/* =========================================================
   STREET LEGENDS
   CAR DATABASE
========================================================= */


/* =========================================================
   CAR CLASSES
========================================================= */

const CAR_CLASSES = {

    D: {
        name: "D CLASS",
        color: "#8d96a5"
    },

    C: {
        name: "C CLASS",
        color: "#22c55e"
    },

    B: {
        name: "B CLASS",
        color: "#3b82f6"
    },

    A: {
        name: "A CLASS",
        color: "#a855f7"
    },

    S: {
        name: "S CLASS",
        color: "#ff3b30"
    },

    X: {
        name: "X CLASS",
        color: "#ffd700"
    }

};


/* =========================================================
   CAR DATABASE
========================================================= */

const cars = [

    /* =========================
       STARTER
    ========================== */

    {
        id: "starter",

        name: "Street Runner",

        brand: "Street Legends",

        type: "Sport",

        class: "D",

        price: 0,

        levelRequired: 1,

        emoji: "🚗",

        stats: {

            speed: 180,

            acceleration: 55,

            handling: 60,

            braking: 50,

            nitro: 40

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       BMW
    ========================== */

    {
        id: "bmw_e36",

        name: "E36",

        brand: "BMW",

        type: "Sport Coupe",

        class: "C",

        price: 12500,

        levelRequired: 3,

        emoji: "🚘",

        stats: {

            speed: 220,

            acceleration: 68,

            handling: 70,

            braking: 62,

            nitro: 50

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    {
        id: "bmw_m3",

        name: "M3",

        brand: "BMW",

        type: "Performance",

        class: "B",

        price: 35000,

        levelRequired: 7,

        emoji: "🏎️",

        stats: {

            speed: 270,

            acceleration: 78,

            handling: 78,

            braking: 72,

            nitro: 65

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       NISSAN
    ========================== */

    {
        id: "nissan_350z",

        name: "350Z",

        brand: "Nissan",

        type: "Drift",

        class: "B",

        price: 28000,

        levelRequired: 6,

        emoji: "🚙",

        stats: {

            speed: 255,

            acceleration: 75,

            handling: 82,

            braking: 68,

            nitro: 70

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    {
        id: "nissan_gtr",

        name: "GT-R",

        brand: "Nissan",

        type: "Super Sport",

        class: "A",

        price: 95000,

        levelRequired: 15,

        emoji: "🏎️",

        stats: {

            speed: 330,

            acceleration: 94,

            handling: 90,

            braking: 88,

            nitro: 82

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       TOYOTA
    ========================== */

    {
        id: "toyota_supra",

        name: "Supra",

        brand: "Toyota",

        type: "Tuner",

        class: "B",

        price: 42000,

        levelRequired: 8,

        emoji: "🚗",

        stats: {

            speed: 290,

            acceleration: 82,

            handling: 76,

            braking: 70,

            nitro: 78

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       AUDI
    ========================== */

    {
        id: "audi_r8",

        name: "R8",

        brand: "Audi",

        type: "Supercar",

        class: "A",

        price: 125000,

        levelRequired: 18,

        emoji: "🏎️",

        stats: {

            speed: 340,

            acceleration: 93,

            handling: 91,

            braking: 90,

            nitro: 85

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       PORSCHE
    ========================== */

    {
        id: "porsche_911",

        name: "911",

        brand: "Porsche",

        type: "Sports Car",

        class: "A",

        price: 150000,

        levelRequired: 20,

        emoji: "🏎️",

        stats: {

            speed: 345,

            acceleration: 95,

            handling: 94,

            braking: 95,

            nitro: 86

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       LAMBORGHINI
    ========================== */

    {
        id: "lamborghini_huracan",

        name: "Huracán",

        brand: "Lamborghini",

        type: "Supercar",

        class: "S",

        price: 350000,

        levelRequired: 30,

        emoji: "🏎️",

        stats: {

            speed: 390,

            acceleration: 98,

            handling: 96,

            braking: 96,

            nitro: 92

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       FERRARI
    ========================== */

    {
        id: "ferrari_488",

        name: "488",

        brand: "Ferrari",

        type: "Supercar",

        class: "S",

        price: 400000,

        levelRequired: 35,

        emoji: "🏎️",

        stats: {

            speed: 400,

            acceleration: 99,

            handling: 97,

            braking: 97,

            nitro: 94

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    },


    /* =========================
       HYPERCAR
    ========================== */

    {
        id: "hyper_x",

        name: "X-Prototype",

        brand: "Street Legends",

        type: "Hypercar",

        class: "X",

        price: 1000000,

        levelRequired: 50,

        emoji: "🚀",

        stats: {

            speed: 500,

            acceleration: 100,

            handling: 100,

            braking: 100,

            nitro: 100

        },

        upgrades: {

            engine: 0,

            turbo: 0,

            tires: 0,

            brakes: 0,

            suspension: 0,

            gearbox: 0

        }

    }

];


/* =========================================================
   GET CAR
========================================================= */

function getCar(
    carId
) {

    return cars.find(
        car =>
            car.id === carId
    );

}


/* =========================================================
   GET ALL CARS
========================================================= */

function getAllCars() {

    return cars;

}


/* =========================================================
   CHECK LEVEL
========================================================= */

function canBuyCar(
    car
) {

    if (
        player.level <
        car.levelRequired
    ) {

        return {

            allowed: false,

            reason:
                `საჭიროა Level ${car.levelRequired}`

        };

    }


    if (
        player.money <
        car.price
    ) {

        return {

            allowed: false,

            reason:
                "საკმარისი ფული არ გაქვს"

        };

    }


    return {

        allowed: true,

        reason: ""

    };

}


/* =========================================================
   BUY CAR
========================================================= */

function buyCar(
    carId
) {

    const car =
        getCar(carId);


    if (!car) {

        showNotification(
            "მანქანა ვერ მოიძებნა."
        );

        return false;

    }


    if (
        ownsCar(carId)
    ) {

        showNotification(
            "ეს მანქანა უკვე გაქვს."
        );

        return false;

    }


    const result =
        canBuyCar(car);


    if (
        !result.allowed
    ) {

        showNotification(
            "❌ " +
            result.reason
        );

        return false;

    }


    if (
        !removeMoney(
            car.price
        )
    ) {

        return false;

    }


    addCar(
        car.id
    );


    showNotification(
        `🎉 ${car.brand} ${car.name} იყიდე!`
    );


    renderCars();

    renderGarage();

    return true;

}


/* =========================================================
   CAR UPGRADE
========================================================= */

const upgradePrices = {

    engine: 2500,

    turbo: 3500,

    tires: 1800,

    brakes: 2000,

    suspension: 2200,

    gearbox: 3000

};


function upgradeCar(
    carId,
    upgradeType
) {

    const car =
        getCar(carId);


    if (!car) {

        return false;

    }


    if (
        !ownsCar(carId)
    ) {

        showNotification(
            "ეს მანქანა არ გაქვს."
        );

        return false;

    }


    if (
        !upgradePrices[
            upgradeType
        ]
    ) {

        return false;

    }


    const currentLevel =
        car.upgrades[
            upgradeType
        ];


    const maxLevel = 10;


    if (
        currentLevel >=
        maxLevel
    ) {

        showNotification(
            "ეს Upgrade უკვე მაქსიმალურ დონეზეა."
        );

        return false;

    }


    const price =
        upgradePrices[
            upgradeType
        ] *
        (
            currentLevel + 1
        );


    if (
        !removeMoney(
            price
        )
    ) {

        return false;

    }


    car.upgrades[
        upgradeType
    ]++;


    applyUpgradeStats(
        car,
        upgradeType
    );


    savePlayer();


    showNotification(
        `🔧 ${upgradeType.toUpperCase()} upgraded!`
    );


    renderGarage();

    return true;

}


/* =========================================================
   APPLY UPGRADE
========================================================= */

function applyUpgradeStats(
    car,
    upgradeType
) {

    const level =
        car.upgrades[
            upgradeType
        ];


    switch (
        upgradeType
    ) {

        case "engine":

            car.stats.speed += 3;

            car.stats.acceleration += 2;

            break;


        case "turbo":

            car.stats.speed += 5;

            car.stats.nitro += 4;

            break;


        case "tires":

            car.stats.handling += 3;

            break;


        case "brakes":

            car.stats.braking += 4;

            break;


        case "suspension":

            car.stats.handling += 2;

            car.stats.braking += 1;

            break;


        case "gearbox":

            car.stats.acceleration += 3;

            break;

    }

}


/* =========================================================
   CAR POWER
========================================================= */

function getCarPower(
    car
) {

    if (!car) {

        return 0;

    }


    const total =

        car.stats.speed * 0.30 +

        car.stats.acceleration * 0.20 +

        car.stats.handling * 0.20 +

        car.stats.braking * 0.15 +

        car.stats.nitro * 0.15;


    return Math.round(
        total
    );

}


/* =========================================================
   CAR CLASS COLOR
========================================================= */

function getCarClassColor(
    className
) {

    if (
        CAR_CLASSES[
            className
        ]
    ) {

        return CAR_CLASSES[
            className
        ].color;

    }


    return "#ffffff";

}
