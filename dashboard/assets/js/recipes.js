// ===== RECIPES MANAGEMENT =====
let allRecipes = [];
let filteredRecipes = [];
let activeFilter = 'all';

// Load recipes from JSON
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        const data = await response.json();
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];
        
        // Initialize filters and display
        initFilters();
        displayRecipes();
        updateSelectedCount();
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.getElementById('recipesGrid').innerHTML = 
            '<p class="error-message">Could not load recipes. Please check the recipes.json file.</p>';
    }
}

// Initialize filter buttons
function initFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    const uniqueTwists = [...new Set(allRecipes.map(r => r.twist.name))];
    
    // Add "All" filter
    const allFilter = createFilterButton('All', 'all', '🌿');
    filtersContainer.appendChild(allFilter);
    
    // Add twist filters
    uniqueTwists.forEach(twistName => {
        const recipe = allRecipes.find(r => r.twist.name === twistName);
        const filterBtn = createFilterButton(twistName, twistName, recipe.twist.icon);
        filtersContainer.appendChild(filterBtn);
    });
    
    // Set "All" as active by default
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
}

// Create a filter button
function createFilterButton(name, filter, icon) {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.setAttribute('data-filter', filter);
    button.innerHTML = ${icon} ${name};
    
    button.addEventListener('click', function() {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter recipes
        activeFilter = filter;
        if (filter === 'all') {
            filteredRecipes = [...allRecipes];
        } else {
            filteredRecipes = allRecipes.filter(recipe => recipe.twist.name === filter);
        }
        
        // Display filtered recipes
        displayRecipes();
    });
    
    return button;
}

// Display recipes in the grid
function displayRecipes() {
    const recipesGrid = document.getElementById('recipesGrid');
    recipesGrid.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipesGrid.appendChild(recipeCard);
    });
    
    // If no recipes match filter
    if (filteredRecipes.length === 0) {
        recipesGrid.innerHTML = 
            <div class="no-recipes">
                <p>No recipes found for this filter.</p>
                <button class="btn-secondary" onclick="document.querySelector('[data-filter=\"all\"]').click()">
                    Show All Recipes
                </button>
            </div>
        ;
    }
}

// Create a recipe card element
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-id', recipe.id);
    
    // Check if previously selected
    const selectedRecipes = JSON.parse(localStorage.getItem('selectedRecipes') || '[]');
    if (selectedRecipes.includes(recipe.id)) {
        card.classList.add('selected');
    }
    
    // Format tags
    const tagsHtml = recipe.tags.map(tag => 
        <span class="recipe-tag">${tag}</span>
    ).join('');
    
    // Format ingredients preview (first 2)
    const ingredientsPreview = recipe.ingredients.slice(0, 2).join(', ') + '...';
    
    card.innerHTML = `
        <div class="recipe-select" onclick="toggleRecipeSelection(${recipe.id}, this)"></div>
		<div class="recipe-card-header">
            <div class="recipe-title">${recipe.title}</div>
            <div class="recipe-twist">${recipe.twist.icon} ${recipe.twist.name}</div>
        </div>
        <div class="recipe-subtitle">${recipe.subtitle}</div>
        <div class="recipe-meta">
            <span>${recipe.calories} kcal</span>
            <span>•</span>
            <span>${recipe.time} min</span>
            <span>•</span>
            <span>Histamine: ${recipe.histamine_level}</span>
        </div>
        <div class="recipe-tags">${tagsHtml}</div>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-ingredients-preview">
            <small>${ingredientsPreview}</small>
        </div>
        <div class="recipe-story" style="display: none;">
            <p><strong>Story:</strong> ${recipe.story}</p>
            <p><strong>Benefits:</strong> ${recipe.benefits}</p>
        </div>
        <div class="recipe-actions">
            <button class="btn-small" onclick="toggleRecipeDetails(this)">Details</button>
            ${recipe.reel_url !== '#' ? 
                <a href="${recipe.reel_url}" target="_blank" class="btn-small btn-outline">Watch Reel</a> : 
                <button class="btn-small btn-outline" onclick="alert('Reel coming soon!')">Watch Reel</button>
            }
        </div>
    `;
    
    // Click anywhere on card toggles selection (except buttons)
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button') && !e.target.closest('.recipe-select')) {
            toggleRecipeSelection(recipe.id, this.querySelector('.recipe-select'));
        }
    });
    
    return card;
}

// Toggle recipe selection
function toggleRecipeSelection(recipeId, selectElement) {
    const card = selectElement.closest('.recipe-card');
    card.classList.toggle('selected');
    
    // Update localStorage
    let selectedRecipes = JSON.parse(localStorage.getItem('selectedRecipes') || '[]');
    if (card.classList.contains('selected')) {
        if (!selectedRecipes.includes(recipeId)) {
            selectedRecipes.push(recipeId);
        }
    } else {
        selectedRecipes = selectedRecipes.filter(id => id !== recipeId);
    }
    localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));
    
    // Update selected count
    updateSelectedCount();
    
    // Visual feedback
    selectElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        selectElement.style.transform = 'scale(1)';
    }, 200);
}

// Toggle recipe details
function toggleRecipeDetails(button) {
    const card = button.closest('.recipe-card');
    const storyDiv = card.querySelector('.recipe-story');
    const isHidden = storyDiv.style.display === 'none';
    
    storyDiv.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Hide Details' : 'Details';
    
    // Scroll into view if opening
    if (isHidden) {
        storyDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Update selected count display
function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.recipe-card.selected').length;
    if (document.getElementById('selectedCount')) {
        document.getElementById('selectedCount').textContent = selectedCount;
    }
    if (document.getElementById('generateListBtn')) {
        document.getElementById('generateListBtn').disabled = selectedCount === 0;
    }
}

// Shuffle recipes display
function shuffleRecipesDisplay() {
    // Shuffle array using Fisher-Yates algorithm
    for (let i = filteredRecipes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredRecipes[i], filteredRecipes[j]] = [filteredRecipes[j], filteredRecipes[i]];
    }
    
    displayRecipes();
    
    // Visual feedback
    const shuffleBtn = document.getElementById('shuffleRecipes');
    shuffleBtn.textContent = '🎲 Shuffled!';
    setTimeout(() => {
        shuffleBtn.textContent = '🎲 Shuffle';
    }, 1000);
}
// Clear all selections
function clearSelections() {
    document.querySelectorAll('.recipe-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    localStorage.removeItem('selectedRecipes');
    updateSelectedCount();
    
    // Visual feedback
    const clearBtn = document.querySelector('[onclick="clearSelections()"]');
    const originalText = clearBtn.textContent;
    clearBtn.textContent = 'Cleared!';
    setTimeout(() => {
        clearBtn.textContent = originalText;
    }, 1000);
}

// Make functions available globally
window.loadRecipes = loadRecipes;
window.shuffleRecipesDisplay = shuffleRecipesDisplay;
window.toggleRecipeSelection = toggleRecipeSelection;
window.toggleRecipeDetails = toggleRecipeDetails;
window.clearSelections = clearSelections;
window.updateSelectedCount = updateSelectedCount;
