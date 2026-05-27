/**
 * Task 5: Full-Stack Deployment & Project Architecture
 * Feature Set: Modular UI, Client-Side Routing Engine, Asset & Rendering Performance Optimizations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. GLOBAL CENTRAL APPLICATION STATE
    const APP_STATE = {
        currentView: 'home', // 'home' | 'catalog' | 'cart'
        products: [],
        cart: JSON.parse(localStorage.getItem('capstone_cart')) || [],
        loading: false
    };

    // Mock API Data Stream (Simulating an active cloud database delivery)
    const MOCK_DB_PRODUCTS = [
        { id: 'p1', name: 'Minimalist Mechanical Keyboard', price: 129, category: 'Tech', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=400&auto=format&fit=crop' },
        { id: 'p2', name: 'Ergonomic Wireless Mouse', price: 79, category: 'Tech', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400&auto=format&fit=crop' },
        { id: 'p3', name: 'Noise-Cancelling Headphones', price: 249, category: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' },
        { id: 'p4', name: 'Ultra-Wide Productivity Monitor', price: 449, category: 'Tech', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop' }
    ];

    // 2. DOM VIEWPORT MOUNT POINT
    const appRoot = document.getElementById('main-content') || document.body;

    // 3. CLIENT-SIDE ROUTING ENGINE (SPA Controller)
    function navigateTo(viewName) {
        APP_STATE.currentView = viewName;
        
        // Update URL hash state silently for browser history tracking
        window.location.hash = `/${viewName}`;
        
        renderApp();
    }

    // Handle browser back/forward buttons seamlessly
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#/', '');
        if (['home', 'catalog', 'cart'].includes(hash) && hash !== APP_STATE.currentView) {
            APP_STATE.currentView = hash;
            renderApp();
        }
    });

    // ==========================================================================
    // MODULAR COMPONENT GENERATORS (Views)
    // ==========================================================================

    // Component A: Hero Home Dashboard Layout
    function ViewHome() {
        return `
            <div class="view-fade-in text-center" style="padding: 3rem 1rem;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight:800;">Next-Gen Storefront</h1>
                <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem;">
                    Welcome to our highly optimized, lightning-fast E-commerce web catalog. Experience seamless client-side single-page interactions built for peak device performance.
                </p>
                <button class="btn route-trigger" data-target="catalog" style="font-size: 1.1rem; padding: 1rem 2rem;">
                    Browse Product Catalog
                </button>
            </div>
        `;
    }

    // Component B: Dynamic Catalog Engine with Performance Lazy-Loading
    function ViewCatalog() {
        if (APP_STATE.products.length === 0) {
            return `<p style="text-align:center; padding: 3rem;">Loading premium collection...</p>`;
        }

        const productCards = APP_STATE.products.map(product => `
            <article class="project-card product-item-card" style="display:flex; flex-direction:column; gap:1rem;">
                <img 
                    src="${product.img}" 
                    alt="${escapeHTML(product.name)}" 
                    loading="lazy" 
                    decoding="async"
                    style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-md);"
                >
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="tech-tag">${escapeHTML(product.category)}</span>
                    <strong style="color:var(--accent-color); font-size:1.25rem;">$${product.price}</strong>
                </div>
                <h3 style="font-size:1.2rem; margin:0;">${escapeHTML(product.name)}</h3>
                <button class="btn add-to-cart-btn" data-id="${product.id}" style="width:100%; margin-top:auto;">
                    Add to Cart
                </button>
            </article>
        `).join('');

        return `
            <div class="view-fade-in">
                <h2 style="margin-bottom: 2rem; font-size:2rem;">Premium Catalog Collection</h2>
                <div class="projects-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:2rem;">
                    ${productCards}
                </div>
            </div>
        `;
    }

    // Component C: Stateful Cart Evaluation View Matrix
    function ViewCart() {
        if (APP_STATE.cart.length === 0) {
            return `
                <div class="view-fade-in text-center" style="padding: 4rem 1rem;">
                    <p style="color:var(--text-muted); margin-bottom:1.5rem;">Your shopping cart is empty.</p>
                    <button class="btn route-trigger" data-target="catalog">Go to Catalog</button>
                </div>
            `;
        }

        const cartRows = APP_STATE.cart.map(item => {
            const product = APP_STATE.products.find(p => p.id === item.id) || {};
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding: 1rem 0;">
                    <div>
                        <h4 style="margin:0;">${escapeHTML(product.name || 'Unknown Product')}</h4>
                        <small style="color:var(--text-muted);">$${product.price} × ${item.quantity}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <strong>$${(product.price * item.quantity) || 0}</strong>
                        <button class="delete-btn remove-cart-item" data-id="${item.id}" style="color:#ef4444;" aria-label="Remove item">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const orderTotal = APP_STATE.cart.reduce((sum, item) => {
            const prod = APP_STATE.products.find(p => p.id === item.id);
            return sum + (prod ? prod.price * item.quantity : 0);
        }, 0);

        return `
            <div class="view-fade-in" style="max-width: 700px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem;">Your Shopping Summary</h2>
                <div style="background:var(--bg-secondary); padding:2rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                    ${cartRows}
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem; padding-top:1rem; border-top:2px solid var(--border-color);">
                        <span style="font-size:1.25rem; font-weight:700;">Total Balance:</span>
                        <span style="font-size:1.75rem; font-weight:800; color:var(--accent-color);">$${orderTotal}</span>
                    </div>
                    <button class="btn" id="checkout-stub-btn" style="width:100%; margin-top:2rem; padding:1rem;">
                        Proceed to Secure Checkout
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // RENDERING ENGINE & INTERACTION LOGIC
    // ==========================================================================
    function renderApp() {
        // Step 1: Selectively inject view architecture based on route state
        if (APP_STATE.currentView === 'home') {
            appRoot.innerHTML = ViewHome();
        } else if (APP_STATE.currentView === 'catalog') {
            appRoot.innerHTML = ViewCatalog();
        } else if (APP_STATE.currentView === 'cart') {
            appRoot.innerHTML = ViewCart();
        }

        // Update Nav Menu Indicator highlights globally across headers
        document.querySelectorAll('nav a').forEach(link => {
            const targetRoute = link.getAttribute('data-route');
            if (targetRoute === APP_STATE.currentView) {
                link.setAttribute('aria-current', 'page');
                link.style.color = 'var(--accent-color)';
            } else {
                link.removeAttribute('aria-current');
                link.style.color = '';
            }
        });
    }

    // High Performance Global Event Delegation Grid Layout Tracker
    document.body.addEventListener('click', (e) => {
        // SPA Link Interceptions
        if (e.target.classList.contains('route-trigger') || e.target.closest('[data-route]')) {
            const target = e.target.dataset.target || e.target.closest('[data-route]').dataset.route;
            if (target) {
                e.preventDefault();
                navigateTo(target);
            }
        }

        // Add item to shopping array logic
        if (e.target.classList.contains('add-to-cart-btn')) {
            const prodId = e.target.dataset.id;
            const existingItem = APP_STATE.cart.find(item => item.id === prodId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                APP_STATE.cart.push({ id: prodId, quantity: 1 });
            }
            
            localStorage.setItem('capstone_cart', JSON.stringify(APP_STATE.cart));
            alert('Item added to your shopping cart cart successfully!');
            renderApp();
        }

        // Remove item from shopping matrix completely
        if (e.target.classList.contains('remove-cart-item')) {
            const prodId = e.target.dataset.id;
            APP_STATE.cart = APP_STATE.cart.filter(item => item.id !== prodId);
            localStorage.setItem('capstone_cart', JSON.stringify(APP_STATE.cart));
            renderApp();
        }

        // Checkout Button Action
        if (e.target.id === 'checkout-stub-btn') {
            alert('Order simulated successfully! Thank you for testing the Capstone Web App pipeline.');
            APP_STATE.cart = [];
            localStorage.removeItem('capstone_cart');
            navigateTo('home');
        }
    });

    // Helper utilities
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
    }

    // Initialize application runtime state and simulate smooth asynchronous data hydration
    function initApplication() {
        APP_STATE.loading = true;
        setTimeout(() => {
            APP_STATE.products = MOCK_DB_PRODUCTS;
            APP_STATE.loading = false;
            
            // Sync up initial URL location paths cleanly
            const initialHash = window.location.hash.replace('#/', '');
            if (['home', 'catalog', 'cart'].includes(initialHash)) {
                APP_STATE.currentView = initialHash;
            }
            renderApp();
        }, 300); // Fast mock latency filter
    }

    initApplication();
});
