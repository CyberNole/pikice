// Uvodni zaslon za vse šale: »Tapni za ogled fotografije«.
// Prvi dotik vklopi celozaslonski način (Android), skrije uvod in šele nato
// spusti dotike do šale. Na iPhonu celozaslonskega načina ni, uvod se samo skrije.
(function () {
  var slog = document.createElement("style");
  slog.textContent =
    "#uvod{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;" +
    "background:#1c1c1e;color:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;" +
    "padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));" +
    "-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;cursor:pointer;transition:opacity .2s ease}" +
    "#uvod .uvod-slika{width:min(62vw,240px);aspect-ratio:4/3;max-width:100%;border-radius:14px;overflow:hidden;position:relative;" +
    "background:linear-gradient(160deg,#6d8bb0 0%,#a9b9c9 38%,#d6b58f 70%,#8a6a55 100%);filter:blur(0.4px)}" +
    "#uvod .uvod-slika::after{content:'';position:absolute;inset:0;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(28,28,30,.18)}" +
    "#uvod .uvod-ikona{position:absolute;inset:0;display:grid;place-items:center;z-index:1}" +
    "#uvod .uvod-naslov{font-size:16px;font-weight:600}" +
    "#uvod .uvod-pod{font-size:14px;color:#a1a1a6}" +
    "#uvod:focus-visible{outline:3px solid #0a84ff;outline-offset:-6px}";
  document.head.appendChild(slog);

  var uvod = document.createElement("div");
  uvod.id = "uvod";
  uvod.setAttribute("role", "button");
  uvod.setAttribute("tabindex", "0");
  uvod.setAttribute("aria-label", "Odpri fotografijo");
  uvod.innerHTML =
    '<div class="uvod-slika"><div class="uvod-ikona">' +
    '<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="21" fill="rgba(0,0,0,.35)"/>' +
    '<rect x="11" y="13" width="22" height="18" rx="3" fill="none" stroke="#fff" stroke-width="2"/>' +
    '<circle cx="17.5" cy="19" r="2.2" fill="#fff"/><path d="M12 29l7-7 4 4 3-3 6 6" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg></div></div>' +
    '<div class="uvod-naslov">Fotografija</div>' +
    '<div class="uvod-pod">Tapni za ogled</div>';
  document.body.appendChild(uvod);

  var odprto = false;
  var spustiOd = 0;

  function celZaslon() {
    var el = document.documentElement;
    var z = el.requestFullscreen || el.webkitRequestFullscreen;
    if (z && !document.fullscreenElement && !document.webkitFullscreenElement) {
      try { var p = z.call(el); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    }
  }

  function odpri() {
    if (odprto) return;
    odprto = true;
    // Še kratek čas po dotiku lovimo dogodke, da ta isti dotik ne sproži šale.
    spustiOd = Date.now() + 350;
    celZaslon();
    uvod.style.opacity = "0";
    setTimeout(function () { uvod.remove(); }, 220);
  }

  // Dokler je uvod viden, noben dotik ne pride do šale (lovljenje v fazi zajema).
  ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "mouseup", "click"].forEach(function (ime) {
    window.addEventListener(ime, function (ev) {
      if (!odprto) {
        if (ime === "pointerup" || ime === "touchend" || ime === "click") odpri();
        ev.stopImmediatePropagation();
        if (ev.cancelable && ime !== "click") ev.preventDefault();
      } else if (Date.now() < spustiOd) {
        ev.stopImmediatePropagation();
      }
    }, { capture: true, passive: false });
  });
  window.addEventListener("keydown", function (ev) {
    if (!odprto && (ev.key === "Enter" || ev.key === " ")) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      odpri();
    }
  }, true);
  try { uvod.focus({ preventScroll: true }); } catch (e) {}
})();
