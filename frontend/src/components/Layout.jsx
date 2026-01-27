import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Menu, X } from "lucide-react";

// [LEARNING NOTE] Layout Architecture
// A modern dashboard layout often uses 'h-screen' and 'overflow-hidden' on the main wrapper.
// This creates a "CSS Containment" environment where the outer page never scrolls.
// Instead, scrolling is delegated to specific inner containers like the Board or Sidebar.

const Layout = ({ user, initials, onLogout, savedCount, onShowFavorites, onNewIssue, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* 
         Mobile Drawer & Overlay 
         We use 'fixed' for the overlay to ensure it covers everything regardless of the parent.
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 
         Sidebar Container
         LG: 'static' and 'translate-x-0' keeps it as a permanent side column.
         MOBILE: 'fixed' and translation makes it a slide-out drawer.
      */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
        lg:static lg:translate-x-0 lg:flex lg:h-full lg:shrink-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar 
          user={user} 
          initials={initials} 
          onLogout={onLogout}
          savedCount={savedCount}
          onShowFavorites={onShowFavorites}
        />
      </div>

      {/* Main Content Area: flex-col to keep Header/Topbar at top and content below */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        {/* Mobile Header: Visible ONLY on mobile/tablet below LG breakpoint */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-900 shadow-sm flex items-center justify-center text-white font-bold">W</div>
             <span className="font-semibold text-slate-900 tracking-tight">Workspace</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 active:scale-95 transition-all outline-none"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Global Nav/Header: Sticky or Fixed within the flex container */}
        <Topbar onNewIssue={onNewIssue} />
        
        {/* Inner Content: This is where independent scrolling starts */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
