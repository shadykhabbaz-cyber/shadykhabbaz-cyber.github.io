document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("inci-search");
  const ratingFilter = document.getElementById("inci-filter");
  const cards = Array.from(document.querySelectorAll(".ing-card"));
  const countEl = document.getElementById("inci-count");

  function filterCards() {
    const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const r = ratingFilter ? ratingFilter.value : "all";
    let shown = 0;
    cards.forEach(c => {
      const text = c.getAttribute("data-search") || "";
      const rating = c.getAttribute("data-rating") || "";
      const matchQ = !q || text.includes(q);
      const matchR = r === "all" || rating === r;
      c.style.display = (matchQ && matchR) ? "" : "none";
      if (matchQ && matchR) shown++;
    });
    if (countEl) countEl.textContent = shown + " z " + cards.length + " składników INCI";
  }
  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (ratingFilter) ratingFilter.addEventListener("change", filterCards);

  const pasteArea = document.getElementById("inci-paste");
  const analyzeBtn = document.getElementById("inci-analyze-btn");
  const analyzeResult = document.getElementById("inci-analyze-result");
  const presetBtns = Array.from(document.querySelectorAll("[data-preset-inci]"));
  const dbEl = document.getElementById("carelab-db-json");
  let db = { ingredients: [] };
  if (dbEl) {
    try { db = JSON.parse(dbEl.textContent); } catch (e) {}
  }

  function analyzeInciString(raw) {
    if (!analyzeResult) return;
    const text = (raw || "").trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const firstToken = text.split(/[,;]/)[0].trim().toLowerCase();
    const hasWaterFirst = firstToken.includes("aqua") || firstToken.includes("water");
    const matched = db.ingredients.filter(ing => {
      const tokens = ing.inci.toLowerCase().split("/").map(s => s.trim());
      return tokens.some(t => t.length > 3 && lower.includes(t));
    });
    const baseType = hasWaterFirst
      ? "Emulsja wodno-lipidowa (Aqua na 1. miejscu w INCI) – niższa okluzja, łatwe rozprowadzanie na świeżym tatuażu."
      : "Formuła bezwodna / masło lub gęsta baza lipidowa (brak Aqua na 1. miejscu) – wyższa okluzja; nakładać bardzo cienką warstwą.";

    let html = '<div class="card"><h3>Wynik analizy receptury INCI</h3>';
    html += "<p><strong>Typ bazy kosmetycznej:</strong> " + baseType + "</p>";
    html += "<p><strong>Rozpoznane składniki w bazie Shady Care Lab (" + matched.length + "):</strong></p>";
    if (matched.length > 0) {
      html += '<div class="grid-2">';
      matched.forEach(m => {
        html += '<div class="card" style="padding:0.9rem"><strong>' + m.inci + " (" + m.name_pl + ')</strong>' +
          '<span class="pill pill-' + m.fresh_tattoo_rating + '">' + m.fresh_tattoo_rating.replace(/_/g, " ") + "</span>" +
          '<p style="font-size:0.86rem;color:var(--muted)">' + m.explanation_pl + "</p></div>";
      });
      html += "</div>";
    }
    html += "</div>";
    analyzeResult.innerHTML = html;
  }

  if (analyzeBtn && pasteArea) analyzeBtn.addEventListener("click", () => analyzeInciString(pasteArea.value));
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-preset-inci") || "";
      if (pasteArea) pasteArea.value = val;
      analyzeInciString(val);
      if (pasteArea) pasteArea.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  const methodBtns = Array.from(document.querySelectorAll("[data-method-tab]"));
  const methodPanels = Array.from(document.querySelectorAll("[data-method-panel]"));
  methodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-method-tab");
      methodBtns.forEach(b => b.classList.toggle("btn-outline", b !== btn));
      methodPanels.forEach(p => {
        p.style.display = p.getAttribute("data-method-panel") === target ? "" : "none";
      });
    });
  });
});
