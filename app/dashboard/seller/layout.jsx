// dashboard/seller/layout.js
export default function SellerLayout({ children }) {
  // Always return JSX, not an object
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Optional: Add a sidebar or header here */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
      </header>

      <main className="p-4">
        {/* Render all child pages */}
        {children}
      </main>
    </div>
  );
}