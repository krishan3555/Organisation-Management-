import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-background font-body-md min-h-screen flex">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col bg-surface-container-low w-64 h-screen fixed left-0 top-0 z-40 border-r border-outline-variant/30">
        <div className="p-6 flex items-center space-x-3 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="font-h3 text-label-md font-bold text-primary">Admin Panel</h2>
            <p className="font-caption text-caption text-on-surface-variant">Village Development</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/admin" className="text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-xl font-bold flex items-center px-4 py-3 transition-all duration-200">
                <span className="material-symbols-outlined mr-3">dashboard</span>
                <span className="font-label-md text-label-md">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/members" className="text-on-surface-variant flex items-center px-4 py-3 rounded-xl hover:bg-surface-container-high hover:text-primary transition-colors duration-200">
                <span className="material-symbols-outlined mr-3">group</span>
                <span className="font-label-md text-label-md">Member Directory</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/events" className="text-on-surface-variant flex items-center px-4 py-3 rounded-xl hover:bg-surface-container-high hover:text-primary transition-colors duration-200">
                <span className="material-symbols-outlined mr-3">event_available</span>
                <span className="font-label-md text-label-md">Event Management</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/applications" className="text-on-surface-variant flex items-center px-4 py-3 rounded-xl hover:bg-surface-container-high hover:text-primary transition-colors duration-200">
                <span className="material-symbols-outlined mr-3">pending_actions</span>
                <span className="font-label-md text-label-md">Applications</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/verification" className="text-on-surface-variant flex items-center px-4 py-3 rounded-xl hover:bg-surface-container-high hover:text-primary transition-colors duration-200">
                <span className="material-symbols-outlined mr-3">verified</span>
                <span className="font-label-md text-label-md">ID Verification</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 border-t border-outline-variant/20 space-y-2">
          <Link
            href="/en"
            className="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md py-3 rounded-xl flex justify-center items-center hover:bg-surface-dim transition-colors"
          >
            <span className="material-symbols-outlined mr-2 text-sm">open_in_new</span>
            View Public Portal
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative bg-surface">
        {/* Top Header */}
        <header className="h-20 bg-surface flex items-center justify-between px-4 md:px-10 border-b border-outline-variant/20 sticky top-0 z-30">
          <div>
            <h1 className="font-h2 text-h3 text-on-background">Admin Portal</h1>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/member/dashboard" className="text-sm font-label-md text-primary hover:underline">
              Member View
            </Link>
            <div className="flex items-center space-x-3 border-l border-outline-variant/30 pl-6">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-background">Admin User</p>
                <p className="font-caption text-caption text-on-surface-variant">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
