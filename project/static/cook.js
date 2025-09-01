class CookDashboard {
    constructor() {
        this.socket = io();
        this.init();
    }

    init() {
        this.setupSocketListeners();
        this.loadOrders();
    }

    setupSocketListeners() {
        this.socket.on('new_order', (order) => {
            this.loadOrders();
        });
    }

    loadOrders() {
        fetch('/api/orders')
            .then(response => response.json())
            .then(orders => {
                const filteredOrders = orders.filter(order => order.status === 'pending' || order.status === 'cooking');
                this.renderOrders(filteredOrders);
            });
    }

    renderOrders(orders) {
        const ordersContainer = document.getElementById('orders-list');
        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const orderElement = this.createOrderCardElement(order);
            ordersContainer.appendChild(orderElement);
        });
    }

    createOrderCardElement(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        orderCard.innerHTML = `
            <div class="order-header-info">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-table">Table ${order.table_number}</div>
                </div>
                <div>
                    <div class="order-status ${order.status}">${order.status.toUpperCase()}</div>
                </div>
            </div>
            <div class="order-items-list">
                ${order.items}
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
                actions.push(`<button class="action-btn accept" onclick="app.updateOrderStatus(${order.id}, 'accepted')">Accept</button>`);
                break;
            case 'accepted':
                actions.push(`<button class="action-btn cooking" onclick="app.updateOrderStatus(${order.id}, 'cooking')">Start Cooking</button>`);
                break;
            case 'cooking':
                actions.push(`<button class="action-btn ready" onclick="app.updateOrderStatus(${order.id}, 'ready')">Mark Ready</button>`);
                break;
        }
        
        return actions.join('');
    }

    updateOrderStatus(orderId, newStatus) {
        this.socket.emit('update_status', { order_id: orderId, status: newStatus });
    }
}

const app = new CookDashboard();
