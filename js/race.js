/* =========================================================
   STREET LEGENDS
   TRAFFIC RACE ENGINE
   ========================================================= */

let raceRunning = false;
let raceFinished = false;

let speed = 0;
let maxSpeed = 220;

let distance = 0;
let targetDistance = 5000;

let score = 0;
let nitro = 100;

let playerX = 50;

let trafficCars = [];

let animationFrame = null;
let lastTime = 0;

const keys = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
    nitro: false
};


/* =========================================================
   RACE START
   ========================================================= */

function startTrafficRace() {

    if (raceRunning) return;

    const raceScreen =
        document.getElementById("raceScreen");

    if (!raceScreen) return;

    raceRunning = true;
    raceFinished = false;

    speed = 70;
    distance = 0;
    score = 0;
    nitro = 100;

    playerX = 50;

    trafficCars = [];

    lastTime = performance.now();

    resetRaceUI();

    spawnInitialTraffic();

    requestAnimationFrame(raceLoop);

    showRaceMessage("GO!");

}


/* =========================================================
   RESET
   ========================================================= */

function resetRaceUI() {

    const player =
        document.getElementById("playerCar");

    if (player) {

        player.style.left =
            playerX + "%";

        player.style.transform =
            "translateX(-50%)";

    }

    const road =
        document.getElementById("raceRoad");

    if (road) {

        road.classList.remove("crashed");

    }

    updateRaceHUD();

}


/* =========================================================
   GAME LOOP
   ========================================================= */

function raceLoop(timestamp) {

    if (!raceRunning) return;

    const delta =
        Math.min(
            (timestamp - lastTime) / 1000,
            0.05
        );

    lastTime = timestamp;

    updatePlayer(delta);

    updateTraffic(delta);

    updateDistance(delta);

    checkCollisions();

    updateRaceHUD();

    if (
        distance >= targetDistance
    ) {

        finishRace();

        return;

    }

    animationFrame =
        requestAnimationFrame(
            raceLoop
        );

}


/* =========================================================
   PLAYER
   ========================================================= */

function updatePlayer(delta) {

    if (keys.accelerate) {

        speed +=
            100 * delta;

    } else {

        speed -=
            25 * delta;

    }


    if (keys.brake) {

        speed -=
            180 * delta;

    }


    if (keys.nitro && nitro > 0) {

        speed +=
            250 * delta;

        nitro -=
            35 * delta;

    } else {

        nitro +=
            8 * delta;

    }


    speed =
        Math.max(
            0,
            Math.min(
                maxSpeed,
                speed
            )
        );


    nitro =
        Math.max(
            0,
            Math.min(
                100,
                nitro
            )
        );


    /*
       STEERING
    */

    const steeringSpeed =
        45 * delta;


    if (keys.left) {

        playerX -=
            steeringSpeed;

    }


    if (keys.right) {

        playerX +=
            steeringSpeed;

    }


    /*
       Road limits
    */

    playerX =
        Math.max(
            12,
            Math.min(
                88,
                playerX
            )
        );


    const player =
        document.getElementById(
            "playerCar"
        );


    if (player) {

        player.style.left =
            playerX + "%";

    }

}


/* =========================================================
   TRAFFIC
   ========================================================= */

function spawnInitialTraffic() {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        spawnTraffic(
            120 + i * 18
        );

    }

}


function spawnTraffic(startY = 120) {

    const road =
        document.getElementById(
            "raceRoad"
        );

    if (!road) return;


    const car =
        document.createElement(
            "div"
        );


    car.className =
        "traffic-car";


    const lanes = [
        25,
        40,
        60,
        75
    ];


    const lane =
        lanes[
            Math.floor(
                Math.random() *
                lanes.length
            )
        ];


    const emojis = [
        "🚙",
        "🚕",
        "🚘",
        "🚗",
        "🚐",
        "🚓"
    ];


    car.textContent =
        emojis[
            Math.floor(
                Math.random() *
                emojis.length
            )
        ];


    car.style.left =
        lane + "%";


    car.style.top =
        startY + "%";


    road.appendChild(
        car
    );


    trafficCars.push({

        element: car,

        x: lane,

        y: startY,

        speed:
            35 +
            Math.random() * 50

    });

}


