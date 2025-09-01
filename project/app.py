from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import sqlite3

app = Flask(__name__)
socketio = SocketIO(app)

# Database setup
def init_db():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                image TEXT NOT NULL,
                available BOOLEAN NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                table_number INTEGER NOT NULL,
                items TEXT NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT NOT NULL
            )
        ''')
        conn.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/customer')
def customer():
    return render_template('customer.html')

@app.route('/owner')
def owner():
    return render_template('owner.html')

@app.route('/cook')
def cook():
    return render_template('cook.html')

@app.route('/api/orders')
def get_orders():
    with sqlite3.connect('database.db') as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders")
        orders = [dict(row) for row in cursor.fetchall()]
        return jsonify(orders)

@socketio.on('place_order')
def handle_place_order(data):
    # Save order to database
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (table_number, items, total_amount, status) VALUES (?, ?, ?, ?)",
            (data['table_number'], str(data['items']), data['total_amount'], 'pending')
        )
        conn.commit()
    # Notify owner and cook
    emit('new_order', data, broadcast=True)

@socketio.on('update_status')
def handle_update_status(data):
    # Update order status in database
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            (data['status'], data['order_id'])
        )
        conn.commit()
    # Notify customer
    emit('status_updated', data, broadcast=True)

@app.route('/api/payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    # In a real app, you would process the payment here
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
