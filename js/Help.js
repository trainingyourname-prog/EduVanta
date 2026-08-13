/*
========================================================
EduVanta Help Center — Frontend Settings
========================================================

1. Google Apps Script Web App URL এখানে বসাও।
2. WhatsApp number country code সহ দাও।
3. Email address দাও.
========================================================
*/

const CONFIG = {

    // IMPORTANT:
    // এখানে শুধু সরাসরি Google Apps Script Web App URL থাকবে।
    GOOGLE_SCRIPT_URL:
        "https://script.google.com/macros/s/AKfycbzdJbDkMzKQq46fW-Hqfs3AEgYFuGymtpuONTGWilOoNZwgXXbVNeqxP7P4c6r-zNCV/exec",

    // Country code সহ, + বা space ছাড়া
    ADMIN_WHATSAPP: "9474391464",

    // নিজের Email এখানে বসাও
    ADMIN_EMAIL: "eduvanta.help.centre@gmail.com",

    // Maximum upload size
    MAX_PDF_SIZE_MB: 3,

    // Maximum number of photos per request
    MAX_PHOTOS: 5
};


// ======================================================
// ELEMENTS
// ======================================================

const form = document.getElementById("helpForm");

const fileInput =
    document.getElementById("sourceFile");

const uploadBox =
    document.getElementById("uploadBox");

const fileName =
    document.getElementById("fileName");

const statusBox =
    document.getElementById("formStatus");

const submitBtn =
    document.getElementById("submitBtn");

const problem =
    document.getElementById("problem");

const problemCount =
    document.getElementById("problemCount");

const subjectSelect =
    document.getElementById("subject");

const otherSubject =
    document.getElementById("otherSubject");

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


// ======================================================
// YEAR
// ======================================================

const yearElement =
    document.getElementById("year");

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


// ======================================================
// WHATSAPP LINK
// ======================================================

const whatsappLink =
    document.getElementById("whatsappLink");

if (whatsappLink) {

    const whatsappMessage =
        encodeURIComponent(
            "EduVanta Help Center সম্পর্কে জানতে চাই।"
        );

    whatsappLink.href =
        `https://wa.me/${CONFIG.ADMIN_WHATSAPP}?text=${whatsappMessage}`;
}


// ======================================================
// EMAIL LINK
// ======================================================

const emailLink =
    document.getElementById("emailLink");

if (emailLink) {

    emailLink.href =
        `mailto:${CONFIG.ADMIN_EMAIL}?subject=${encodeURIComponent(
            "EduVanta Help Center Request"
        )}`;
}


// ======================================================
// SUBJECT / TOPIC
// ======================================================

if (subjectSelect && otherSubject) {

    subjectSelect.addEventListener(
        "change",
        () => {

            const isOther =
                subjectSelect.value === "অন্যান্য";


            otherSubject.classList.toggle(
                "show",
                isOther
            );


            otherSubject.required =
                isOther;


            if (!isOther) {

                otherSubject.value = "";

            }

        }
    );

}


// ======================================================
// PROBLEM CHARACTER COUNTER
// ======================================================

if (problem && problemCount) {

    problem.addEventListener(
        "input",
        () => {

            problemCount.textContent =
                problem.value.length;

        }
    );

}


// ======================================================
// UPLOAD BOX CLICK
// ======================================================

if (uploadBox && fileInput) {

    uploadBox.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );

}


// ======================================================
// FILE CHANGE
// ======================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            updateFileName();

        }
    );

}


// ======================================================
// DRAG & DROP
// ======================================================

if (uploadBox) {

    [
        "dragenter",
        "dragover"
    ].forEach(eventName => {

        uploadBox.addEventListener(
            eventName,
            event => {

                event.preventDefault();
                event.stopPropagation();

                uploadBox.classList.add(
                    "dragover"
                );

            }
        );

    });


    [
        "dragleave",
        "drop"
    ].forEach(eventName => {

        uploadBox.addEventListener(
            eventName,
            event => {

                event.preventDefault();
                event.stopPropagation();

                uploadBox.classList.remove(
                    "dragover"
                );

            }
        );

    });


    uploadBox.addEventListener(
        "drop",
        event => {

            const files =
                event.dataTransfer.files;

            if (files.length > 0) {

                fileInput.files = files;

                updateFileName();

            }

        }
    );

}


// ======================================================
// UPDATE FILE NAME
// ======================================================

