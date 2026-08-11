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
// REGISTER
// =====================================================

export async function registerUser(
    username,
    email,
    password
) {

    username = username.trim();
    email = email.trim();

    if (!username) {

        throw new Error(
            "შეიყვანე Nickname"
        );

    }

    if (!email) {

        throw new Error(
            "შეიყვანე Email"
        );

    }

    if (password.length < 6) {

        throw new Error(
            "Password უნდა იყოს მინიმუმ 6 სიმბოლო"
        );

    }


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

            uid: user.uid,

            username: username,

            email: email,

            level: 1,

            xp: 0,

            money: 5000,

            gold: 100,

            wins: 0,

            losses: 0,

            races: 0,

            selectedCar: "street-runner",

            cars: [
                "street-runner"
            ],

            createdAt:
                new Date()

        }
    );


    return user;

}



// =====================================================
// LOGIN
// =====================================================

export async function loginUser(
    email,
    password
) {

    email = email.trim();


    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


    return userCredential.user;

}



// =====================================================
// LOGOUT
// =====================================================

export async function logoutUser() {

    await signOut(auth);

}



// =====================================================
// GET PLAYER DATA
// =====================================================

export async function getPlayerData(
    uid
) {

    const playerRef =
        doc(
            db,
            "players",
            uid
        );


    const playerSnapshot =
        await getDoc(
            playerRef
        );


    if (!playerSnapshot.exists()) {

        return null;

    }


    return playerSnapshot.data();

}



// =====================================================
// AUTH STATE
// =====================================================

export function listenToAuth(
    callback
) {

    return onAuthStateChanged(
        auth,
        callback
    );

}
