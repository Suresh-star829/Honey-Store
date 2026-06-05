// ═══════════════════════════════════════════════
//  GOLDENHIVE — Honey Store JavaScript
// ═══════════════════════════════════════════════

// ── PRODUCT DATA ──────────────────────────────
const products = [
  { id: 1, name: "Wildflower Honey",     emoji: "🌸", origin: "Coorg, Karnataka",       price: 549,  rating: 4.8, reviews: 312, category: "raw",       badge: "bestseller", weight: "500g" },
  { id: 2, name: "Acacia Honey",         emoji: "🌿", origin: "Himachal Pradesh",        price: 699,  rating: 4.9, reviews: 198, category: "raw",       badge: "organic",    weight: "500g" },
  { id: 3, name: "Turmeric Infused",     emoji: "💛", origin: "Nilgiri Hills",           price: 649,  rating: 4.7, reviews: 245, category: "infused",   badge: "",           weight: "250g" },
  { id: 4, name: "Cinnamon & Ginger",    emoji: "🟤", origin: "Spice Gardens, Kerala",   price: 599,  rating: 4.6, reviews: 167, category: "infused",   badge: "",           weight: "250g" },
  { id: 5, name: "Sidr (Wild Jujube)",   emoji: "🍯", origin: "Rajasthan Forests",       price: 1299, rating: 5.0, reviews: 89,  category: "specialty", badge: "organic",    weight: "500g" },
  { id: 6, name: "Manuka Style Honey",   emoji: "🌺", origin: "Ooty Highlands",          price: 999,  rating: 4.8, reviews: 134, category: "specialty", badge: "",           weight: "250g" },
  { id: 7, name: "Jamun Honey",          emoji: "🫐", origin: "Madhya Pradesh",          price: 749,  rating: 4.7, reviews: 203, category: "raw",       badge: "organic",    weight: "500g" },
  { id: 8, name: "Garlic Infused",       emoji: "🧄", origin: "Maharashtra",             price: 499,  rating: 4.5, reviews: 156, category: "infused",   badge: "",           weight: "250g" },
];

// ── STATE ──────────────────────────────────────
let cart = [];
let activeFilter = "all";

// ═══════════════════════════════════════════════
//  PRODUCT RENDERING
// ═══════════════════════════════════════════════

/**
 * Renders product cards into #productsGrid
 * @param {string} filter - "all" | "raw" | "infused" | "specialty"
 */
function renderProducts(filter) {
  const grid = document.getElementById("productsGrid");
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  grid.innerHTML = filtered
    .map((p) => {
      const starsFull = "★".repeat(Math.floor(p.rating));
      const starsHalf = p.rating % 1 >= 0.5 ? "½" : "";
      const stars = starsFull + starsHalf;

      const badgeHTML = p.badge
        ? `<div class="badge ${p.badge}">
             ${p.badge === "bestseller" ? "🔥 Bestseller" : "🌿 Organic"}
           </div>`
        : "";

      const inCart = cart.find((c) => c.id === p.id);

      return `
        <div class="product-card" data-id="${p.id}">
          <div class="product-img">
            ${p.emoji}
            ${badgeHTML}
          </div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-origin">📍 ${p.origin} · ${p.weight}</div>
            <div class="product-rating">
              <span class="stars">${stars}</span>
              <span class="rating-count">${p.rating} (${p.reviews})</span>
            </div>
            <div class="product-footer">
              <div class="product-price">₹${p.price}<span>/jar</span></div>
              <button
                class="add-btn ${inCart ? "added" : ""}"
                onclick="addToCart(${p.id})"
                title="Add to cart"
              >${inCart ? "✓" : "+"}</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

// ── FILTER PRODUCTS ────────────────────────────
/**
 * Filters displayed products and updates active button style
 * @param {string} cat - category string
 * @param {HTMLElement} btn - the clicked filter button
 */
function filterProducts(cat, btn) {
  activeFilter = cat;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(cat);
}

// ═══════════════════════════════════════════════
//  CART MANAGEMENT
// ═══════════════════════════════════════════════

/**
 * Adds a product to the cart or increments its quantity
 * @param {number} id - product id
 */
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  renderProducts(activeFilter);
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

/**
 * Increments or decrements item quantity; removes if qty reaches 0
 * @param {number} id - product id
 * @param {number} delta - +1 or -1
 */
function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }

  updateCartUI();
  renderProducts(activeFilter);
}

// ── UPDATE CART UI ─────────────────────────────
/**
 * Re-renders the cart drawer contents and updates the badge count
 */
function updateCartUI() {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = totalItems;

  const itemsEl = document.getElementById("cartItems");
  const footerEl = document.getElementById("cartFooter");

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-emoji">🍯</div>
        <p>Your cart is empty.<br>Discover our pure honey varieties!</p>
      </div>`;
    footerEl.style.display = "none";
    return;
  }

  // Render cart items
  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} · ${item.weight}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>`
    )
    .join("");

  // Calculate and display total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cartTotal").textContent =
    "₹" + cartTotal.toLocaleString("en-IN");
  footerEl.style.display = "block";
}

// ── TOGGLE CART DRAWER ─────────────────────────
/**
 * Opens or closes the cart sidebar drawer
 */
function toggleCart() {
  document.getElementById("cartOverlay").classList.toggle("open");
  document.getElementById("cartDrawer").classList.toggle("open");
}

// ── CHECKOUT ───────────────────────────────────
/**
 * Simulates order placement and clears the cart
 */
function checkout() {
  showToast("🎉 Order placed! Thank you for choosing GoldenHive.");
  cart = [];
  updateCartUI();
  toggleCart();
}

// ═══════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════

/**
 * Handles contact form submission
 * @param {Event} e - form submit event
 */
function submitForm(e) {
  e.preventDefault();
  showToast("✉️ Message sent! We'll get back to you soon.");
  e.target.reset();
}

// ═══════════════════════════════════════════════
//  TOAST NOTIFICATION
// ═══════════════════════════════════════════════

let toastTimer = null;

/**
 * Shows a temporary toast notification at the bottom of the screen
 * @param {string} msg - message to display
 * @param {number} duration - milliseconds to show (default 3000)
 */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");

  // Clear any existing timer to prevent overlap
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════

// Run on page load
renderProducts("all");
updateCartUI();