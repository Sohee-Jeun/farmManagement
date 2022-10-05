"use strict";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD36FY7naMkZoSV-_vjz6j_KvPTrDMLlBg",
  authDomain: "farm-employee-management.firebaseapp.com",
  projectId: "farm-employee-management",
  storageBucket: "farm-employee-management.appspot.com",
  messagingSenderId: "375892594246",
  appId: "1:375892594246:web:102b3eb83169e8545bc447",
  measurementId: "G-ZSRWL3RCS9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function getEmployeeName() {
  const employeeName = document.getElementsByName("employeeName");
  let result;
  for (let i = 0; i < employeeName.length; i++) {
    if (employeeName[i].checked) {
      result = employeeName[i].value;
    }
  }
  return result;
}

function selectDayOff() {
  const dayOff = document.getElementById("dayOff");
  const reason = document.getElementById("dayOffReason");
  reason.style.visibility = "hidden";
  let result = reason.value;
  dayOff.addEventListener("change", () => {
    if (dayOff.checked) {
      reason.style.visibility = "visible";
      result;
    } else {
      reason.style.visibility = "hidden";
    }
  });
  return result;
}
function onSaveBtnClick() {
  const workDate = document.getElementById("workDate");
  const punchedHour = document.getElementById("punchedHours");
  const punchedMins = document.getElementById("punchedMins");
  const dayOffReason = document.getElementById("dayOffReason");
  const saveBtn = document.getElementById("save");
  const db = getFirestore();

  saveBtn.addEventListener("click", () => {
    setDoc(doc(db, "users", `${getEmployeeName()},${workDate.value}`), {
      name: getEmployeeName(),
      workDate: workDate.value,
      hours: punchedHour.value,
      mins: punchedMins.value,
      dayOff: dayOffReason.value,
    });
    const name = getEmployeeName();
    showConfirmMessage(db, name);
    console.log("all set");
  });
}

async function showConfirmMessage(db, employeeName) {
  const confirmSection = document.querySelector(".confirmSection");
  const q = query(collection(db, "users"), where("name", "==", employeeName));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let nameString;
    if (doc.data().name === "920817") {
      nameString = "르 페어론";
    } else if (doc.data().name === "980203") {
      nameString = "폰 패니";
    } else if (doc.data().name === "990613") {
      nameString = "태이 터엉";
    }
    confirmSection.innerHTML = `
        <span class="confirm employeeName">이름: ${nameString}</span>
        <span class="confirm WorkDate">날짜: ${doc.data().workDate}</span>
        <span class="confirm punchedHours">일한시간: ${doc.data().hours}시간 ${
      doc.data().mins
    }분</span>
        <span class="confirm dayOffReason">휴무사유: ${doc.data().dayOff}</span>
        <div class="confirmSign"> <i class="fa fa-solid fa-check"></i></div>
        <p class="confirmMsg">데이터가 저장되었습니다.</p>
      `;
  });
}
function toggle() {
  const toggleBtn = document.querySelector(".navbar-toggleBtn");
  const menu = document.querySelector(".menuitems");
  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}
toggle();
selectDayOff();
onSaveBtnClick();
