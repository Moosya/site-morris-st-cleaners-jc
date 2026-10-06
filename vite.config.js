import { readFileSync } from "node:fs"
import { defineConfig } from "vite"

// Bake the business name from public/config.json into <title> at build time so the
// HTML title (tab, link previews, curl) is the business name, never a generic "Local shop".
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
}

function businessTitle() {
  return {
    name: "business-title",
    transformIndexHtml(html) {
      let name = ""
      try {
        const cfg = JSON.parse(readFileSync(new URL("./public/config.json", import.meta.url), "utf8"))
        name = cfg.shopName || cfg.businessName || cfg.name || ""
      } catch (e) {
        console.warn("business-title: could not read public/config.json", e)
      }
      if (!name) throw new Error("public/config.json needs shopName so the page title is the business name")
      return html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + escapeHtml(name) + "</title>")
    },
  }
}

// base "./" => built index.html references ./assets/..., so the same build works at a
// domain root (Railway) and under a sub-path (GitHub Pages /site-xxx/). Never use root-absolute paths.
export default defineConfig({ base: "./", plugins: [businessTitle()] })
