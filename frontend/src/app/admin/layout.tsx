export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar will go here */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-primary-600">Admin Panel</h2>
          </div>
          {/* Navigation will be added when UI is provided */}
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
