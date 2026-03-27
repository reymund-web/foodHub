// js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total p');
    const closeBtn = document.querySelector('.close-btn');

    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is currently empty.</div>';
            cartTotalElement.textContent = '$0.00';
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})"><i class="fa fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    window.updateQty = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart[index].qty += change;
            if (cart[index].qty <= 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            // Send postMessage to parent if inside iframe
            if (window.parent) {
                window.parent.postMessage('updateCartBadge', '*');
            }
        }
    };

    window.removeItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        // Send postMessage to parent if inside iframe
        if (window.parent) {
            window.parent.postMessage('updateCartBadge', '*');
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Send postMessage to parent window to handle local filesystem CORS
            if (window.parent) {
                window.parent.postMessage('closeCart', '*');
            }
        });
    }

    // Listen to changes from other tabs/windows or parent frame
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            renderCart();
        }
    });

    // Custom event to trigger re-render from parent window
    window.addEventListener('cartUpdated', () => {
        renderCart();
    });

    renderCart();
});
