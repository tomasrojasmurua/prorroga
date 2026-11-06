// Audio que suena al abrir la página
const AUDIO_AL_ABRIR = "audio2";

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

// Botonera: un solo audio a la vez; tocar el mismo botón lo detiene
let sonando = null;
function pintarBotonera() {
  const cont = document.getElementById("botonera");
  BOTONERA.forEach((b) => {
    const audio = new Audio(b.archivo);
    audio.preload = "none";
    const btn = document.createElement("button");
    btn.className = "boton";
    btn.innerHTML = `<span class="pulsador">${b.emoji}</span><span class="etiqueta"></span>`;
    btn.querySelector(".etiqueta").textContent = b.nombre;
    audio.addEventListener("ended", () => btn.classList.remove("activo"));
    btn.addEventListener("click", () => {
      const mismo = sonando && sonando.audio === audio;
      if (sonando) {
        sonando.audio.pause();
        sonando.btn.classList.remove("activo");
        sonando = null;
      }
      if (mismo) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      btn.classList.add("activo");
      sonando = { audio, btn };
    });
    cont.append(btn);
  });
}
pintarBotonera();
document.getElementById("titulo").addEventListener("click", () =>
  reproducir(AUDIO_AL_ABRIR).catch(() => {})
);

pintarChistes();
relojPrórroga();
sonarAlAbrir();
