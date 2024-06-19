/**
 * This is a compiled JS file.
 * Changes here could be overwritten. 
 * Contact your Shopify developers if changes need to be made.
 */

function add_to_cart_grid(variantid, qty) {
    var id = variantid;
    var q = qty;
    // After successfully adding to the cart, toggle the button state.
    toggleCartItemState(variantid, qty);
}

function toggleCartItemState(variantid, qty) {
    var cartItem = document.querySelector('.cart-offer-items .product-item[data-product-id="' + variantid + '"]');
    if (!cartItem) {
        return;
    }

    var btn = cartItem.querySelector('.cart-offer-atc');

    if (btn.classList.contains('item-remove')) {
        // If the item is in the "Remove" state, remove it from the cart.
        removeItemFromCart(variantid);
        document.dispatchEvent(new CustomEvent('cart:build'));
        // Otherwise, add it to the cart.
        btn.textContent = "Add";
        btn.classList.remove('item-remove');
    } else {
        addItemToCart(variantid, qty);
        // Otherwise, add it to the cart.
        btn.textContent = "Remove";
        btn.classList.add('item-remove');
    }
}

function addItemToCart(variantid, qty) {
    var id = variantid;
    var q = qty;
    var ajax = {
        type: "POST",
        url: "/cart/add.js",
        data: "quantity=" + q + "&id=" + id,
        dataType: "json",
        success: function (n) {
            var cart = new theme.CartDrawer;
            cart.init();
            cart.open();
        },
        error: function (n, c) {
            console.log('fail');
        }
    };
    jQuery.ajax(ajax);
}

// Function to remove an item from the cart
function removeItemFromCart(productSKU) {
        var ajax = {
            type: 'POST',
            url: '/cart/change.js',
            dataType: 'json',
            data: {
                id: parseFloat(productSKU),
                quantity: 0 // Set quantity to 0 to remove the item
            },
            success: function (data) {
                document.dispatchEvent(new CustomEvent('cart:build'));
            }
        };
        jQuery.ajax(ajax);
    }


// Define an array of product IDs you want to check for in the cart
var productIDsToCheck = ['46705214161179', '46705284808987', '46705277796635', '46705262362907','47135558304027','47138264547611','47051022336283','47026954043675','47050551820571','47050349052187'];

// Function to check cart item count and remove items if < 2
function checkCartTotalItems() {
    // Make an AJAX request to retrieve the cart item count
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/cart.js', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var cartData = JSON.parse(xhr.responseText);
            var cartItemTotal = cartData.item_count;
                // console.log("cartData",cartData);
            if (cartItemTotal <= 1) {
                var cartItem = document.querySelector('.cart-offer-items .product-item .cart-offer-atc.item-remove');
                if (cartItem) {
                    cartItem.click();
                }
                // Clear the entire cart
                // var xhrClear = new XMLHttpRequest();
                // xhrClear.open('POST', '/cart/clear.js', true);
                // xhrClear.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
                // xhrClear.send();
            }


        }
    };

    xhr.send();
}






// Add an event listener for page load
window.addEventListener('load', function () {
    // Call the checkCartTotalItems function when the page has loaded
    checkCartTotalItems();
});
// function to clear cart when there is no sell items left
function checkCartSellItems() {
    var xhrClear = new XMLHttpRequest();
    xhrClear.open('POST', '/cart/clear.js', true);
    xhrClear.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

    xhrClear.onload = function() {
        if (xhrClear.status === 200) {
            // Cart cleared successfully, you can add further handling here
            btn = document.querySelectorAll(".cart-offer-items .cart-offer-atc");
            btn.forEach(element => {
                element.innerHTML = "Add";
                element.classList.remove('item-remove');
            });
        } else {
            // Error handling
            console.error('Error clearing the cart: ' + xhrClear.status);
        }
    };
    xhrClear.send();
}

// listening for custom cart update event which is created in theme.js file
document.addEventListener('cart:updated', function(e) {
    // check for update event is called when items are removed
    if (e.detail.cart.items_removed.length > 0) {
        var upsellCount = document.querySelector('.drawer__contents .cart__items').getAttribute('data-upsell-count');
        var totalItemCount = document.querySelector('.drawer__contents .cart__items').getAttribute('data-count');
        var sellCount = totalItemCount - upsellCount;
        if (parseInt(sellCount) <= 1 && parseInt(upsellCount) >= 1) {
            checkCartSellItems(); // removing complete cart including upsell items if 1 non upsell item is in cart          
            var cart = new theme.CartDrawer;
            // refresh the cart after cart is clear
            cart.init();
        }
    }
});

