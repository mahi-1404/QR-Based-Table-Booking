// Mock Data for the Food Ordering Application
const mockData = {
    // Menu Categories and Items
    menuItems: [
        {
            id: 1,
            name: "Margherita Pizza",
            description: "Fresh tomato sauce, mozzarella cheese, and basil leaves",
            price: 299,
            category: "mains",
            image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 15
        },
        {
            id: 2,
            name: "Chicken Tikka Masala",
            description: "Tender chicken in creamy tomato curry with aromatic spices",
            price: 349,
            category: "mains",
            image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 25
        },
        {
            id: 3,
            name: "Caesar Salad",
            description: "Crisp romaine lettuce with parmesan, croutons and caesar dressing",
            price: 199,
            category: "starters",
            image: "https://images.pexels.com/photos/2377164/pexels-photo-2377164.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 10
        },
        {
            id: 4,
            name: "Chocolate Brownie",
            description: "Rich chocolate brownie served with vanilla ice cream",
            price: 149,
            category: "desserts",
            image: "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 5
        },
        {
            id: 5,
            name: "Fresh Orange Juice",
            description: "Freshly squeezed orange juice with pulp",
            price: 99,
            category: "drinks",
            image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 3
        },
        {
            id: 6,
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter and herbs",
            price: 129,
            category: "starters",
            image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 8
        },
        {
            id: 7,
            name: "Grilled Salmon",
            description: "Fresh salmon grilled to perfection with lemon and herbs",
            price: 449,
            category: "mains",
            image: "https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 20
        },
        {
            id: 8,
            name: "Vegetable Spring Rolls",
            description: "Crispy spring rolls filled with fresh vegetables",
            price: 169,
            category: "starters",
            image: "https://images.pexels.com/photos/2307221/pexels-photo-2307221.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 12
        },
        {
            id: 9,
            name: "Tiramisu",
            description: "Classic Italian dessert with coffee-soaked ladyfingers",
            price: 199,
            category: "desserts",
            image: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 5
        },
        {
            id: 10,
            name: "Mango Lassi",
            description: "Refreshing yogurt-based drink with fresh mango",
            price: 119,
            category: "drinks",
            image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 5
        },
        {
            id: 11,
            name: "Butter Chicken",
            description: "Tender chicken in rich butter and tomato gravy",
            price: 329,
            category: "mains",
            image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 22
        },
        {
            id: 12,
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with Indian spices",
            price: 249,
            category: "starters",
            image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 15
        },
        {
            id: 13,
            name: "Cheesecake",
            description: "Classic New York style cheesecake with berry compote",
            price: 179,
            category: "desserts",
            image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 5
        },
        {
            id: 14,
            name: "Iced Coffee",
            description: "Cold brew coffee served with ice and cream",
            price: 129,
            category: "drinks",
            image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: true,
            preparationTime: 3
        },
        {
            id: 15,
            name: "Pasta Carbonara",
            description: "Creamy pasta with pancetta, eggs, and parmesan",
            price: 299,
            category: "mains",
            image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
            available: false,
            preparationTime: 18
        }
    ],

    // Sample Orders for Admin Panel
    sampleOrders: [
        {
            id: 'ORD001',
            tableNumber: 3,
            items: [
                { id: 1, name: "Margherita Pizza", price: 299, quantity: 1 },
                { id: 5, name: "Fresh Orange Juice", price: 99, quantity: 2 }
            ],
            totalAmount: 497,
            status: 'pending',
            timestamp: new Date(Date.now() - 300000), // 5 minutes ago
            customerName: 'Table 3',
            estimatedTime: 20
        },
        {
            id: 'ORD002',
            tableNumber: 1,
            items: [
                { id: 2, name: "Chicken Tikka Masala", price: 349, quantity: 1 },
                { id: 6, name: "Garlic Bread", price: 129, quantity: 1 },
                { id: 4, name: "Chocolate Brownie", price: 149, quantity: 2 }
            ],
            totalAmount: 776,
            status: 'cooking',
            timestamp: new Date(Date.now() - 600000), // 10 minutes ago
            customerName: 'Table 1',
            estimatedTime: 15
        },
        {
            id: 'ORD003',
            tableNumber: 5,
            items: [
                { id: 7, name: "Grilled Salmon", price: 449, quantity: 1 },
                { id: 3, name: "Caesar Salad", price: 199, quantity: 1 }
            ],
            totalAmount: 648,
            status: 'ready',
            timestamp: new Date(Date.now() - 900000), // 15 minutes ago
            customerName: 'Table 5',
            estimatedTime: 0
        },
        {
            id: 'ORD004',
            tableNumber: 2,
            items: [
                { id: 11, name: "Butter Chicken", price: 329, quantity: 2 },
                { id: 12, name: "Paneer Tikka", price: 249, quantity: 1 },
                { id: 10, name: "Mango Lassi", price: 119, quantity: 2 }
            ],
            totalAmount: 1025,
            status: 'accepted',
            timestamp: new Date(Date.now() - 180000), // 3 minutes ago
            customerName: 'Table 2',
            estimatedTime: 25
        }
    ],

    // Admin Users
    adminUsers: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'owner',
            name: 'Restaurant Owner',
            permissions: ['orders', 'menu', 'analytics', 'users']
        },
        {
            id: 2,
            username: 'chef',
            password: 'chef123',
            role: 'chef',
            name: 'Head Chef',
            permissions: ['orders']
        }
    ],

    // Restaurant Analytics
    analytics: {
        todayOrders: 45,
        todayRevenue: 18750,
        averageRating: 4.5,
        averagePreparationTime: 25
    },

    // Restaurant Settings
    restaurantInfo: {
        name: 'Bistro Delights',
        address: '123 Food Street, Culinary District',
        phone: '+91 98765 43210',
        email: 'info@bistrodelights.com',
        tables: 6,
        operatingHours: {
            open: '09:00',
            close: '23:00'
        }
    }
};

