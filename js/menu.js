// Sample Food Data
const foodItems = [
    {
        id: 1,
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, and tomatoes.",
        price: "$8.99",
        category: "main dish",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Caesar Salad",
        description: "Crisp romaine, parmesan cheese, croutons, and Caesar dressing.",
        price: "$6.50",
        category: "salad",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Iced Lemon Tea",
        description: "Refreshing cold tea with freshly squeezed lemon juice.",
        price: "$3.00",
        category: "beverage",
        image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Mozzarella Sticks",
        description: "Deep-fried breaded cheese sticks with marinara sauce.",
        price: "$5.99",
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1531749668029-2be01df71fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil.",
        price: "$12.99",
        category: "main dish",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey molten center.",
        price: "$7.50",
        category: "dessert",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        name: "Mango Smoothie",
        description: "Blended fresh ripe mangoes with yogurt and honey.",
        price: "$4.50",
        category: "beverage",
        image: "https://images.unsplash.com/photo-1546892697-39b1a0e05232?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 8,
        name: "Chicken Wings",
        description: "Spicy buffalo wings served with creamy ranch dip.",
        price: "$9.99",
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// DOM Elements
const menuGrid = document.getElementById("menu-grid");
const categoryFilters = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");

// Function to create a food card HTML string
function generateFoodCard(food) {
    return `
        <div class="food-card" data-category="${food.category}">
            <div class="card-img-container">
                <img src="${food.image}" alt="${food.name}">
            </div>
            <div class="card-info">
                <h3 class="card-title">${food.name}</h3>
                <p class="card-desc">${food.description}</p>
                <div class="card-footer">
                    <span class="card-price">${food.price}</span>
                    <button class="add-btn" onclick="addToCart(${food.id})">Add +</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render items to the grid
function renderMenuItems(items) {
    menuGrid.innerHTML = items.map(generateFoodCard).join('');
    
    // Show a message if no items match
    if (items.length === 0) {
        menuGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #777; padding: 40px;">No items found matching your criteria.</div>`;
    }
}

// Initial Render
renderMenuItems(foodItems);

// Filter by Category Logic
categoryFilters.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all buttons
        categoryFilters.forEach(f => f.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");
        
        const filterVal = btn.getAttribute("data-filter");
        
        // Filter the array
        if (filterVal === "all") {
            renderMenuItems(foodItems);
        } else {
            const filtered = foodItems.filter(item => item.category === filterVal);
            renderMenuItems(filtered);
        }
        
        // Clear search input when filtering by category
        searchInput.value = '';
    });
});

// Search Logic
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Also reset categories to "All" when searching
    categoryFilters.forEach(f => f.classList.remove("active"));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");
    
    if (searchTerm === "") {
        renderMenuItems(foodItems);
    } else {
        const searchedItems = foodItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        renderMenuItems(searchedItems);
    }
});

// Add to cart functionality using local storage
function addToCart(foodId) {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.id === foodId);
    
    // Convert price string (e.g., "$8.99") to number
    const priceNum = parseFloat(food.price.replace(/[^0-9.-]+/g,""));

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: priceNum,
            qty: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Automatically open the cart
    //openCart();
    
    // Trigger update in cart iframe
    const cartFrame = document.getElementById('cart-frame');
    if (cartFrame && cartFrame.contentWindow) {
        const event = new Event('cartUpdated');
        cartFrame.contentWindow.dispatchEvent(event);
    }
    updateCartBadge();
}

// Global cart badge updater and cart controls
function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function openCart() {
    const cartFrame = document.getElementById('cart-frame');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartFrame) cartFrame.style.right = '0';
    if (cartOverlay) cartOverlay.style.display = 'block';
}

function closeCart() {
    const cartFrame = document.getElementById('cart-frame');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartFrame) cartFrame.style.right = '-400px';
    if (cartOverlay) cartOverlay.style.display = 'none';
}

// Update cart badge right away on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

// Listen for messages from the cart iframe (avoid local CORS issues)
window.addEventListener('message', (event) => {
    if (event.data === 'closeCart') {
        closeCart();
    } else if (event.data === 'updateCartBadge') {
        updateCartBadge();
    }
});
