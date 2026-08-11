// =====================================================
// STREET LEGENDS
// MAIN GAME CONTROLLER
// =====================================================

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs,
    orderBy,
    query,
    limit
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// =====================================================
// GLOBAL PLAYER
// =====================================================

let player = null;
let currentUser = null;

let selectedCarId = "street-runner";

let raceRunning = false;
let raceFinished = false;

let raceSpeed = 0;
let raceDistance = 0;
let racePosition = 50;

let nitro = 100;

let raceInterval = null;
let raceTimer = null;


// =====================================================
// CAR DATABASE
// =====================================================

const cars = [

    {
        id: "street-runner",
        brand: "Street",
        name: "Runner",
        type: "Starter",
        class: "D",
        emoji: "🚗",
        price: 0,
        levelRequired: 1,

        stats: {
            speed: 180,
            acceleration: 45,
            handling: 55
        }
    },

    {
        id: "night-shadow",
        brand: "Night",
        name: "Shadow",
        type: "Street",
        class: "C",
        emoji: "🏎️",
        price: 8500,
        levelRequired: 3,

        stats: {
            speed: 230,
            acceleration: 60,
            handling: 65
        }
    },

    {
        id: "turbo-x",
        brand: "Turbo",
        name: "X",
        type: "Sport",
        class: "C",
        emoji: "🚘",
        price: 18000,
        levelRequired: 5,

        stats: {
            speed: 270,
            acceleration: 70,
            handling: 72
        }
    },

    {
        id: "phantom-r",
        brand: "Phantom",
        name: "R",
        type: "Super",
        class: "B",
        emoji: "🏎️",
        price: 35000,
        levelRequired: 8,

        stats: {
            speed: 330,
            acceleration: 82,
            handling: 80
        }
    },

    {
        id: "vortex",
        brand: "Vortex",
        name: "GT",
        type: "Hyper",
        class: "A",
        emoji: "🏎️",
        price: 75000,
        levelRequired: 12,

        stats: {
            speed: 410,
            acceleration: 91,
            handling: 88
        }
    },

    {
        id: "legend-x",
        brand: "Legend",
        name: "X",
        type: "Hypercar",
        class: "S",
        emoji: "🚀",
        price: 150000,
        levelRequired: 20,

        stats: {
            speed: 500,
            acceleration: 100,
            handling: 96
        }
    }

];


// =====================================================
// CLASS COLORS
// =====================================================

const CAR_CLASSES = {

    D: {
        color: "#9ca3af"
    },

    C: {
        color: "#22c55e"
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


// =====================================================
// MISSIONS
// =====================================================

const missions = [

    {
        id: "first_race",
        title: "FIRST RACE",
        description: "დაასრულე შენი პირველი რბოლა.",
        rewardMoney: 1000,
        rewardXP: 300
    },

    {
        id: "three_races",
        title: "RACE DRIVER",
        description: "დაასრულე 3 რბოლა.",
        rewardMoney: 2500,
        rewardXP: 700
    },

    {
        id: "first_win",
        title: "FIRST VICTORY",
        description: "მოიგე შენი პირველი რბოლა.",
        rewardMoney: 3000,
        rewardXP: 1000
    },

    {
        id: "level_five",
        title: "GETTING SERIOUS",
        description: "მიაღწიე Level 5-ს.",
        rewardMoney: 5000,
        rewardXP: 1500
    }

];


// =====================================================
// INITIAL AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {
            return;
        }

        currentUser = user;

        await loadPlayer();

        initializeGame();

    }
);


// =====================================================
// LOAD PLAYER
// =====================================================

async function loadPlayer() {

    if (!currentUser) {
        return;
    }

    try {

        const playerRef =
            doc(
                db,
                "players",
                currentUser.uid
            );

        const snapshot =
            await getDoc(
                playerRef
            );

        if (!snapshot.exists()) {

            console.error(
                "Player document does not exist."
            );

            return;
        }

        player = {
            id: currentUser.uid,
            ...snapshot.data()
        };

        selectedCarId =
            player.selectedCar ||
            player.cars?.[0] ||
            "street-runner";

    } catch (error) {

        console.error(
            "Player loading error:",
            error
        );

    }

}


