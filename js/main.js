/* =========================================================
   STREET LEGENDS
   MAIN CONTROLLER
========================================================= */


/* =========================================================
   SCREEN SYSTEM
========================================================= */

function showScreen(
    screenId
) {

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


    /*
       Refresh screen data
    */

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

function updateNavigation(
    screenId
) {

    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    buttons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    const mapping = {

        homeScreen: 0,

        raceScreen: 1,

        garageScreen: 2,

        shopScreen: 3,

        leaderboardScreen: 4,

        profileScreen: 5

    };


    const index =
        mapping[
            screenId
        ];


    if (
        index !== undefined &&
        buttons[index]
    ) {

        buttons[index]
            .classList.add(
                "active"
            );

    }

}


/* =========================================================
   CAR DATABASE SCREEN
========================================================= */

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

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "car-card";


            const owned =
                ownsCar(
                    car.id
                );


            const classInfo =
                CAR_CLASSES[
                    car.class
                ];


            const locked =
                player.level <
                car.levelRequired;


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
                        "
                    >

                        <div>

                            <h3>
                                ${car.brand}
                                ${car.name}
                            </h3>

                            <div class="car-type">
                                ${car.type}
                            </div>

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
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-top:18px;
                        "
                    >

                        <div>

                            ${
                                owned

                                ? `
                                    <span
                                        style="
                                            color:#22c55e;
                                            font-weight:bold;
                                        "
                                    >
                                        ✓ OWNED
                                    </span>
                                `

                                : locked

                                ? `
                                    <span
                                        style="
                                            color:#8d96a5;
                                        "
                                    >
                                        🔒 LV
                                        ${car.levelRequired}
                                    </span>
                                `

                                : `
                                    <strong
                                        style="
                                            color:#ffd700;
                                        "
                                    >
                                        $${car.price.toLocaleString()}
                                    </strong>
                                `
                            }

                        </div>


                        ${
                            owned

                            ? `
                                <button
                                    onclick="
                                        selectGarageCar(
                                            '${car.id}'
                                        )
                                    "
                                    style="
                                        padding:9px 13px;
                                        border:none;
                                        border-radius:7px;
                                        background:#252b35;
                                        color:white;
                                        cursor:pointer;
                                    "
                                >
                                    SELECT
                                </button>
                            `

                            : locked

                            ? `
                                <button
                                    disabled
                                    style="
                                        padding:9px 13px;
                                        border:none;
                                        border-radius:7px;
                                        background:#252b35;
                                        color:#666;
                                    "
                                >
                                    LOCKED
                                </button>
                            `

                            : `
                                <button
                                    onclick="
                                        buyCar(
                                            '${car.id}'
                                        )
                                    "
                                    style="
                                        padding:9px 13px;
                                        border:none;
                                        border-radius:7px;
                                        background:#ff3b30;
                                        color:white;
                                        cursor:pointer;
                                        font-weight:bold;
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
   RENDER MISSIONS
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


                <div
                    style="
                        text-align:right;
                    "
                >

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
                        margin-bottom:15px;
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
                        line-height:1.5;
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


/* =========================================================
   SHOP PURCHASE
========================================================= */

function buyShopItem(
    name,
    price
) {

    if (
        !removeMoney(
            price
        )
    ) {

        return;

    }


    showNotification(
        `🛒 ${name} იყიდე!`
    );

}


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
   RENDER LEADERBOARD
========================================================= */

function renderLeaderboard() {

    const container =
        document.getElementById(
            "leaderboardList"
        );


    if (!container) {

        return;

    }


    const allPlayers = [

        ...leaderboardData,

        {

            name:
                player.name,

            level:
                player.level,

            xp:
                player.xp

        }

    ];


    allPlayers.sort(
        (
            a,
            b
        ) =>
            b.xp -
            a.xp
    );


    container.innerHTML = "";


    allPlayers.forEach(
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


            const isYou =
                item.name ===
                player.name;


            row.innerHTML = `

                <span
                    class="rank"
                >
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


                <div
                    class="player-row"
                >

                    <div
                        class="player-avatar"
                    >
                        🏎️
                    </div>

                    <strong
                        style="
                            ${
                                isYou
                                ? "color:#ff3b30;"
                                : ""
                            }
                        "
                    >
                        ${item.name}
                        ${
                            isYou
                            ? " (YOU)"
                            : ""
                        }
                    </strong>

                </div>


                <span>
                    ${item.level}
                </span>


                <strong>
                    ${item.xp.toLocaleString()}
                </strong>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   LOADING SCREEN
========================================================= */

function startLoading() {

    let progress = 0;


    const interval =
        setInterval(
            () => {

                progress +=
                    Math.floor(
                        Math.random() * 12
                    ) + 5;


                if (
                    progress >= 100
                ) {

                    progress = 100;

                }


                const progressBar =
                    document.getElementById(
                        "loadingProgress"
                    );


                const loadingText =
                    document.getElementById(
                        "loadingText"
                    );


                if (progressBar) {

                    progressBar.style.width =
                        progress + "%";

                }


                if (loadingText) {

                    if (
                        progress < 30
                    ) {

                        loadingText.textContent =
                            "იტვირთება მანქანები...";

                    } else if (
                        progress < 60
                    ) {

                        loadingText.textContent =
                            "იტვირთება რუკები...";

                    } else if (
                        progress < 85
                    ) {

                        loadingText.textContent =
                            "იტვირთება თამაშის სისტემა...";

                    } else {

                        loadingText.textContent =
                            "მზადაა!";

                    }

                }


                if (
                    progress >= 100
                ) {

                    clearInterval(
                        interval
                    );


                    setTimeout(
                        () => {

                            const loading =
                                document.getElementById(
                                    "loadingScreen"
                                );


                            const app =
                                document.getElementById(
                                    "app"
                                );


                            if (loading) {

                                loading.style.display =
                                    "none";

                            }


                            if (app) {

                                app.classList.remove(
                                    "hidden"
                                );

                            }


                            initializeGame();

                        },
                        400
                    );

                }

            },
            120
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

    showScreen(
        "homeScreen"
    );

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startLoading();

    }
);
