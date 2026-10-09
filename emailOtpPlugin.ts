import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

interface EmailOtpConfig {
  apiKey: string;
  from: string;
  adminEmail: string;
  adminPassword: string;
}

interface PendingCode {
  hash: Buffer;
  expiresAt: number;
  attempts: number;
}

interface AdminAttemptState {
  attempts: number;
  windowStartedAt: number;
  lockedUntil: number;
}

interface ServerAuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Warning' | 'Blocked';
}

const CODE_LIFETIME_MS = 5 * 60 * 1000;
const SEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000;
const ADMIN_COOKIE = 'telex_admin_session';

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  let body = '';
  for await (const chunk of request) {
    body += chunk.toString();
    if (body.length > 8192) throw new Error('Request is too large.');
  }
  const parsed: unknown = JSON.parse(body);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid request body.');
  }
  return parsed as Record<string, unknown>;
}

function respond(response: ServerResponse, status: number, message: string): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify({ success: status < 400, message }));
}

export function createEmailOtpPlugin(config: EmailOtpConfig): Plugin {
  const pendingCodes = new Map<string, PendingCode>();
  const lastSentAt = new Map<string, number>();
  const adminSessions = new Map<string, { email: string; expiresAt: number }>();
  const adminAttempts = new Map<string, AdminAttemptState>();
  const auditLogs: ServerAuditLog[] = [];

  const handleRequest = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    if (request.method !== 'POST') return next();

    void (async () => {
      try {
        const body = await readJson(request);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
          respond(response, 400, 'Enter a valid email address.');
          return;
        }

        const path = request.url?.split('?', 1)[0];
        if (path === '/send') {
          if (!config.apiKey || !config.from) {
            respond(response, 503, 'Email verification is not configured on the server.');
            return;
          }

          const now = Date.now();
          const lastSent = lastSentAt.get(email) || 0;
          if (now - lastSent < SEND_COOLDOWN_MS) {
            respond(response, 429, `Please wait ${Math.ceil((SEND_COOLDOWN_MS - (now - lastSent)) / 1000)} seconds before requesting another code.`);
            return;
          }

          lastSentAt.set(email, now);
          const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: config.from,
              to: [email],
              subject: 'Your TeleX verification code',
              text: `Your TeleX verification code is ${code}. It expires in 5 minutes.`,
            }),
          });

          if (!emailResponse.ok) {
            lastSentAt.delete(email);
            respond(response, 502, 'The verification email could not be sent. Check the email service configuration and try again.');
            return;
          }

          pendingCodes.set(email, {
            hash: createHash('sha256').update(code).digest(),
            expiresAt: now + CODE_LIFETIME_MS,
            attempts: 0,
          });
          respond(response, 200, `Verification code sent to ${email}.`);
          return;
        }

        if (path === '/verify') {
          const code = typeof body.code === 'string' ? body.code.trim() : '';
          if (!/^\d{6}$/.test(code)) {
            respond(response, 400, 'Enter the 6-digit code from your email.');
            return;
          }

          const pending = pendingCodes.get(email);
          if (!pending || Date.now() > pending.expiresAt) {
            pendingCodes.delete(email);
            respond(response, 400, 'That code is missing or expired. Request a new one.');
            return;
          }
          pending.attempts += 1;
          const submittedHash = createHash('sha256').update(code).digest();
          if (!timingSafeEqual(pending.hash, submittedHash)) {
            if (pending.attempts >= MAX_VERIFY_ATTEMPTS) pendingCodes.delete(email);
            respond(response, 400, 'That verification code is incorrect.');
            return;
          }

          pendingCodes.delete(email);
          lastSentAt.delete(email);
          respond(response, 200, 'Email verified.');
          return;
        }

        respond(response, 404, 'Email verification endpoint not found.');
      } catch {
        respond(response, 400, 'Could not process the verification request.');
      }
    })();
  };

  const handleAdminRequest = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    const path = request.url?.split('?', 1)[0];
    const cookies = request.headers.cookie || '';
    const sessionToken = cookies
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${ADMIN_COOKIE}=`))
      ?.slice(ADMIN_COOKIE.length + 1);

    if (request.method === 'GET' && path === '/session') {
      const session = sessionToken ? adminSessions.get(sessionToken) : undefined;
      if (!session || Date.now() > session.expiresAt) {
        if (sessionToken) adminSessions.delete(sessionToken);
        response.statusCode = 401;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ success: false, message: 'Not signed in.' }));
        return;
      }
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.setHeader('Cache-Control', 'no-store');
      response.end(JSON.stringify({
        success: true,
        admin: { email: session.email, name: session.email },
      }));
      return;
    }

    if (request.method === 'GET' && path === '/audit-logs') {
      const session = sessionToken ? adminSessions.get(sessionToken) : undefined;
      if (!session || Date.now() > session.expiresAt) {
        response.statusCode = 401;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ success: false, message: 'Not signed in.' }));
        return;
      }
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.setHeader('Cache-Control', 'no-store');
      response.end(JSON.stringify({ success: true, logs: auditLogs.slice(0, 500) }));
      return;
    }

    if (request.method !== 'POST') return next();
    void (async () => {
      try {
        const path = request.url?.split('?', 1)[0];
        if (path === '/logout') {
          if (sessionToken) adminSessions.delete(sessionToken);
          response.setHeader('Set-Cookie', `${ADMIN_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ success: true, message: 'Signed out.' }));
          return;
        }
        if (path === '/audit-logs') {
          const session = sessionToken ? adminSessions.get(sessionToken) : undefined;
          if (!session || Date.now() > session.expiresAt) {
            respond(response, 401, 'Not signed in.');
            return;
          }

          const body = await readJson(request);
          const action = typeof body.action === 'string' ? body.action.trim().slice(0, 120) : '';
          const details = typeof body.details === 'string' ? body.details.trim().slice(0, 1000) : '';
          const status = body.status === 'Warning' || body.status === 'Blocked'
            ? body.status
            : 'Success';
          if (!action) {
            respond(response, 400, 'An action name is required.');
            return;
          }

          const log: ServerAuditLog = {
            id: randomBytes(16).toString('hex'),
            timestamp: new Date().toISOString(),
            adminUser: session.email,
            action,
            details,
            ipAddress: request.socket.remoteAddress || 'Unavailable',
            userAgent: String(request.headers['user-agent'] || 'Unavailable').slice(0, 300),
            status,
          };
          auditLogs.unshift(log);
          if (auditLogs.length > 500) auditLogs.length = 500;
          response.statusCode = 201;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify({ success: true, log }));
          return;
        }
        if (path !== '/login') {
          respond(response, 404, 'Admin authentication endpoint not found.');
          return;
        }
        if (!config.adminEmail || !config.adminPassword) {
          respond(response, 503, 'Admin sign-in is not configured on the server.');
          return;
        }

        const forwardedFor = request.headers['x-forwarded-for'];
        const clientIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
          ?.split(',')[0]
          .trim() || request.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const attemptState = adminAttempts.get(clientIp);
        if (attemptState && attemptState.lockedUntil > now) {
          respond(response, 429, `Too many sign-in attempts. Try again in ${Math.ceil((attemptState.lockedUntil - now) / 1000)} seconds.`);
          return;
        }

        const body = await readJson(request);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const expectedEmail = config.adminEmail.trim().toLowerCase();
        const passwordMatches = timingSafeEqual(
          createHash('sha256').update(password).digest(),
          createHash('sha256').update(config.adminPassword).digest(),
        );

        if (email !== expectedEmail || !passwordMatches) {
          const current = attemptState && now - attemptState.windowStartedAt < 60_000
            ? attemptState
            : { attempts: 0, windowStartedAt: now, lockedUntil: 0 };
          current.attempts += 1;
          if (current.attempts >= 5) current.lockedUntil = now + 5 * 60_000;
          adminAttempts.set(clientIp, current);
          respond(response, 401, 'Email or password is incorrect.');
          return;
        }

        adminAttempts.delete(clientIp);
        const token = randomBytes(32).toString('hex');
        adminSessions.set(token, {
          email: expectedEmail,
          expiresAt: Date.now() + ADMIN_SESSION_MS,
        });
        response.setHeader(
          'Set-Cookie',
          `${ADMIN_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ADMIN_SESSION_MS / 1000}`,
        );
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify({
          success: true,
          admin: { email: expectedEmail, name: expectedEmail },
          message: 'Signed in.',
        }));
      } catch {
        respond(response, 400, 'Could not process the sign-in request.');
      }
    })();
  };

  return {
    name: 'telex-email-otp',
    configureServer(server) {
      server.middlewares.use('/api/auth/email-otp', handleRequest);
      server.middlewares.use('/api/admin/auth', handleAdminRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/auth/email-otp', handleRequest);
      server.middlewares.use('/api/admin/auth', handleAdminRequest);
    },
  };
}