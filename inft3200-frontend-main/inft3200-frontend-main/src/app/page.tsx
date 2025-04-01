export default function InternalHomePage() {
  return (
    <main className="max-w-[100vw] overflow-x-hidden bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      {/* Hero / Header Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[50vh] bg-cover bg-center bg-[url('/hero-image.jpg')] dark:bg-[url('/hero-image-dark.jpg')]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-60" />

        {/* Hero text */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            The Reading Nook
          </h1>
          <p className="text-md md:text-lg text-white">
            Internal Inventory Dashboard
          </p>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8">
            Welcome to The Reading Nook's Internal System
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Use the links below to manage our bookstore inventory. This section 
            is for authorized staff only.
          </p>

          <div className="flex flex-col items-center md:flex-row md:justify-center gap-6">
            {/* Link to the Books List */}
            <a
              href="books/list"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Admin View
            </a>

            {/* Link to Add a Book */}
            <a
              href="books/view"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              List Books
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-200 dark:bg-gray-800 text-center">
        <p className="text-gray-700 dark:text-gray-400">
          &copy; {new Date().getFullYear()} The Reading Nook. Internal Use Only.
        </p>
      </footer>
    </main>
  );
}
