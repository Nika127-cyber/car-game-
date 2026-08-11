import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const authScreen =
    document.getElementById("authScreen");

const gameApp =
    document.getElementById("gameApp");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const registerUsername =
    document.getElementById("registerUsername");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const loginButton =
    document.getElementById("loginButton");

const registerButton =
    document.getElementById("registerButton");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");

const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("registerMessage");

const logoutButton =
    document.getElementById("logoutButton");


// =====================================================
// SHOW LOGIN
// =====================================================

showRegister.addEventListener(
    "click",
    () => {

        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");

        loginMessage.textContent = "";

    }
);


// =====================================================
// SHOW REGISTER
// =====================================================

showLogin.addEventListener(
    "click",
    () => {

        registerForm.classList.add("hidden");

        loginForm.classList.remove("hidden");

        registerMessage.textContent = "";

    }
);


// =====================================================
// REGISTER
// =====================================================

registerButton.addEventListener(
    "click",
    async () => {

        const username =
            registerUsername.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;


        registerMessage.textContent = "";


        if (!username) {

            registerMessage.textContent =
                "შეიყვანე Nickname.";

            return;

        }


        if (username.length < 3) {

            registerMessage.textContent =
                "Nickname მინიმუმ 3 სიმბოლო უნდა იყოს.";

            return;

        }


        if (!email) {

            registerMessage.textContent =
                "შეიყვანე Email.";

            return;

        }


        if (password.length < 6) {

            registerMessage.textContent =
                "Password მინიმუმ 6 სიმბოლო უნდა იყოს.";

            return;

        }


        registerButton.disabled = true;

        registerButton.textContent =
            "იქმნება...";


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // მოთამაშის მონაცემები

            await setDoc(
                doc(
                    db,
                    "players",
                    user.uid
                ),
                {

                    uid:
                        user.uid,

                    username:
                        username,

                    email:
                        email,

                    level:
                        1,

                    xp:
                        0,

                    money:
                        5000,

                    gold:
                        100,

                    wins:
                        0,

                    losses:
                        0,

                    races:
                        0,

                    bestSpeed:
                        0,

                    selectedCar:
                        "street-runner",

                    cars:
                        [
                            "street-runner"
                        ],

                    createdAt:
                        new Date()

                }
            );


            registerMessage.style.color =
                "#22c55e";

            registerMessage.textContent =
                "ანგარიში წარმატებით შეიქმნა!";


        } catch (error) {

            registerMessage.style.color =
                "#ff7a73";

            registerMessage.textContent =
                firebaseErrorMessage(
                    error.code
                );

        }


        registerButton.disabled = false;

        registerButton.textContent =
            "ანგარიშის შექმნა";

    }
);


// =====================================================
// LOGIN
// =====================================================

loginButton.addEventListener(
    "click",
    async () => {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        loginMessage.textContent = "";


        if (!email || !password) {

            loginMessage.textContent =
                "შეავსე ორივე ველი.";

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "იტვირთება...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            loginMessage.style.color =
                "#22c55e";

            loginMessage.textContent =
                "წარმატებით შეხვედი!";


        } catch (error) {

            loginMessage.style.color =
                "#ff7a73";

            loginMessage.textContent =
                firebaseErrorMessage(
                    error.code
                );

        }


        loginButton.disabled = false;

        loginButton.textContent =
            "შესვლა";

    }
);


// =====================================================
// LOGOUT
// =====================================================

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                error
            );

        }

    }
);


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            await openGame(
                user
            );

        } else {

            openLogin();

        }

    }
);


// =====================================================
// OPEN GAME
// =====================================================

async function openGame(
    user
) {

    authScreen.classList.add(
        "hidden"
    );

    gameApp.classList.remove(
        "hidden"
    );


    try {

        const playerRef =
            doc(
                db,
                "players",
                user.uid
            );


        const playerSnapshot =
            await getDoc(
                playerRef
            );


        if (
            playerSnapshot.exists()
        ) {

            const player =
                playerSnapshot.data();


            updatePlayerUI(
                player
            );

        } else {

            console.warn(
                "Player profile not found."
            );

        }

    } catch (error) {

        console.error(
            "Player loading error:",
            error
        );

    }

}


// =====================================================
// OPEN LOGIN
// =====================================================

function openLogin() {

    authScreen.classList.remove(
        "hidden"
    );

    gameApp.classList.add(
        "hidden"
    );

}


// =====================================================
// UPDATE PLAYER UI
// =====================================================

function updatePlayerUI(
    player
) {

    const username =
        player.username ||
        "Player";

    const money =
        player.money ??
        0;

    const level =
        player.level ??
        1;

    const wins =
        player.wins ??
        0;

    const cars =
        player.cars?.length ||
        1;


    // TOP BAR

    const gameUsername =
        document.getElementById(
            "gameUsername"
        );

    const gameMoney =
        document.getElementById(
            "gameMoney"
        );

    const gameLevel =
        document.getElementById(
            "gameLevel"
        );


    if (gameUsername)
        gameUsername.textContent =
            username;


    if (gameMoney)
        gameMoney.textContent =
            money.toLocaleString();


    if (gameLevel)
        gameLevel.textContent =
            level;


    // HOME

    const homeWins =
        document.getElementById(
            "homeWins"
        );

    const homeCars =
        document.getElementById(
            "homeCars"
        );


    if (homeWins)
        homeWins.textContent =
            wins;


    if (homeCars)
        homeCars.textContent =
            cars;


    // PROFILE

    const profileUsername =
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


    if (profileUsername)
        profileUsername.textContent =
            username;


    if (profileLevel)
        profileLevel.textContent =
            level;


    if (profileWins)
        profileWins.textContent =
            wins;


    if (profileCars)
        profileCars.textContent =
            cars;

}


// =====================================================
// FIREBASE ERROR TRANSLATION
// =====================================================

function firebaseErrorMessage(
    code
) {

    switch (code) {

        case
            "auth/email-already-in-use":

            return "ეს Email უკვე გამოყენებულია.";

        case
            "auth/invalid-email":

            return "Email არასწორია.";

        case
            "auth/weak-password":

            return "Password ძალიან სუსტია.";

        case
            "auth/invalid-credential":

            return "Email ან Password არასწორია.";

        case
            "auth/user-not-found":

            return "ასეთი ანგარიში ვერ მოიძებნა.";

        case
            "auth/wrong-password":

            return "Password არასწორია.";

        case
            "auth/too-many-requests":

            return "ძალიან ბევრი მცდელობაა. ცოტა ხანში სცადე.";

        default:

            return "დაფიქსირდა შეცდომა. სცადე თავიდან.";

    }

}
