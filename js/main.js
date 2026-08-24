const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");

openBtn?.addEventListener("click", () => {
  mobileMenu.classList.add("is-open");
  document.body.style.overflow = "hidden"; 
});

closeBtn?.addEventListener("click", () => {
  mobileMenu.classList.remove("is-open");
  document.body.style.overflow = "";
});

// close when clocking outside
mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});



