/* =========================================================
   EduVanta Premium Screenshot Gallery + Lightbox
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const total = 25;
    const imagePath = "images/screenshots/screenshot";

    const track = document.getElementById("showcaseTrack");
    const dots = document.getElementById("showcaseDots");
    const gallery = document.getElementById("gallery");
    const counter = document.getElementById("showcaseCounter");
    const prevBtn = document.getElementById("showcasePrev");
    const nextBtn = document.getElementById("showcaseNext");
    const playPause = document.getElementById("playPause");
    const viewport = document.getElementById("showcaseViewport");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const closeBtn = document.getElementById("closeBtn");
    const backdrop = document.querySelector(".lightbox-backdrop");

    let current = 0;
    let lightboxCurrent = 0;
    let timer = null;
    let isPlaying = true;

    function pad(number) {
        return String(number).padStart(2, "0");
    }

    function src(index) {
        return imagePath + (index + 1) + ".jpg";
    }

    // Build the premium slideshow and gallery from the same 25 images.
    for (let i = 0; i < total; i++) {
        const slide = document.createElement("div");
        slide.className = "showcase-slide";
        slide.innerHTML = `<img src="${src(i)}" alt="EduVanta Screenshot ${pad(i + 1)}" loading="${i === 0 ? "eager" : "lazy"}">`;
        slide.querySelector("img").addEventListener("click", () => openLightbox(i));
        track.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "showcase-dot";
        dot.setAttribute("aria-label", `Show screenshot ${i + 1}`);
        dot.addEventListener("click", () => goTo(i, true));
        dots.appendChild(dot);

        const card = document.createElement("article");
        card.className = "gallery-card";
        card.style.setProperty("--delay", `${Math.min(i * 0.045, 0.8)}s`);
        card.innerHTML = `
            <img src="${src(i)}" alt="EduVanta Screenshot ${pad(i + 1)}" loading="lazy">
            <span class="gallery-number">${pad(i + 1)}</span>
        `;
        card.addEventListener("click", () => openLightbox(i));
        gallery.appendChild(card);
    }

    const slides = Array.from(document.querySelectorAll(".showcase-slide"));
    const dotItems = Array.from(document.querySelectorAll(".showcase-dot"));

    function updateShowcase() {
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent = `${pad(current + 1)} / ${total}`;
        slides.forEach((slide, index) => slide.classList.toggle("active", index === current));
        dotItems.forEach((dot, index) => dot.classList.toggle("active", index === current));
    }

    function goTo(index, restartTimer = false) {
        current = (index + total) % total;
        updateShowcase();
        if (restartTimer && isPlaying) restartAutoPlay();
    }

    function next() {
        goTo(current + 1);
    }

    function previous() {
        goTo(current - 1, true);
    }

    function startAutoPlay() {
        clearInterval(timer);
        if (!isPlaying) return;
        timer = setInterval(next, 3500);
    }

    function restartAutoPlay() {
        startAutoPlay();
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        playPause.textContent = isPlaying ? "❚❚" : "▶";
        playPause.setAttribute("aria-label", isPlaying ? "Pause slideshow" : "Play slideshow");
        startAutoPlay();
    }

    function openLightbox(index) {
        lightboxCurrent = index;
        updateLightbox();
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function updateLightbox() {
        lightboxImg.src = src(lightboxCurrent);
        lightboxImg.alt = `EduVanta Screenshot ${pad(lightboxCurrent + 1)}`;
        lightboxCounter.textContent = `${pad(lightboxCurrent + 1)} / ${total}`;
        lightboxCaption.textContent = `EduVanta Screenshot ${pad(lightboxCurrent + 1)}`;
        lightboxImg.style.animation = "none";
        void lightboxImg.offsetWidth;
        lightboxImg.style.animation = "lightboxImageIn .45s cubic-bezier(.2,.8,.2,1) both";
    }

    function nextLightbox() {
        lightboxCurrent = (lightboxCurrent + 1) % total;
        updateLightbox();
    }

    function previousLightbox() {
        lightboxCurrent = (lightboxCurrent - 1 + total) % total;
        updateLightbox();
    }

    prevBtn.addEventListener("click", previous);
    nextBtn.addEventListener("click", () => goTo(current + 1, true));
    playPause.addEventListener("click", togglePlay);

    viewport.addEventListener("mouseenter", () => clearInterval(timer));
    viewport.addEventListener("mouseleave", startAutoPlay);

    lightboxPrev.addEventListener("click", previousLightbox);
    lightboxNext.addEventListener("click", nextLightbox);
    closeBtn.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("open")) return;
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") nextLightbox();
        if (event.key === "ArrowLeft") previousLightbox();
    });

    // Swipe support for phones.
    let touchStartX = 0;
    viewport.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", e => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 45) {
            diff < 0 ? goTo(current + 1, true) : goTo(current - 1, true);
        }
    }, { passive: true });

    lightbox.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", e => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 45) {
            diff < 0 ? nextLightbox() : previousLightbox();
        }
    }, { passive: true });

    updateShowcase();
    startAutoPlay();
});