/* =========================================================
   TRAFFIC UPDATE
   ========================================================= */

function updateTraffic(delta) {

    trafficCars.forEach(
        traffic => {

            traffic.y +=
                (
                    speed -
                    traffic.speed +
                    80
                ) *
                delta;


            traffic.element.style.top =
                traffic.y + "%";

        }
    );


    /*
       Remove cars that passed
    */

    trafficCars =
        trafficCars.filter(
            traffic => {

                if (
                    traffic.y >
                    120
                ) {

                    traffic.element.remove();

                    spawnTraffic(
                        -20
                    );

                    score += 10;

                    return false;

                }

                return true;

            }
        );

}


/* =========================================================
   DISTANCE
   ========================================================= */

function updateDistance(delta) {

    distance +=
        speed *
        delta *
        0.45;

}


/* =========================================================
   COLLISION
   ========================================================= */

function checkCollisions() {

    const player =
        document.getElementById(
            "playerCar"
        );


    if (!player) return;


    const playerRect =
        player.getBoundingClientRect();


    for (
        const traffic of trafficCars
    ) {

        const trafficRect =
            traffic.element.getBoundingClientRect();


        const collision =
            playerRect.left <
                trafficRect.right &&
            playerRect.right >
                trafficRect.left &&
            playerRect.top <
                trafficRect.bottom &&
            playerRect.bottom >
                trafficRect.top;


        if (collision) {

            crashRace();

            return;

        }

    }

}


/* =========================================================
   CRASH
   ========================================================= */

function crashRace() {

    if (!raceRunning) return;

    raceRunning = false;
    raceFinished = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    const road =
        document.getElementById(
            "raceRoad"
        );


    if (road) {

        road.classList.add(
            "crashed"
        );

    }


    showRaceMessage(
        "💥 CRASH!"
    );


    setTimeout(
        () => {

            showRaceResult(
                false
            );

        },
        1200
    );

}


/* =========================================================
   FINISH
   ========================================================= */

function finishRace() {

    if (!raceRunning) return;

    raceRunning = false;
    raceFinished = true;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    score +=
        Math.floor(
            speed
        );


    showRaceMessage(
        "🏁 FINISH!"
    );


    setTimeout(
        () => {

            showRaceResult(
                true
            );

        },
        1000
    );

}


/* =========================================================
   RESULT
   ========================================================= */

function showRaceResult(
    won
) {

    const reward =
        won
            ? Math.floor(
                500 +
                speed * 4 +
                score
            )
            : 0;


    const result =
        document.createElement(
            "div"
        );


    result.className =
        "race-result";


    result.innerHTML = `

        <div class="race-result-box">

            <div class="result-icon">
                ${won ? "🏆" : "💥"}
            </div>

            <h1>
                ${
                    won
                    ? "RACE COMPLETE"
                    : "RACE OVER"
                }
            </h1>

            <p>
                ${
                    won
                    ? "შენ ფინიშამდე მიხვედი!"
                    : "მანქანას დაეჯახე!"
                }
            </p>

            <div class="result-stats">

                <div>
                    <span>DISTANCE</span>
                    <strong>
                        ${Math.floor(distance)} m
                    </strong>
                </div>

                <div>
                    <span>SPEED</span>
                    <strong>
                        ${Math.floor(speed)} km/h
                    </strong>
                </div>

                <div>
                    <span>SCORE</span>
                    <strong>
                        ${score}
                    </strong>
                </div>

                ${
                    won
                    ? `
                    <div>
                        <span>REWARD</span>
                        <strong>
                            💰 $${reward}
                        </strong>
                    </div>
                    `
                    : ""
                }

            </div>

            <button
                class="primary-btn"
                onclick="
                    closeRaceResult();
                    startTrafficRace();
                "
            >
                🔄 AGAIN
            </button>

            <button
                class="secondary-btn"
                onclick="
                    closeRaceResult();
                "
            >
                EXIT

            </button>

        </div>

    `;


    document.body.appendChild(
        result
    );


    /*
       Add money if player system exists
    */

    if (
        won &&
        typeof player !== "undefined"
    ) {

        player.money += reward;

        if (
            typeof updatePlayerUI ===
            "function"
        ) {

            updatePlayerUI();

        }

    }

}


