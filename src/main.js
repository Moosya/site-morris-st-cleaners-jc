import "./style.css"

function digits(phone) {
  const d = String(phone || "").replace(/\D/g, "")
  if (d.length === 10) return "+1" + d
  if (d.length === 11 && d[0] === "1") return "+" + d
  return d
}

function slugify(name) {
  return String(name || "shop")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
}

function applyConfig(cfg) {
  document.title = cfg.shopName
  document.getElementById("shop-name").textContent = cfg.shopName
  document.getElementById("tagline").textContent = cfg.tagline
  document.getElementById("address").textContent = cfg.address
  document.getElementById("hours").textContent = cfg.hours
  document.getElementById("phone").textContent = cfg.phone || "Visit or message for details"
  const photo = document.getElementById("shop-photo")
  // Self-hosted /hero.jpg is the default. If a remote photoUrl ever dies, fall back to
  // /hero.jpg once, then hide the image rather than show a broken-image icon.
  photo.onerror = () => {
    if (!photo.dataset.fallback && !String(photo.src).endsWith("/hero.jpg")) {
      photo.dataset.fallback = "1"
      photo.src = "/hero.jpg"
    } else {
      photo.style.display = "none"
    }
  }
  photo.src = cfg.photoUrl || "/hero.jpg"
  photo.alt = cfg.shopName
  const demoId = cfg.demoId || slugify(cfg.shopName)
  const previewUrl = window.location.href
  const subject = encodeURIComponent(
    "Yes I want this site — " + cfg.shopName + " [" + demoId + "]"
  )
  const body = encodeURIComponent(
    [
      "Hi, I want a site like the preview for " + cfg.shopName + ".",
      "",
      "Business: " + cfg.shopName,
      "Address: " + (cfg.address || ""),
      "Demo ID: " + demoId,
      "Preview: " + previewUrl,
    ].join("\n")
  )

  const shopPhone = digits(cfg.phone)
  const callBtn = document.getElementById("cta-call")
  const smsBtn = document.getElementById("cta-sms")
  const altBtn = document.getElementById("cta-alt")
  if (shopPhone) {
    callBtn.href = "tel:" + shopPhone
    smsBtn.href = "sms:" + shopPhone
    callBtn.classList.remove("hidden")
    smsBtn.classList.remove("hidden")
    if (altBtn) altBtn.classList.add("hidden")
  } else {
    callBtn.classList.add("hidden")
    smsBtn.classList.add("hidden")
    callBtn.removeAttribute("href")
    smsBtn.removeAttribute("href")
    if (altBtn && cfg.altCtaUrl) {
      altBtn.href = cfg.altCtaUrl
      altBtn.textContent = cfg.altCtaLabel || "Visit online"
      altBtn.target = "_blank"
      altBtn.rel = "noopener noreferrer"
      altBtn.classList.remove("hidden")
    } else if (altBtn) {
      altBtn.classList.add("hidden")
    }
  }

  const ownerPhone = digits(cfg.ownerPhone || "+19082868650")
  const ownerEmail = cfg.ownerEmail || cfg.email || "troupe.javelin-7w@icloud.com"
  const ownerName = cfg.ownerName || "us"
  document.getElementById("owner-name-hero").textContent = ownerName
  document.getElementById("owner-name-bottom").textContent = ownerName
  document.getElementById("owner-cta-call-hero").href = "tel:" + ownerPhone
  document.getElementById("owner-cta-call-bottom").href = "tel:" + ownerPhone
  document.getElementById("owner-cta-sms-hero").href = "sms:" + ownerPhone
  document.getElementById("owner-cta-sms-bottom").href = "sms:" + ownerPhone
  document.getElementById("owner-cta-mail-hero").href =
    "mailto:" + ownerEmail + "?subject=" + subject + "&body=" + body
  document.getElementById("owner-cta-mail-bottom").href =
    "mailto:" + ownerEmail + "?subject=" + subject + "&body=" + body
  const list = document.getElementById("services")
  list.innerHTML = ""
  for (const service of cfg.services || []) {
    const li = document.createElement("li")
    li.className =
      "rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
    const h = document.createElement("h3")
    h.className = "font-semibold"
    h.textContent = service.name
    const p = document.createElement("p")
    p.className = "mt-2 text-sm text-stone-600"
    p.textContent = service.description
    li.append(h, p)
    list.append(li)
  }
  document.getElementById("footer").textContent =
    "This is a preview we made for " +
    cfg.shopName +
    ". Reply STOP if you do not want more messages."
}

async function main() {
  const res = await fetch("/config.json?v=" + Date.now(), {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("config.json missing")
  applyConfig(await res.json())
}

main().catch((err) => {
  console.error(err)
  document.getElementById("shop-name").textContent =
    "Could not load this page"
})
