// =====================================================
// STREET LEGENDS
// MAIN CONTROLLER
// =====================================================


// =====================================================
// SCREEN NAVIGATION
// =====================================================

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const target =
        document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }

    updateNavigation(screenId);

    // Screen-specific rendering

    if (screenId === "garageScreen") {
        if (typeof renderGarage === "function") {
            renderGarage();
        }
    }

    if (screenId === "carsScreen") {
        if (typeof renderCars === "function") {
            renderCars();
        }
    }

    if (screenId === "missionsScreen") {
        if (typeof renderMissions === "function") {
            renderMissions();
        }
    }

    if (screenId === "shopScreen") {
        if (typeof renderShop === "function") {
            renderShop();
        }
    }

    if (screenId === "leaderboardScreen") {
        if (typeof renderLeaderboard === "function") {
            renderLeaderboard();
        }
    }

    if (screenId === "profileScreen") {
        if (typeof updatePlayerUI === "function") {
            updatePlayerUI();
        }
    }
}


// =====================================================
// NAVIGATION
// =====================================================

function updateNavigation(screenId) {

    const buttons =
        document.querySelectorAll(".nav-button");

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    buttons.forEach(button => {

        if (
            button.dataset.screen ===
            screenId
        ) {
            button.classList.add("active");
        }

    });
}


// =====================================================
// NAVIGATION BUTTONS
// =====================================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(".nav-button");

        if (!button) {
            return;
        }

        const screen =
            button.dataset.screen;

        if (screen) {
            showScreen(screen);
        }

    }
);


// =====================================================
// START RACE BUTTON
// =====================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#startRaceButton"
            )
        ) {

            showScreen(
                "raceScreen"
            );

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#logoutButton"
            )
        ) {

            console.log(
                "Logout handled by auth.js"
            );

        }

    }
);


// =====================================================
// SAFE GAME INITIALIZATION
// =====================================================

function initializeGame() {

    console.log(
        "Street Legends initialized."
    );

    // IMPORTANT:
    // Player data is now loaded by auth.js.
    // We do NOT call loadPlayer() here.

    if (
        typeof renderGarage ===
        "function"
    ) {
        renderGarage();
    }

    if (
        typeof renderCars ===
        "function"
    ) {
        renderCars();
    }

    if (
        typeof renderMissions ===
        "function"
    ) {
        renderMissions();
    }

    if (
        typeof renderShop ===
        "function"
    ) {
        renderShop();
    }

    if (
        typeof renderLeaderboard ===
        "function"
    ) {
        renderLeaderboard();
    }

    showScreen(
        "homeScreen"
    );
}


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Street Legends loaded."
        );

    }
);
