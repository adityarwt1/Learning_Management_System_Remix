export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to Your Application
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This is a sample page to demonstrate the fixed navbar. The navbar
            now has a proper height and doesn&apost cover the entire screen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Feature {item}</h3>
                <p className="text-gray-600">
                  This is a sample feature card demonstrating the layout with
                  the fixed navbar.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>© {new Date().getFullYear()} Vote LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