// =====================================================
// INITIALIZE GAME
// =====================================================

function initializeGame() {

    if (!player) {
        return;
    }

    updatePlayerUI();

    renderCars();

    renderGarage();

    renderMissions();

    renderShop();

    renderLeaderboard();

    showScreen(
        "homeScreen"
    );

}


// =====================================================
// SCREEN SYSTEM
// =====================================================

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

}


// =====================================================
// NAVIGATION
// =====================================================

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


// =====================================================
// NAV BUTTON CLICK
// =====================================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".nav-button"
            );

        if (!button) {
            return;
        }

        const screen =
            button.dataset.screen;

        if (!screen) {
            return;
        }

        if (
            screen === "raceScreen" &&
            raceRunning
        ) {

            return;

        }

        showScreen(
            screen
        );

    }
);


// =====================================================
// UPDATE PLAYER UI
// =====================================================

function updatePlayerUI() {

    if (!player) {
        return;
    }

    const username =
        player.username ||
        "Player";

    const money =
        player.money ?? 0;

    const level =
        player.level ?? 1;

    const wins =
        player.wins ?? 0;

    const speed =
        player.bestSpeed ?? 0;

    const carCount =
        player.cars?.length || 1;


    setText(
        "gameUsername",
        username
    );

    setText(
        "gameMoney",
        money.toLocaleString()
    );

    setText(
        "gameLevel",
        level
    );

    setText(
        "homeWins",
        wins
    );

    setText(
        "homeCars",
        carCount
    );

    setText(
        "homeSpeed",
        Math.round(speed)
    );

    setText(
        "profileUsername",
        username
    );

    setText(
        "profileLevel",
        level
    );

    setText(
        "profileWins",
        wins
    );

    setText(
        "profileCars",
        carCount
    );

}


// =====================================================
// SET TEXT HELPER
// =====================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// GET SELECTED CAR
// =====================================================

function getSelectedCar() {

    return (
        cars.find(
            car =>
                car.id ===
                selectedCarId
        ) ||
        cars[0]
    );

}


// =====================================================
// RENDER CARS
// =====================================================