function updateFileName() {

    const files = Array.from(fileInput.files || []);

    if (!files.length) {
        fileName.textContent = "কোনো ফাইল নির্বাচন করা হয়নি";
        return;
    }

    const pdfFiles = files.filter(file => isPdfFile(file));
    const photoFiles = files.filter(file => isPhotoFile(file));

    // A request can contain either one PDF or up to five photos.
    if (pdfFiles.length > 0 && files.length !== 1) {
        fileName.textContent = "❌ PDF-এর সঙ্গে অন্য ফাইল একসাথে দেওয়া যাবে না।";
        fileInput.value = "";
        return;
    }

    if (pdfFiles.length > 1) {
        fileName.textContent = "❌ একবারে শুধু ১টি PDF দেওয়া যাবে।";
        fileInput.value = "";
        return;
    }

    if (photoFiles.length > CONFIG.MAX_PHOTOS) {
        fileName.textContent = `❌ সর্বোচ্চ ${CONFIG.MAX_PHOTOS}টি Photo আপলোড করা যাবে।`;
        fileInput.value = "";
        return;
    }

    if (photoFiles.length === 0 && pdfFiles.length === 0) {
        fileName.textContent = "❌ শুধু PDF, JPG, JPEG, PNG অথবা WEBP ফাইল দেওয়া যাবে।";
        fileInput.value = "";
        return;
    }

    // PDF size limit: 3 MB.
    if (pdfFiles.length === 1 && pdfFiles[0].size > CONFIG.MAX_PDF_SIZE_MB * 1024 * 1024) {
        fileName.textContent = `❌ PDF-এর সর্বোচ্চ সাইজ ${CONFIG.MAX_PDF_SIZE_MB} MB।`;
        fileInput.value = "";
        return;
    }

    const totalSizeMB = files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);

    if (pdfFiles.length === 1) {
        fileName.textContent = `✅ ${pdfFiles[0].name} (${(pdfFiles[0].size / (1024 * 1024)).toFixed(2)} MB)`;
    } else {
        fileName.textContent = `✅ ${photoFiles.length}টি Photo নির্বাচিত (${totalSizeMB.toFixed(2)} MB মোট)`;
    }
}

function isPdfFile(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    return file.type === "application/pdf" || extension === "pdf";
}

function isPhotoFile(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        ["jpg", "jpeg", "png", "webp"].includes(extension);
}

// ======================================================
// STATUS MESSAGE
// ======================================================

function showStatus(message, type) {

    if (!statusBox) {
        return;
    }


    statusBox.textContent =
        message;


    statusBox.className =
        `form-status show ${type}`;

}


// ======================================================
// GET SELECTED FORMAT
// ======================================================

function getSelectedFormat() {

    const selected =
        document.querySelector(
            'input[name="format"]:checked'
        );


    return selected
        ? selected.value
        : "";

}


// ======================================================
// WHATSAPP NORMALIZE
// ======================================================

function normalizeWhatsApp(value) {

    return value.replace(
        /[^\d+]/g,
        ""
    );

}


// ======================================================
// WHATSAPP VALIDATION
// ======================================================

function isValidWhatsApp(value) {

    const digits =
        value.replace(
            /\D/g,
            ""
        );


    return (
        digits.length >= 10 &&
        digits.length <= 15
    );

}


// ======================================================
// FILE TO BASE64
// ======================================================

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                const result =
                    reader.result;


                const comma =
                    result.indexOf(",");


                const base64 =
                    comma >= 0
                        ? result.slice(
                            comma + 1
                        )
                        : result;


                resolve(base64);

            };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "File reading failed."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ======================================================
