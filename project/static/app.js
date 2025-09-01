// Main Application Logic for QR Food Ordering System

class FoodOrderingApp {
    constructor() {
        this.currentScreen = 'table-selection';
        this.currentTable = null;
        this.cart = [];
        this.currentOrder = null;
        this.currentUser = null;
        this.orderStatusInterval = null;
        this.isAdminMode = false;
        this.currentEditingItem = null;
        this.selectedRating = 0;
        this.socket = io();
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.loadCartFromStorage();
        this.checkUrlParams();
        this.setupSocketListeners();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                app.style.display = 'block';
                app.classList.add('fade-in');
            }, 500);
        }, 1500);
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const table = urlParams.get('table');
        
        if (table) {
            this.currentTable = parseInt(table);
            this.showScreen('menu-screen');
            this.updateTableDisplay();
            this.loadMenu();
        }
    }

    setupEventListeners() {
        // Table selection
        document.querySelectorAll('.table-card').forEach(card => {
            card.addEventListener('click', () => {
                const tableNumber = parseInt(card.dataset.table);
                this.selectTable(tableNumber);
            });
        });

        // Menu category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.filterMenu(category);
                
                // Update active button
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Cart functionality
        document.getElementById('cart-btn').addEventListener('click', () => this.toggleCart());
        document.getElementById('close-cart').addEventListener('click', () => this.closeCart());
        document.getElementById('cart-overlay').addEventListener('click', () => this.closeCart());
        document.getElementById('place-order').addEventListener('click', () => this.placeOrder());

        // Admin functionality
        document.getElementById('admin-btn').addEventListener('click', () => this.showAdminLogin());
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });
        document.getElementById('back-to-main').addEventListener('click', () => this.showScreen('table-selection'));
        document.getElementById('admin-logout').addEventListener('click', () => this.adminLogout());

        // Admin navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('disabled')) return;
                
                const section = btn.dataset.section;
                this.showAdminSection(section);
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Order status
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('menu-screen');
            this.loadMenu();
        });

        // Payment
        document.getElementById('pay-now-btn').addEventListener('click', () => this.showPaymentModal());
        
        // Payment modal
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => this.selectPaymentMethod(option.dataset.method));
        });
        
        document.getElementById('confirm-payment').addEventListener('click', () => this.processPayment());
        
        // Modal closing
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        document.getElementById('modal-overlay').addEventListener('click', () => this.closeModal());

        // Order filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterOrders(filter);
                
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Menu management
        document.getElementById('add-menu-item').addEventListener('click', () => this.showAddMenuItemModal());
        document.getElementById('save-menu-item').addEventListener('click', () => this.saveMenuItem());
        document.getElementById('menu-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMenuItem();
        });

        // Feedback system
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.addEventListener('click', () => this.setRating(parseInt(star.dataset.rating)));
            star.addEventListener('mouseover', () => this.highlightStars(parseInt(star.dataset.rating)));
        });
        
        document.querySelector('.star-rating').addEventListener('mouseleave', () => this.highlightStars(this.selectedRating));
        document.getElementById('submit-feedback').addEventListener('click', () => this.submitFeedback());
    }

    selectTable(tableNumber) {
        this.currentTable = tableNumber;
        this.showScreen('menu-screen');
        this.updateTableDisplay();
        this.loadMenu();
        this.showToast(`Welcome to Table ${tableNumber}!`);
    }

    updateTableDisplay() {
        const tableDisplay = document.getElementById('current-table');
        if (tableDisplay) {
            tableDisplay.textContent = `Table ${this.currentTable}`;
        }
    }

    loadMenu(category = 'all') {
        const menuContainer = document.getElementById('menu-items');
        const items = mockDataUtils.getMenuItemsByCategory(category);
        
        menuContainer.innerHTML = '';
        
        items.forEach(item => {
            const menuItemElement = this.createMenuItemElement(item);
            menuContainer.appendChild(menuItemElement);
        });
    }

    createMenuItemElement(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item fade-in';
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" loading="lazy">
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">₹${item.price}</span>
                    <button class="add-to-cart-btn" onclick="app.addToCart(${item.id})" ${!item.available ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                        ${item.available ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `;
        
        return menuItem;
    }

    filterMenu(category) {
        this.loadMenu(category);
    }

    addToCart(itemId) {
        const item = mockDataUtils.getMenuItemById(itemId);
        if (!item || !item.available) return;

        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: itemId,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.showToast(`${item.name} added to cart!`);
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const placeOrderBtn = document.getElementById('place-order');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartCount.textContent = totalItems;
        cartTotal.textContent = totalAmount;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <small>Add items from the menu to get started</small>
                </div>
            `;
            placeOrderBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const cartItemElement = this.createCartItemElement(item);
                cartItems.appendChild(cartItemElement);
            });
            placeOrderBtn.disabled = false;
        }
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="app.updateCartItemQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="app.updateCartItemQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        
        return cartItem;
    }

    updateCartItemQuantity(itemId, change) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.cart = this.cart.filter(cartItem => cartItem.id !== itemId);
        }
        
        this.updateCartDisplay();
        this.saveCartToStorage();
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        
        // Update cart display when opening
        this.updateCartDisplay();
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    }

    placeOrder() {
        if (this.cart.length === 0) return;
        
        const orderData = {
            table_number: this.currentTable,
            items: [...this.cart],
            total_amount: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
        
        this.socket.emit('place_order', orderData);
        
        // Clear cart
        this.cart = [];
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.closeCart();
        
        // Show order status
        this.showOrderStatus(orderData);
        this.showToast('Order placed successfully!');
    }

    showOrderStatus(order) {
        this.showScreen('order-status');
        
        document.getElementById('order-table').textContent = `Table ${order.tableNumber}`;
        document.getElementById('order-id').textContent = `Order #${order.id}`;
        
        // Update status tracker
        this.updateOrderStatusTracker(order.status);
        
        // Show order items
        const orderItemsContainer = document.getElementById('order-items');
        orderItemsContainer.innerHTML = '';
        
        order.items.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-qty">x${item.quantity}</span>
                </div>
                <span class="order-item-price">₹${item.price * item.quantity}</span>
            `;
            orderItemsContainer.appendChild(orderItem);
        });
        
        // Add total
        const totalItem = document.createElement('div');
        totalItem.className = 'order-item';
        totalItem.style.fontWeight = 'bold';
        totalItem.style.borderTop = '2px solid var(--tomato-red)';
        totalItem.style.marginTop = 'var(--spacing-md)';
        totalItem.style.paddingTop = 'var(--spacing-md)';
        totalItem.innerHTML = `
            <span>Total</span>
            <span class="order-item-price">₹${order.totalAmount}</span>
        `;
        orderItemsContainer.appendChild(totalItem);
        
        // Start order status monitoring
        this.startOrderStatusMonitoring(order.id);
    }

    updateOrderStatusTracker(status) {
        const steps = ['pending', 'accepted', 'cooking', 'ready', 'served'];
        const currentStepIndex = steps.indexOf(status);
        
        document.querySelectorAll('.status-step').forEach((step, index) => {
            if (index <= currentStepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Show pay button if served
        const payButton = document.getElementById('pay-now-btn');
        if (status === 'served') {
            payButton.style.display = 'flex';
        } else {
            payButton.style.display = 'none';
        }
    }

    startOrderStatusMonitoring(orderId) {
        this.orderStatusInterval = setInterval(() => {
            // In a real app, this would poll the server
            // Here we'll simulate status updates
            this.simulateOrderStatusUpdate(orderId);
        }, 5000); // Check every 5 seconds
    }

    simulateOrderStatusUpdate(orderId) {
        // This simulates receiving updates from the server
        const order = mockData.sampleOrders.find(o => o.id === orderId);
        if (order && this.currentOrder && this.currentOrder.id === orderId) {
            this.updateOrderStatusTracker(order.status);
            
            if (order.status === 'served') {
                clearInterval(this.orderStatusInterval);
                this.showToast('Your order is ready! Enjoy your meal!');
            }
        }
    }

    simulateRealTimeUpdates() {
        // Simulate status changes for demo purposes
        setInterval(() => {
            if (this.isAdminMode && document.getElementById('admin-orders').classList.contains('active')) {
                this.loadOrdersForAdmin();
            }
            
            // Simulate automatic order status progression
            mockData.sampleOrders.forEach(order => {
                const timeSinceOrder = Date.now() - order.timestamp.getTime();
                const minutesSinceOrder = Math.floor(timeSinceOrder / 60000);
                
                if (order.status === 'pending' && minutesSinceOrder > 2) {
                    order.status = 'accepted';
                } else if (order.status === 'accepted' && minutesSinceOrder > 5) {
                    order.status = 'cooking';
                } else if (order.status === 'cooking' && minutesSinceOrder > 15) {
                    order.status = 'ready';
                } else if (order.status === 'ready' && minutesSinceOrder > 20) {
                    order.status = 'served';
                }
            });
        }, 10000); // Update every 10 seconds
    }

    // Payment functionality
    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        const overlay = document.getElementById('modal-overlay');
        const paymentItems = document.getElementById('payment-items');
        const paymentTotal = document.getElementById('payment-total');
        
        // Populate payment items
        paymentItems.innerHTML = '';
        this.currentOrder.items.forEach(item => {
            const paymentItem = document.createElement('div');
            paymentItem.className = 'payment-item';
            paymentItem.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            `;
            paymentItems.appendChild(paymentItem);
        });
        
        paymentTotal.textContent = this.currentOrder.totalAmount;
        
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    selectPaymentMethod(method) {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelector(`[data-method="${method}"]`).classList.add('selected');
        document.getElementById('confirm-payment').disabled = false;
    }

    processPayment() {
        const selectedMethod = document.querySelector('.payment-option.selected');
        if (!selectedMethod) return;

        const confirmBtn = document.getElementById('confirm-payment');
        confirmBtn.textContent = 'Processing...';
        confirmBtn.disabled = true;

        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: this.currentOrder.id,
                amount: this.currentOrder.totalAmount,
                method: selectedMethod.dataset.method
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.closeModal();
                this.showToast('Payment successful! Thank you for dining with us!');
                setTimeout(() => {
                    this.showFeedbackModal();
                }, 1000);
            } else {
                this.showToast('Payment failed!', 'error');
                confirmBtn.textContent = 'Confirm Payment';
                confirmBtn.disabled = false;
            }
        });
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        const overlay = document.getElementById('modal-overlay');
        
        modals.forEach(modal => modal.classList.remove('active'));
        overlay.classList.remove('active');
        
        // Reset modal states
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.getElementById('confirm-payment').disabled = true;
        document.getElementById('confirm-payment').textContent = 'Confirm Payment';
        
        // Reset menu item form
        if (document.getElementById('menu-item-form')) {
            document.getElementById('menu-item-form').reset();
            this.currentEditingItem = null;
        }
    }

    // Admin functionality
    showAdminLogin() {
        this.showScreen('admin-login');
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        const user = mockDataUtils.validateAdmin(username, password);
        
        if (user) {
            this.currentUser = user;
            this.isAdminMode = true;
            this.showAdminDashboard();
            this.showToast(`Welcome, ${user.name}!`);
        } else {
            this.showToast('Invalid credentials!', 'error');
        }
    }

    showAdminDashboard() {
        this.showScreen('admin-dashboard');
        this.updateAdminProfile();
        this.setupAdminPermissions();
        this.showAdminSection('orders');
    }

    updateAdminProfile() {
        document.getElementById('admin-name').textContent = this.currentUser.name;
        document.getElementById('admin-role').textContent = this.currentUser.role;
    }

    setupAdminPermissions() {
        const menuNavBtn = document.getElementById('menu-nav-btn');
        const analyticsNavBtn = document.getElementById('analytics-nav-btn');
        
        if (!this.currentUser.permissions.includes('menu')) {
            menuNavBtn.classList.add('disabled');
        }
        
        if (!this.currentUser.permissions.includes('analytics')) {
            analyticsNavBtn.classList.add('disabled');
        }
    }

    showAdminSection(section) {
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`admin-${section}`).classList.add('active');
        
        switch (section) {
            case 'orders':
                this.loadOrdersForAdmin();
                break;
            case 'menu':
                if (this.currentUser.permissions.includes('menu')) {
                    this.loadMenuManagement();
                }
                break;
            case 'analytics':
                if (this.currentUser.permissions.includes('analytics')) {
                    this.loadAnalytics();
                }
                break;
        }
    }

    loadOrdersForAdmin() {
        const ordersContainer = document.getElementById('orders-list');
        const orders = mockData.sampleOrders;
        
        ordersContainer.innerHTML = '';
        
        orders.forEach(order => {
            const orderElement = this.createOrderCardElement(order);
            ordersContainer.appendChild(orderElement);
        });
    }

    createOrderCardElement(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const timeAgo = this.getTimeAgo(order.timestamp);
        
        orderCard.innerHTML = `
            <div class="order-header-info">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-table">Table ${order.tableNumber}</div>
                </div>
                <div>
                    <div class="order-time">${timeAgo}</div>
                    <div class="order-status ${order.status}">${order.status.toUpperCase()}</div>
                </div>
            </div>
            <div class="order-items-list">
                ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
            </div>
            <div style="margin-top: var(--spacing-md); font-weight: 600; color: var(--tomato-red);">
                Total: ₹${order.totalAmount}
            </div>
            <div class="order-actions-admin">
                ${this.generateOrderActionButtons(order)}
            </div>
        `;
        
        return orderCard;
    }

    generateOrderActionButtons(order) {
        const actions = [];
        
        switch (order.status) {
            case 'pending':
                actions.push(`<button class="action-btn accept" onclick="app.updateOrderStatus('${order.id}', 'accepted')">Accept</button>`);
                break;
            case 'accepted':
                actions.push(`<button class="action-btn cooking" onclick="app.updateOrderStatus('${order.id}', 'cooking')">Start Cooking</button>`);
                break;
            case 'cooking':
                actions.push(`<button class="action-btn ready" onclick="app.updateOrderStatus('${order.id}', 'ready')">Mark Ready</button>`);
                break;
            case 'ready':
                actions.push(`<button class="action-btn served" onclick="app.updateOrderStatus('${order.id}', 'served')">Mark Served</button>`);
                break;
        }
        
        return actions.join('');
    }

    updateOrderStatus(orderId, newStatus) {
        this.socket.emit('update_status', { order_id: orderId, status: newStatus });
    }

    filterOrders(filter) {
        const ordersContainer = document.getElementById('orders-list');
        const orders = mockDataUtils.getOrdersByStatus(filter);
        
        ordersContainer.innerHTML = '';
        
        orders.forEach(order => {
            const orderElement = this.createOrderCardElement(order);
            ordersContainer.appendChild(orderElement);
        });
    }

    loadMenuManagement() {
        const menuManagement = document.getElementById('menu-management');
        const allItems = mockDataUtils.getAllMenuItems();
        
        menuManagement.innerHTML = '';
        
        allItems.forEach(item => {
            const menuAdminItem = this.createMenuAdminItemElement(item);
            menuManagement.appendChild(menuAdminItem);
        });
    }

    createMenuAdminItemElement(item) {
        const menuAdminItem = document.createElement('div');
        menuAdminItem.className = 'menu-admin-item';
        
        menuAdminItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-admin-image">
            <div class="menu-admin-info">
                <div class="menu-admin-name">${item.name}</div>
                <div class="menu-admin-description">${item.description}</div>
                <div class="menu-admin-details">
                    <span class="menu-admin-price">₹${item.price}</span>
                    <span class="menu-admin-category">${item.category}</span>
                    <span class="menu-admin-status ${item.available ? 'available' : 'unavailable'}">
                        ${item.available ? 'Available' : 'Out of Stock'}
                    </span>
                </div>
            </div>
            <div class="menu-admin-actions">
                <button class="edit-btn" onclick="app.editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="toggle-btn ${item.available ? '' : 'unavailable'}" onclick="app.toggleMenuItem(${item.id})">
                    <i class="fas fa-toggle-${item.available ? 'on' : 'off'}"></i>
                    ${item.available ? 'Disable' : 'Enable'}
                </button>
                <button class="delete-btn" onclick="app.deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        return menuAdminItem;
    }

    showAddMenuItemModal() {
        this.currentEditingItem = null;
        document.getElementById('modal-item-name').textContent = 'Add Menu Item';
        document.getElementById('menu-item-form').reset();
        document.getElementById('item-available').checked = true;
        
        const modal = document.getElementById('menu-item-modal');
        const overlay = document.getElementById('modal-overlay');
        
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    editMenuItem(itemId) {
        const item = mockDataUtils.getMenuItemById(itemId);
        if (!item) return;
        
        this.currentEditingItem = item;
        document.getElementById('modal-item-name').textContent = 'Edit Menu Item';
        
        // Populate form
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-description').value = item.description;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-image').value = item.image;
        document.getElementById('item-prep-time').value = item.preparationTime;
        document.getElementById('item-available').checked = item.available;
        
        const modal = document.getElementById('menu-item-modal');
        const overlay = document.getElementById('modal-overlay');
        
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    saveMenuItem() {
        const formData = {
            name: document.getElementById('item-name').value,
            description: document.getElementById('item-description').value,
            price: parseInt(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            image: document.getElementById('item-image').value,
            preparationTime: parseInt(document.getElementById('item-prep-time').value),
            available: document.getElementById('item-available').checked
        };
        
        if (this.currentEditingItem) {
            // Update existing item
            mockDataUtils.updateMenuItem(this.currentEditingItem.id, formData);
            this.showToast('Menu item updated successfully!');
        } else {
            // Add new item
            mockDataUtils.addMenuItem(formData);
            this.showToast('Menu item added successfully!');
        }
        
        this.closeModal();
        this.loadMenuManagement();
    }

    toggleMenuItem(itemId) {
        mockDataUtils.toggleMenuItemAvailability(itemId);
        this.loadMenuManagement();
        this.showToast('Menu item availability updated!');
    }

    deleteMenuItem(itemId) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            mockDataUtils.deleteMenuItem(itemId);
            this.loadMenuManagement();
            this.showToast('Menu item deleted successfully!');
        }
    }

    loadAnalytics() {
        const analytics = mockDataUtils.getAnalytics();
        
        document.getElementById('total-orders').textContent = analytics.todayOrders;
        document.getElementById('total-revenue').textContent = `₹${analytics.todayRevenue}`;
        document.getElementById('avg-rating').textContent = analytics.averageRating;
        document.getElementById('avg-time').textContent = `${analytics.averagePreparationTime}m`;
        
        // Load popular items
        const popularItems = mockDataUtils.getPopularItems();
        const popularItemsContainer = document.getElementById('popular-items');
        
        popularItemsContainer.innerHTML = '';
        popularItems.forEach(item => {
            const popularItem = document.createElement('div');
            popularItem.className = 'popular-item';
            popularItem.innerHTML = `
                <span class="popular-item-name">${item.name}</span>
                <span class="popular-item-count">${item.count} orders</span>
            `;
            popularItemsContainer.appendChild(popularItem);
        });
    }

    adminLogout() {
        this.currentUser = null;
        this.isAdminMode = false;
        this.showScreen('table-selection');
        this.showToast('Logged out successfully!');
    }

    // Feedback functionality
    showFeedbackModal() {
        const modal = document.getElementById('feedback-modal');
        const overlay = document.getElementById('modal-overlay');
        
        this.selectedRating = 0;
        this.highlightStars(0);
        document.getElementById('feedback-comments').value = '';
        
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    setRating(rating) {
        this.selectedRating = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        document.querySelectorAll('.star-rating i').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    submitFeedback() {
        const comments = document.getElementById('feedback-comments').value;
        
        // In a real app, this would send feedback to the server
        console.log('Feedback submitted:', {
            rating: this.selectedRating,
            comments: comments,
            orderId: this.currentOrder?.id,
            tableNumber: this.currentTable
        });
        
        this.closeModal();
        this.showToast('Thank you for your feedback!');
        
        // Reset for new order
        setTimeout(() => {
            this.currentOrder = null;
            this.showScreen('table-selection');
            clearInterval(this.orderStatusInterval);
        }, 2000);
    }

    // Utility functions
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.style.background = 'var(--tomato-red)';
        } else {
            toast.style.background = 'var(--fresh-green)';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        if (minutes < 60) return `${minutes} minutes ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1 hour ago';
        return `${hours} hours ago`;
    }

    saveCartToStorage() {
        localStorage.setItem('foodOrderCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('foodOrderCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartDisplay();
        }
    }

    setupSocketListeners() {
        this.socket.on('new_order', (order) => {
            if (this.isAdminMode) {
                this.loadOrdersForAdmin();
            }
        });

        this.socket.on('status_updated', (data) => {
            if (this.currentOrder && this.currentOrder.id === data.order_id) {
                this.updateOrderStatusTracker(data.status);
            }
        });
    }
}
// Initialize the application
const app = new FoodOrderingApp();

// Handle page visibility for real-time updates
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && app.currentOrder) {
        // Refresh order status when page becomes visible
        if (app.currentScreen === 'order-status') {
            app.simulateOrderStatusUpdate(app.currentOrder.id);
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    app.showToast('Connection restored!');
});

window.addEventListener('offline', () => {
    app.showToast('You are offline. Some features may not work.', 'error');
});

// Service Worker registration for PWA capabilities (optional)
/* if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} */
