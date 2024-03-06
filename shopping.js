document.addEventListener("DOMContentLoaded", function() {
    var shoppingCart = document.getElementById("cart");
    var shoppingList = document.getElementById("shoppingList");
    var quantityInputs = {};

    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

    function updateProductDetails() {
        for (var itemName in cartItems) {
            var item = cartItems[itemName];
            var productDetails = document.querySelector('[data-product-name="' + itemName + '"]');

            if (productDetails) {
                var inventoryCount = productDetails.getAttribute("data-inventory");
                var inventorySpan = productDetails.querySelector("#inventoryCount");

                // Update inventory count
                if (inventorySpan) {
                    inventorySpan.textContent = inventoryCount;

                    // Display warning if inventory is 3 or less
                    if (inventoryCount <= 3) {
                        inventorySpan.style.color = "red";
                        inventorySpan.textContent += " Only " + inventoryCount + " left!";
                    } else {
                        inventorySpan.style.color = ""; // Reset color
                    }
                }
            }
        }
    }


    function updateShoppingList() {
        var shoppingListContainer = document.getElementById("shoppingList");
        shoppingListContainer.innerHTML = "";
        
        function createQuantityInputEventListener(itemName) {
            return function(event) {
                var newQuantity = parseInt(event.target.value);
                updateQuantity(itemName, newQuantity);
                updateShoppingList();  // Update the shopping list when the quantity changes
            };
        }
        
        for (var itemName in cartItems) {
            var item = cartItems[itemName];
            var listItem = document.createElement("div");
            listItem.className = "product-entry";
    
            // Product information
            var productInfo = document.createElement("span");
            productInfo.innerHTML = item.name + " - $" + item.price.toFixed(2) + " x " + getTotalQuantity(itemName);
            listItem.appendChild(productInfo);
   

            // Quantity input
            var quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.placeholder = getTotalQuantity(itemName);
            quantityInput.value = getTotalQuantity(itemName);
            quantityInput.className = "quantity-input";
            quantityInput.dataset.itemName = itemName;
            quantityInput.addEventListener("input", createQuantityInputEventListener(itemName));
            listItem.appendChild(quantityInput);
    
            shoppingListContainer.appendChild(listItem);
        }
    
        if (Object.keys(cartItems).length > 0) {
            // Checkout button
            shoppingListContainer.innerHTML += "<button class='checkoutBtn' onclick='checkout()'>Checkout</button>";
        } else {
            // Empty message
            shoppingListContainer.innerHTML = "<p>Empty</p>";
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
    
    // Function to get the total quantity for a specific item
    function getTotalQuantity(itemName) {
        var item = cartItems[itemName];
        return quantityInputs[itemName] || item.quantity;
    }
    
    function updateQuantity(itemName, newQuantity) {
        quantityInputs[itemName] = newQuantity;
        updateShoppingList();
    }

    function addToCart(productContainer) {
        var productName = productContainer.getAttribute("data-product-name");
        var productPrice = parseFloat(productContainer.getAttribute("data-product-price"));

        if (cartItems.hasOwnProperty(productName)) {
            cartItems[productName].quantity++;
        } else {
            cartItems[productName] = { name: productName, price: productPrice, quantity: 1 };
        }
        updateShoppingList();
    }

    // Function to simulate checkout (you can replace this with actual PayPal integration)
    function checkout() {
        alert("Checkout button clicked. Implement PayPal integration here.");
        // Clear the cart after checkout
        cartItems = {};
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateShoppingList();
    }

    function clearShoppingCart() {
        // Clear the cart
        cartItems = {};
        updateShoppingList();
    }
    
    shoppingCart.addEventListener("mouseover", function(event) {
        updateShoppingList();
        shoppingCart.addEventListener("mouseover", function(event) {
            // Get mouse coordinates
            var mouseX = event.clientX;
            var mouseY = event.clientY;
    
            // Set the shopping list position
            shoppingList.style.display = "block";
            shoppingList.style.position = "fixed";
            shoppingList.style.top = mouseY + "px";
            shoppingList.style.left = mouseX + "px";
            updateShoppingList();
        });
    });

    shoppingList.addEventListener("mouseleave", function() {
        shoppingList.style.display = "none";
    });

    var clearButton = document.querySelector(".clearBtn");
    if (clearButton) {
        clearButton.addEventListener("click", function() {
            clearShoppingCart();
        });
    }

    var addToCartButtons = document.querySelectorAll(".addToCart");
    addToCartButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            var productContainer = event.target.closest(".product");
            addToCart(productContainer);
        });
    });
    updateProductDetails();
});

// Function to fetch categories from the server and populate the select element
function fetchCategories() {
    fetch('/')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('categorySelect');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.catid;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Function to fetch products by category from the server and populate the product list section
function fetchProducts(categoryId) {
    const productList = document.getElementById('productList');
    // Clear previous products
    productList.innerHTML = '';
    // Fetch products for the selected category
    fetch(`/products/${categoryId}`)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productElement = document.createElement('div');
                // Create product HTML elements based on retrieved data
                productElement.textContent = `${product.name} - $${product.price}`;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Fetch categories when the page loads
document.addEventListener('DOMContentLoaded', fetchCategories);
