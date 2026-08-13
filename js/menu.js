/* =========================================================
   EduVanta — Shared Responsive Menu
   Works on every page
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!menuToggle || !mainNav) return;

    function closeMenu() {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
    }

    function toggleMenu(event) {
        event.stopPropagation();
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    menuToggle.addEventListener("click", toggleMenu);

    mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });

    // Keep the correct menu item active even if the HTML active class is missing.
    const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    mainNav.querySelectorAll("a").forEach(function (link) {
        const linkPage = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});
