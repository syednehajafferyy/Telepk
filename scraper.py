"""Create a polite, same-site HTML and media archive.

Install with: python -m pip install requests beautifulsoup4
Run with:     python scraper.py
Use --help to see crawl and output options.
"""

from __future__ import annotations

import argparse
import xml.etree.ElementTree as ET
import hashlib
import posixpath
import re
import time
from collections import deque
from pathlib import Path, PurePosixPath
from urllib.parse import parse_qsl, quote, unquote, urlencode, urljoin, urlsplit, urlunsplit
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup


DEFAULT_URL = "https://www.telex.pk/"
USER_AGENT = "TeleXSiteArchive/1.0 (polite public-site archive)"
TRACKING_PARAMS = {"fbclid", "gclid", "mc_cid", "mc_eid"}
STATIC_EXTENSIONS = {
    ".7z", ".avif", ".bmp", ".css", ".csv", ".doc", ".docx", ".eot",
    ".gif", ".gz", ".ico", ".jpeg", ".jpg", ".js", ".json", ".m4a",
    ".mp3", ".mp4", ".ogg", ".otf", ".pdf", ".png", ".ppt", ".pptx",
    ".rar", ".svg", ".tar", ".tif", ".tiff", ".ttf", ".txt", ".wav",
    ".webm", ".webp", ".woff", ".woff2", ".xls", ".xlsx", ".xml", ".zip",
}
URL_IN_CSS = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
FRAGMENT_SAFE = "-._~!$&'()*+,;=:@/?"


def normalize_url(
    raw_url: str,
    base_url: str,
    allowed_hosts: set[str],
    *,
    allow_external: bool = False,
) -> str | None:
    """Resolve a link and return a normalized URL only for allowed hosts."""
    absolute = urljoin(base_url, raw_url.strip())
    parts = urlsplit(absolute)
    host = (parts.hostname or "").lower()
    if (
        parts.scheme.lower() not in {"http", "https"}
        or not host
        or (host not in allowed_hosts and not allow_external)
    ):
        return None

    query_items = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key.lower() not in TRACKING_PARAMS and not key.lower().startswith("utm_")
    ]
    query = urlencode(sorted(query_items))
    netloc = host
    if parts.port and parts.port not in {80, 443}:
        netloc = f"{host}:{parts.port}"
    return urlunsplit((parts.scheme.lower(), netloc, parts.path or "/", query, ""))


def local_path_for(url: str, output: Path, as_page: bool = False) -> Path:
    """Map a URL to a contained local path while retaining its URL directories."""
    parts = urlsplit(url)
    decoded_path = unquote(parts.path)
    segments = []
    for segment in decoded_path.split("/"):
        if segment in {"", ".", ".."}:
            continue
        segment = re.sub(r'[\x00-\x1f<>:"|?*]', "_", segment).rstrip(" .")
        if not segment:
            continue
        if segment.upper().split(".", 1)[0] in {
            "CON", "PRN", "AUX", "NUL", *(f"COM{i}" for i in range(1, 10)),
            *(f"LPT{i}" for i in range(1, 10)),
        }:
            segment = f"_{segment}"
        segments.append(segment)

    if decoded_path.endswith("/") or not segments:
        segments.append("index.html")
    elif as_page and not PurePosixPath(segments[-1]).suffix:
        segments[-1] += ".html"

    if parts.query:
        filename = Path(segments[-1])
        suffix = hashlib.sha256(parts.query.encode("utf-8")).hexdigest()[:10]
        segments[-1] = f"{filename.stem}-{suffix}{filename.suffix}"

    return output.joinpath(*segments)


