import re
import unicodedata


def slugify(value: str) -> str:
    """Turn a title/name into a URL-friendly slug.

    "Hello World! Xin chào" -> "hello-world-xin-chao"
    """
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "item"
