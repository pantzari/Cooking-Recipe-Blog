document.addEventListener("DOMContentLoaded", async () => {
  const swiperWrapper = document.querySelector(".mySwiper .swiper-wrapper");

  if (!swiperWrapper) return;

  try {
    const response = await fetch("./js/featured-recipes.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const recipes = await response.json();

    swiperWrapper.innerHTML = "";

    // Added index so every recipe has an ID fallback
    recipes.forEach((recipe, index) => {
      const isVegan = recipe.badges && recipe.badges.includes("VEGAN");
      const recipeId = recipe.id !== undefined ? recipe.id : (recipe._id !== undefined ? recipe._id : index + 1);

      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      // Exact structure from your #tabs .recipes-grid SCSS
      slide.innerHTML = `
        <div class="recipe-card" data-is-vegan="${isVegan}">
          <div class="image-wrapper">
            <img src="${recipe.hero_image.url}" alt="${recipe.hero_image.alt}">
            <div class="vegan-badge">VEGAN</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${recipe.title}</h3>
            <p class="card-description">${recipe.description}</p>
            <div class="card-footer">
              <span class="meta-info">${recipe.meta.prep_time} - ${recipe.meta.difficulty} - ${recipe.meta.servings}</span>
              <!-- NOW LEADS TO RECIPE-DETAILS WITH THE ID -->
              <a href="./recipe-details.html?id=${recipeId}" class="view-btn">VIEW RECIPE</a>
            </div>
          </div>
        </div>
      `;

      swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper
    new Swiper(".mySwiper", {
      observer: true,
      observeParents: true,
      slidesPerView: 2,
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
      },
    });
  } catch (error) {
    console.error("Failed to load featured recipes JSON:", error);
  }
});