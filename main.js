onload = () => {
    document.body.classList.remove("container");

    const audio = document.getElementById("song");
    if (!audio) return;

    // Intentar reproducir automáticamente solo
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Si el navegador bloquea la reproducción automática en frío,
            // empezará a sonar de forma invisible al primer roce, toque o scroll,
            // sin necesidad de mostrar avisos ni presionar botones.
            const autoPlayOnTouch = () => {
                audio.play();
                ["click", "touchstart", "pointerdown", "scroll", "keydown"].forEach(event => {
                    window.removeEventListener(event, autoPlayOnTouch);
                    document.removeEventListener(event, autoPlayOnTouch);
                });
            };

            ["click", "touchstart", "pointerdown", "scroll", "keydown"].forEach(event => {
                window.addEventListener(event, autoPlayOnTouch, { once: true, passive: true });
                document.addEventListener(event, autoPlayOnTouch, { once: true, passive: true });
            });
        });
    }
};
