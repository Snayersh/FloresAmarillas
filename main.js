onload = () => {
    document.body.classList.remove("container");

    const audio = document.getElementById("song");
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = document.getElementById("music-icon");
    const audioPrompt = document.getElementById("audio-prompt");

    if (!audio) return;

    let hasStarted = false;

    const updateUIState = (isPlaying) => {
        if (isPlaying) {
            if (musicBtn) {
                musicBtn.classList.add("playing");
                musicBtn.setAttribute("title", "Pausar música");
                musicBtn.setAttribute("aria-label", "Pausar música");
            }
            if (musicIcon) musicIcon.textContent = "🎵";
            if (audioPrompt) audioPrompt.classList.add("fade-out");
        } else {
            if (musicBtn) {
                musicBtn.classList.remove("playing");
                musicBtn.setAttribute("title", "Reproducir música");
                musicBtn.setAttribute("aria-label", "Reproducir música");
            }
            if (musicIcon) musicIcon.textContent = "🔇";
        }
    };

    const playAudio = () => {
        return audio.play()
            .then(() => {
                hasStarted = true;
                updateUIState(true);
                removeInteractionListeners();
            })
            .catch(() => {
                // Si el navegador bloqueó la reproducción automática en frío
                if (!hasStarted && audioPrompt) {
                    audioPrompt.classList.remove("hidden");
                }
                updateUIState(false);
            });
    };

    const handleFirstInteraction = () => {
        if (hasStarted) return;
        playAudio();
    };

    const removeInteractionListeners = () => {
        ["click", "touchstart", "pointerdown", "keydown"].forEach(event => {
            window.removeEventListener(event, handleFirstInteraction);
            document.removeEventListener(event, handleFirstInteraction);
        });
    };

    // Intentar reproducir automáticamente
    playAudio();

    // Si el navegador requiere interacción previa, iniciar al primer clic/toque en la página
    ["click", "touchstart", "pointerdown", "keydown"].forEach(event => {
        window.addEventListener(event, handleFirstInteraction, { once: true });
        document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    // Control manual mediante el botón de música
    if (musicBtn) {
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (audio.paused) {
                playAudio();
            } else {
                audio.pause();
                updateUIState(false);
            }
        });
    }

    // Al pulsar directamente en el aviso flotante
    if (audioPrompt) {
        audioPrompt.addEventListener("click", (e) => {
            e.stopPropagation();
            playAudio();
        });
    }
};
