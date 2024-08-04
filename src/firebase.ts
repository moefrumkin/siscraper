import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { Course, CourseDetailsQuery, Department, School, SearchQuery, Term } from "./lib/datatypes";

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

export const getSchools = httpsCallable<void, Array<School>>(firebaseFunctions, "getSchools")
export const getDepartments = httpsCallable<{school: string}, Array<Department>>(firebaseFunctions, "getDepartments")
export const getTerms = httpsCallable<void, Array<Term>>(firebaseFunctions, "getTerms")
export const searchCourses = httpsCallable<SearchQuery, Array<Course>>(firebaseFunctions, "searchCourses")
export const getCourseDetails = httpsCallable<CourseDetailsQuery, Course[]>(firebaseFunctions, "getCourseDetails")

if (process.env.NODE_ENV !== "production") {
    connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
}