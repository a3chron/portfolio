import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function markdownToHtml(mdxContent: string): Promise<string> {
  try {
    // Clean MDX-specific syntax
    const cleanContent = mdxContent
      .replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, "")
      .replace(/^export\s+.*?;?\s*$/gm, "")
      .replace(/<[A-Z][^>]*>/g, "")
      .replace(/<\/[A-Z][^>]*>/g, "");

    const processed = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(cleanContent);

    return processed.toString();
  } catch (error) {
    console.error("Error converting markdown:", error);
    return mdxContent; // fallback to raw content
  }
}
