import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxNaQnjQWbyiZxI-2W5xDV2vI3nYP65BY",
    authDomain: "siscraper-37151.firebaseapp.com",
    projectId: "siscraper-37151",
    storageBucket: "siscraper-37151.appspot.com",
    messagingSenderId: "411410505345",
    appId: "1:411410505345:web:4121f37bda45c3b1c6b780"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const firebaseFunctions = getFunctions(firebase);

if (process.env.NODE_ENV !== "production") {
    connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
}