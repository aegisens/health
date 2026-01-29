// ===== SHOPPING LIST GENERATOR =====

// Generate shopping list from selected recipes
function generateShoppingList() {
    const selectedRecipes = JSON.parse(localStorage.getItem('selectedRecipes') || '[]');
    
    if (selectedRecipes.length === 0) {
        alert('Please select at least one recipe first!');
        return;
    }
    
    // Get selected recipes data
    const recipes = allRecipes.filter(recipe => selectedRecipes.includes(recipe.id));
    
    // Generate categorized shopping list
    const shoppingList = categorizeIngredients(recipes);
    
    // Display preview
    displayShoppingListPreview(shoppingList);
    
    // Generate and download PDF
    generatePDF(shoppingList, recipes);
}

// Categorize ingredients by type
function categorizeIngredients(recipes) {
    const categories = {
        vegetables: [],
        proteins: [],
        dairy: [],
        grains: [],
        spices: [],
        other: []
    };
    
    // Keywords for categorization
    const vegKeywords = ['avocado', 'spinach', 'arugula', 'cilantro', 'parsley', 'garlic', 'sweet potato', 'tomato', 'onion', 'carrot', 'cucumber'];
    const proteinKeywords = ['egg', 'salmon', 'anchovies', 'boquerones', 'beans', 'chicken', 'tofu', 'lentil'];
    const dairyKeywords = ['yogurt', 'cheese', 'milk', 'butter'];
    const grainKeywords = ['bread', 'rice', 'quinoa', 'oats', 'pasta', 'nori'];
    const spiceKeywords = ['salt', 'pepper', 'paprika', 'cumin', 'cinnamon', 'chili', 'wasabi', 'ginger', 'vinegar', 'oil', 'soy sauce'];
    
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            const ingLower = ingredient.toLowerCase();
            let categorized = false;
            
            // Check each category
            for (const keyword of vegKeywords) {
                if (ingLower.includes(keyword)) {
                    categories.vegetables.push(ingredient);
                    categorized = true;
                    break;
                }
            }
            
            if (!categorized) {
                for (const keyword of proteinKeywords) {
                    if (ingLower.includes(keyword)) {
                        categories.proteins.push(ingredient);
                        categorized = true;
                        break;
                    }
                }
            }
            
            if (!categorized) {
                for (const keyword of dairyKeywords) {
                    if (ingLower.includes(keyword)) {
                        categories.dairy.push(ingredient);
                        categorized = true;
                        break;
                    }
                }
            }
            
            if (!categorized) {
                for (const keyword of grainKeywords) {
                    if (ingLower.includes(keyword)) {
                        categories.grains.push(ingredient);
                        categorized = true;
                        break;
                    }
                }
            }
            
            if (!categorized) {
                for (const keyword of spiceKeywords) {
                    if (ingLower.includes(keyword)) {
                        categories.spices.push(ingredient);
                        categorized = true;
                        break;
                    }
                }
            }
            
            if (!categorized) {
                categories.other.push(ingredient);
            }
        });
    });
    
    // Remove duplicates within each category
    Object.keys(categories).forEach(category => {
        categories[category] = [...new Set(categories[category])];
    });
    
    return categories;
}

// Display shopping list preview
function displayShoppingListPreview(shoppingList) {
	const previewContainer = document.getElementById('shoppingListPreview');
    
    let html = '<h4>Shopping List Preview</h4>';
    
    Object.entries(shoppingList).forEach(([category, items]) => {
        if (items.length > 0) {
            html += <div class="shopping-category">
                <h5>${category.toUpperCase()}</h5>
                <ul>;
            
            items.forEach(item => {
                html += <li>${item}</li>;
            });
            
            html += </ul></div>;
        }
    });
    
    previewContainer.innerHTML = html;
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// Generate and download PDF
function generatePDF(shoppingList, recipes) {
    // In a real app, this would generate an actual PDF
    // For demo, we'll create a downloadable text file
    
    let textContent = AEGISENS SHOPPING LIST\n;
    textContent += Generated on ${new Date().toLocaleDateString()}\n;
    textContent += =================================\n\n;
    
    // List selected recipes
    textContent += Selected Recipes:\n;
    recipes.forEach(recipe => {
        textContent += • ${recipe.title} (${recipe.subtitle})\n;
    });
    textContent += \n;
    
    // List ingredients by category
    textContent += SHOPPING LIST:\n;
    textContent += =================================\n;
    
    Object.entries(shoppingList).forEach(([category, items]) => {
        if (items.length > 0) {
            textContent += \n${category.toUpperCase()}:\n;
            items.forEach(item => {
                textContent += ☐ ${item}\n;
            });
        }
    });
    
    textContent += \n=================================\n;
    textContent += Tips:\n;
    textContent += • Buy organic when possible\n;
    textContent += • Check histamine levels if sensitive\n;
    textContent += • Store properly for maximum freshness\n;
    textContent += \nHappy cooking! 🍳\n;
    textContent += Aegisens - Health That Senses You;
    
    // Create downloadable file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = aegisens-shopping-list-${new Date().toISOString().split('T')[0]}.txt;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert(Shopping list downloaded! You selected ${recipes.length} recipe(s).\n\nFile name: ${a.download});
}

// Make function available globally
window.generateShoppingList = generateShoppingList;