class SiteScraper:
    def __init__(
        self,
        start_url: str,
        output: Path,
        delay: float,
        timeout: float,
        max_pages: int,
        max_file_mb: float,
    ) -> None:
        start = urlsplit(start_url)
        start_host = (start.hostname or "").lower()
        if start.scheme not in {"http", "https"} or not start_host:
            raise ValueError("Start URL must be an absolute http:// or https:// URL.")

        self.allowed_hosts = {start_host}
        if start_host.startswith("www."):
            self.allowed_hosts.add(start_host[4:])
        else:
            self.allowed_hosts.add(f"www.{start_host}")
        self.start_url = normalize_url(start_url, start_url, self.allowed_hosts)
        if self.start_url is None:
            raise ValueError("Start URL host is not allowed.")

        self.output = output.resolve()
        self.delay = max(0.0, delay)
        self.timeout = timeout
        self.max_pages = max_pages
        self.max_file_bytes = int(max_file_mb * 1024 * 1024) if max_file_mb > 0 else 0
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})
        self.robot_rules: dict[str, RobotFileParser | None] = {}
        self.last_request_at = 0.0
        self.queue: deque[tuple[str, str]] = deque()
        self.queued: set[tuple[str, str]] = set()
        self.saved: set[tuple[str, str]] = set()
        self.page_count = 0
        self.file_count = 0
        self.schedule(self.start_url, "page")

    def schedule(self, url: str, kind: str) -> None:
        task = (url, kind)
        if task not in self.queued and task not in self.saved:
            self.queue.append(task)
            self.queued.add(task)

    def get_robot_rules(self, url: str) -> RobotFileParser | None:
        host = urlsplit(url).netloc
        if host in self.robot_rules:
            return self.robot_rules[host]

        robots_url = f"{urlsplit(url).scheme}://{host}/robots.txt"
        parser = RobotFileParser(robots_url)
        try:
            response = self.session.get(robots_url, timeout=self.timeout, allow_redirects=False)
            if response.status_code in {404, 410}:
                parser.parse([])
            elif response.status_code == 200:
                parser.parse(response.text.splitlines())
            else:
                print(f"Skipping {host}: robots.txt returned HTTP {response.status_code}.")
                self.robot_rules[host] = None
                return None
        except requests.RequestException as exc:
            print(f"Skipping {host}: could not read robots.txt ({exc}).")
            self.robot_rules[host] = None
            return None

        self.robot_rules[host] = parser
        for sitemap in parser.site_maps() or []:
            sitemap_url = normalize_url(sitemap, url, self.allowed_hosts)
            if sitemap_url:
                self.schedule(sitemap_url, "sitemap")
        return parser

    def wait_turn(self, rules: RobotFileParser) -> None:
        crawl_delay = rules.crawl_delay(USER_AGENT) or rules.crawl_delay("*") or 0
        interval = max(self.delay, float(crawl_delay))
        remaining = interval - (time.monotonic() - self.last_request_at)
        if remaining > 0:
            time.sleep(remaining)
        self.last_request_at = time.monotonic()

    def fetch(self, url: str, kind: str) -> tuple[str, requests.Response, bytes] | None:
        current_url = url
        for _ in range(6):
            rules = self.get_robot_rules(current_url)
            if rules is None or not rules.can_fetch(USER_AGENT, current_url):
                print(f"Blocked by robots.txt or unavailable: {current_url}")
                return None
            self.wait_turn(rules)
            try:
                response = self.session.get(
                    current_url, timeout=self.timeout, allow_redirects=False, stream=True
                )
            except requests.RequestException as exc:
                print(f"Request failed: {current_url} ({exc})")
                return None

            if response.is_redirect:
                location = response.headers.get("Location")
                response.close()
                redirected = normalize_url(
                    location or "",
                    current_url,
                    self.allowed_hosts,
                    allow_external=kind == "resource",
                )
                if not redirected:
                    print(f"Skipping external redirect from {current_url}")
                    return None
                current_url = redirected
                continue

            try:
                response.raise_for_status()
                chunks = []
                total = 0
                for chunk in response.iter_content(chunk_size=64 * 1024):
                    if not chunk:
                        continue
                    total += len(chunk)
                    if self.max_file_bytes and total > self.max_file_bytes:
                        print(f"Skipped (file size limit): {current_url}")
                        response.close()
                        return None
                    chunks.append(chunk)
                return current_url, response, b"".join(chunks)
            except requests.RequestException as exc:
                print(f"Download failed: {current_url} ({exc})")
                response.close()
                return None
        print(f"Too many redirects: {url}")
        return None

    def save_file(self, path: Path, content: bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        self.file_count += 1

    def schedule_reference(
        self,
        raw_url: str,
        base_url: str,
        kind: str,
        *,
        allow_external: bool = False,
    ) -> str | None:
        url = normalize_url(
            raw_url, base_url, self.allowed_hosts, allow_external=allow_external
        )
        if not url:
            return None
        self.schedule(url, kind)
        return url

    def local_path(self, url: str, as_page: bool = False) -> Path:
        path = local_path_for(url, self.output, as_page=as_page)
        host = (urlsplit(url).hostname or "").lower()
        if host not in self.allowed_hosts:
            safe_host = re.sub(r"[^a-z0-9.-]", "_", urlsplit(url).netloc.lower())
            path = self.output / "_external" / safe_host / path.relative_to(self.output)
        return path

    def local_reference(self, url: str, source_path: Path, as_page: bool) -> str:
        target = self.local_path(url, as_page=as_page)
        relative = posixpath.relpath(
            target.relative_to(self.output).as_posix(),
            source_path.parent.relative_to(self.output).as_posix() or ".",
        )
        local_url = quote(relative, safe="/@:+~.-")
        fragment = urlsplit(url).fragment
        if fragment:
            return f"{local_url}#{quote(fragment, safe=FRAGMENT_SAFE)}"
        return local_url

    def rewrite_css(self, css: str, base_url: str, source_path: Path) -> str:
        def replace(match: re.Match[str]) -> str:
            raw_url = match.group(2).strip()
            if not raw_url or raw_url.lower().startswith(("data:", "blob:", "#")):
                return match.group(0)
            url = self.schedule_reference(
                raw_url, base_url, "resource", allow_external=True
            )
            if not url:
                return match.group(0)
            local = self.local_reference(url, source_path, as_page=False)
            return f"url({match.group(1)}{local}{match.group(1)})"

        return URL_IN_CSS.sub(replace, css)

    def process_html(self, content: bytes, url: str, page_path: Path) -> bytes:
        soup = BeautifulSoup(content, "html.parser")
        for tag in soup.find_all(True):
            for attribute in ("href", "src", "poster", "data-src", "data-original", "action"):
                raw = tag.get(attribute)
                if not isinstance(raw, str) or not raw.strip():
                    continue
                if attribute == "href" and tag.name == "link":
                    rel = {str(value).lower() for value in (tag.get("rel") or [])}
                    kind = "resource" if rel.intersection(
                        {"stylesheet", "icon", "preload", "modulepreload", "manifest"}
                    ) else "page"
                elif attribute in {"src", "poster", "data-src", "data-original"}:
                    kind = "resource"
                elif attribute == "action":
                    kind = "page"
                else:
                    kind = "resource" if PurePosixPath(urlsplit(urljoin(url, raw)).path).suffix.lower() in STATIC_EXTENSIONS else "page"

                normalized = self.schedule_reference(
                    raw, url, kind, allow_external=kind == "resource"
                )
                if normalized:
                    fragment = urlsplit(urljoin(url, raw)).fragment
                    if normalized == url and fragment and kind == "page":
                        tag[attribute] = f"#{quote(fragment, safe=FRAGMENT_SAFE)}"
                    else:
                        local = self.local_reference(normalized, page_path, as_page=kind == "page")
                        tag[attribute] = (
                            f"{local}#{quote(fragment, safe=FRAGMENT_SAFE)}"
                            if fragment
                            else local
                        )

            srcset = tag.get("srcset")
            if isinstance(srcset, str) and "data:" not in srcset.lower():
                candidates = []
                for candidate in srcset.split(","):
                    tokens = candidate.strip().split()
                    if not tokens:
                        continue
                    normalized = self.schedule_reference(
                        tokens[0], url, "resource", allow_external=True
                    )
                    if normalized:
                        tokens[0] = self.local_reference(normalized, page_path, as_page=False)
                    candidates.append(" ".join(tokens))
                tag["srcset"] = ", ".join(candidates)

            style = tag.get("style")
            if isinstance(style, str):
                tag["style"] = self.rewrite_css(style, url, page_path)

        for style_tag in soup.find_all("style"):
            if style_tag.string:
                style_tag.string.replace_with(self.rewrite_css(style_tag.string, url, page_path))
        return soup.encode()

    def process_sitemap(self, content: bytes, url: str) -> None:
        try:
            root = ET.fromstring(content)
        except ET.ParseError:
            print(f"Invalid sitemap XML: {url}")
            return
        for element in root.iter():
            if element.tag.rsplit("}", 1)[-1].lower() == "loc" and element.text:
                page_url = normalize_url(element.text.strip(), url, self.allowed_hosts)
                if page_url:
                    self.schedule(page_url, "page")

    def run(self) -> None:
        print(f"Starting at {self.start_url}")
        print(f"Archive folder: {self.output}")
        page_limit_reported = False
        while self.queue:
            url, kind = self.queue.popleft()
            task = (url, kind)
            self.queued.discard(task)
            if task in self.saved:
                continue
            if kind == "page" and self.max_pages and self.page_count >= self.max_pages:
                if not page_limit_reported:
                    print(f"Page limit reached ({self.max_pages}); remaining queued pages are skipped.")
                    page_limit_reported = True
                continue

            result = self.fetch(url, kind)
            if result is None:
                self.saved.add(task)
                continue
            final_url, response, content = result
            content_type = response.headers.get("Content-Type", "").split(";", 1)[0].lower()
            is_html = kind == "page" and (
                "html" in content_type or not content_type or content_type == "application/octet-stream"
            )
            if kind == "sitemap":
                is_html = False

            path = self.local_path(final_url, as_page=is_html)
            try:
                if is_html:
                    content = self.process_html(content, final_url, path)
                    self.page_count += 1
                elif kind == "sitemap" or "xml" in content_type:
                    self.process_sitemap(content, final_url)
                elif "css" in content_type or urlsplit(final_url).path.lower().endswith(".css"):
                    try:
                        css = content.decode(response.encoding or "utf-8", errors="replace")
                    except LookupError:
                        css = content.decode("utf-8", errors="replace")
                    content = self.rewrite_css(css, final_url, path).encode("utf-8")

                self.save_file(path, content)
                self.saved.add(task)
                self.saved.add((final_url, kind))
                print(f"Saved: {path.relative_to(self.output)}")
            except OSError as exc:
                print(f"Could not save {final_url}: {exc}")
            finally:
                response.close()

        self.session.close()
        print(f"Finished: {self.page_count} HTML pages and {self.file_count} files saved.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Polite recursive archive of a public website.")
    parser.add_argument("--url", default=DEFAULT_URL, help=f"Starting URL (default: {DEFAULT_URL})")
    parser.add_argument("--output", type=Path, default=Path.cwd() / "telex.pk_archive", help="Archive directory")
    parser.add_argument("--delay", type=float, default=1.0, help="Minimum delay between requests in seconds")
    parser.add_argument("--timeout", type=float, default=20.0, help="Request timeout in seconds")
    parser.add_argument("--max-pages", type=int, default=0, help="Maximum HTML pages; 0 means unlimited")
    parser.add_argument("--max-file-mb", type=float, default=0, help="Skip files larger than this; 0 means unlimited")
    args = parser.parse_args()

    if args.max_pages < 0 or args.max_file_mb < 0:
        parser.error("--max-pages and --max-file-mb must be zero or greater")

    scraper = SiteScraper(
        start_url=args.url,
        output=args.output,
        delay=args.delay,
        timeout=args.timeout,
        max_pages=args.max_pages,
        max_file_mb=args.max_file_mb,
    )
    try:
        scraper.run()
    except KeyboardInterrupt:
        scraper.session.close()
        print("\nStopped by user.")


if __name__ == "__main__":
    main()