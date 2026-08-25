import { useEffect } from "react";

const SITE_NAME = "ห้องเรียนครูไต๋";
const SITE_URL = "https://grits.online";
const DEFAULT_DESCRIPTION = "พื้นที่รวมเว็บไซต์เพื่อการศึกษา ระบบงานในโรงเรียน และเรื่องราวของครูไต๋";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
};

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

export default function Seo({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  noIndex = false,
  structuredData,
}: SeoProps) {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const structuredJson = structuredData ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    document.title = title;
    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "th_TH" });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: image ? "summary_large_image" : "summary" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    const existingOgImage = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]');
    const existingTwitterImage = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');
    if (image) {
      setMeta('meta[property="og:image"]', { property: "og:image", content: image });
      setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    } else {
      existingOgImage?.remove();
      existingTwitterImage?.remove();
    }

    document.getElementById("page-structured-data")?.remove();
    if (structuredJson) {
      const script = document.createElement("script");
      script.id = "page-structured-data";
      script.type = "application/ld+json";
      script.textContent = structuredJson;
      document.head.appendChild(script);
    }

    return () => document.getElementById("page-structured-data")?.remove();
  }, [canonicalUrl, description, image, noIndex, structuredJson, title, type]);

  return null;
}

export { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL };
