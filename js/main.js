```javascript
/* =========================================================
   STREET LEGENDS
   MAIN GAME CONTROLLER
   ========================================================= */


/* =========================================================
   PLAYER DATA
========================================================= */

let player = {

    name: "Player",

    money: 5000,

    level: 1,

    xp: 0,

    wins: 0,

    races: 0,

    bestSpeed: 0,

    ownedCars: [
        "starter"
    ],

    selectedCar: "starter"

};


/* =========================================================
   CAR DATABASE
========================================================= */

const cars = [

    {
        id: "starter",
        brand: "Street",
        name: "Runner",
        type: "Starter",
        class: "C",
        emoji: "🚗",
        price: 0,
        levelRequired: 1,

        stats: {
            speed: 180,
            acceleration: 55,
            handling: 60,
            braking: 55
        }
    },


    {
        id: "eclipse",
        brand: "Night",
        name: "Eclipse",
        type: "Sport",
        class: "B",
        emoji: "🏎️",
        price: 12000,
        levelRequired: 3,

        stats: {
            speed: 240,
            acceleration: 70,
            handling: 68,
            braking: 65
        }
    },


    {
        id: "phantom",
        brand: "Phantom",
        name: "GT",
        type: "Super",
        class: "A",
        emoji: "🏎️",
        price: 35000,
        levelRequired: 8,

        stats: {
            speed: 310,
            acceleration: 82,
            handling: 78,
            braking: 75
        }
    },


    {
        id: "thunder",
        brand: "Thunder",
        name: "X",
        type: "Hyper",
        class: "S",
        emoji: "🚘",
        price: 85000,
        levelRequired: 15,

        stats: {
            speed: 390,
            acceleration: 94,
            handling: 88,
            braking: 90
        }
    }

];


/* =========================================================
   CAR CLASSES
========================================================= */

const CAR_CLASSES = {

    C: {
        color: "#8d96a5"
    },

    B: {
        color: "#3b82f6"
    },

    A: {
        color: "#a855f7"
    },

    S: {
        color: "#ffd700"
    }

};


/* =========================================================
   MISSIONS
========================================================= */

const missions = [

    {
        id: "first_race",

        title: "FIRST RACE",

        description:
            "დაასრულე შენი პირველი რბოლა.",

        rewardMoney: 1000,

        rewardXP: 300,

        completed: false
    },


    {
        id: "three_races",

        title: "RACE DRIVER",

        description:
            "დაასრულე 3 რბოლა.",

        rewardMoney: 2500,

        rewardXP: 700,

        completed: false
    },


    {
        id: "first_win",

        title: "FIRST VICTORY",

        description:
            "მოიგე შენი პირველი რბოლა.",

        rewardMoney: 3000,

        rewardXP: 1000,

        completed: false
    },


    {
        id: "level_five",

        title: "GETTING SERIOUS",

        description:
            "მიაღწიე Level 5-ს.",

        rewardMoney: 5000,

        rewardXP: 1500,

        completed: false
    }

];


/* =========================================================
   LEADERBOARD
========================================================= */

const leaderboardData = [

    {
        name: "ShadowRacer",
        level: 42,
        xp: 42100
    },

    {
        name: "SpeedKing",
        level: 38,
        xp: 38600
    },

    {
        name: "DriftMaster",
        level: 34,
        xp: 34100
    },

    {
        name: "NightWolf",
        level: 29,
        xp: 29400
    },

    {
        name: "TurboBoy",
        level: 25,
        xp: 25300
    }

];


/* =========================================================
   GAME STATE
========================================================= */

let currentRaceMode = null;

let raceRunning = false;

let raceFinished = false;

let raceLoop = null;

let raceStartTime = 0;

let raceElapsed = 0;

let raceDistance = 0;

let playerSpeed = 0;

let playerNitro = 100;

let playerX = 50;

let playerPosition = 4;

let totalPlayers = 4;

let opponents = [];


/* =========================================================
   UTILITY
========================================================= */

function getSelectedCar() {

    return cars.find(
        car =>
            car.id === player.selectedCar
    ) || cars[0];

}


function ownsCar(id) {

    return player.ownedCars.includes(id);

}


function savePlayer() {

    localStorage.setItem(
        "streetLegendsPlayer",
        JSON.stringify(player)
    );

}


function loadPlayer() {

    const saved =
        localStorage.getItem(
            "streetLegendsPlayer"
        );

    if (!saved) {

        return;

    }

    try {

        player =
            JSON.parse(saved);

    } catch (error) {

        console.error(
            "Player data error:",
            error
        );

    }

}


/* =========================================================
   LEVEL SYSTEM
========================================================= */

function xpNeededForLevel(level) {

    return level * 1000;

}


function checkLevelUp() {

    let needed =
        xpNeededForLevel(
            player.level
        );


    while (
        player.xp >= needed
    ) {

        player.xp -= needed;

        player.level++;

        needed =
            xpNeededForLevel(
                player.level
            );


        showNotification(
            `🎉 LEVEL ${player.level}!`
        );

    }

}


/* =========================================================
   PLAYER UI
========================================================= */

function updatePlayerUI() {

    const username =
        document.getElementById(
            "gameUsername"
        );

    const money =
        document.getElementById(
            "gameMoney"
        );

    const level =
        document.getElementById(
            "gameLevel"
        );


    if (username) {

        username.textContent =
            player.name;

    }


    if (money) {

        money.textContent =
            player.money.toLocaleString();

    }


    if (level) {

        level.textContent =
            player.level;

    }


    const homeWins =
        document.getElementById(
            "homeWins"
        );

    const homeCars =
        document.getElementById(
            "homeCars"
        );

    const homeSpeed =
        document.getElementById(
            "homeSpeed"
        );


    if (homeWins) {

        homeWins.textContent =
            player.wins;

    }


    if (homeCars) {

        homeCars.textContent =
            player.ownedCars.length;

    }


    if (homeSpeed) {

        homeSpeed.textContent =
            Math.round(
                player.bestSpeed
            );

    }


    const profileName =
        document.getElementById(
            "profileUsername"
        );

    const profileLevel =
        document.getElementById(
            "profileLevel"
        );

    const profileWins =
        document.getElementById(
            "profileWins"
        );

    const profileCars =
        document.getElementById(
            "profileCars"
        );


    if (profileName) {

        profileName.textContent =
            player.name;

    }


    if (profileLevel) {

        profileLevel.textContent =
            player.level;

    }


    if (profileWins) {

        profileWins.textContent =
            player.wins;

    }


    if (profileCars) {

        profileCars.textContent =
            player.ownedCars.length;

    }


    savePlayer();

}


/* =========================================================
   SCREEN SYSTEM
========================================================= */

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(
            ".screen"
        );


    screens.forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            screenId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    updateNavigation(
        screenId
    );


    if (
        screenId ===
        "garageScreen"
    ) {

        renderGarage();

    }


    if (
        screenId ===
        "carsScreen"
    ) {

        renderCars();

    }


    if (
        screenId ===
        "missionsScreen"
    ) {

        renderMissions();

    }


    if (
        screenId ===
        "shopScreen"
    ) {

        renderShop();

    }


    if (
        screenId ===
        "leaderboardScreen"
    ) {

        renderLeaderboard();

    }


    if (
        screenId ===
        "profileScreen"
    ) {

        updatePlayerUI();

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation(screenId) {

    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    buttons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    buttons.forEach(
        button => {

            if (
                button.dataset.screen ===
                screenId
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   GARAGE
========================================================= */

function renderGarage() {

    const grid =
        document.getElementById(
            "garageGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    player.ownedCars.forEach(
        carId => {

            const car =
                cars.find(
                    item =>
                        item.id === carId
                );


            if (!car) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "car-card";


            const selected =
                player.selectedCar ===
                car.id;


            card.innerHTML = `

                <div class="car-image">

                    <span>
                        ${car.emoji}
                    </span>

                </div>

                <div class="car-info">

                    <h3>
                        ${car.brand}
                        ${car.name}
                    </h3>

                    <p>
                        ${car.type}
                    </p>

                    <p>
                        SPEED:
                        ${car.stats.speed}
                    </p>

                    <p>
                        ACCELERATION:
                        ${car.stats.acceleration}
                    </p>

                    <button
                        onclick="
                            selectGarageCar(
                                '${car.id}'
                            )
                        "
                    >

                        ${
                            selected
                            ? "✓ SELECTED"
                            : "SELECT"
                        }

                    </button>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SELECT CAR
========================================================= */

function selectGarageCar(carId) {

    if (
        !ownsCar(carId)
    ) {

        return;

    }


    player.selectedCar =
        carId;


    savePlayer();

    updatePlayerUI();

    renderGarage();

    renderCars();


    showNotification(
        "🚗 მანქანა არჩეულია!"
    );

}


/* =========================================================
   CARS SHOP
========================================================= */

function createStatHTML(
    name,
    value,
    max
) {

    const percentage =
        Math.min(
            100,
            (value / max) * 100
        );


    return `

        <div
            style="
                margin-top:10px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    font-size:12px;
                "
            >

                <span>
                    ${name}
                </span>

                <strong>
                    ${value}
                </strong>

            </div>

            <div
                style="
                    width:100%;
                    height:6px;
                    background:#202631;
                    border-radius:5px;
                    overflow:hidden;
                "
            >

                <div
                    style="
                        width:${percentage}%;
                        height:100%;
                        background:#ff3b30;
                    "
                ></div>

            </div>

        </div>

    `;

}


function renderCars() {

    const grid =
        document.getElementById(
            "carsGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    cars.forEach(
        car => {

            const owned =
                ownsCar(car.id);


            const locked =
                player.level <
                car.levelRequired;


            const classInfo =
                CAR_CLASSES[
                    car.class
                ];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "car-card";


            card.innerHTML = `

                <div
                    class="car-image"
                    style="
                        border-bottom:
                        3px solid
                        ${classInfo.color};
                    "
                >

                    <span>
                        ${car.emoji}
                    </span>

                </div>


                <div class="car-info">

                    <h3>
                        ${car.brand}
                        ${car.name}
                    </h3>

                    <div>
                        ${car.type}
                    </div>

                    <strong
                        style="
                            color:${classInfo.color};
                        "
                    >
                        CLASS ${car.class}
                    </strong>


                    ${createStatHTML(
                        "SPEED",
                        car.stats.speed,
                        400
                    )}


                    ${createStatHTML(
                        "ACCELERATION",
                        car.stats.acceleration,
                        100
                    )}


                    ${createStatHTML(
                        "HANDLING",
                        car.stats.handling,
                        100
                    )}


                    <div
                        style="
                            margin-top:15px;
                        "
                    >

                        ${
                            owned

                            ? `
                                <button
                                    onclick="
                                        selectGarageCar(
                                            '${car.id}'
                                        )
                                    "
                                >
                                    SELECT
                                </button>
                            `

                            : locked

                            ? `
                                <button
                                    disabled
                                >
                                    🔒 LEVEL
                                    ${car.levelRequired}
                                </button>
                            `

                            : `
                                <button
                                    onclick="
                                        buyCar(
                                            '${car.id}'
                                        )
                                    "
                                >
                                    BUY
                                    $${car.price.toLocaleString()}
                                </button>
                            `
                        }

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   BUY CAR
========================================================= */

function buyCar(carId) {

    const car =
        cars.find(
            item =>
                item.id === carId
        );


    if (!car) {

        return;

    }


    if (
        ownsCar(car.id)
    ) {

        return;

    }


    if (
        player.level <
        car.levelRequired
    ) {

        showNotification(
            `🔒 საჭიროა Level ${car.levelRequired}`
        );

        return;

    }


    if (
        player.money <
        car.price
    ) {

        showNotification(
            "💰 საკმარისი ფული არ გაქვს!"
        );

        return;

    }


    player.money -=
        car.price;


    player.ownedCars.push(
        car.id
    );


    savePlayer();

    updatePlayerUI();

    renderCars();

    renderGarage();


    showNotification(
        `🚗 ${car.brand} ${car.name} იყიდე!`
    );

}


/* =========================================================
   MISSIONS
========================================================= */

function renderMissions() {

    const container =
        document.getElementById(
            "missionsList"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    missions.forEach(
        mission => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "mission-card";


            card.innerHTML = `

                <div>

                    <strong>
                        🎯 ${mission.title}
                    </strong>

                    <small>
                        ${mission.description}
                    </small>

                </div>


                <div>

                    <div
                        style="
                            color:#ffd700;
                            font-weight:bold;
                        "
                    >
                        +$${mission.rewardMoney}
                    </div>

                    <div>
                        +${mission.rewardXP} XP
                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SHOP
========================================================= */

function renderShop() {

    const grid =
        document.getElementById(
            "shopGrid"
        );


    if (!grid) {

        return;

    }


    const items = [

        {
            name: "Engine Boost",
            description:
                "ზრდის მანქანის სიჩქარეს.",
            price: 1000,
            icon: "🚀"
        },

        {
            name: "Nitro Pack",
            description:
                "ამატებს Nitro-ს.",
            price: 750,
            icon: "⚡"
        },

        {
            name: "Racing Tires",
            description:
                "აუმჯობესებს მართვას.",
            price: 1500,
            icon: "🛞"
        },

        {
            name: "Brake Kit",
            description:
                "აუმჯობესებს დამუხრუჭებას.",
            price: 1200,
            icon: "🛑"
        }

    ];


    grid.innerHTML = "";


    items.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "shop-card";


            card.innerHTML = `

                <div
                    style="
                        font-size:45px;
                    "
                >
                    ${item.icon}
                </div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.description}
                </p>

                <button
                    onclick="
                        buyShopItem(
                            '${item.name}',
                            ${item.price}
                        )
                    "
                >
                    $${item.price.toLocaleString()}
                </button>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


function buyShopItem(
    name,
    price
) {

    if (
        player.money <
        price
    ) {

        showNotification(
            "💰 საკმარისი ფული არ გაქვს!"
        );

        return;

    }


    player.money -=
        price;


    savePlayer();

    updatePlayerUI();


    showNotification(
        `🛒 ${name} იყიდე!`
    );

}


/* =========================================================
   LEADERBOARD
========================================================= */

function renderLeaderboard() {

    const container =
        document.getElementById(
            "leaderboardList"
        );


    if (!container) {

        return;

    }


    const players = [

        ...leaderboardData,

        {
            name: player.name,
            level: player.level,
            xp: player.xp
        }

    ];


    players.sort(
        (
            a,
            b
        ) =>
            b.xp - a.xp
    );


    container.innerHTML = "";


    players.forEach(
        (
            item,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "leaderboard-row";


            row.innerHTML = `

                <span>
                    ${
                        index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1
                    }
                </span>

                <strong>
                    ${item.name}
                </strong>

                <span>
                    LVL ${item.level}
                </span>

                <strong>
                    ${item.xp.toLocaleString()} XP
                </strong>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {

    let notification =
        document.getElementById(
            "gameNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "gameNotification";


        notification.style.position =
            "fixed";

        notification.style.top =
            "90px";

        notification.style.left =
            "50%";

        notification.style.transform =
            "translateX(-50%)";

        notification.style.zIndex =
            "99999";

        notification.style.padding =
            "14px 24px";

        notification.style.borderRadius =
            "10px";

        notification.style.background =
            "#151922";

        notification.style.color =
            "white";

        notification.style.border =
            "1px solid #ff3b30";

        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    clearTimeout(
        notification.timer
    );


    notification.timer =
        setTimeout(
            () => {

                notification.style.display =
                    "none";

            },
            2500
        );

}


/* =========================================================
   RACE MODE SELECTION
========================================================= */

function setupRaceModes() {

    const buttons =
        document.querySelectorAll(
            ".race-mode-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const mode =
                        button.dataset.raceMode;


                    startRace(
                        mode
                    );

                }
            );

        }
    );

}


/* =========================================================
   START RACE
========================================================= */

function startRace(mode) {

    if (raceRunning) {

        return;

    }


    currentRaceMode =
        mode;


    raceFinished =
        false;


    raceDistance =
        0;


    playerSpeed =
        0;


    playerNitro =
        100;


    playerX =
        50;


    playerPosition =
        totalPlayers;


    const activeRace =
        document.getElementById(
            "activeRace"
        );


    if (!activeRace) {

        return;

    }


    activeRace.classList.remove(
        "hidden"
    );


    const modeTitle =
        document.getElementById(
            "raceModeTitle"
        );


    const titles = {

        quick:
            "QUICK RACE",

        time:
            "TIME TRIAL",

        career:
            "CAREER",

        drift:
            "DRIFT"

    };


    if (modeTitle) {

        modeTitle.textContent =
            titles[mode] ||
            "RACE";

    }


    const result =
        document.getElementById(
            "raceResult"
        );


    if (result) {

        result.classList.add(
            "hidden"
        );

    }


    createOpponents();

    resetRaceVisuals();

    showScreen(
        "raceScreen"
    );


    countdownStart();

}


/* =========================================================
   CREATE OPPONENTS
========================================================= */

function createOpponents() {

    const container =
        document.getElementById(
            "raceOpponents"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    opponents = [];


    const opponentNames = [

        "Shadow",

        "SpeedKing",

        "NightWolf"

    ];


    const opponentCars = [

        "🏎️",

        "🚘",

        "🏁"

    ];


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const opponent = {

            name:
                opponentNames[i],

            progress: 0,

            speed:
                0.18 +
                Math.random() * 0.06,

            element:
                document.createElement(
                    "div"
                )

        };


        opponent.element.className =
            "race-opponent";


        opponent.element.textContent =
            opponentCars[i];


        opponent.element.style.position =
            "absolute";


        opponent.element.style.left =
            `${25 + i * 25}%`;


        opponent.element.style.bottom =
            `${120 + i * 20}px`;


        container.appendChild(
            opponent.element
        );


        opponents.push(
            opponent
        );

    }

}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdownStart() {

    const countdown =
        document.getElementById(
            "raceCountdown"
        );


    if (!countdown) {

        beginRace();

        return;

    }


    let count =
        3;


    countdown.textContent =
        count;


    const timer =
        setInterval(
            () => {

                count--;


                if (
                    count > 0
                ) {

                    countdown.textContent =
                        count;

                } else {

                    countdown.textContent =
                        "GO!";


                    clearInterval(
                        timer
                    );


                    setTimeout(
                        () => {

                            countdown.textContent =
                                "";

                            beginRace();

                        },
                        500
                    );

                }

            },
            1000
        );

}


/* =========================================================
   BEGIN RACE
========================================================= */

function beginRace() {

    if (raceRunning) {

        return;

    }


    raceRunning =
        true;


    raceStartTime =
        performance.now();


    raceLoop =
        requestAnimationFrame(
            updateRace
        );

}


/* =========================================================
   RACE ENGINE
========================================================= */

function updateRace(timestamp) {

    if (
        !raceRunning
    ) {

        return;

    }


    raceElapsed =
        (timestamp -
            raceStartTime) /
        1000;


    const car =
        getSelectedCar();


    const maxSpeed =
        car.stats.speed;


    const acceleration =
        car.stats.acceleration;


    /*
       ავტომობილი თანდათან აჩქარდება.
    */

    playerSpeed +=
        acceleration *
        0.002;


    /*
       მაქსიმალური სიჩქარე.
    */

    if (
        playerSpeed >
        maxSpeed
    ) {

        playerSpeed =
            maxSpeed;

    }


    /*
       სიჩქარის მცირე დანაკარგი.
    */

    playerSpeed *=
        0.998;


    /*
       Distance progress.
    */

    let progressGain =
        playerSpeed /
        maxSpeed *
        0.22;


    /*
       Nitro.
    */

    if (
        nitroPressed &&
        playerNitro > 0
    ) {

        playerSpeed +=
            3.5;

        playerNitro -=
            0.6;

        progressGain *=
            1.35;

    } else {

        playerNitro +=
            0.08;

    }


    playerNitro =
        Math.max(
            0,
            Math.min(
                100,
                playerNitro
            )
        );


    /*
       Braking.
    */

    if (brakePressed) {

        playerSpeed *=
            0.94;

    }


    raceDistance +=
        progressGain;


    if (
        raceDistance >
        100
    ) {

        raceDistance =
            100;

    }


    /*
       Opponent movement.
    */

    opponents.forEach(
        opponent => {

            opponent.progress +=
                opponent.speed;


            if (
                opponent.progress >
                100
            ) {

                opponent.progress =
                    100;

            }

        }
    );


    /*
       Calculate player position.
    */

    const progressList = [

        {
            progress:
                raceDistance,

            player:
                true
        }

    ];


    opponents.forEach(
        opponent => {

            progressList.push({

                progress:
                    opponent.progress,

                player:
                    false

            });

        }
    );


    progressList.sort(
        (
            a,
            b
        ) =>
            b.progress -
            a.progress
    );


    playerPosition =
        progressList.findIndex(
            item =>
                item.player
        ) + 1;


    /*
       Finish.
    */

    if (
        raceDistance >=
        100
    ) {

        finishRace();

        return;

    }


    updateRaceUI();


    raceLoop =
        requestAnimationFrame(
            updateRace
        );

}


/* =========================================================
   RACE INPUT
========================================================= */

let nitroPressed =
    false;

let brakePressed =
    false;


/* =========================================================
   UPDATE RACE UI
========================================================= */

function updateRaceUI() {

    const speed =
        document.getElementById(
            "raceSpeed"
        );


    const distance =
        document.getElementById(
            "raceDistance"
        );


    const nitro =
        document.getElementById(
            "raceNitro"
        );


    const position =
        document.getElementById(
            "racePlayerPosition"
        );


    if (speed) {

        speed.textContent =
            Math.round(
                playerSpeed
            );

    }


    if (distance) {

        distance.textContent =
            Math.round(
                raceDistance
            );

    }


    if (nitro) {

        nitro.textContent =
            Math.round(
                playerNitro
            );

    }


    if (position) {

        position.textContent =
            playerPosition;

    }


    if (
        playerSpeed >
        player.bestSpeed
    ) {

        player.bestSpeed =
            playerSpeed;

    }


    /*
       Visual movement.
    */

    const car =
        document.getElementById(
            "playerCar"
        );


    if (car) {

        car.style.left =
            `${playerX}%`;

    }


    const opponentsContainer =
        document.getElementById(
            "raceOpponents"
        );


    if (opponentsContainer) {

        opponents.forEach(
            opponent => {

                const element =
                    opponent.element;


                const roadHeight =
                    opponentsContainer
                        .parentElement
                        .clientHeight;


                const bottom =
                    opponent.progress *
                    0.7;


                element.style.bottom =
                    `${bottom}px`;

            }
        );

    }

}


/* =========================================================
   RESET VISUALS
========================================================= */

function resetRaceVisuals() {

    const car =
        document.getElementById(
            "playerCar"
        );


    if (car) {

        car.style.left =
            "50%";

    }


    const distance =
        document.getElementById(
            "raceDistance"
        );


    const speed =
        document.getElementById(
            "raceSpeed"
        );


    const nitro =
        document.getElementById(
            "raceNitro"
        );


    if (distance) {

        distance.textContent =
            "0";

    }


    if (speed) {

        speed.textContent =
            "0";

    }


    if (nitro) {

        nitro.textContent =
            "100";

    }

}


/* =========================================================
   FINISH RACE
========================================================= */

function finishRace() {

    if (raceFinished) {

        return;

    }


    raceFinished =
        true;


    raceRunning =
        false;


    cancelAnimationFrame(
        raceLoop
    );


    player.races++;


    const position =
        playerPosition;


    let moneyReward =
        500;


    let xpReward =
        150;


    if (
        position === 1
    ) {

        moneyReward =
            2500;

        xpReward =
            500;

        player.wins++;

    }


    else if (
        position === 2
    ) {

        moneyReward =
            1500;

        xpReward =
            350;

    }


    else if (
        position === 3
    ) {

        moneyReward =
            900;

        xpReward =
            250;

    }


    player.money +=
        moneyReward;


    player.xp +=
        xpReward;


    checkLevelUp();


    updateMissions();


    savePlayer();

    updatePlayerUI();


    showRaceResult(
        position,
        moneyReward,
        xpReward
    );

}


/* =========================================================
   RACE RESULT
========================================================= */

function showRaceResult(
    position,
    money,
    xp
) {

    const result =
        document.getElementById(
            "raceResult"
        );


    const icon =
        document.getElementById(
            "raceResultIcon"
        );


    const title =
        document.getElementById(
            "raceResultTitle"
        );


    const text =
        document.getElementById(
            "raceResultText"
        );


    const moneyElement =
        document.getElementById(
            "raceMoneyReward"
        );


    const xpElement =
        document.getElementById(
            "raceXPReward"
        );


    if (!result) {

        return;

    }


    if (
        position === 1
    ) {

        if (icon) {

            icon.textContent =
                "🏆";

        }

        if (title) {

            title.textContent =
                "VICTORY!";

        }

    }

    else {

        if (icon) {

            icon.textContent =
                "🏁";

        }

        if (title) {

            title.textContent =
                "FINISHED";

        }

    }


    if (text) {

        text.textContent =
            `შენ დაასრულე რბოლა ${position}-ე ადგილზე.`;

    }


    if (moneyElement) {

        moneyElement.textContent =
            `+$${money.toLocaleString()}`;

    }


    if (xpElement) {

        xpElement.textContent =
            `+${xp} XP`;

    }


    result.classList.remove(
        "hidden"
    );

}


/* =========================================================
   RACE CONTROLS
========================================================= */

function setupRaceControls() {

    const left =
        document.getElementById(
            "leftButton"
        );


    const right =
        document.getElementById(
            "rightButton"
        );


    const accelerate =
        document.getElementById(
            "accelerateButton"
        );


    const brake =
        document.getElementById(
            "brakeButton"
        );


    const nitro =
        document.getElementById(
            "nitroButton"
        );


    function press(
        element,
        start,
        end
    ) {

        if (!element) {

            return;

        }


        element.addEventListener(
            "pointerdown",
            start
        );


        element.addEventListener(
            "pointerup",
            end
        );


        element.addEventListener(
            "pointerleave",
            end
        );


        element.addEventListener(
            "pointercancel",
            end
        );

    }


    press(

        accelerate,

        () => {

            if (
                raceRunning
            ) {

                playerSpeed +=
                    8;

            }

        },

        () => {}

    );


    press(

        brake,

        () => {

            brakePressed =
                true;

        },

        () => {

            brakePressed =
                false;

        }

    );


    press(

        nitro,

        () => {

            nitroPressed =
                true;

        },

        () => {

            nitroPressed =
                false;

        }

    );


    if (left) {

        left.addEventListener(
            "click",
            () => {

                if (
                    raceRunning
                ) {

                    playerX -=
                        5;

                    playerX =
                        Math.max(
                            10,
                            playerX
                        );

                }

            }
        );

    }


    if (right) {

        right.addEventListener(
            "click",
            () => {

                if (
                    raceRunning
                ) {

                    playerX +=
                        5;

                    playerX =
                        Math.min(
                            90,
                            playerX
                        );

                }

            }
        );

    }


    /*
       Keyboard controls
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !raceRunning
            ) {

                return;

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                playerX -= 4;

                playerX =
                    Math.max(
                        10,
                        playerX
                    );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                playerX += 4;

                playerX =
                    Math.min(
                        90,
                        playerX
                    );

            }


            if (
                event.key ===
                "ArrowDown"
            ) {

                brakePressed =
                    true;

            }


            if (
                event.code ===
                "Space"
            ) {

                nitroPressed =
                    true;

            }

        }
    );


    document.addEventListener(
        "keyup",
        event => {

            if (
                event.key ===
                "ArrowDown"
            ) {

                brakePressed =
                    false;

            }


            if (
                event.code ===
                "Space"
            ) {

                nitroPressed =
                    false;

            }

        }
    );

}


/* =========================================================
   UPDATE MISSIONS
========================================================= */

function updateMissions() {

    missions.forEach(
        mission => {

            if (
                mission.completed
            ) {

                return;

            }


            let complete =
                false;


            if (
                mission.id ===
                "first_race" &&
                player.races >= 1
            ) {

                complete =
                    true;

            }


            if (
                mission.id ===
                "three_races" &&
                player.races >= 3
            ) {

                complete =
                    true;

            }


            if (
                mission.id ===
                "first_win" &&
                player.wins >= 1
            ) {

                complete =
                    true;

            }


            if (
                mission.id ===
                "level_five" &&
                player.level >= 5
            ) {

                complete =
                    true;

            }


            if (complete) {

                mission.completed =
                    true;


                player.money +=
                    mission.rewardMoney;


                player.xp +=
                    mission.rewardXP;


                showNotification(
                    `🎯 მისია შესრულებულია: ${mission.title}`
                );

            }

        }
    );


    checkLevelUp();

    savePlayer();

}


/* =========================================================
   BACK TO RACE HUB
========================================================= */

function setupRaceBackButton() {

    const button =
        document.getElementById(
            "raceBackButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const result =
                document.getElementById(
                    "raceResult"
                );


            const activeRace =
                document.getElementById(
                    "activeRace"
                );


            if (result) {

                result.classList.add(
                    "hidden"
                );

            }


            if (activeRace) {

                activeRace.classList.add(
                    "hidden"
                );

            }


            currentRaceMode =
                null;


            showScreen(
                "raceScreen"
            );

        }
    );

}


/* =========================================================
   HOME RACE BUTTON
========================================================= */

function setupHomeButton() {

    const button =
        document.getElementById(
            "startRaceButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            showScreen(
                "raceScreen"
            );

        }
    );

}


/* =========================================================
   NAVIGATION EVENTS
========================================================= */

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const screen =
                        button.dataset.screen;


                    if (
                        raceRunning &&
                        screen !==
                        "raceScreen"
                    ) {

                        showNotification(
                            "🏁 დაასრულე რბოლა ჯერ!"
                        );

                        return;

                    }


                    showScreen(
                        screen
                    );

                }
            );

        }
    );

}


/* =========================================================
   INITIALIZE GAME
========================================================= */

function initializeGame() {

    loadPlayer();

    updatePlayerUI();

    renderGarage();

    renderCars();

    renderMissions();

    renderShop();

    renderLeaderboard();

    setupNavigation();

    setupRaceModes();

    setupRaceControls();

    setupRaceBackButton();

    setupHomeButton();

    showScreen(
        "homeScreen"
    );

}


/* =========================================================
   START GAME
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeGame();

    }
);
```
