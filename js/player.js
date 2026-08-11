const player = {

    name: "Guest",

    level: 1,

    xp: 0,

    money: 5000,

    gold: 100,

    wins: 0,

    races: 0,

    bestSpeed: 180,

    selectedCar: "starter",

    cars: [
        "starter"
    ]

};


/* =========================
   XP SYSTEM
========================= */

function getRequiredXP() {

    return player.level * 1000;

}


function addXP(amount) {

    player.xp += amount;

    while (
        player.xp >= getRequiredXP()
    ) {

        player.xp -=
            getRequiredXP();

        player.level++;

        showNotification(
            `🎉 Level ${player.level}!`
        );
    }

    updatePlayerUI();

    savePlayer();

}


/* =========================
   MONEY
========================= */

function addMoney(amount) {

    player.money += amount;

    updatePlayerUI();

    savePlayer();

}


function removeMoney(amount) {

    if (
        player.money < amount
    ) {

        showNotification(
            "❌ საკმარისი ფული არ გაქვს!"
        );

        return false;
    }

    player.money -= amount;

    updatePlayerUI();

    savePlayer();

    return true;
}


/* =========================
   GOLD
========================= */

function addGold(amount) {

    player.gold += amount;

    updatePlayerUI();

    savePlayer();

}


function removeGold(amount) {

    if (
        player.gold < amount
    ) {

        showNotification(
            "❌ საკმარისი Gold არ გაქვს!"
        );

        return false;
    }

    player.gold -= amount;

    updatePlayerUI();

    savePlayer();

    return true;
}


/* =========================
   RACE STATISTICS
========================= */

function completeRace(
    won,
    rewardMoney,
    rewardXP
) {

    player.races++;

    if (won) {

        player.wins++;

        addMoney(
            rewardMoney
        );

        addXP(
            rewardXP
        );

    } else {

        addMoney(
            Math.floor(
                rewardMoney * 0.25
            )
        );

        addXP(
            Math.floor(
                rewardXP * 0.25
            )
        );
    }

    updatePlayerUI();

    savePlayer();

}


/* =========================
   CAR OWNERSHIP
========================= */

function ownsCar(carId) {

    return player.cars.includes(
        carId
    );

}


function addCar(carId) {

    if (
        ownsCar(carId)
    ) {

        return false;
    }

    player.cars.push(
        carId
    );

    updatePlayerUI();

    savePlayer();

    return true;
}


/* =========================
   SELECT CAR
========================= */

function selectCar(carId) {

    if (
        !ownsCar(carId)
    ) {

        showNotification(
            "ეს მანქანა ჯერ არ გაქვს!"
        );

        return false;
    }

    player.selectedCar =
        carId;

    savePlayer();

    renderGarage();

    return true;
}


/* =========================
   SAVE
========================= */

function savePlayer() {

    localStorage.setItem(
        "streetLegendsPlayer",
        JSON.stringify(player)
    );

}


/* =========================
   LOAD
========================= */

function loadPlayer() {

    const savedPlayer =
        localStorage.getItem(
            "streetLegendsPlayer"
        );


    if (!savedPlayer) {

        updatePlayerUI();

        return;
    }


    try {

        const data =
            JSON.parse(
                savedPlayer
            );


        Object.assign(
            player,
            data
        );


    } catch (error) {

        console.error(
            "Player data error:",
            error
        );

    }


    updatePlayerUI();

}


/* =========================
   RESET PLAYER
========================= */

function resetPlayer() {

    localStorage.removeItem(
        "streetLegendsPlayer"
    );

    location.reload();

}


/* =========================
   UPDATE UI
========================= */

function updatePlayerUI() {

    const nameElement =
        document.getElementById(
            "playerName"
        );


    const levelElement =
        document.getElementById(
            "playerLevel"
        );


    const moneyElement =
        document.getElementById(
            "playerMoney"
        );


    const goldElement =
        document.getElementById(
            "playerGold"
        );


    const xpBar =
        document.getElementById(
            "xpBar"
        );


    const winsStat =
        document.getElementById(
            "winsStat"
        );


    const carsStat =
        document.getElementById(
            "carsStat"
        );


    const speedStat =
        document.getElementById(
            "speedStat"
        );


    const profileName =
        document.getElementById(
            "profileName"
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


    if (nameElement)
        nameElement.textContent =
            player.name;


    if (levelElement)
        levelElement.textContent =
            player.level;


    if (moneyElement)
        moneyElement.textContent =
            player.money.toLocaleString();


    if (goldElement)
        goldElement.textContent =
            player.gold.toLocaleString();


    if (winsStat)
        winsStat.textContent =
            player.wins;


    if (carsStat)
        carsStat.textContent =
            player.cars.length;


    if (speedStat)
        speedStat.textContent =
            player.bestSpeed +
            " KM/H";


    if (profileName)
        profileName.textContent =
            player.name;


    if (profileLevel)
        profileLevel.textContent =
            player.level;


    if (profileWins)
        profileWins.textContent =
            player.wins;


    if (profileCars)
        profileCars.textContent =
            player.cars.length;


    if (xpBar) {

        const required =
            getRequiredXP();

        const percentage =
            (
                player.xp /
                required
            ) * 100;


        xpBar.style.width =
            Math.min(
                percentage,
                100
            ) + "%";
    }

}


/* =========================
   NOTIFICATION
========================= */

function showNotification(
    text
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

        notification.style.top =
            "90px";

        notification.style.left =
            "50%";

        notification.style.transform =
            "translateX(-50%)";

        notification.style.zIndex =
            "99999";

        notification.style.padding =
            "14px 22px";

        notification.style.background =
            "#151a22";

        notification.style.border =
            "1px solid #333";

        notification.style.borderRadius =
            "10px";

        notification.style.color =
            "white";

        notification.style.fontWeight =
            "bold";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.4)";


        document.body.appendChild(
            notification
        );
    }


    notification.textContent =
        text;


    clearTimeout(
        notification.timer
    );


    notification.timer =
        setTimeout(() => {

            notification.remove();

        }, 2500);

}


/* =========================
   START
========================= */

loadPlayer();
