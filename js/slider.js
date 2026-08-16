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
    "images/screenshots/screenshot14.jpg",
    "images/screenshots/screenshot15.jpg",
    "images/screenshots/screenshot16.jpg",
    "images/screenshots/screenshot17.jpg",
    "images/screenshots/screenshot18.jpg",
    "images/screenshots/screenshot19.jpg",
    "images/screenshots/screenshot20.jpg",
    "images/screenshots/screenshot21.jpg",
    "images/screenshots/screenshot22.jpg",
    "images/screenshots/screenshot23.jpg",
    "images/screenshots/screenshot24.jpg",
    "images/screenshots/screenshot25.jpg"
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