import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBZ2rZilsRo1FuSeOaKEduhWefVQUDWIq4",
    authDomain: "street-legends-36204.firebaseapp.com",
    projectId: "street-legends-36204",
    storageBucket: "street-legends-36204.firebasestorage.app",
    messagingSenderId: "755646586968",
    appId: "1:755646586968:web:c95084b38dbc1f7cdd6a2d"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
    app,
    auth,
    db
};