function closeRaceResult() {

    const result =
        document.querySelector(
            ".race-result"
        );


    if (result) {

        result.remove();

    }

}


/* =========================================================
   RACE MESSAGE
   ========================================================= */

function showRaceMessage(
    text
) {

    const message =
        document.getElementById(
            "raceMessage"
        );


    if (!message) return;


    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    setTimeout(
        () => {

            message.classList.remove(
                "show"
            );

        },
        900
    );

}


/* =========================================================
   HUD
   ========================================================= */

function updateRaceHUD() {

    const speedElement =
        document.getElementById(
            "raceSpeed"
        );


    const distanceElement =
        document.getElementById(
            "raceDistance"
        );


    const scoreElement =
        document.getElementById(
            "raceScore"
        );


    const nitroElement =
        document.getElementById(
            "raceNitro"
        );


    if (speedElement) {

        speedElement.textContent =
            Math.floor(speed);

    }


    if (distanceElement) {

        distanceElement.textContent =
            Math.floor(distance)
            + " / "
            + targetDistance
            + " m";

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    if (nitroElement) {

        nitroElement.style.width =
            nitro + "%";

    }

}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           IMPORTANT:
           Stop browser default actions.
        */

        if (
            raceRunning &&
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Space",
                "KeyW",
                "KeyA",
                "KeyS",
                "KeyD"
            ].includes(
                event.code
            )
        ) {

            event.preventDefault();

        }


        switch (
            event.code
        ) {

            case "ArrowLeft":
            case "KeyA":

                keys.left = true;

                break;


            case "ArrowRight":
            case "KeyD":

                keys.right = true;

                break;


            case "ArrowUp":
            case "KeyW":

                keys.accelerate = true;

                break;


            case "ArrowDown":
            case "KeyS":

                keys.brake = true;

                break;


            case "Space":

                keys.nitro = true;

                break;

        }

    },
    {
        passive: false
    }
);


document.addEventListener(
    "keyup",
    event => {

        switch (
            event.code
        ) {

            case "ArrowLeft":
            case "KeyA":

                keys.left = false;

                break;


            case "ArrowRight":
            case "KeyD":

                keys.right = false;

                break;


            case "ArrowUp":
            case "KeyW":

                keys.accelerate = false;

                break;


            case "ArrowDown":
            case "KeyS":

                keys.brake = false;

                break;


            case "Space":

                keys.nitro = false;

                break;

        }

    }
);


/* =========================================================
   MOBILE CONTROLS
   ========================================================= */

function setupTouchButton(
    id,
    key
) {

    const button =
        document.getElementById(
            id
        );


    if (!button) return;


    button.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            keys[key] = true;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        event => {

            event.preventDefault();

            keys[key] = false;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchcancel",
        () => {

            keys[key] = false;

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTouchButton(
            "leftButton",
            "left"
        );

        setupTouchButton(
            "rightButton",
            "right"
        );

        setupTouchButton(
            "accelerateButton",
            "accelerate"
        );

        setupTouchButton(
            "brakeButton",
            "brake"
        );

        setupTouchButton(
            "nitroButton",
            "nitro"
        );

    }
);


/* =========================================================
   PREVENT SCROLL WHILE PLAYING
   ========================================================= */

window.addEventListener(
    "wheel",
    event => {

        if (raceRunning) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


window.addEventListener(
    "touchmove",
    event => {

        if (raceRunning) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   EXPORT
   ========================================================= */

window.startTrafficRace =
    startTrafficRace;
