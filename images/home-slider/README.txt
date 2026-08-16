EDUVANTA HOME PAGE SLIDER
==========================

All banner photo addresses/paths are managed in ONE place only:

    js/home-slider.js

You do NOT need to add banner photo paths in index.html.

How to add photos:
1. Put your images inside this folder: images/home-slider/
2. Open js/home-slider.js
3. Add each image path inside homeSliderImages.

Example for 5 images:

const homeSliderImages = [
    "images/home-slider/banner1.jpg",
    "images/home-slider/banner2.jpg",
    "images/home-slider/banner3.jpg",
    "images/home-slider/banner4.jpg",
    "images/home-slider/banner5.jpg"
];

You can use 1, 5, 10, or any number of images.
The slider automatically creates the navigation dots and changes images every 3 seconds.

You can also use a direct web image URL if needed, for example:
"https://example.com/banner.jpg"

Only edit the homeSliderImages list when adding/removing banners.
