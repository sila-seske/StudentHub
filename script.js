// =========================
// STUDENTHUB
// =========================

document.addEventListener("DOMContentLoaded", function () {

    let classes = [];

    // =========================
    // ADD CLASS
    // =========================

    let addClassButton = document.getElementById("addClassBtn");
    let classForm = document.getElementById("classForm");
    let saveClassButton = document.getElementById("saveClassBtn");
    let classList = document.getElementById("classList");

    addClassButton.addEventListener("click", function () {
        classForm.style.display = "block";
    });

    saveClassButton.addEventListener("click", function () {

        let course = document.getElementById("courseName").value.trim();
        let day = document.getElementById("classDay").value;
        let startTime = document.getElementById("startTime").value;
        let endTime = document.getElementById("endTime").value;
        let room = document.getElementById("classRoom").value.trim();

        if (
            course === "" ||
            day === "" ||
            startTime === "" ||
            endTime === "" ||
            room === ""
        ) {
            alert("Please fill in all the class information.");
            return;
        }

        let classInfo = {
            course: course,
            day: day,
            startTime: startTime,
            endTime: endTime,
            room: room
        };

        classes.push(classInfo);
        displayClasses();

        document.getElementById("courseName").value = "";
        document.getElementById("classDay").value = "Monday";
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("classRoom").value = "";
    });

    function displayClasses() {

        classList.innerHTML = "";

        classes.forEach(function (classInfo, index) {

            classList.innerHTML += `
                <div>
                    <h3>${classInfo.course}</h3>
                    <p>${classInfo.day}</p>
                    <p>${classInfo.startTime} - ${classInfo.endTime}</p>
                    <p>${classInfo.room}</p>

                    <button onclick="deleteClass(${index})">
                        Delete
                    </button>
                </div>
            `;
        });
    }

    window.deleteClass = function (index) {
        classes.splice(index, 1);
        displayClasses();
    };


    // =========================
    // STUDY PLANNER
    // =========================

    let studyPlanButton = document.getElementById("studyPlanBtn");
    let studyResults = document.getElementById("studyResults");

    studyPlanButton.addEventListener("click", function () {

        let numberOfClasses = classes.length;
        let classNames = "";

        classes.forEach(function (classInfo) {

            classNames += `
                <li>
                    ${classInfo.course} - ${classInfo.day}
                </li>
            `;
        });

        studyResults.innerHTML = `
            <div>
                <h3>💡 Your Study Plan</h3>

                <p>
                    You currently have ${numberOfClasses} class(es) scheduled.
                </p>

                <ul>
                    ${classNames}
                </ul>
            </div>
        `;
    });


    // =========================
    // DIGITAL CLOCK
    // =========================

    function updateClock() {

        let now = new Date();

        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");

        document.getElementById("digitalClock").textContent =
            hours + ":" + minutes + ":" + seconds;
    }

    updateClock();
    setInterval(updateClock, 1000);


    // =========================
    // STUDENT PREFERENCES
    // =========================

    let savePreferencesButton =
        document.getElementById("savePreferencesBtn");

    savePreferencesButton.addEventListener("click", function () {

        let studentName =
            document.getElementById("studentName").value.trim();

        let studyPreference =
            document.getElementById("studyPreference").value;

        let studyDuration =
            document.getElementById("studyDuration").value;


        if (studentName === "") {

            alert("Please enter your name.");
            return;
        }


        localStorage.setItem("studentName", studentName);
        localStorage.setItem("studyPreference", studyPreference);
        localStorage.setItem("studyDuration", studyDuration);


        alert("Preferences saved successfully!");
    });


    // =========================
    // LOAD SAVED PREFERENCES
    // =========================

    let savedName = localStorage.getItem("studentName");
    let savedPreference = localStorage.getItem("studyPreference");
    let savedDuration = localStorage.getItem("studyDuration");

    if (savedName !== null) {
        document.getElementById("studentName").value = savedName;
    }

    if (savedPreference !== null) {
        document.getElementById("studyPreference").value = savedPreference;
    }

    if (savedDuration !== null) {
        document.getElementById("studyDuration").value = savedDuration;
    }


    // =========================
    // PWA INSTALL BUTTON
    // =========================

    let installButton = document.getElementById("installBtn");
    let deferredInstallPrompt = null;

    installButton.style.display = "none";

    window.addEventListener("beforeinstallprompt", function (event) {

        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.style.display = "block";
    });

    installButton.addEventListener("click", async function () {

        if (!deferredInstallPrompt) {
            alert("StudentHub cannot be installed from this preview yet. Open it from a supported HTTPS website.");
            return;
        }

        deferredInstallPrompt.prompt();

        await deferredInstallPrompt.userChoice;

        deferredInstallPrompt = null;
        installButton.style.display = "none";
    });


    // =========================
    // SERVICE WORKER
    // =========================

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker.register("./service-worker.js")
            .then(function () {
                console.log("StudentHub service worker registered!");
            })
            .catch(function (error) {
                console.log("Service worker registration failed:", error);
            });
    }

});
