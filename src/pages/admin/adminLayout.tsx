import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, FolderOpen, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: FolderOpen, label: "Projects", to: "/admin/projects" },
  { icon: Users, label: "Leads", to: "/admin/leads" },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  let location = useLocation();

  let api = import.meta.env.VITE_API_URL;

  let navigate = useNavigate();

  let verify = async () => {
    try {
      let res = await axios.post(`${api}/api/admin/verify`, {}, { withCredentials: true })
      if (!res.data.success) {
        navigate('/admin/login')
      }
    } catch (err) {
      console.log(err)
    }
  }
  

  let logout = async () => {
    try {
      let res = await axios.post(`${api}/api/admin/logout`, {}, { withCredentials: true })
      if (res.data.success) {
        navigate('/admin/login')
      }
    } catch (err) {
      console.log(err)
    }
  }
  

  useEffect(() => {
    verify();
  }, []);


  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-64 bg-card border-r border-border fixed inset-y-0 left-0 z-50"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
            </div>
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.to === location.pathname
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : ""}`}>
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40 glass">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="text-sm text-muted-foreground">Welcome back, Abdullah</div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}