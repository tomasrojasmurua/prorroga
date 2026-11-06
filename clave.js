// ===============================================
//  CLAVE DE ACCESO
//  Se pide cada vez que se abre el sitio en una pestaña nueva.
//  Se guarda solo el "hash" SHA-256 de la clave, no la clave en texto.
//  Para cambiarla, calcula el hash de la nueva clave (por ejemplo en
//  https://emn178.github.io/online-tools/sha256.html) y pégalo aquí.
//  Ojo: es una protección liviana. Alguien con conocimientos técnicos
//  puede saltársela, porque GitHub Pages no tiene contraseñas reales.
// ===============================================
// Versión del sitio: se muestra en la esquina superior derecha de todas las páginas
const VERSION_SITIO = "v1.29 · 6 nov 2026";

(function () {
  function mostrarVersion() {
    if (document.getElementById("version")) return;
    const v = document.createElement("div");
    v.id = "version";
    v.textContent = VERSION_SITIO;
    v.style.cssText = "position:fixed;top:calc(8px + env(safe-area-inset-top));right:8px;z-index:2147483647;" +
      "font:700 12px Inter,system-ui,sans-serif;color:#111;background:#facc15;padding:4px 10px;" +
      "border-radius:999px;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,0.4);";
    document.body.append(v);
  }
  if (document.body) mostrarVersion();
  else document.addEventListener("DOMContentLoaded", mostrarVersion);
})();

(function () {
  const HASH_CLAVE = "d9df09cc98ec4c836115c388149cdafaa75eb0e04b9ba401e5c5845fcdfc2e4d";
  const LLAVE = "prorroga-acceso";

  let resolver;
  window.prorrogaDesbloqueada = new Promise((r) => (resolver = r));

  try { localStorage.removeItem(LLAVE); } catch (e) {} // limpia el acceso antiguo
  let guardado = null;
  try { guardado = sessionStorage.getItem(LLAVE); } catch (e) {}
  if (guardado === HASH_CLAVE) {
    resolver(false); // false = no hubo interacción del usuario
    return;
  }

  // Oculta la página mientras no se ingrese la clave
  const estilo = document.createElement("style");
  estilo.textContent = `
    body > *:not(#candado):not(#version) { display: none !important; }
    #candado { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 16px; padding: 16px; text-align: center;
      background: #0d1b12; color: #f1f5f2; font-family: "Inter", system-ui, sans-serif; }
    #candado h1 { font-family: "Bebas Neue", sans-serif; font-size: clamp(3rem, 14vw, 6rem);
      margin: 0; letter-spacing: 4px; cursor: default; }
    #candado form { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
    #candado input { font: 600 1.1rem "Inter", sans-serif; padding: 12px 16px; border-radius: 999px;
      border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #f1f5f2;
      text-align: center; width: min(260px, 80vw); }
    #candado input:focus { outline: none; border-color: #facc15; }
    #candado button { font: 400 1.4rem "Bebas Neue", sans-serif; letter-spacing: 1px; border: 0;
      border-radius: 999px; padding: 10px 24px; background: #facc15; color: #111; cursor: pointer; }
    #candado .error { color: #f87171; min-height: 1.4em; margin: 0; }
    #candado.sacudir form { animation: sacudir 0.4s; }
    @keyframes sacudir { 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
  `;
  document.head.append(estilo);

  function mostrarCandado() {
    const c = document.createElement("div");
    c.id = "candado";
    c.innerHTML = `
      <div style="font-size:3rem">🔒</div>
      <h1>PRÓRROGA</h1>
      <p style="color:#a7c4b1;margin:0">Solo para el equipo. Ingresa la clave.</p>
      <form>
        <input type="password" autocomplete="current-password" aria-label="Clave" placeholder="Clave" autofocus>
        <button type="submit">Entrar</button>
      </form>
      <p class="error" aria-live="polite"></p>`;
    document.body.append(c);
    const input = c.querySelector("input");
    const error = c.querySelector(".error");
    input.focus();

    c.querySelector("form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const datos = new TextEncoder().encode(input.value.trim().toLowerCase());
      const buf = await crypto.subtle.digest("SHA-256", datos);
      const hash = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      if (hash === HASH_CLAVE) {
        try { sessionStorage.setItem(LLAVE, hash); } catch (e) {}
        c.remove();
        estilo.remove();
        resolver(true); // true = el usuario hizo clic, se puede reproducir audio
      } else {
        error.textContent = "Clave incorrecta. ¿Seguro que eres del equipo?";
        if (window.nooo) nooo(3);
        c.classList.remove("sacudir");
        void c.offsetWidth;
        c.classList.add("sacudir");
        input.select();
      }
    });
  }

  if (document.body) mostrarCandado();
  else document.addEventListener("DOMContentLoaded", mostrarCandado);
})();
