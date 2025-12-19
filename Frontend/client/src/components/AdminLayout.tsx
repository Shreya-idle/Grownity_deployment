import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Portal</h2>
        <nav className="flex flex-col gap-4">
          <a
            href="/admin/dashboard"
            className="hover:bg-primary/80 p-2 rounded"
          >
            Dashboard
          </a>
          <a
            href="/admin/dashboard/approvals"
            className="hover:bg-primary/80 p-2 rounded"
          >
            Approvals
          </a>
          <a
            href="/admin/dashboard/team"
            className="hover:bg-primary/80 p-2 rounded"
          >
            Team
          </a>
          <a
            href="/admin/dashboard/analytics"
            className="hover:bg-primary/80 p-2 rounded"
          >
            Analytics
          </a>
          <a
            href="/admin/dashboard/proposals"
            className="hover:bg-primary/80 p-2 rounded"
          >
            Proposals
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
