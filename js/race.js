/* =========================================================
   STREET LEGENDS
   RACE SYSTEM
========================================================= */

let raceState = {

    active: false,

    countdown: 3,

    speed: 0,

    distance: 0,

    nitro: 100,

    time: 0,

    obstacles: [],

    keys: {},

    animationFrame: null,

    timerInterval: null

};


/* =========================================================
   START RACE
========================================================= */

function startRace() {

    if (raceState.active) {

        return;

    }


    const car =
        getCar(
            player.selectedCar
        );


    if (!car) {

        showNotification(
            "აირჩიე მანქანა Garage-დან."
        );

        return;

    }


    raceState.active = true;

    raceState.speed = 0;

    raceState.distance = 0;

    raceState.nitro = 100;

    raceState.time = 0;

    raceState.obstacles = [];

    raceState.countdown = 3;


    showScreen(
        "raceScreen"
    );


    prepareRace();

}


/* =========================================================
   PREPARE RACE
========================================================= */

function prepareRace() {

    updateRaceUI();


    const countdownElement =
        document.getElementById(
            "raceCountdown"
        );


    if (countdownElement) {

        countdownElement.style.display =
            "flex";

    }


    let count = 3;


    const countdown =
        setInterval(
            () => {

                if (
                    countdownElement
                ) {

                    if (count > 0) {

                        countdownElement.textContent =
                            count;

                    } else {

                        countdownElement.textContent =
                            "GO!";

                    }

                }


                if (
                    count <= 0
                ) {

                    clearInterval(
                        countdown
                    );


                    setTimeout(
                        () => {

                            if (
                                countdownElement
                            ) {

                                countdownElement.style.display =
                                    "none";

                            }


                            beginRaceLoop();

                        },
                        600
                    );

                }


                count--;

            },
            1000
        );

}


/* =========================================================
   BEGIN RACE LOOP
========================================================= */

function beginRaceLoop() {

    raceState.active = true;


    raceState.timerInterval =
        setInterval(
            () => {

                if (
                    !raceState.active
                ) {

                    return;

                }


                raceState.time +=
                    0.1;


                updateRaceUI();

            },
            100
        );


    raceState.animationFrame =
        requestAnimationFrame(
            raceLoop
        );

}


/* =========================================================
   RACE LOOP
========================================================= */

function raceLoop() {

    if (
        !raceState.active
    ) {

        return;

    }


    updatePhysics();

    updateRoad();

    updateObstacles();

    checkCollisions();

    updateRaceUI();


    raceState.animationFrame =
        requestAnimationFrame(
            raceLoop
        );

}


/* =========================================================
   PHYSICS
========================================================= */

function updatePhysics() {

    const car =
        getCar(
            player.selectedCar
        );


    if (!car) {

        return;

    }


    const maxSpeed =
        car.stats.speed;


    /*
       Acceleration
    */

    if (
        raceState.keys["ArrowUp"] ||
        raceState.keys["w"] ||
        raceState.keys["W"]
    ) {

        raceState.speed +=
            car.stats.acceleration *
            0.025;

    } else {

        raceState.speed -=
            0.015;

    }


    /*
       Braking
    */

    if (
        raceState.keys["ArrowDown"] ||
        raceState.keys["s"] ||
        raceState.keys["S"]
    ) {

        raceState.speed -=
            car.stats.braking *
            0.035;

    }


    /*
       Nitro
    */

    if (
        (
            raceState.keys["Shift"] ||
            raceState.keys[" "]
        ) &&
        raceState.nitro > 0 &&
        raceState.speed > 30
    ) {

        raceState.speed +=
            car.stats.nitro *
            0.055;


        raceState.nitro -=
            0.35;

    } else {

        if (
            raceState.nitro < 100
        ) {

            raceState.nitro +=
                0.08;

        }

    }


    /*
       Limit speed
    */

    const maxWithNitro =
        maxSpeed *
        1.25;


    if (
        raceState.speed >
        maxWithNitro
    ) {

        raceState.speed =
            maxWithNitro;

    }


    if (
        raceState.speed < 0
    ) {

        raceState.speed = 0;

    }


    /*
       Distance
    */

    raceState.distance +=
        raceState.speed *
        0.00075;


    /*
       Finish
    */

    if (
        raceState.distance >= 5
    ) {

        finishRace(true);

    }

}


/* =========================================================
   ROAD
========================================================= */

function updateRoad() {

    const road =
        document.getElementById(
            "raceRoad"
        );


    if (!road) {

        return;

    }


    const movement =
        (
            raceState.speed *
            0.8
        );


    road.style.setProperty(
        "--road-speed",
        movement + "px"
    );

}


/* =========================================================
   OBSTACLES
========================================================= */

function updateObstacles() {

    /*
       Spawn random traffic
    */

    if (
        Math.random() <
        0.015
    ) {

        spawnObstacle();

    }


    raceState.obstacles.forEach(
        obstacle => {

            obstacle.y +=
                raceState.speed *
                0.045;


            if (
                obstacle.element
            ) {

                obstacle.element.style.top =
                    obstacle.y + "%";

            }

        }
    );


    raceState.obstacles =
        raceState.obstacles.filter(
            obstacle => {

                if (
                    obstacle.y > 110
                ) {

                    if (
                        obstacle.element
                    ) {

                        obstacle.element.remove();

                    }

                    return false;

                }

                return true;

            }
        );

}


/* =========================================================
   SPAWN OBSTACLE
========================================================= */

function spawnObstacle() {

    const road =
        document.getElementById(
            "raceRoad"
        );


    if (!road) {

        return;

    }


    const obstacle =
        document.createElement(
            "div"
        );


    obstacle.className =
        "race-obstacle";


    obstacle.textContent =
        Math.random() >
        0.5
        ? "🚗"
        : "🚙";


    const lane =
        Math.floor(
            Math.random() * 3
        );


    obstacle.dataset.lane =
        lane;


    const x =
        20 +
        lane *
        30;


    obstacle.style.position =
        "absolute";


    obstacle.style.left =
        x + "%";


    obstacle.style.top =
        "-15%";


    obstacle.style.fontSize =
        "38px";


    obstacle.style.transform =
        "translateX(-50%)";


    road.appendChild(
        obstacle
    );


    raceState.obstacles.push({

        element:
            obstacle,

        lane:
            lane,

        x:
            x,

        y:
            -15

    });

}


/* =========================================================
   COLLISIONS
========================================================= */

function checkCollisions() {

    const playerCar =
        document.getElementById(
            "playerCar"
        );


    if (!playerCar) {

        return;

    }


    const playerRect =
        playerCar.getBoundingClientRect();


    raceState.obstacles.forEach(
        obstacle => {

            if (
                !obstacle.element
            ) {

                return;

            }


            const obstacleRect =
                obstacle.element
                    .getBoundingClientRect();


            const collision =

                playerRect.left <
                obstacleRect.right &&

                playerRect.right >
                obstacleRect.left &&

                playerRect.top <
                obstacleRect.bottom &&

                playerRect.bottom >
                obstacleRect.top;


            if (collision) {

                raceState.speed *=
                    0.45;


                raceState.nitro -=
                    10;


                obstacle.element
                    .style.transform =
                    "translateX(-50%) rotate(15deg)";


                showNotification(
                    "💥 შეჯახება!"
                );

            }

        }
    );

}


/* =========================================================
   RACE UI
========================================================= */

function updateRaceUI() {

    const speedElement =
        document.getElementById(
            "raceSpeed"
        );


    const distanceElement =
        document.getElementById(
            "raceDistance"
        );


    const nitroElement =
        document.getElementById(
            "raceNitro"
        );


    const timerElement =
        document.getElementById(
            "raceTimer"
        );


    if (speedElement) {

        speedElement.textContent =
            Math.round(
                raceState.speed
            ) +
            " KM/H";

    }


    if (distanceElement) {

        distanceElement.textContent =
            raceState.distance
                .toFixed(2) +
            " KM";

    }


    if (nitroElement) {

        nitroElement.style.width =
            raceState.nitro +
            "%";

    }


    if (timerElement) {

        timerElement.textContent =
            formatRaceTime(
                raceState.time
            );

    }

}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatRaceTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    const ms =
        Math.floor(
            (
                seconds %
                1
            ) * 100
        );


    return (

        String(
            minutes
        ).padStart(
            2,
            "0"
        )

        +

        ":" +

        String(
            secs
        ).padStart(
            2,
            "0"
        )

        +

        ":" +

        String(
            ms
        ).padStart(
            2,
            "0"
        )

    );

}


/* =========================================================
   FINISH RACE
========================================================= */

function finishRace(
    won
) {

    if (
        !raceState.active
    ) {

        return;

    }


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


    const rewardMoney =
        won
        ? 2500
        : 500;


    const rewardXP =
        won
        ? 750
        : 200;


    completeRace(
        won,
        rewardMoney,
        rewardXP
    );


    showRaceResult(
        won,
        rewardMoney,
        rewardXP
    );

}


/* =========================================================
   RACE RESULT
========================================================= */

function showRaceResult(
    won,
    money,
    xp
) {

    let modal =
        document.getElementById(
            "raceResultModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );


        modal.id =
            "raceResultModal";


        modal.style.position =
            "fixed";

        modal.style.inset =
            "0";

        modal.style.background =
            "rgba(0,0,0,.8)";

        modal.style.zIndex =
            "99999";

        modal.style.display =
            "flex";

        modal.style.alignItems =
            "center";

        modal.style.justifyContent =
            "center";


        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            style="
                width:min(
                    420px,
                    90%
                );
                background:#11151d;
                border:1px solid #303744;
                border-radius:20px;
                padding:30px;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:55px;
                    margin-bottom:15px;
                "
            >

                ${
                    won
                    ? "🏆"
                    : "🏁"
                }

            </div>


            <h2>

                ${
                    won
                    ? "RACE WON!"
                    : "RACE FINISHED"
                }

            </h2>


            <p
                style="
                    color:#8d96a5;
                    margin-top:10px;
                "
            >

                დრო:
                ${formatRaceTime(
                    raceState.time
                )}

            </p>


            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:25px;
                    margin:25px 0;
                "
            >

                <div>

                    <strong
                        style="
                            color:#ffd700;
                            font-size:22px;
                        "
                    >
                        +$${money.toLocaleString()}
                    </strong>

                    <small
                        style="
                            display:block;
                            color:#8d96a5;
                        "
                    >
                        MONEY
                    </small>

                </div>


                <div>

                    <strong
                        style="
                            color:#60a5fa;
                            font-size:22px;
                        "
                    >
                        +${xp} XP
                    </strong>

                    <small
                        style="
                            display:block;
                            color:#8d96a5;
                        "
                    >
                        EXPERIENCE
                    </small>

                </div>

            </div>


            <button
                onclick="
                    closeRaceResult()
                "
                style="
                    width:100%;
                    padding:13px;
                    border:none;
                    border-radius:9px;
                    background:#ff3b30;
                    color:white;
                    font-weight:bold;
                    cursor:pointer;
                "
            >

                CONTINUE

            </button>

        </div>

    `;


    modal.style.display =
        "flex";

}


/* =========================================================
   CLOSE RESULT
========================================================= */

function closeRaceResult() {

    const modal =
        document.getElementById(
            "raceResultModal"
        );


    if (modal) {

        modal.remove();

    }


    showScreen(
        "homeScreen"
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        raceState.keys[
            event.key
        ] = true;


        if (
            event.key ===
            " "
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        raceState.keys[
            event.key
        ] = false;

    }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

function setupMobileControls() {

    const buttons =
        document.querySelectorAll(
            "[data-control]"
        );


    buttons.forEach(
        button => {

            const control =
                button.dataset.control;


            button.addEventListener(
                "touchstart",
                event => {

                    event.preventDefault();

                    raceState.keys[
                        control
                    ] = true;

                },
                {
                    passive:false
                }
            );


            button.addEventListener(
                "touchend",
                event => {

                    event.preventDefault();

                    raceState.keys[
                        control
                    ] = false;

                },
                {
                    passive:false
                }
            );


            button.addEventListener(
                "mousedown",
                () => {

                    raceState.keys[
                        control
                    ] = true;

                }
            );


            button.addEventListener(
                "mouseup",
                () => {

                    raceState.keys[
                        control
                    ] = false;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    raceState.keys[
                        control
                    ] = false;

                }
            );

        }
    );

}


/* =========================================================
   INITIALIZE RACE SYSTEM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMobileControls();

    }
);
