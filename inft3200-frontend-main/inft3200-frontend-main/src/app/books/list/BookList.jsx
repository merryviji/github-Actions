'use client'; 

import { useState, useEffect } from 'react';

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fields for the "Add New Book" form
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [inventory, setInventory] = useState(0);


  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/books`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching book list. Check console for details.');
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);


  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  const handleInventoryChange = (isbn, newInventory) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.isbn === isbn ? { ...book, inventory: newInventory } : book
      )
    );
  };

  const handleUpdateClick = async (isbn) => {
    const bookToUpdate = books.find((b) => b.isbn === isbn);
    if (!bookToUpdate) return;

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/books/update/${isbn}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inventory: bookToUpdate.inventory }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update book inventory');
      }
      await pause(500);
      await fetchBooks();
      alert('Inventory updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating inventory. Check console for details.');
    }
  };


  const handleDeleteClick = async (isbn) => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/books/delete/${isbn}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete book with ISBN: ${isbn}`);
      }
      await pause(500);
      await fetchBooks();
      alert('Book deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error deleting book. Check console for details.');
    }
  };


  const handleOpenModal = () => {
    setShowModal(true);

    setIsbn('');
    setTitle('');
    setAuthorFirstName('');
    setAuthorLastName('');
    setInventory(0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const handleAddBook = async (e) => {
    e.preventDefault();
    const newBook = {
      isbn,
      title,
      authorFirstName,
      authorLastName,
      inventory,
    };

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/books/add`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBook),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to add new book');
      }

      await pause(500);
      await fetchBooks();

      alert('Book added successfully!');
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Error adding book. Check console for details.');
    }
  };


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book List</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          onClick={handleOpenModal}
        >
          Add New Book
        </button>
      </div>

      <table className="w-full table-auto border-collapse shadow-sm rounded">
        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left">
          <tr>
            <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">
              ISBN
            </th>
            <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">
              Title
            </th>
            <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">
              Inventory
            </th>
            <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.isbn}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2">{book.isbn}</td>
              <td className="px-4 py-2">{book.title}</td>
              <td className="px-4 py-2">
                <input
                  className="border rounded p-1 w-20 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  type="number"
                  value={book.inventory}
                  onChange={(e) =>
                    handleInventoryChange(book.isbn, Number(e.target.value))
                  }
                />
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => handleUpdateClick(book.isbn)}
                >
                  Update
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  onClick={() => handleDeleteClick(book.isbn)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={handleAddBook} className="flex flex-col space-y-4">
              <div>
                <label className="block font-medium mb-1">ISBN</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Author First Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={authorFirstName}
                  onChange={(e) => setAuthorFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Author Last Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={authorLastName}
                  onChange={(e) => setAuthorLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Inventory</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
