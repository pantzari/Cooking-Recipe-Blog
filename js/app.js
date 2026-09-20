/**
 * TASTY BITES / COOKS DELIGHT - Dynamic Recipe & Steps Renderer
 * Fetches data asynchronously from recipes.json
 */

let recipesList = [];

/**
 * Load recipes asynchronously from the external JSON file
 */
async function loadRecipesData() {
  try {
    const response = await fetch('./js/recipes.json');
    if (!response.ok) {
      throw new Error(`Failed to load recipes.json: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    recipesList = data.recipes || [];

    initApp();
  } catch (error) {
    console.error('Error fetching recipes.json:', error);
    const stepsContainer = document.getElementById('stepsContainer');
    if (stepsContainer) {
      stepsContainer.innerHTML = `
        <div style="padding: 20px; background: #ffebee; color: #c62828; border-radius: 8px;">
          <strong>Error loading recipes:</strong> ${error.message}.<br>
          <small>Make sure you are running via a local server (e.g. VS Code Live Server) so the browser allows loading local JSON files.</small>
        </div>
      `;
    }
  }
}

/**
 * Initialize the application once JSON is fetched
 */
function initApp() {
  const select = document.getElementById('recipeSelect');
  if (select) {
    select.innerHTML = '';
    // Populate the dropdown selector if it exists
    recipesList.forEach(recipe => {
      const option = document.createElement('option');
      option.value = recipe.id;
      option.textContent = recipe.title;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      selectRecipe(e.target.value, true);
    });
  }

  // 1. Check the URL for an ?id= parameter
  const urlParams = new URLSearchParams(window.location.search);
  const recipeIdFromUrl = urlParams.get('id');

  // 2. Find the requested recipe or fall back to the first one in the array
  const targetRecipe = recipesList.find(r => r.id === recipeIdFromUrl) || recipesList[0];

  if (targetRecipe) {
    renderRecipe(targetRecipe);
    if (select) {
      select.value = targetRecipe.id;
    }
  }
}

/**
 * Helper to select and switch recipes dynamically
 * @param {string} recipeId - The ID of the recipe to display
 * @param {boolean} updateUrl - Whether to update the browser's address bar history
 */
function selectRecipe(recipeId, updateUrl = true) {
  const found = recipesList.find(r => r.id === recipeId);
  if (!found) return;

  renderRecipe(found);

  const select = document.getElementById('recipeSelect');
  if (select) {
    select.value = recipeId;
  }

  // Update browser URL query parameter without full reload
  if (updateUrl) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('id', recipeId);
    window.history.pushState({ id: recipeId }, '', newUrl.toString());
  }

  // Smooth scroll back to top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * DYNAMIC STEPS RENDERER
 * Generates the step cards, titles, bullet instructions, and step images from JSON
 */
function renderRecipeSteps(steps) {
  const stepsContainer = document.getElementById('stepsContainer');
  if (!stepsContainer) return;

  if (!steps || steps.length === 0) {
    stepsContainer.innerHTML = '<p class="text-muted">No specific steps provided for this recipe.</p>';
    return;
  }

  const stepsHTML = steps.map((step, index) => {
    const stepNumber = index + 1;
    const title = step.step_title ? step.step_title.toUpperCase() : `STEP ${stepNumber}`;

    // Bullet instructions
    const instructionsList = (step.instructions || [])
      .map(instruction => `<li>${instruction}</li>`)
      .join('');

    // Step image if present
    const imageBlock = step.image && step.image.url ? `
      <div class="step-image-wrapper">
        <img src="${step.image.url}" alt="${step.image.alt || title}" loading="lazy" />
      </div>
    ` : '';

    return `
      <div class="step-card" data-step="${stepNumber}">
        <h3 class="step-title">STEP ${stepNumber}: ${title}</h3>
        <ul class="step-instructions">
          ${instructionsList}
        </ul>
        ${imageBlock}
      </div>
    `;
  }).join('');

  stepsContainer.innerHTML = stepsHTML;
}

/**
 * Render Complete Recipe Details into HTML elements
 */
function renderRecipe(recipe) {
  if (!recipe) return;

  // Title & Hero
  const titleEl = document.getElementById('recipeTitle');
  if (titleEl) titleEl.textContent = recipe.title;

  const subtitleEl = document.getElementById('recipeSubtitle');
  if (subtitleEl) subtitleEl.textContent = recipe.subtitle || recipe.description || '';

  const heroImg = document.getElementById('heroImage');
  if (heroImg && recipe.hero_image && recipe.hero_image.url) {
    heroImg.src = recipe.hero_image.url;
    heroImg.alt = recipe.hero_image.alt || recipe.title;
  }

  // Badges
  const badgesContainer = document.getElementById('recipeBadges');
  if (badgesContainer) {
    const allBadges = [...(recipe.badges || []), ...(recipe.categories || ['RECIPE'])];
    const displayBadges = [...new Set(allBadges)].filter(b => b !== 'ALL');
    badgesContainer.innerHTML = displayBadges.length > 0
      ? `<span class="badge-red">${displayBadges[0]}</span>`
      : `<span class="badge-red">FEATURED</span>`;
  }

  // Meta info bar
  const prepEl = document.getElementById('metaPrepTime');
  if (prepEl) prepEl.textContent = recipe.meta?.prep_time || '15 MIN';

  const diffEl = document.getElementById('metaDifficulty');
  if (diffEl) diffEl.textContent = recipe.meta?.difficulty || 'EASY PREP';

  const servEl = document.getElementById('metaServings');
  if (servEl) servEl.textContent = recipe.meta?.servings || '1 SERVE';

  // Introduction
  const introEl = document.getElementById('recipeIntro');
  if (introEl) {
    const introList = recipe.introduction && recipe.introduction.length > 0
      ? recipe.introduction
      : [recipe.description || ''];
    introEl.innerHTML = introList.map(p => `<p>${p}</p>`).join('');
  }

  // Dos & Don'ts Guide
  const guideEl = document.getElementById('recipeGuide');
  if (guideEl) {
    if (recipe.dos_and_donts) {
      const dos = (recipe.dos_and_donts.dos || []).map(item => `
        <div class="guide-item">
          <h4>DO: ${item.title}</h4>
          <p>${item.text}</p>
        </div>
      `).join('');

      const donts = (recipe.dos_and_donts.donts || []).map(item => `
        <div class="guide-item">
          <h4>DON'T: ${item.title}</h4>
          <p>${item.text}</p>
        </div>
      `).join('');

      guideEl.innerHTML = `
        <h3 class="guide-title">${recipe.dos_and_donts.title || "TIPS & TECHNIQUES"}</h3>
        ${dos}
        ${donts}
      `;
    } else {
      guideEl.innerHTML = '';
    }
  }

  // Instructions Overview
  const overviewEl = document.getElementById('instructionsOverview');
  if (overviewEl) overviewEl.textContent = recipe.instructions_overview || '';

  // Render Steps dynamically
  renderRecipeSteps(recipe.steps);

  // Pairing Suggestions
  const pairingEl = document.getElementById('pairingContainer');
  if (pairingEl) {
    if (recipe.pairing_suggestions) {
      const general = (recipe.pairing_suggestions.general || []).map(g => `<p>${g}</p>`).join('');
      const summary = recipe.pairing_suggestions.summary ? `<p><em>${recipe.pairing_suggestions.summary}</em></p>` : '';
      pairingEl.innerHTML = `
        <h4>PAIRING SUGGESTIONS</h4>
        ${general}
        ${summary}
      `;
      pairingEl.style.display = 'block';
    } else {
      pairingEl.style.display = 'none';
    }
  }

  // Tags
  const tagsEl = document.getElementById('recipeTags');
  if (tagsEl) {
    tagsEl.innerHTML = (recipe.categories || ['RECIPE'])
      .filter(c => c !== 'ALL')
      .map(cat => `<span class="tag-pill">${cat}</span>`)
      .join('');
  }

  // Author Card
  if (recipe.author) {
    const authorName = document.getElementById('authorName');
    if (authorName) authorName.textContent = recipe.author.name || 'Anonymous Chef';

    const authorBio = document.getElementById('authorBio');
    if (authorBio) authorBio.textContent = recipe.author.bio || 'Culinary enthusiast and recipe creator.';

    const authorAvatar = document.getElementById('authorAvatar');
    if (authorAvatar) {
      authorAvatar.src = recipe.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    }
  }

  // Sidebar: Ingredients
  const ingList = document.getElementById('ingredientsList');
  if (ingList) {
    ingList.innerHTML = (recipe.ingredients || [])
      .map(ing => `<li>${ing}</li>`)
      .join('');
  }

  // Sidebar: Equipment
  const eqList = document.getElementById('equipmentList');
  if (eqList) {
    eqList.innerHTML = (recipe.equipment_needed || ['Standard kitchenware'])
      .map(eq => `<li>${eq}</li>`)
      .join('');
  }

  // Sidebar: Nutritional Value
  if (recipe.nutritional_value) {
    const servingNote = document.getElementById('nutritionServing');
    if (servingNote) servingNote.textContent = recipe.nutritional_value.serving_note || '';

    const nutriCal = document.getElementById('nutriCalories');
    if (nutriCal) nutriCal.textContent = recipe.nutritional_value.calories || '--';

    const nutriProt = document.getElementById('nutriProtein');
    if (nutriProt) nutriProt.textContent = recipe.nutritional_value.protein || '--';

    const nutriFat = document.getElementById('nutriFat');
    if (nutriFat) nutriFat.textContent = recipe.nutritional_value.total_fat || '--';

    const nutriCarb = document.getElementById('nutriCarbs');
    if (nutriCarb) nutriCarb.textContent = recipe.nutritional_value.carbohydrates || '--';

    const nutriDisc = document.getElementById('nutritionDisclaimer');
    if (nutriDisc) nutriDisc.textContent = recipe.nutritional_value.disclaimer || 'NOTE: NUTRITIONAL VALUES ARE APPROXIMATE.';
  }

  // Optional: Update similar recipes if the container is present
  renderSimilarRecipes(recipe.id);
}

/**
 * Render Similar Recipe Cards (if container exists in DOM)
 */
function renderSimilarRecipes(currentRecipeId) {
  const container = document.getElementById('similarRecipesGrid');
  if (!container) return;

  const others = recipesList.filter(r => r.id !== currentRecipeId).slice(0, 2);

  container.innerHTML = others.map(item => `
    <div class="recipe-preview-card" onclick="selectRecipe('${item.id}', true)">
      <div class="card-img-wrap">
        <img src="${item.hero_image?.url}" alt="${item.title}" loading="lazy" />
        ${item.badges?.includes('VEGAN') ? '<span class="card-badge">VEGAN</span>' : ''}
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-footer">
          <span class="card-meta">${item.meta?.prep_time || '15 MIN'} • ${item.meta?.difficulty || 'EASY'}</span>
          <button class="btn btn-outline btn-sm">READ RECIPE</button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Global click interceptor:
 * Catches clicks on any "VIEW RECIPE" buttons or links with ?id=,
 * switching recipes dynamically without a full page reload.
 */
document.addEventListener('click', (e) => {
  const viewBtn = e.target.closest('.view-btn');
  if (viewBtn) {
    const href = viewBtn.getAttribute('href');
    if (href) {
      try {
        const url = new URL(href, window.location.href);
        const recipeId = url.searchParams.get('id');
        if (recipeId) {
          const targetRecipe = recipesList.find(r => r.id === recipeId);
          if (targetRecipe) {
            e.preventDefault();
            selectRecipe(recipeId, true);
          }
        }
      } catch (err) {
        console.error('Error handling recipe button click:', err);
      }
    }
  }
});

/**
 * Handle browser Back and Forward navigation
 */
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  const found = recipesList.find(r => r.id === recipeId) || recipesList[0];
  if (found) {
    renderRecipe(found);
    const select = document.getElementById('recipeSelect');
    if (select) select.value = found.id;
  }
});

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', loadRecipesData);