function renderCars() {

    const grid =
        document.getElementById(
            "carsGrid"
        );

    if (!grid || !player) {
        return;
    }

    grid.innerHTML = "";


    cars.forEach(
        car => {

            const owned =
                player.cars?.includes(
                    car.id
                );

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

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:start;
                        "
                    >

                        <div>

                            <h3>
                                ${car.brand}
                                ${car.name}
                            </h3>

                            <p>
                                ${car.type}
                            </p>

                        </div>

                        <strong
                            style="
                                color:
                                ${classInfo.color};
                            "
                        >
                            ${car.class}
                        </strong>

                    </div>


                    ${createStatHTML(
                        "SPEED",
                        car.stats.speed,
                        500
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
                            margin-top:18px;
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                        "
                    >

                        <strong
                            style="
                                color:#ffd700;
                            "
                        >

                            ${
                                owned
                                ? "✓ OWNED"
                                : locked
                                ? "🔒 LV " +
                                  car.levelRequired
                                : "$" +
                                  car.price.toLocaleString()
                            }

                        </strong>


                        ${
                            owned

                            ? `
                                <button
                                    class="secondary-btn"
                                    onclick="
                                        selectGarageCar(
                                            '${car.id}'
                                        )
                                    "
                                >
                                    ${
                                        selectedCarId === car.id
                                        ? "SELECTED"
                                        : "SELECT"
                                    }
                                </button>
                            `

                            : locked

                            ? `
                                <button
                                    class="secondary-btn"
                                    disabled
                                >
                                    LOCKED
                                </button>
                            `

                            : `
                                <button
                                    class="primary-btn"
                                    onclick="
                                        buyCar(
                                            '${car.id}'
                                        )
                                    "
                                >
                                    BUY
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


// =====================================================
// STAT HTML
// =====================================================

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
                    font-size:10px;
                    color:#8d96a5;
                "
            >

                <span>
                    ${name}
                </span>

                <span>
                    ${value}
                </span>

            </div>


            <div
                style="
                    width:100%;
                    height:5px;
                    margin-top:4px;
                    background:#242a33;
                    border-radius:10px;
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


// =====================================================
// BUY CAR
// =====================================================

window.buyCar =
async function(
    carId
) {

    if (!player) {
        return;
    }

    const car =
        cars.find(
            item =>
                item.id === carId
        );

    if (!car) {
        return;
    }

    if (
        player.cars?.includes(
            carId
        )
    ) {

        showNotification(
            "ეს მანქანა უკვე გაქვს."
        );

        return;
    }

    if (
        player.level <
        car.levelRequired
    ) {

        showNotification(
            `საჭიროა Level ${car.levelRequired}.`
        );

        return;
    }

    if (
        (player.money ?? 0) <
        car.price
    ) {

        showNotification(
            "არ გაქვს საკმარისი ფული."
        );

        return;
    }


    const newCars =
        [
            ...(player.cars || []),
            carId
        ];


    player.money -=
        car.price;

    player.cars =
        newCars;


    await savePlayer({

        money:
            player.money,

        cars:
            player.cars

    });


    updatePlayerUI();

    renderCars();

    renderGarage();

    showNotification(
        `🚗 ${car.brand} ${car.name} იყიდე!`
    );

};


// =====================================================
// SELECT CAR
// =====================================================

window.selectGarageCar =
async function(
    carId
) {

    if (!player) {
        return;
    }

    if (
        !player.cars?.includes(
            carId
        )
    ) {

        return;
    }

    selectedCarId =
        carId;

    player.selectedCar =
        carId;


    await savePlayer({

        selectedCar:
            carId

    });


    renderCars();

    renderGarage();

    showNotification(
        "🏎️ მანქანა არჩეულია!"
    );

};


// =====================================================
// GARAGE
// =====================================================

function renderGarage() {

    const grid =
        document.getElementById(
            "garageGrid"
        );

    if (!grid || !player) {
        return;
    }

    grid.innerHTML = "";


    const ownedCars =
        cars.filter(
            car =>
                player.cars?.includes(
                    car.id
                )
        );


    if (
        ownedCars.length === 0
    ) {

        grid.innerHTML = `
            <div class="car-card">
                <div class="car-info">
                    ჯერ არცერთი მანქანა არ გაქვს.
                </div>
            </div>
        `;

        return;
    }


    ownedCars.forEach(
        car => {

            const selected =
                selectedCarId ===
                car.id;


            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "car-card";


            card.innerHTML = `

                <div
                    class="car-image"
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

                    <p>
                        ${car.type}
                    </p>


                    <div
                        style="
                            margin-top:15px;
                            color:
                            ${
                                selected
                                ? "#22c55e"
                                : "#8d96a5"
                            };
                            font-weight:bold;
                        "
                    >

                        ${
                            selected
                            ? "✓ SELECTED"
                            : "OWNED"
                        }

                    </div>


                    ${
                        !selected
                        ? `
                            <button
                                class="primary-btn"
                                style="
                                    margin-top:12px;
                                    width:100%;
                                "
                                onclick="
                                    selectGarageCar(
                                        '${car.id}'
                                    )
                                "
                            >
                                SELECT
                            </button>
                        `
                        : ""
                    }

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


// =====================================================
// MISSIONS
// =====================================================

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

            const completed =
                isMissionCompleted(
                    mission.id
                );


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

                    <small
                        style="
                            display:block;
                            margin-top:7px;
                            color:#8d96a5;
                        "
                    >
                        ${mission.description}
                    </small>

                </div>


                <div
                    style="
                        text-align:right;
                    "
                >

                    ${
                        completed

                        ? `
                            <strong
                                style="
                                    color:#22c55e;
                                "
                            >
                                ✓ COMPLETED
                            </strong>
                        `

                        : `
                            <div
                                style="
                                    color:#ffd700;
                                    font-weight:bold;
                                "
                            >
                                +$${mission.rewardMoney.toLocaleString()}
                            </div>

                            <div
                                style="
                                    color:#8d96a5;
                                    font-size:11px;
                                "
                            >
                                +${mission.rewardXP} XP
                            </div>
                        `
                    }

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// MISSION CHECK
// =====================================================

function isMissionCompleted(
    id
) {

    if (!player) {
        return false;
    }

    if (id === "first_race") {

        return (
            (player.races || 0) >=
            1
        );

    }

    if (id === "three_races") {

        return (
            (player.races || 0) >=
            3
        );

    }

    if (id === "first_win") {

        return (
            (player.wins || 0) >=
            1
        );

    }

    if (id === "level_five") {

        return (
            (player.level || 1) >=
            5
        );

    }

    return false;

}


// =====================================================
// SHOP
// =====================================================

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
                "დროებით ზრდის სიჩქარეს.",
            price: 1000,
            icon: "🚀"
        },

        {
            name: "Nitro Pack",
            description:
                "გაძლევს დამატებით Nitro-ს.",
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

                <p
                    style="
                        color:#8d96a5;
                        margin-top:8px;
                    "
                >
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


// =====================================================
// SHOP PURCHASE
// =====================================================

window.buyShopItem =
async function(
    name,
    price
) {

    if (!player) {
        return;
    }

    if (
        (player.money ?? 0) <
        price
    ) {

        showNotification(
            "არ გაქვს საკმარისი ფული."
        );

        return;
    }


    player.money -=
        price;


    await savePlayer({

        money:
            player.money

    });


    updatePlayerUI();


    showNotification(
        `🛒 ${name} იყიდე!`
    );

};


// =====================================================
// LEADERBOARD
// =====================================================

async function renderLeaderboard() {

    const container =
        document.getElementById(
            "leaderboardList"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                padding:20px;
                text-align:center;
                color:#8d96a5;
            "
        >
            Leaderboard იტვირთება...
        </div>
    `;


    let players = [];


    try {

        const playersRef =
            collection(
                db,
                "players"
            );


        const leaderboardQuery =
            query(
                playersRef,
                orderBy(
                    "xp",
                    "desc"
                ),
                limit(50)
            );


        const snapshot =
            await getDocs(
                leaderboardQuery
            );


        snapshot.forEach(
            docSnapshot => {

                players.push({
                    id:
                        docSnapshot.id,

                    ...docSnapshot.data()

                });

            }
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );

    }


    // Add current player if missing

    if (
        player &&
        !players.some(
            item =>
                item.id ===
                player.id
        )
    ) {

        players.push(
            player
        );

    }


    players.sort(
        (
            a,
            b
        ) =>
            (b.xp || 0) -
            (a.xp || 0)
    );


    container.innerHTML = "";


    players
        .slice(0, 50)
        .forEach(
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


                const you =
                    item.id ===
                    currentUser?.uid;


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


                    <div>

                        <strong
                            style="
                                ${
                                    you
                                    ? "color:#ff3b30;"
                                    : ""
                                }
                            "
                        >

                            ${
                                item.username ||
                                "Player"
                            }

                            ${
                                you
                                ? " (YOU)"
                                : ""
                            }

                        </strong>

                    </div>


                    <span>
                        LV ${
                            item.level ||
                            1
                        }
                    </span>


                    <strong>
                        ${
                            (
                                item.xp ||
                                0
                            ).toLocaleString()
                        }
                    </strong>

                `;


                container.appendChild(
                    row
                );

            }
        );

}


// =====================================================
// RACE
// =====================================================

const startRaceButton =
    document.getElementById(
        "startRaceButton"
    );


if (startRaceButton) {

    startRaceButton.addEventListener(
        "click",
        startRace
    );

}


// =====================================================
// START RACE
// =====================================================

function startRace() {

    if (raceRunning) {
        return;
    }

    showScreen(
        "raceScreen"
    );


    raceRunning =
        false;

    raceFinished =
        false;

    raceSpeed =
        0;

    raceDistance =
        0;

    racePosition =
        50;

    nitro =
        100;


    const car =
        getSelectedCar();


    const playerCar =
        document.getElementById(
            "playerCar"
        );

    if (playerCar) {

        playerCar.textContent =
            car.emoji;

        playerCar.style.left =
            "50%";

        playerCar.style.bottom =
            "12%";

    }


    const countdown =
        document.getElementById(
            "raceCountdown"
        );


    if (!countdown) {
        return;
    }


    let number = 3;


    countdown.textContent =
        number;


    const countdownInterval =
        setInterval(
            () => {

                number--;


                if (number > 0) {

                    countdown.textContent =
                        number;

                } else {

                    countdown.textContent =
                        "GO!";


                    setTimeout(
                        () => {

                            countdown.textContent =
                                "";

                            clearInterval(
                                countdownInterval
                            );

                            beginRace();

                        },
                        500
                    );

                }

            },
            900
        );

}


// =====================================================
// BEGIN RACE
// =====================================================

function beginRace() {

    raceRunning =
        true;

    raceFinished =
        false;


    raceInterval =
        setInterval(
            updateRace,
            50
        );

}


// =====================================================
// UPDATE RACE
// =====================================================

function updateRace() {

    if (!raceRunning) {
        return;
    }


    const car =
        getSelectedCar();


    const acceleration =
        car.stats.acceleration /
        100;


    const maxSpeed =
        car.stats.speed;


    if (raceSpeed > 0) {

        raceSpeed -=
            0.35;

    }


    raceSpeed =
        Math.max(
            0,
            Math.min(
                maxSpeed,
                raceSpeed
            )
        );


    raceDistance +=
        raceSpeed *
        0.003;


    const road =
        document.getElementById(
            "raceRoad"
        );


    const playerCar =
        document.getElementById(
            "playerCar"
        );


    if (road) {

        const movement =
            (raceDistance % 100);

        road.style.backgroundPositionY =
            movement * 5 + "px";

    }


    if (playerCar) {

        playerCar.style.left =
            racePosition + "%";

    }


    if (
        raceDistance >=
        100
    ) {

        finishRace();

    }

}


// =====================================================
// ACCELERATE
// =====================================================

function accelerate() {

    if (!raceRunning) {
        return;
    }


    const car =
        getSelectedCar();


    raceSpeed +=
        3 +
        car.stats.acceleration /
        25;


    raceSpeed =
        Math.min(
            car.stats.speed,
            raceSpeed
        );

}


// =====================================================
// BRAKE
// =====================================================

function brake() {

    if (!raceRunning) {
        return;
    }


    raceSpeed -=
        8;


    raceSpeed =
        Math.max(
            0,
            raceSpeed
        );

}


// =====================================================
// NITRO
// =====================================================

function useNitro() {

    if (
        !raceRunning ||
        nitro <= 0
    ) {

        return;
    }


    raceSpeed +=
        20;


    nitro -=
        10;


    raceSpeed =
        Math.min(
            getSelectedCar().stats.speed,
            raceSpeed
        );


    showNotification(
        `⚡ NITRO ${nitro}%`
    );

}


// =====================================================
// LEFT / RIGHT
// =====================================================

function moveLeft() {

    if (!raceRunning) {
        return;
    }

    racePosition -=
        5;

    racePosition =
        Math.max(
            15,
            racePosition
        );

}


function moveRight() {

    if (!raceRunning) {
        return;
    }

    racePosition +=
        5;

    racePosition =
        Math.min(
            85,
            racePosition
        );

}


// =====================================================
// RACE BUTTONS
// =====================================================

const accelerateButton =
    document.getElementById(
        "accelerateButton"
    );

const brakeButton =
    document.getElementById(
        "brakeButton"
    );

const nitroButton =
    document.getElementById(
        "nitroButton"
    );

const leftButton =
    document.getElementById(
        "leftButton"
    );

const rightButton =
    document.getElementById(
        "rightButton"
    );


if (accelerateButton) {

    accelerateButton.addEventListener(
        "click",
        accelerate
    );

}


if (brakeButton) {

    brakeButton.addEventListener(
        "click",
        brake
    );

}


if (nitroButton) {

    nitroButton.addEventListener(
        "click",
        useNitro
    );

}


if (leftButton) {

    leftButton.addEventListener(
        "click",
        moveLeft
    );

}


if (rightButton) {

    rightButton.addEventListener(
        "click",
        moveRight
    );

}


// =====================================================
// KEYBOARD CONTROLS
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (!raceRunning) {
            return;
        }


        if (
            event.key ===
            "ArrowUp"
        ) {

            accelerate();

        }


        if (
            event.key ===
            "ArrowDown"
        ) {

            brake();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            moveLeft();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            moveRight();

        }


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            useNitro();

        }

    }
);


// =====================================================
// FINISH RACE
// =====================================================

async function finishRace() {

    if (
        raceFinished
    ) {

        return;

    }


    raceFinished =
        true;

    raceRunning =
        false;


    clearInterval(
        raceInterval
    );


    const won =
        Math.random() >
        0.25;


    const reward =
        won
        ? 2500
        : 750;


    const xpReward =
        won
        ? 500
        : 150;


    player.races =
        (player.races || 0) +
        1;


    if (won) {

        player.wins =
            (player.wins || 0) +
            1;

    } else {

        player.losses =
            (player.losses || 0) +
            1;

    }


    player.money =
        (player.money || 0) +
        reward;


    player.xp =
        (player.xp || 0) +
        xpReward;


    const speed =
        Math.round(
            raceSpeed
        );


    if (
        speed >
        (player.bestSpeed || 0)
    ) {

        player.bestSpeed =
            speed;

    }


    calculateLevel();


    await savePlayer({

        races:
            player.races,

        wins:
            player.wins,

        losses:
            player.losses,

        money:
            player.money,

        xp:
            player.xp,

        level:
            player.level,

        bestSpeed:
            player.bestSpeed

    });


    updatePlayerUI();

    renderMissions();

    renderLeaderboard();


    showNotification(

        won

        ? `🏆 VICTORY! +$${reward} +${xpReward} XP`

        : `🏁 FINISHED! +$${reward} +${xpReward} XP`

    );


    setTimeout(
        () => {

            showScreen(
                "homeScreen"
            );

        },
        1800
    );

}


// =====================================================
// LEVEL SYSTEM
// =====================================================

function calculateLevel() {

    if (!player) {
        return;
    }


    const xp =
        player.xp || 0;


    const newLevel =
        Math.max(
            1,
            Math.floor(
                xp / 1000
            ) + 1
        );


    if (
        newLevel >
        (player.level || 1)
    ) {

        player.level =
            newLevel;


        showNotification(
            `⭐ LEVEL UP! Level ${newLevel}`
        );

    }

}


// =====================================================
// SAVE PLAYER
// =====================================================

async function savePlayer(
    data
) {

    if (!currentUser) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "players",
                currentUser.uid
            ),
            data
        );

    } catch (error) {

        console.error(
            "Save player error:",
            error
        );

    }

}


// =====================================================
// NOTIFICATION
// =====================================================

function showNotification(
    message
) {

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

        notification.style.left =
            "50%";

        notification.style.top =
            "90px";

        notification.style.transform =
            "translateX(-50%)";

        notification.style.zIndex =
            "9999";

        notification.style.padding =
            "14px 22px";

        notification.style.borderRadius =
            "12px";

        notification.style.background =
            "#171c25";

        notification.style.border =
            "1px solid #394352";

        notification.style.color =
            "white";

        notification.style.fontWeight =
            "bold";

        notification.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.5)";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(
            () => {

                notification.style.display =
                    "none";

            },
            2500
        );

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                const {
                    signOut
                } =
                    await import(
                        "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js"
                    );


                await signOut(
                    auth
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}
