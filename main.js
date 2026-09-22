onload = () => {
    document.body.classList.remove("container");

    const audio = document.getElementById("song");
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = document.getElementById("music-icon");
    const audioPrompt = document.getElementById("audio-prompt");

    if (!audio) return;

    let hasInteracted = false;

    const updateUIState = (isPlaying) => {
        if (isPlaying) {
            if (musicBtn) musicBtn.classList.add("playing");
            if (musicIcon) musicIcon.textContent = "🎵";
            if (audioPrompt) audioPrompt.classList.add("fade-out");
        } else {
            if (musicBtn) musicBtn.classList.remove("playing");
            if (musicIcon) musicIcon.textContent = "🔇";
        }
    };

    const playAudio = () => {
        audio.play().then(() => {
            updateUIState(true);
            removeFirstInteractionListeners();
        }).catch(() => {
            // Si el navegador bloqueó la reproducción automática en frío
            if (audioPrompt) audioPrompt.classList.remove("hidden");
            updateUIState(false);
        });
    };

    const handleFirstInteraction = () => {
        if (hasInteracted) return;
        hasInteracted = true;
        playAudio();
    };

    const removeFirstInteractionListeners = () => {
        ["click", "touchstart", "pointerdown", "keydown"].forEach(event => {
            document.removeEventListener(event, handleFirstInteraction);
        });
    };

    // Intentar reproducir automáticamente
    playAudio();

    // Si el navegador requiere interacción previa, iniciar al primer toque/clic en cualquier parte
    ["click", "touchstart", "pointerdown", "keydown"].forEach(event => {
        document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    // Control manual mediante el botón de música
    if (musicBtn) {
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play().then(() => updateUIState(true)).catch(() => {});
            } else {
                audio.pause();
                updateUIState(false);
            }
        });
    }

    if (audioPrompt) {
        audioPrompt.addEventListener("click", (e) => {
            e.stopPropagation();
            playAudio();
        });
    }
};
