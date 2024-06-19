  window.addEventListener('load', ()=>{
      const variants = document.getElementsByClassName('variant');
      const atcBtn = document.getElementById('atc-btn');
      var variantId= 47667557826843 ;   
// Define an array of product IDs you want to check for in the cart
var productIDsToCheck = ['47667557826843', '47667557859611', '47667557892379', '47667557925147','47667557957915','47667557990683','47667558023451','47667558056219','47667558088987','47667558121755','47667558154523','47667558187291'];
     //selected option value 
    for( let i =0;i < variants.length ;i++) { 
        variants[i].addEventListener('click', (e) => {
            for (let sibling of variants[i].parentNode.children) {
                 sibling.classList.remove('selected');
            }
            variants[i].classList.toggle('selected');
            variantId =  variants[i].getAttribute('data-value');
        });
    }
       //add custom gift to cart
     atcBtn.addEventListener('click', function () {
     
    let found = productIDsToCheck.find((id) => id == variantId);
    if(found){
     Counter("increment");
      if(count>1){
        q =0;
      }
      else{
        q=1;
      }
    }
        addItemToCart(variantId, q);
    });  
function addItemToCart(variantid, q) {
    var id = variantid;
    var q = q; 
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

});

// function to clear cart when there is no sell items left
function checkCartSellItems() {
    var xhrClear = new XMLHttpRequest();
    xhrClear.open('POST', '/cart/clear.js', true);
    xhrClear.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

    xhrClear.onload = function() {
        if (xhrClear.status === 200) {
            // Cart cleared successfully, you can add further handling here
            btn = document.querySelectorAll(".custom-gift-wrapper .cart-offer-atc");
            btn.forEach(element => {
                element.innerHTML = "Select";
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
        const TotalPrice = e.detail.cart.original_total_price /100;
        var giftId = document.querySelector('.drawer__contents .cart__items').getAttribute('data-gift-id');
        var upsellCount = document.querySelector('.drawer__contents .cart__items').getAttribute('data-upsell-count');
        var totalItemCount = document.querySelector('.drawer__contents .cart__items').getAttribute('data-count');
        var sellCount = totalItemCount - upsellCount;
        const cartLength = e.detail.cart.items_removed.length;
    if(upsellCount){
      let count;
        Counter("decrement");
    }

  if((TotalPrice < 699) ){
    if(upsellCount){
       removeItemFromCart(giftId);
      }
     var cartItem = document.querySelector('.custom-gift-wrapper');
      var btn = cartItem.querySelector('.custom-gift-wrapper .cart-offer-atc');
    if (btn.classList.contains('item-remove')) {
        // If the item is in the "Remove" state, remove it from the cart.
        document.dispatchEvent(new CustomEvent('cart:build'));
        // Otherwise, add it to the cart.
        btn.textContent = "Select";
        btn.classList.remove('item-remove');
    } 
  }
    if (cartLength > 0) {  
        if (parseInt(sellCount) <= 1 && parseInt(upsellCount) >= 1 || (TotalPrice == 0) ) {
            checkCartSellItems(); // removing complete cart including upsell items if 1 non upsell item is in cart          
            var cart = new theme.CartDrawer;
            // refresh the cart after cart is clear
            cart.init();
        }
    }
});

      var  count=0 ;

function Counter(data) {
    if(data=="increment"){
   return  count++;
  }
 else if(data=="decrement"){
    return  count=0;
  }
  }