function onButtonClick() {
  const calendarBtn = document.querySelector(".calendar");
  const timeBtn = document.querySelector(".tm");
  const employeeBtn = document.querySelector(".employee");
  calendarBtn.addEventListener("click", () => {
    window.location = "./calendar.html";
  });
  timeBtn.addEventListener("click", () => {
    window.location = "./timeManagement.html";
  });
  employeeBtn.addEventListener("click", () => {
    window.location = "./employee.html";
  });
}
onButtonClick();
