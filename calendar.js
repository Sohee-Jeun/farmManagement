function toggle() {
  const toggleBtn = document.querySelector(".navbar-toggleBtn");
  const menu = document.querySelector(".menuitems");
  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}
toggle();
