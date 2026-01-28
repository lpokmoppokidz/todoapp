import React, { useState, useEffect, useRef } from "react";
import { Settings, User as UserIcon, Users, ChevronUp, Search } from "lucide-react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

// [LEARNING NOTE] UI vs Logic
// Notice how clean this component became! 
// We moved the "Online Users" logic to a Hook.
// This Sidebar now only worries about "How things look" (UI).

const Sidebar = ({ user, initials, onLogout, savedCount = 0, onShowFavorites }) => {
  const onlineUsers = useOnlineUsers();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="h-full w-full bg-gray-50/50 border-r border-gray-200 flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-transparent">
        <div className="w-6 h-6 rounded-lg bg-slate-900 shrink-0 shadow-sm"></div>
        <span className="font-semibold text-slate-900 tracking-tight">Workspace</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-gray-950/5 transition-all">
          <span className="text-lg">📋</span> Board
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-gray-100/50 transition-colors">
          <span className="text-lg">📅</span> Timeline
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-gray-100/50 transition-colors">
          <span className="text-lg">📁</span> Projects
        </a>

        <div className="mt-6 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Favorites</div>
        <div className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Saved tasks</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{savedCount}</span>
          </div>
          <button onClick={onShowFavorites} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100/50 transition-colors">
            View all →
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 relative" ref={profileRef}>
        <button 
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-950/5 transition-all text-left"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-slate-700">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <ChevronUp size={16} className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
        </button>
        
        {showProfileMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl shadow-xl ring-1 ring-gray-950/10 p-1 animate-in slide-in-from-bottom-2 fade-in-0 duration-200 z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Info</h3>
            </div>
            
            <div className="p-1 space-y-1">
               <div className="px-2 py-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search users..." className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900/20 transition-all placeholder:text-gray-400" />
                </div>
               </div>

               <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">{initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
               </div>

              <div className="px-2 py-2">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-600">
                  <Users size={14} className="text-slate-400" />
                  <span>Online ({onlineUsers.length})</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {onlineUsers.map((u) => (
                    <div key={u.id} className="relative group cursor-pointer" title={u.name}>
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-sm group-hover:scale-110 transition-transform">
                          <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover bg-white" />
                       </div>
                       <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <Settings size={16} /> <span>Settings</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <UserIcon size={16} /> <span>Profile</span>
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
