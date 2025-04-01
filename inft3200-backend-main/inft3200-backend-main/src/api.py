from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2
import psycopg2.extras
import boto3

app = Flask(__name__)
CORS(app)
load_dotenv()


def get_db_connection():
    """
    Returns a new connection to the PostgreSQL database.
    """
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS')
    )
    return conn

@app.route('/', methods=['GET'])
def welcome():
    return "Welcome to the INFT3200 API"
    
@app.route('/books/<int:isbn>', methods=['GET'])
def get_book(isbn):
    """
    Retrieve a single book by ISBN.
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cursor.execute("SELECT isbn, title, author_first, author_last, inventory FROM books WHERE isbn = %s;", (isbn,))
        book = cursor.fetchone()
        if book:
            return jsonify({
                "isbn": book["isbn"],
                "title": book["title"],
                "author_first": book["author_first"],
                "author_last": book["author_last"]
            }), 200
        else:
            return jsonify({"error": "Book not found"}), 404
    finally:
        cursor.close()
        conn.close()

@app.route('/books/update/<int:isbn>', methods=['PUT'])
def update_book(isbn):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    title = data.get('title')
    author_first = data.get('author_first')
    author_last = data.get('author_last')
    inventory = data.get('inventory')

    if not title and not inventory and not author_first and not author_last:
        return jsonify({"error": "Nothing to update"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Build a dynamic update statement based on provided fields
    update_fields = []
    update_values = []

    if title is not None:
        update_fields.append("title = %s")
        update_values.append(title)

    if author_first is not None:
        update_fields.append("author_first = %s")
        update_values.append(author_first)

    if author_last is not None:
        update_fields.append("author_last = %s")
        update_values.append(author_last)

    if inventory is not None:
        update_fields.append("inventory = %s")
        update_values.append(inventory)    

    update_values.append(isbn)

    update_stmt = f"UPDATE books SET {', '.join(update_fields)} WHERE isbn = %s RETURNING isbn;"

    try:
        cursor.execute(update_stmt, tuple(update_values))
        updated_row = cursor.fetchone()
        conn.commit()

        if updated_row:
            return jsonify({"message": "Book updated successfully"}), 200
        else:
            return jsonify({"error": "Book not found"}), 404
    finally:
        cursor.close()
        conn.close()

@app.route('/books/delete/<int:isbn>', methods=['DELETE'])
def delete_book(isbn):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM books WHERE isbn = %s RETURNING isbn;", (isbn,))
        deleted_isbn = cursor.fetchone()
        conn.commit()

        if deleted_isbn:
            return jsonify({"message": "Book deleted successfully"}), 200
        else:
            return jsonify({"error": "Book not found"}), 404
    finally:
        cursor.close()
        conn.close()

@app.route('/books', methods=['GET'])
def get_all_books():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cursor.execute("SELECT isbn, title, author_first, author_last, inventory FROM books;")
        rows = cursor.fetchall()
        results = [
            {"isbn": row["isbn"], "title": row["title"], "author_first": row["author_first"], "author_last": row["author_last"], "inventory": row["inventory"]}
            for row in rows
        ]
        return jsonify(results), 200
    finally:
        cursor.close()
        conn.close()

@app.route('/books/add', methods=['POST'])
def add_book():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    isbn = data.get('isbn')
    title = data.get('title')
    author_first = data.get('authorFirstName')
    author_last = data.get('authorLastName')
    inventory = data.get('inventory')

    if not title or not author_first or not author_last or not inventory:
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO books (isbn, title, author_first, author_last, inventory) VALUES (%s, %s, %s, %s, %s) RETURNING isbn;",
            (isbn, title, author_first, author_last, inventory)
        )
        new_isbn = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"message": "New book added", "isbn": new_isbn}), 201
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    from waitress import serve
    #app.run(debug=True)
    serve(app, host="0.0.0.0", port=8080)
