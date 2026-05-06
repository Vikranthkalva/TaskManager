import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, Settings, Plus, 
  Search, Bell, LogOut, MoreHorizontal, Clock, Lock, Mail, User as UserIcon, CheckCircle, Trash2
} from 'lucide-react';
import axios from 'axios';

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [notifications, setNotifications] = useState([]); // New: For real-time updates
  const [tasks, setTasks] = useState([
    { id: 1, title: "Database Migration", user: "Jane", priority: "Medium", time: "1d left", status: "In Progress" },
    { id: 2, title: "API Documentation", user: "John", priority: "Low", time: "2d left", status: "To Do" },
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://your-backend-url.railway.app/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Fetch failed, using local demo data.");
      }
    };
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  // --- 3. LOGIC FUNCTIONS ---
  const addNotification = (msg) => {
    setNotifications(prev => [{ id: Date.now(), msg, time: 'Just now' }, ...prev]);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const mockUser = { 
      name: e.target.email.value.split('@')[0], 
      role: e.target.email.value.includes('admin') ? 'ADMIN' : 'MEMBER', 
      avatar: e.target.email.value[0].toUpperCase() 
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    addNotification(`Welcome back, ${mockUser.name}!`);
  };

  const addTask = async (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: e.target.title.value,
      user: user.name,
      priority: e.target.priority.value,
      time: "Just now",
      status: "To Do"
    };
    
    try {
      const response = await axios.post('https://your-backend-url.railway.app/tasks', newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      setTasks([...tasks, newTask]); 
    }
    addNotification(`New task created: ${newTask.title}`);
    setShowTaskModal(false);
  };

  // Improved: Function to move tasks between any column
  const moveTask = async (taskId, newStatus) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    const taskName = tasks.find(t => t.id === taskId)?.title;
    addNotification(`"${taskName}" moved to ${newStatus}`);
    
    try {
      await axios.patch(`https://your-backend-url.railway.app/tasks/${taskId}`, { status: newStatus });
    } catch (e) { console.error("Update failed"); }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    addNotification("Task deleted successfully.");
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 4. AUTH VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
              <Lock className="text-white" size={32} />
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-6">{authMode === 'login' ? 'Login' : 'Signup'}</h2>
           <form onSubmit={handleAuth} className="space-y-4">
              <input name="email" type="email" placeholder="Email (use 'admin' for admin role)" className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-100" required />
              <input type="password" placeholder="Password" className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-100" required />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Continue</button>
           </form>
           <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="mt-4 text-sm text-indigo-600 font-bold">
             Switch to {authMode === 'login' ? 'Signup' : 'Login'}
           </button>
        </div>
      </div>
    );
  }

  // --- 5. DASHBOARD VIEW ---
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <CheckSquare className="text-white" size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">TaskFlow</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<CheckSquare size={20}/>} label="Team Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <SidebarLink icon={<Users size={20}/>} label="Members" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
          <div onClick={() => setIsLoggedIn(false)} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">{user?.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user?.role}</p>
            </div>
            <LogOut size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition outline-none border border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:text-indigo-600 transition">
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>}
              </button>
              {/* Notifications Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none group-hover:pointer-events-auto">
                <h4 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Recent Activity</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-[11px] border-l-2 border-indigo-500 pl-2 py-1 bg-slate-50 rounded-r-md">
                      {n.msg}
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-[11px] text-slate-400">No new updates</p>}
                </div>
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowTaskModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 flex items-center gap-2 transition active:scale-95">
                <Plus size={18} /> Create Task
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' || activeTab === 'tasks' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Current Sprints</h2>
                  <p className="text-slate-500 font-medium">Monitoring {filteredTasks.length} tasks</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {['To Do', 'In Progress', 'Done'].map(colTitle => (
                  <TaskColumn key={colTitle} title={colTitle} count={filteredTasks.filter(t => t.status === colTitle).length}>
                    {filteredTasks.filter(t => t.status === colTitle).map(task => (
                      <TaskCard 
                        key={task.id} 
                        {...task} 
                        onMove={(status) => moveTask(task.id, status)} 
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </TaskColumn>
                ))}
              </div>
            </div>
          ) : activeTab === 'team' ? (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Team Members</h2>
                  <p className="text-slate-500 font-medium">Manage roles and project access</p>
                </div>
                {user?.role === 'ADMIN' && (
                   <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
                     <Plus size={18} /> Invite Member
                   </button>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <MemberRow name={user?.name} email={`${user?.name}@taskflow.com`} role={user?.role} isOnline />
                    <MemberRow name="Rahul Kumar" email="rahul@taskflow.com" role="MEMBER" isOnline />
                    <MemberRow name="Sana Khan" email="sana@taskflow.com" role="MEMBER" />
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
               <Settings size={48} className="mb-4 animate-spin-slow" />
               <p className="text-lg font-bold uppercase tracking-widest">Settings Module Coming Soon</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black mb-6">Create New Task</h3>
            <form onSubmit={addTask} className="space-y-4">
              <input name="title" placeholder="Task Title" className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-sm outline-none border border-slate-100" required />
              <select name="priority" className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-sm cursor-pointer outline-none border border-slate-100">
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
      active ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const TaskColumn = ({ title, count, children }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between px-2 text-slate-700">
      <div className="flex items-center gap-3">
        <h4 className="font-bold">{title}</h4>
        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-md font-bold">{count}</span>
      </div>
      <MoreHorizontal className="text-slate-400 cursor-pointer hover:text-slate-600" size={18} />
    </div>
    <div className="space-y-4 min-h-[100px]">{children}</div>
  </div>
);

const TaskCard = ({ id, title, user, priority, time, status, onMove, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-transparent shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-visible">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
          priority === 'High' ? 'bg-rose-100 text-rose-600' : 
          priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
        }`}>{priority}</span>
        
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 hover:bg-slate-50 rounded-md transition">
            <MoreHorizontal size={18} className="text-slate-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 py-2 animate-in zoom-in duration-150">
              <button onClick={() => onMove('To Do')} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition">To Do</button>
              <button onClick={() => onMove('In Progress')} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition">In Progress</button>
              <button onClick={() => onMove('Done')} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-emerald-50 text-emerald-600 transition">Done</button>
              <hr className="my-1 border-slate-50" />
              <button onClick={() => onDelete(id)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-rose-50 text-rose-500 flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <h5 className={`font-bold text-slate-800 leading-snug mb-4 ${status === 'Done' ? 'line-through text-slate-400' : ''}`}>{title}</h5>
      
      <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-slate-400">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <Clock size={12} />
          {time}
        </div>
        <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black border border-white shadow-sm">
          {user ? user[0] : '?'}
        </div>
      </div>
    </div>
  );
};

const MemberRow = ({ name, email, role, isOnline = false }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50">
    <td className="px-6 py-5 text-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold relative">
          {name ? name[0] : '?'}
          {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>}
        </div>
        <div>
          <p className="font-bold text-slate-800 leading-none mb-1">{name}</p>
          <p className="text-xs text-slate-400 font-medium">{email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${
        role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
      }`}>
        {role}
      </span>
    </td>
    <td className="px-6 py-5 text-xs font-medium text-slate-600">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
        {isOnline ? 'Active Now' : 'Offline'}
      </div>
    </td>
    <td className="px-6 py-5 text-right">
      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal size={18} /></button>
    </td>
  </tr>
);

export default App;