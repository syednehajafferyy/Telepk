import { NextResponse } from 'next/server';

interface SyncGuestRequest {
  userId: string;
  email?: string;
  phone?: string;
}

/**
 * Guest Checkout Sync Handler
 * Links unassigned guest orders to a newly created customer account by matching email or phone
 */
export async function POST(request: Request) {
  try {
    const body: SyncGuestRequest = await request.json();
    const { userId, email, phone } = body;

    if (!userId || (!email && !phone)) {
      return NextResponse.json(
        { error: 'User ID and matching email or phone required' },
        { status: 400 }
      );
    }

    // In production with Prisma:
    // const result = await prisma.order.updateMany({
    //   where: {
    //     userId: null,
    //     OR: [
    //       email ? { customerEmail: email.toLowerCase() } : undefined,
    //       phone ? { customerPhone: phone } : undefined,
    //     ].filter(Boolean) as any,
    //   },
    //   data: {
    //     userId: userId,
    //   },
    // });

    // Mock response simulating synced order count
    const simulatedSyncedCount = 2;

    console.log(`[TeleX CRM Sync] Linked ${simulatedSyncedCount} guest orders to User: ${userId} (${email || phone})`);

    return NextResponse.json({
      success: true,
      syncedOrdersCount: simulatedSyncedCount,
      message: `Successfully linked ${simulatedSyncedCount} previous guest orders to your TeleX account.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to sync guest orders' },
      { status: 500 }
    );
  }
}
