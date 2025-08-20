// Basic nav/cart helpers
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}
function setCart(items) { localStorage.setItem('cart', JSON.stringify(items)); updateCartCount(); }
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx >= 0) cart[idx].quantity += quantity;
  else cart.push({ productId, quantity });
  setCart(cart);
  alert('Added to cart!');
}
function updateQty(productId, qty) {
  qty = Math.max(1, Number(qty || 1));
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx >= 0) { cart[idx].quantity = qty; setCart(cart); }
}
function removeFromCart(productId) {
  setCart(getCart().filter(i => i.productId !== productId));
}
function clearCart() { setCart([]); }
function updateCartCount() {
  const count = getCart().reduce((a, b) => a + (b.quantity || 1), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = String(count);
}
function showMessage(msg, isError = false) {
  const el = document.getElementById('message');
  if (el) {
    el.className = 'alert' + (isError ? ' error' : '');
    el.textContent = msg;
  } else {
    alert(msg);
  }
}

// Auth-aware nav
function refreshNav() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const login = document.getElementById('nav-login');
  const reg = document.getElementById('nav-register');
  const out = document.getElementById('nav-logout');
  if (token && user) {
    if (login) login.style.display = 'none';
    if (reg) reg.style.display = 'none';
    if (out) out.style.display = 'inline';
    out.onclick = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); location.reload(); }
  } else {
    if (login) login.style.display = 'inline';
    if (reg) reg.style.display = 'inline';
    if (out) out.style.display = 'none';
  }
  updateCartCount();
}
document.addEventListener('DOMContentLoaded', refreshNav);
