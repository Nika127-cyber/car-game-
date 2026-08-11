/* =========================================================
   STREET LEGENDS
   GAME ENGINE
========================================================= */


/* =========================================================
   GAME STATE
========================================================= */

const gameState = {

    initialized: false,

    paused: false,

    currentScreen: "homeScreen",

    sound: true,

    music: true

};


/* =========================================================
   INITIALIZE GAME ENGINE
========================================================= */

function initializeGameEngine() {

    if (
        gameState.initialized
    ) {

        return;

    }


    gameState.initialized =
        true;


    setupNavigation();

    setupRaceButtons();

    setupGameButtons();

    setupMobileControls();

    updateSelectedCarDisplay();

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navigation =
        document.querySelectorAll(
            "[data-screen]"
        );


    navigation.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const screen =
                        button.dataset.screen;


                    if (!screen) {

                        return;

                    }


                    showScreen(
                        screen
                    );


                    gameState.currentScreen =
                        screen;


                    updateSelectedCarDisplay();

                }
            );

        }
    );

}


/* =========================================================
   RACE BUTTONS
========================================================= */

function setupRaceButtons() {

    const raceButtons =
        document.querySelectorAll(
            "[data-start-race]"
        );


    raceButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    startGameRace();

                }
            );

        }
    );

}


/* =========================================================
   START GAME RACE
========================================================= */

function startGameRace() {

    const selectedCar =
        getCar(
            player.selectedCar
        );


    if (!selectedCar) {

        showNotification(
            "ჯერ აირჩიე მანქანა."
        );

        return;

    }


    prepareRaceScreen(
        selectedCar
    );


    startRace();

}


/* =========================================================
   PREPARE RACE SCREEN
========================================================= */

function prepareRaceScreen(
    car
) {

    const playerCar =
        document.getElementById(
            "playerCar"
        );


    if (!playerCar) {

        return;

    }


    playerCar.textContent =
        car.emoji;


    playerCar.dataset.carId =
        car.id;


    playerCar.style.transform =
        "translateX(-50%)";


    playerCar.style.transition =
        "transform .08s linear";


    const carName =
        document.getElementById(
            "raceCarName"
        );


    if (carName) {

        carName.textContent =
            `${car.brand} ${car.name}`;

    }


    const carClass =
        document.getElementById(
            "raceCarClass"
        );


    if (carClass) {

        carClass.textContent =
            car.class;

    }


    const maxSpeed =
        document.getElementById(
            "raceMaxSpeed"
        );


    if (maxSpeed) {

        maxSpeed.textContent =
            car.stats.speed +
            " KM/H";

    }


    resetRaceCarPosition();

}


/* =========================================================
   RESET PLAYER CAR
========================================================= */

function resetRaceCarPosition() {

    const playerCar =
        document.getElementById(
            "playerCar"
        );


    if (!playerCar) {

        return;

    }


    playerCar.style.left =
        "50%";


    playerCar.style.bottom =
        "12%";


    playerCar.style.transform =
        "translateX(-50%)";


    playerCar.dataset.lane =
        "1";

}


/* =========================================================
   GAME BUTTONS
========================================================= */

function setupGameButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-game-action]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.gameAction;


                    handleGameAction(
                        action
                    );

                }
            );

        }
    );

}


/* =========================================================
   HANDLE ACTION
========================================================= */

function handleGameAction(
    action
) {

    switch (
        action
    ) {

        case "pause":

            pauseGame();

            break;


        case "resume":

            resumeGame();

            break;


        case "home":

            leaveRace();

            break;


        case "garage":

            showScreen(
                "garageScreen"
            );

            break;


        case "cars":

            showScreen(
                "carsScreen"
            );

            break;


        case "missions":

            showScreen(
                "missionsScreen"
            );

            break;


        case "shop":

            showScreen(
                "shopScreen"
            );

            break;


        case "leaderboard":

            showScreen(
                "leaderboardScreen"
            );

            break;


        case "profile":

            showScreen(
                "profileScreen"
            );

            break;

    }

}


/* =========================================================
   PAUSE
========================================================= */

function pauseGame() {

    if (
        !raceState.active
    ) {

        return;

    }


    gameState.paused =
        true;


    const pauseScreen =
        document.getElementById(
            "pauseScreen"
        );


    if (pauseScreen) {

        pauseScreen.style.display =
            "flex";

    }

}


/* =========================================================
   RESUME
========================================================= */

function resumeGame() {

    gameState.paused =
        false;


    const pauseScreen =
        document.getElementById(
            "pauseScreen"
        );


    if (pauseScreen) {

        pauseScreen.style.display =
            "none";

    }

}


/* =========================================================
   LEAVE RACE
========================================================= */

function leaveRace() {

    if (
        raceState.active
    ) {

        raceState.active =
            false;


        if (
            raceState.animationFrame
        ) {

            cancelAnimationFrame(
                raceState.animationFrame
            );

        }


        if (
            raceState.timerInterval
        ) {

            clearInterval(
                raceState.timerInterval
            );

        }

    }


    gameState.paused =
        false;


    resetRaceCarPosition();


    showScreen(
        "homeScreen"
    );

}


