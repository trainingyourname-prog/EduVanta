const images = [
    "images/screenshots/screenshot1.jpg",
    "images/screenshots/screenshot2.jpg",
    "images/screenshots/screenshot3.jpg",
    "images/screenshots/screenshot4.jpg",
    "images/screenshots/screenshot5.jpg",
    "images/screenshots/screenshot6.jpg",
    "images/screenshots/screenshot7.jpg",
    "images/screenshots/screenshot8.jpg",
    "images/screenshots/screenshot9.jpg",
    "images/screenshots/screenshot10.jpg",
    "images/screenshots/screenshot11.jpg",
    "images/screenshots/screenshot12.jpg",
    "images/screenshots/screenshot13.jpg",
    "images/screenshots/screenshot14.jpg"
];

let i = 0;

const slider = document.getElementById("slider");

if (slider) {

    setInterval(() => {

        i++;

        if (i >= images.length) {

            i = 0;

        }

        slider.src = images[i];

    }, 2500);

}