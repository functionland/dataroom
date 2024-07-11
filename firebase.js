function loadConfig() {
    return new Promise((resolve, reject) => {
        if (window.location.hostname === 'localhost') {
            fetch('/env.json')
                .then(response => response.json())
                .then(env => {
                    window.env = env;
                    resolve();
                })
                .catch(error => reject(error));
        } else {
            window.env = {
                REACT_APP_FIREBASE_API_KEY: '<%= REACT_APP_FIREBASE_API_KEY %>',
                REACT_APP_FIREBASE_AUTH_DOMAIN: '<%= REACT_APP_FIREBASE_AUTH_DOMAIN %>',
                REACT_APP_FIREBASE_PROJECT_ID: '<%= REACT_APP_FIREBASE_PROJECT_ID %>',
                REACT_APP_FIREBASE_STORAGE_BUCKET: '<%= REACT_APP_FIREBASE_STORAGE_BUCKET %>',
                REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '<%= REACT_APP_FIREBASE_MESSAGING_SENDER_ID %>',
                REACT_APP_FIREBASE_APP_ID: '<%= REACT_APP_FIREBASE_APP_ID %>',
                REACT_APP_FIREBASE_MEASUREMENT_ID: '<%= REACT_APP_FIREBASE_MEASUREMENT_ID %>',
            };
            resolve();
        }
    });
}

loadConfig().then(() => {
    initializeFirebase();
}).catch(error => console.error('Error loading environment variables:', error));

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
    const app = firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    window.db = firebase.firestore(app);
}