/* =========================================================
   MOBILE STEERING
========================================================= */

function movePlayerCar(
    direction
) {

    const playerCar =
        document.getElementById(
            "playerCar"
        );


    if (!playerCar) {

        return;

    }


    let lane =
        Number(
            playerCar.dataset.lane ||
            1
        );


    if (
        direction ===
        "left"
    ) {

        lane--;

    }


    if (
        direction ===
        "right"
    ) {

        lane++;

    }


    lane =
        Math.max(
            0,
            Math.min(
                2,
                lane
            )
        );


    playerCar.dataset.lane =
        lane;


    const positions = [

        "20%",

        "50%",

        "80%"

    ];


    playerCar.style.left =
        positions[lane];

}


/* =========================================================
   SETUP MOBILE CONTROLS
========================================================= */

function setupMobileControls() {

    const leftButton =
        document.getElementById(
            "leftControl"
        );


    const rightButton =
        document.getElementById(
            "rightControl"
        );


    const nitroButton =
        document.getElementById(
            "nitroControl"
        );


    const accelerateButton =
        document.getElementById(
            "accelerateControl"
        );


    const brakeButton =
        document.getElementById(
            "brakeControl"
        );


    if (leftButton) {

        leftButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                movePlayerCar(
                    "left"
                );

            },
            {
                passive:false
            }
        );


        leftButton.addEventListener(
            "click",
            () => {

                movePlayerCar(
                    "left"
                );

            }
        );

    }


    if (rightButton) {

        rightButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                movePlayerCar(
                    "right"
                );

            },
            {
                passive:false
            }
        );


        rightButton.addEventListener(
            "click",
            () => {

                movePlayerCar(
                    "right"
                );

            }
        );

    }


    if (nitroButton) {

        setupHoldButton(
            nitroButton,
            "Shift"
        );

    }


    if (accelerateButton) {

        setupHoldButton(
            accelerateButton,
            "ArrowUp"
        );

    }


    if (brakeButton) {

        setupHoldButton(
            brakeButton,
            "ArrowDown"
        );

    }

}


/* =========================================================
   HOLD BUTTON
========================================================= */

function setupHoldButton(
    button,
    key
) {

    const start =
        event => {

            event.preventDefault();

            raceState.keys[
                key
            ] = true;

        };


    const stop =
        event => {

            event.preventDefault();

            raceState.keys[
                key
            ] = false;

        };


    button.addEventListener(
        "touchstart",
        start,
        {
            passive:false
        }
    );


    button.addEventListener(
        "touchend",
        stop,
        {
            passive:false
        }
    );


    button.addEventListener(
        "touchcancel",
        stop,
        {
            passive:false
        }
    );


    button.addEventListener(
        "mousedown",
        start
    );


    button.addEventListener(
        "mouseup",
        stop
    );


    button.addEventListener(
        "mouseleave",
        stop
    );

}


/* =========================================================
   SELECTED CAR DISPLAY
========================================================= */

function updateSelectedCarDisplay() {

    const car =
        getCar(
            player.selectedCar
        );


    if (!car) {

        return;

    }


    const elements = [

        document.getElementById(
            "homeCar"
        ),

        document.getElementById(
            "selectedCarPreview"
        )

    ];


    elements.forEach(
        element => {

            if (!element) {

                return;

            }


            element.textContent =
                car.emoji;

        }
    );


    const name =
        document.getElementById(
            "selectedCarName"
        );


    if (name) {

        name.textContent =
            `${car.brand} ${car.name}`;

    }

}


/* =========================================================
   SOUND SYSTEM
========================================================= */

function toggleSound() {

    gameState.sound =
        !gameState.sound;


    showNotification(
        gameState.sound
        ? "🔊 ხმა ჩართულია"
        : "🔇 ხმა გამორთულია"
    );

}


/* =========================================================
   MUSIC SYSTEM
========================================================= */

function toggleMusic() {

    gameState.music =
        !gameState.music;


    showNotification(
        gameState.music
        ? "🎵 მუსიკა ჩართულია"
        : "🔇 მუსიკა გამორთულია"
    );

}


/* =========================================================
   GAME SETTINGS
========================================================= */

function saveGameSettings() {

    localStorage.setItem(
        "streetLegendsSettings",
        JSON.stringify(
            gameState
        )
    );

}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadGameSettings() {

    const saved =
        localStorage.getItem(
            "streetLegendsSettings"
        );


    if (!saved) {

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        gameState.sound =
            data.sound ??
            true;


        gameState.music =
            data.music ??
            true;

    } catch {

        console.log(
            "Settings could not be loaded."
        );

    }

}


/* =========================================================
   AUTO SAVE
========================================================= */

setInterval(
    () => {

        savePlayer();

        saveGameSettings();

    },
    5000
);


/* =========================================================
   GAME ENGINE START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGameSettings();

        setTimeout(
            () => {

                initializeGameEngine();

            },
            500
        );

    }
);
