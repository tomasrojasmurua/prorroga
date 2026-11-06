// Grito "¡Noooo!" de Nicolás para errores y derrotas.
// Si se indican segundos, se corta antes con un fundido.
function nooo(segundos) {
  try {
    if (window._nooo) window._nooo.pause();
    const a = new Audio("audio/noooo.mp3");
    window._nooo = a;
    a.play().catch(() => {});
    if (!segundos) return;
    setTimeout(() => {
      const paso = setInterval(() => {
        a.volume = Math.max(0, a.volume - 0.1);
        if (a.volume <= 0) { a.pause(); clearInterval(paso); }
      }, 40);
    }, segundos * 1000 - 400);
  } catch (e) {}
}
