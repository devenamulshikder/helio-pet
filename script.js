// ========== CART FUNCTIONALITY ========== //
document.addEventListener("DOMContentLoaded", function () {
  // ----- DOM Elements ----- //
  const elements = {
    // Product Page Elements
    addToCartBtn: document.getElementById("add-to-cart"),
    cartNumber: document.getElementById("cart-number"),
    minusBtn: document.getElementById("minus"),
    plusBtn: document.getElementById("plus"),
    discountedPrice: document.querySelector(".current-price"),
    originalPrice: document.querySelector(".original-price"),

    // Cart Sidebar Elements
    cartSidebar: document.getElementById("cartSidebar"),
    cartOverlay: document.getElementById("cartOverlay"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartQuantity: document.getElementById("cartQuantity"),
    totalPrice: document.getElementById("totalPrice"),
    minusQty: document.getElementById("minusQty"),
    plusQty: document.getElementById("plusQty"),
    cartIcon: document.getElementById("cart-icon"),
    removeBtn: document.querySelector(".remove-btn"), // Add remove button
  };

  // ----- Constants ----- //
  const PRICE_PER_ITEM = 249.0;
  const ORIGINAL_PRICE = 369.0;
  const MAX_QUANTITY = 10;
  const MIN_QUANTITY = 1;

  // ----- Cart State ----- //
  let cart = {
    quantity: 1,
    price: PRICE_PER_ITEM,
    total: PRICE_PER_ITEM,
    original: ORIGINAL_PRICE,
    totalOriginal: ORIGINAL_PRICE,
  };

  // ----- Initialize Cart ----- //
  function initCart() {
    loadCartFromStorage();
    createCartBadge();
    updateAllDisplays();
    setupEventListeners();
    setupCartBadgeStyles();
  }

  // ----- LocalStorage Functions ----- //
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem("helioPetCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && typeof parsedCart.quantity === "number") {
          cart.quantity = Math.max(
            MIN_QUANTITY,
            Math.min(MAX_QUANTITY, parsedCart.quantity)
          );
          cart.total = cart.quantity * cart.price;
          cart.totalOriginal = cart.quantity * cart.original;
        }
      } catch (e) {
        console.error("Failed to parse cart data:", e);
      }
    }
    updateAllDisplays();
  }

  function saveCartToStorage() {
    localStorage.setItem("helioPetCart", JSON.stringify(cart));
  }

  function clearCartFromStorage() {
    localStorage.removeItem("helioPetCart");
  }

  // ----- Remove Item Functionality ----- //
  function removeCartItem() {
    // Reset cart to initial state
    cart = {
      quantity: 1,
      price: PRICE_PER_ITEM,
      total: PRICE_PER_ITEM,
      original: ORIGINAL_PRICE,
      totalOriginal: ORIGINAL_PRICE,
    };

    // Clear from storage
    clearCartFromStorage();

    // Update all displays
    updateAllDisplays();

    // Close the cart sidebar
    closeCart();
  }

  // ----- Display Updates ----- //
  function updateAllDisplays() {
    // Product Page
    if (elements.cartNumber) elements.cartNumber.textContent = cart.quantity;
    if (elements.discountedPrice)
      elements.discountedPrice.textContent = `$${cart.total.toFixed(2)}`;
    if (elements.originalPrice)
      elements.originalPrice.textContent = `$${cart.totalOriginal.toFixed(2)}`;

    // Cart Sidebar
    if (elements.cartQuantity)
      elements.cartQuantity.textContent = cart.quantity;
    if (elements.totalPrice)
      elements.totalPrice.textContent = cart.total.toFixed(2);

    // Cart Badge
    updateCartBadge();
  }

  // ----- Cart Badge ----- //
  function createCartBadge() {
    if (!elements.cartIcon) return;

    const existingBadge = elements.cartIcon.querySelector(".cart-badge");
    if (!existingBadge) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      elements.cartIcon.appendChild(badge);
    }
  }

  function updateCartBadge() {
    const badge = elements.cartIcon?.querySelector(".cart-badge");
    if (badge) {
      badge.textContent = cart.quantity;
      badge.style.display = cart.quantity > 0 ? "block" : "none";
    }
  }

  // ----- Quantity Handlers ----- //
  function handleQuantityChange(change, isFromSidebar = false) {
    const newQuantity = cart.quantity + change;

    if (newQuantity >= MIN_QUANTITY && newQuantity <= MAX_QUANTITY) {
      cart.quantity = newQuantity;
      cart.total = cart.quantity * cart.price;
      cart.totalOriginal = cart.quantity * cart.original;

      updateAllDisplays();
      saveCartToStorage();
    }
  }

  // ----- Cart Visibility ----- //
  function openCart() {
    if (elements.cartSidebar) elements.cartSidebar.classList.add("active");
    if (elements.cartOverlay) elements.cartOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    if (elements.cartSidebar) elements.cartSidebar.classList.remove("active");
    if (elements.cartOverlay) elements.cartOverlay.style.display = "none";
    document.body.style.overflow = "";
  }

  // ----- Event Listeners ----- //
  function setupEventListeners() {
    // Product Page Controls
    if (elements.plusBtn)
      elements.plusBtn.addEventListener("click", () => handleQuantityChange(1));
    if (elements.minusBtn)
      elements.minusBtn.addEventListener("click", () =>
        handleQuantityChange(-1)
      );

    // Cart Sidebar Controls
    if (elements.plusQty)
      elements.plusQty.addEventListener("click", (e) => {
        e.stopPropagation();
        handleQuantityChange(1, true);
      });
    if (elements.minusQty)
      elements.minusQty.addEventListener("click", (e) => {
        e.stopPropagation();
        handleQuantityChange(-1, true);
      });

    // Remove Button
    if (elements.removeBtn) {
      elements.removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeCartItem();
      });
    }

    // Cart Toggles
    if (elements.addToCartBtn)
      elements.addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openCart();
      });

    if (elements.cartIcon)
      elements.cartIcon.addEventListener("click", openCart);
    if (elements.closeCartBtn)
      elements.closeCartBtn.addEventListener("click", closeCart);

    // Overlay Click
    if (elements.cartOverlay) {
      elements.cartOverlay.addEventListener("click", (e) => {
        if (e.target === elements.cartOverlay) {
          closeCart();
        }
      });
    }
  }

  // ----- Dynamic Styles ----- //
  function setupCartBadgeStyles() {
    const styleId = "cart-badge-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .cart-badge {
          position: absolute;
          top: 20px;
          right: 190px;
          background-color: #ED4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Outfit", sans-serif;
        }
        .cart-icon {
          position: relative;
          display: inline-block;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #ED4444;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
        }
        .remove-btn:hover {
          color: #c0392b;
        }
      `;
      document.head.appendChild(style);
    }
  }

  initCart();
});
