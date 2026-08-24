document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("recipes-grid");
  const tabButtons = document.querySelectorAll(".tab-btn");
  let recipes = [];

  // Fetch JSON data dynamically
  try {
    const response = await fetch("./js/recipes.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    recipes = Array.isArray(data) ? data : data.recipes || [];
    renderRecipes("ALL");
  } catch (error) {
    console.error("Error fetching recipes:", error);
    if (grid) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef6453;">
        Unable to load recipes.json. Make sure the file exists in your project folder.
      </p>`;
    }
  }

  function renderRecipes(filterCategory) {
    if (!grid) return;

    const selectedTab = filterCategory.trim().toUpperCase();

    // 1. FILTER RECIPES
    const filtered = recipes.filter((recipe) => {
      if (selectedTab === "ALL") return true;

      let categories = [];
      if (Array.isArray(recipe.categories)) {
        categories = recipe.categories.map((c) => c.trim().toUpperCase());
      } else if (typeof recipe.category === "string") {
        categories = [recipe.category.trim().toUpperCase()];
      }

      if (selectedTab === "VEGAN") {
        return (
          recipe.isVegan === true ||
          categories.includes("VEGAN") ||
          (Array.isArray(recipe.badges) && recipe.badges.includes("VEGAN"))
        );
      }

      const cleanedTab = selectedTab.replace("!", "");
      return categories.some(
        (cat) => cat === selectedTab || cat.replace("!", "") === cleanedTab
      );
    });

    // 2. EMPTY STATE
    if (filtered.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #72706a; padding: 40px 0;">
        No recipes found under "${filterCategory}".
      </p>`;
      return;
    }

    // 3. RENDER ALL CARDS
    grid.innerHTML = filtered.map((recipe) => {
      const imageUrl = recipe.image || recipe.hero_image?.url || "";
      const recipeId = recipe.id || "";
      const title = recipe.title || "Untitled Recipe";
      const description = recipe.description || recipe.overview || "";
      const time = recipe.meta?.prep_time || recipe.time || recipe.prep_time || "";
      const difficulty = recipe.meta?.difficulty || recipe.difficulty || recipe.level || "";
      const serves = recipe.meta?.servings || recipe.serves || recipe.servings || "";
      const isVegan =
        recipe.isVegan ||
        (Array.isArray(recipe.badges) && recipe.badges.includes("VEGAN"));

      return `
        <div class="recipe-card" data-is-vegan="${isVegan}">
          <div class="image-wrapper">
            <img src="${imageUrl}" alt="${title}">
            <div class="vegan-badge">VEGAN</div>
          </div>
          <div class="card-body">
            <h2 class="card-title">${title}</h2>
            <p class="card-description">${description}</p>
            <div class="card-footer">
              <span class="meta-info">${[time, difficulty, serves].filter(Boolean).join(" - ")}</span>
              <a href="/recipe-detail.html?id=${recipeId}" class="view-btn">VIEW RECIPE</a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // 4. TOGGLE "has-more" CLASS FOR CSS CONTROL
    grid.classList.toggle("has-more", filtered.length > 4);
  }

  // Click event handlers for category tabs
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      grid.classList.remove("expanded");
      const activeBtn = document.getElementById("see-more-btn");
      if (activeBtn) activeBtn.textContent = "SEE MORE";

      const selectedCategory = btn.getAttribute("data-category");
      renderRecipes(selectedCategory);
    });
  });

  // Handle "See More" Click
  document.addEventListener("click", (e) => {
    if (e.target.matches("#see-more-btn")) {
      grid.classList.toggle("expanded");
      e.target.textContent = grid.classList.contains("expanded") ? "SEE LESS" : "SEE MORE";
    }
  });
  
});