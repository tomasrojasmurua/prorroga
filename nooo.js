// Grito "¡Noooo!" de Nicolás para errores y derrotas.
// Suena solo los primeros segundos (el audio completo está en la botonera).
function nooo(segundos = 3) {
  try {
    if (window._nooo) window._nooo.pause();
    const a = new Audio("audio/noooo.mp3");
    window._nooo = a;
    a.play().catch(() => {});
    const fin = segundos * 1000;
    setTimeout(() => {
      const paso = setInterval(() => {
        a.volume = Math.max(0, a.volume - 0.1);
        if (a.volume <= 0) { a.pause(); clearInterval(paso); }
      }, 40);
    }, fin - 400);
  } catch (e) {}
}
