/* =========================================================
   EduVanta Home Page Featured Banner Slider
   ---------------------------------------------------------
   Add/remove as many images as you want in this ONE list.
   The banner frame automatically fits each image's real ratio.
   Slides change every 3 seconds.
   ========================================================= */

const homeSliderImages = [
    "images/home-slider/banner1.png",
    "images/home-slider/banner2.png",
    "images/home-slider/banner3.png",
    "images/home-slider/banner4.png",
    "images/home-slider/banner5.png",
    "images/home-slider/banner6.png"
];

const homeBannerSlider = document.getElementById("homeBannerSlider");
const homeBannerDots = document.getElementById("homeBannerDots");
const homeBannerA = document.getElementById("homeBannerImageA");
const homeBannerB = document.getElementById("homeBannerImageB");
const homeBannerViewport = homeBannerSlider?.querySelector(".home-banner-viewport");

let homeBannerIndex = 0;
let homeBannerTimer = null;
let activeLayer = homeBannerA;
let slideToken = 0;

if (
    homeBannerSlider &&
    homeBannerDots &&
    homeBannerA &&
    homeBannerB &&
    homeBannerViewport &&
    homeSliderImages.length
) {

    // Set the frame ratio from the real image dimensions.
    function setBannerRatio(image) {
        if (!image.naturalWidth || !image.naturalHeight) return;

        const ratio = image.naturalWidth / image.naturalHeight;
        homeBannerViewport.style.setProperty("--banner-ratio", `${ratio}`);
    }

    function loadImageRatio(src, callback) {
        const probe = new Image();
        probe.onload = () => {
            const ratio = probe.naturalWidth / probe.naturalHeight;
            homeBannerViewport.style.setProperty("--banner-ratio", `${ratio}`);
            if (callback) callback();
        };
        probe.src = src;
    }

    // Create one small dot per image automatically.
    homeSliderImages.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "home-banner-dot";
        dot.setAttribute("aria-label", `Show banner ${index + 1}`);

        dot.addEventListener("click", () => {
            if (index !== homeBannerIndex) {
                showHomeBanner(index);
                restartHomeBannerTimer();
            }
        });

        homeBannerDots.appendChild(dot);
    });

    const dots = () => homeBannerDots.querySelectorAll(".home-banner-dot");

    function updateDots() {
        dots().forEach((dot, index) => {
            dot.classList.toggle("active", index === homeBannerIndex);
        });
    }

    function showHomeBanner(index) {
        homeBannerIndex = (index + homeSliderImages.length) % homeSliderImages.length;

        if (homeSliderImages.length < 2) {
            activeLayer.src = homeSliderImages[homeBannerIndex];
            activeLayer.onload = () => setBannerRatio(activeLayer);
            updateDots();
            return;
        }

        const nextLayer = activeLayer === homeBannerA ? homeBannerB : homeBannerA;
        const nextSrc = homeSliderImages[homeBannerIndex];
        const token = ++slideToken;

        // Preload first, then change the frame to the new image ratio.
        const probe = new Image();
        probe.onload = () => {
            if (token !== slideToken) return;

            homeBannerViewport.style.setProperty(
                "--banner-ratio",
                `${probe.naturalWidth / probe.naturalHeight}`
            );

            nextLayer.src = nextSrc;
            nextLayer.alt = `EduVanta featured banner ${homeBannerIndex + 1}`;

            nextLayer.classList.remove("is-active", "slide-in", "slide-out");
            activeLayer.classList.remove("slide-in", "slide-out");
            nextLayer.classList.add("slide-in");

            void nextLayer.offsetWidth;

            nextLayer.classList.add("is-active");
            activeLayer.classList.add("slide-out");

            window.setTimeout(() => {
                if (token !== slideToken) return;

                activeLayer.classList.remove("is-active", "slide-out");
                nextLayer.classList.remove("slide-in");
                activeLayer = nextLayer;
                updateDots();
            }, 720);
        };

        probe.onerror = () => {
            // If a bad image URL is supplied, keep the current banner visible.
            updateDots();
        };

        probe.src = nextSrc;
    }

    function startHomeBannerTimer() {
        window.clearInterval(homeBannerTimer);

        if (homeSliderImages.length > 1) {
            homeBannerTimer = window.setInterval(() => {
                showHomeBanner(homeBannerIndex + 1);
            }, 3000);
        }
    }

    function restartHomeBannerTimer() {
        startHomeBannerTimer();
    }

    homeBannerSlider.addEventListener("mouseenter", () => {
        window.clearInterval(homeBannerTimer);
    });

    homeBannerSlider.addEventListener("mouseleave", () => {
        startHomeBannerTimer();
    });

    homeBannerSlider.addEventListener("touchstart", () => {
        window.clearInterval(homeBannerTimer);
    }, { passive: true });

    homeBannerSlider.addEventListener("touchend", () => {
        startHomeBannerTimer();
    }, { passive: true });

    // First image: load it and immediately size the frame to its ratio.
    homeBannerA.src = homeSliderImages[0];
    homeBannerA.alt = "EduVanta featured banner 1";

    homeBannerA.addEventListener("load", () => {
        setBannerRatio(homeBannerA);
    }, { once: true });

    if (homeSliderImages.length > 1) {
        homeBannerB.src = homeSliderImages[1];
        homeBannerB.alt = "EduVanta featured banner 2";
    }

    updateDots();
    loadImageRatio(homeSliderImages[0]);
    startHomeBannerTimer();
}
