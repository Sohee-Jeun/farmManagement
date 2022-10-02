function toggle() {
  const toggleBtn = document.querySelector(".navbar-toggleBtn");
  const menu = document.querySelector(".menuitems");
  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}
function loadEmployeeInfo() {
  return fetch("./data/data.json")
    .then((response) => response.json())
    .then((json) => json.employees);
}

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

function displayEmployeeInfo(employees) {
  const personalInfo = document.getElementById("personalInfo");
  personalInfo.innerHTML = employees
    .map((item) => createHTMLString(item))
    .join("");
}
function createHTMLString(item) {
  return `
    <tr> 
            <td rowspan="7" class="imgTable"><img src="${item.img}" class="item__thumbnail" ></td>
            <td >이름: ${item.name}</td>
           
          </tr>
          <tr>
            <td >생년월일: ${item.birth}</td>
          </tr>
          <tr>
            <td>외국인 등록번호: ${item.forignNum}</td>
          </tr>
          <tr>
            <td>고용일: ${item.hiredDate}</td>
          </tr>
          <tr>
            <td>계약기간: ${item.contractPeriod}년</td>
          </tr>
          <tr>
            <td>계약 종료일: ${item.endContract}</td>
          </tr>
          <tr>
            <td>월급날: 매월 ${item.payDate}일</td>
          </tr>
    `;
}
function employeeListClick(event, employees) {
  // const table = document.getElementById("paymentSheet");
  // table.innerHTML = ``;
  const dataset = event.target.dataset;
  const key = dataset.key;
  const value = dataset.value;

  if (key == null || value == null) {
    return;
  }
  displayEmployeeInfo(employees.filter((item) => item[key] === value));
  getpunchedInDatabase(value);
}

function setEventListeners(employees) {
  const buttons = document.querySelector(".employeeListBtns"); //이벤트의 위임
  buttons.addEventListener("click", (event) => {
    employeeListClick(event, employees);
  });
}

async function getpunchedInDatabase(name) {
  const table = document.getElementById("punchInDetails");
  table.innerHTML = `
  <thead></thead>`;
  const paymentBtn = document.querySelector(".paymentStatusBtn");
  const db = getFirestore();
  const q = query(collection(db, "users"), where("name", "==", name));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    table.innerHTML += `
    <tr>
    <td>${doc.data().workDate}</td>
    <td>${doc.data().hours}시간${doc.data().mins}분 </td>
    <td>${doc.data().dayOff}</td>
    </tr>
    `;
  });
  paymentBtn.addEventListener("click", () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    getPaymentDetails(name, startDate, endDate);
  });
}

async function getPaymentDetails(name, startDate, endDate) {
  const paymentSheet = document.getElementById("paymentSheet");
  paymentSheet.innerHTML = ``;
  const db = getFirestore();
  const q = query(
    collection(db, "users"),
    where("name", "==", name),
    where("workDate", ">=", startDate),
    where("workDate", "<=", endDate)
  );
  const querySnapshot = await getDocs(q);
  let monthArray = [...startDate];
  let month = monthArray.slice(0, 7).join("");
  let addHours = 0;
  let addMins = 0;
  let totalHours = 0;

  querySnapshot.forEach((doc) => {
    addHours += Number(doc.data().hours);
    addMins += Number(doc.data().mins);
  });
  totalHours = addHours + parseFloat(addMins / 60);
  paymentSheet.innerHTML = displaypaymentSheet(name, totalHours, month);
}

function nameToString(name) {
  let employeeName;
  if (name === "961201") {
    employeeName = "전소희";
  } else if (name == "980807") {
    employeeName = "전태원";
  }
  return employeeName;
}

function displaypaymentSheet(name, totalHours, month) {
  const paymentSheet = document.getElementById("paymentSheet");
  paymentSheet.innerHTML = ``;
  let [amountPaid, deduction, actualAmountPaid] = paymentCalc(totalHours);
  return `     
  <thead>
  <tr>
    <td scope='col' colspan='4' >${month} 급여명세서</td>
  </tr>
  <tr>
    <td colspan='4'>성명: ${nameToString(name)}</td>
    
  </tr>
  <tr>
    <td>지급항목</td>
    <td>지급액</td>
    <td>공제항목</td>
    <td>공제액</td>
  </tr>
</thead>
<tbody>
<tr>
<td>기본액</td>
<td>${amountPaid}</td>
<td>15%</td>
<td>${deduction}</td>
</tr>
</tbody>
<tfoot>
  <tr>
    <td>급여계</td>
    <td>${amountPaid}</td>
    <td>차감수령액</td>
    <td>${actualAmountPaid}</td>
  </tr>
</tfoot>
  `;
}

function paymentCalc(hours) {
  const wages = 9160;
  const amountPaid = hours * wages;
  const deduction = amountPaid * 0.15;
  const actualAmountPaid = amountPaid - deduction;
  const resultAmountPaid = amountPaid.toLocaleString("ko-KR", "KRW");
  const resultDeduction = deduction.toLocaleString("ko-KR", "KRW");
  const resultActualAmountPaid = actualAmountPaid.toLocaleString(
    "ko-KR",
    "KRW"
  );
  return [resultAmountPaid, resultDeduction, resultActualAmountPaid];
}
toggle();
loadEmployeeInfo()
  .then((employees) => {
    setEventListeners(employees);
  })
  .catch(console.log());