// FORM SUBMIT
// ======================================================

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        // ------------------------------------------------
        // FORMAT
        // ------------------------------------------------

        const selectedFormat =
            getSelectedFormat();


        if (
            ![
                "JSON",
                "XLS",
                "XLSX"
            ].includes(selectedFormat)
        ) {

            showStatus(
                "JSON, XLS অথবা XLSX থেকে একটি ফাইল টাইপ নির্বাচন করুন।",
                "error"
            );

            return;

        }


        // ------------------------------------------------
        // STUDENT NAME
        // ------------------------------------------------

        const studentName =
            document
                .getElementById("studentName")
                .value
                .trim();


        if (!studentName) {

            showStatus(
                "Student Name লিখুন।",
                "error"
            );

            return;

        }


        // ------------------------------------------------
        // WHATSAPP
        // ------------------------------------------------

        const whatsapp =
            normalizeWhatsApp(
                document
                    .getElementById("whatsapp")
                    .value
                    .trim()
            );


        if (!isValidWhatsApp(whatsapp)) {

            showStatus(
                "সঠিক WhatsApp নম্বর দিন।",
                "error"
            );

            return;

        }


        // ------------------------------------------------
        // EMAIL
        // ------------------------------------------------

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        // ------------------------------------------------
        // SUBJECT
        // ------------------------------------------------

        let subject =
            subjectSelect.value.trim();


        if (
            subject === "অন্যান্য"
        ) {

            subject =
                otherSubject.value.trim();

        }


        if (!subject) {

            showStatus(
                "একটি Subject / Topic নির্বাচন করুন।",
                "error"
            );

            return;

        }


        // ------------------------------------------------
        // PROBLEM
        // ------------------------------------------------

        const problemText =
            problem.value.trim();




        // ------------------------------------------------
        // FILES
        // ------------------------------------------------

        const files = Array.from(fileInput.files || []);

        if (!files.length) {
            showStatus(
                "একটি PDF অথবা সর্বোচ্চ ৫টি Photo নির্বাচন করুন।",
                "error"
            );
            return;
        }

        const pdfFiles = files.filter(file => isPdfFile(file));
        const photoFiles = files.filter(file => isPhotoFile(file));

        // Allow either one PDF OR up to five photos. Do not mix them.
        if (pdfFiles.length > 0 && (files.length !== 1 || photoFiles.length > 0)) {
            showStatus(
                "একটি PDF-এর সঙ্গে অন্য PDF/Photo একসাথে দেওয়া যাবে না।",
                "error"
            );
            return;
        }

        if (pdfFiles.length > 1) {
            showStatus(
                "একবারে শুধু ১টি PDF দেওয়া যাবে।",
                "error"
            );
            return;
        }

        if (photoFiles.length > CONFIG.MAX_PHOTOS) {
            showStatus(
                `সর্বোচ্চ ${CONFIG.MAX_PHOTOS}টি Photo আপলোড করা যাবে।`,
                "error"
            );
            return;
        }

        const invalidFiles = files.filter(file => !isPdfFile(file) && !isPhotoFile(file));

        if (invalidFiles.length) {
            showStatus(
                "শুধু PDF, JPG, JPEG, PNG অথবা WEBP ফাইল দেওয়া যাবে।",
                "error"
            );
            return;
        }

        if (pdfFiles.length === 1 && pdfFiles[0].size > CONFIG.MAX_PDF_SIZE_MB * 1024 * 1024) {
            showStatus(
                `PDF-এর সর্বোচ্চ সাইজ ${CONFIG.MAX_PDF_SIZE_MB} MB।`,
                "error"
            );
            return;
        }
        // ------------------------------------------------
        // GOOGLE SCRIPT URL
        // ------------------------------------------------

        if (
            !CONFIG.GOOGLE_SCRIPT_URL ||
            CONFIG.GOOGLE_SCRIPT_URL.includes(
                "PASTE_YOUR"
            )
        ) {

            showStatus(
                "Google Apps Script Web App URL সেট করা হয়নি।",
                "error"
            );

            return;

        }


        // ------------------------------------------------
        // BUTTON LOADING
        // ------------------------------------------------

        submitBtn.disabled =
            true;


        submitBtn.innerHTML =
            "<span>⏳ ফাইল পাঠানো হচ্ছে...</span>";


        try {

            // --------------------------------------------
            // Convert all selected files to Base64
            // --------------------------------------------

            const encodedFiles = [];

            for (const selectedFile of files) {
                const base64 = await fileToBase64(selectedFile);
                encodedFiles.push({
                    fileName: selectedFile.name,
                    fileType: selectedFile.type || "application/octet-stream",
                    fileSize: selectedFile.size,
                    fileBase64: base64
                });
            }

            // --------------------------------------------
            // Payload
            // --------------------------------------------

            const firstFile = encodedFiles[0];

            const payload = {
                studentName: studentName,
                whatsapp: whatsapp,
                email: email,
                subject: subject,
                format: selectedFormat,
                formats: [selectedFormat],
                // Optional: may be empty.
                problem: problemText,
                files: encodedFiles,

                // Compatibility with the previous single-file backend.
                fileName: firstFile.fileName,
                fileType: firstFile.fileType,
                fileSize: firstFile.fileSize,
                fileBase64: firstFile.fileBase64,
                fileCount: encodedFiles.length
            };

            console.log(
                "Sending Help Center request..."
            );


            // --------------------------------------------
            // Send to Google Apps Script
            // --------------------------------------------

            await fetch(
                CONFIG.GOOGLE_SCRIPT_URL,
                {

                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


            // --------------------------------------------
            // Success
            // --------------------------------------------

            showStatus(
                "✅ আপনার request সফলভাবে পাঠানো হয়েছে। আপনার দেওয়া WhatsApp/Email নম্বরে যোগাযোগ করা হবে।",
                "success"
            );


            // --------------------------------------------
            // Reset form
            // --------------------------------------------

            form.reset();


            otherSubject.value =
                "";


            otherSubject.classList.remove(
                "show"
            );


            otherSubject.required =
                false;


            problemCount.textContent =
                "0";


            fileName.textContent =
                "কোনো ফাইল নির্বাচন করা হয়নি";


        } catch (error) {

            console.error(
                "Help Center Error:",
                error
            );


            showStatus(
                "❌ Request পাঠানো যায়নি। Internet connection এবং Google Script URL পরীক্ষা করুন।",
                "error"
            );


        } finally {

            submitBtn.disabled =
                false;


            submitBtn.innerHTML =
                "<span>📤 Request Submit করুন</span>";

        }

    }
);