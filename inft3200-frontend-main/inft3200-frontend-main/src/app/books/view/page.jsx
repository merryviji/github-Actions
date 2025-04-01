import React from 'react';

export default async function BookReadOnlyPage() {
  const response = await fetch(
    `http://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/books`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  const books = await response.json();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book List (Read-Only)</h1>
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
              <td className="px-4 py-2">{book.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
