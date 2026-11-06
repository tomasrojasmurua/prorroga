// Frase que suena al abrir la página: "audio1" o "audio2"
const AUDIO_AL_ABRIR = "audio1";

function reproducir(id) {
  const a = document.getElementById(id);
  a.currentTime = 0;
  return a.play();
}

// Los navegadores bloquean el audio automático hasta que el usuario
// interactúa. Intentamos reproducir; si falla, mostramos el botón de entrada.
function sonarAlAbrir() {
  const entrada = document.getElementById("entrada");
  reproducir(AUDIO_AL_ABRIR).catch(() => {
    entrada.classList.remove("oculto");
    document.getElementById("btn-entrar").focus();
  });
  document.getElementById("btn-entrar").addEventListener("click", () => {
    entrada.classList.add("oculto");
    reproducir(AUDIO_AL_ABRIR).catch(() => {});
  });
}

function pintarChistes() {
  const cont = document.getElementById("chistes");
  CHISTES.forEach((c, i) => {
    const art = document.createElement("article");
    art.className = "chiste";
    art.style.animationDelay = `${i * 80}ms`;
    const num = document.createElement("span");
    num.className = "numero";
    num.textContent = String(i + 1).padStart(2, "0");
    const h = document.createElement("h2");
    h.textContent = c.titulo;
    const p = document.createElement("p");
    p.textContent = c.texto;
    art.append(num, h, p);
    if (c.autor) {
      const autor = document.createElement("p");
      autor.className = "autor";
      autor.textContent = "— " + c.autor;
      art.append(autor);
    }
    cont.append(art);
  });
}

// El reloj suma minutos de prórroga cada minuto que pasas en la página
function relojPrórroga() {
  const el = document.getElementById("minutos-extra");
  let min = 1;
  setInterval(() => { el.textContent = ++min; }, 60000);
}

document.querySelectorAll(".btn-audio").forEach((b) =>
  b.addEventListener("click", () => reproducir(b.dataset.audio).catch(() => {}))
);
document.getElementById("titulo").addEventListener("click", () =>
  reproducir(AUDIO_AL_ABRIR).catch(() => {})
);

pintarChistes();
relojPrórroga();
sonarAlAbrir();