// Utility functions for mock data operations
const mockDataUtils = {
    // Get menu items by category
    getMenuItemsByCategory: (category) => {
        if (category === 'all') {
            return mockData.menuItems.filter(item => item.available);
        }
        return mockData.menuItems.filter(item => 
            item.category === category && item.available
        );
    },

    // Get all menu items (including unavailable for admin)
    getAllMenuItems: () => {
        return mockData.menuItems;
    },

    // Get menu item by ID
    getMenuItemById: (id) => {
        return mockData.menuItems.find(item => item.id === parseInt(id));
    },

    // Generate order ID
    generateOrderId: () => {
        const timestamp = Date.now().toString().slice(-6);
        return `ORD${timestamp}`;
    },

    // Calculate estimated preparation time
    calculateEstimatedTime: (items) => {
        let maxTime = 0;
        items.forEach(item => {
            const menuItem = mockDataUtils.getMenuItemById(item.id);
            if (menuItem && menuItem.preparationTime > maxTime) {
                maxTime = menuItem.preparationTime;
            }
        });
        return Math.max(maxTime + 5, 15); // Add 5 minutes buffer, minimum 15 minutes
    },

    // Validate admin credentials
    validateAdmin: (username, password) => {
        return mockData.adminUsers.find(user => 
            user.username === username && user.password === password
        );
    },

    // Get orders by status
    getOrdersByStatus: (status) => {
        if (status === 'all') {
            return mockData.sampleOrders;
        }
        return mockData.sampleOrders.filter(order => order.status === status);
    },

    // Update order status
    updateOrderStatus: (orderId, newStatus) => {
        const order = mockData.sampleOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            return true;
        }
        return false;
    },

    // Add new order
    addOrder: (orderData) => {
        const newOrder = {
            id: mockDataUtils.generateOrderId(),
            ...orderData,
            timestamp: new Date(),
            status: 'pending'
        };
        mockData.sampleOrders.unshift(newOrder);
        return newOrder;
    },

    // Get analytics data
    getAnalytics: () => {
        return {
            ...mockData.analytics,
            todayOrders: mockData.sampleOrders.length,
            todayRevenue: mockData.sampleOrders.reduce((sum, order) => 
                sum + order.totalAmount, 0
            )
        };
    },

    // Toggle menu item availability
    toggleMenuItemAvailability: (itemId) => {
        const item = mockData.menuItems.find(i => i.id === parseInt(itemId));
        if (item) {
            item.available = !item.available;
            return true;
        }
        return false;
    },

    // Add new menu item
    addMenuItem: (itemData) => {
        const newId = Math.max(...mockData.menuItems.map(i => i.id)) + 1;
        const newItem = {
            id: newId,
            available: true,
            preparationTime: 15,
            ...itemData
        };
        mockData.menuItems.push(newItem);
        return newItem;
    },

    // Update menu item
    updateMenuItem: (itemId, updateData) => {
        const itemIndex = mockData.menuItems.findIndex(i => i.id === parseInt(itemId));
        if (itemIndex !== -1) {
            mockData.menuItems[itemIndex] = {
                ...mockData.menuItems[itemIndex],
                ...updateData
            };
            return mockData.menuItems[itemIndex];
        }
        return null;
    },

    // Delete menu item
    deleteMenuItem: (itemId) => {
        const itemIndex = mockData.menuItems.findIndex(i => i.id === parseInt(itemId));
        if (itemIndex !== -1) {
            mockData.menuItems.splice(itemIndex, 1);
            return true;
        }
        return false;
    },

    // Get popular items for analytics
    getPopularItems: () => {
        const itemCounts = {};
        
        // Count items from all orders
        mockData.sampleOrders.forEach(order => {
            order.items.forEach(item => {
                if (itemCounts[item.name]) {
                    itemCounts[item.name] += item.quantity;
                } else {
                    itemCounts[item.name] = item.quantity;
                }
            });
        });

        // Convert to array and sort by count
        return Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 items
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockData, mockDataUtils };
}