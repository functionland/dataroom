function initializeFirebase() {
    const firebaseConfig = {
        apiKey: window.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: window.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: window.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: window.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: window.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: window.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: window.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    window.db = firebase.firestore();
}
