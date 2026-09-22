import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  FileCheck,
  User,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  FileText,
  Clock,
  PackageCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Phone,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { MessengerDocuments } from "./MessengerDocuments";
import { Profile } from "./Profile";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { id: "tasks", label: "Task Saya", icon: FileCheck },
  { id: "profile", label: "Profile", icon: User },
];

interface MessengerDashboardProps {
  onLogout: () => void;
}

export function MessengerDashboard({ onLogout }: MessengerDashboardProps) {
  const [currentPage, setCurrentPage] = useState("tasks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Sample stats for dashboard
  const stats = [
    {
      label: "Jemput Dokumen",
      value: 3,
      icon: FileText,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Proses Samsat",
      value: 2,
      icon: Clock,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Ambil Dokumen",
      value: 1,
      icon: PackageCheck,
      color: "purple",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Antar Dokumen",
      value: 1,
      icon: CheckCircle2,
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
  ];

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const renderPage = () => {
    switch (currentPage) {
      case "tasks":
        return <MessengerDocuments />;
      case "profile":
        return <Profile userRole="messenger" />;
      default:
        return <MessengerDocuments />;
    }
  };

  const getPageTitle = () => {
    const item = menuItems.find((item) => item.id === currentPage);
    return item ? item.label : "Task Saya";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-[280px] glass-sidebar z-50 lg:hidden flex flex-col"
            >
              <SidebarContent
                isSidebarOpen={true}
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  setIsMobileSidebarOpen(false);
                }}
                onLogout={onLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 80,
        }}
        className="glass-sidebar hidden lg:flex flex-col relative z-30 transition-all duration-300"
      >
        <SidebarContent
          isSidebarOpen={isSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
        />

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 items-center justify-center rounded-full glass-card border border-border hover:bg-primary/20 transition-colors"
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              !isSidebarOpen && "rotate-180"
            )}
          />
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-card border-b border-border p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-base md:text-lg">{getPageTitle()}</h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Kelola tugas messenger Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="relative">
              <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] md:text-xs">
                3
              </Badge>
            </Button>
            <div
              className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border cursor-pointer hover:bg-secondary/50 rounded-lg p-1 md:p-2 transition-colors"
              onClick={() => setCurrentPage("profile")}
            >
              <Avatar className="w-7 h-7 md:w-8 md:h-8">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
                  MS
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm">Messenger</p>
                <p className="text-xs text-muted-foreground">
                  messenger@birojasa.com
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  isSidebarOpen,
  currentPage,
  setCurrentPage,
  onLogout,
}: {
  isSidebarOpen: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Messenger
              </h1>
              <p className="text-xs text-muted-foreground">Task Dashboard</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                  : "hover:bg-secondary/50 text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg"
                  transition={{ type: "spring", damping: 25 }}
                />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 relative z-10",
                  isActive && "text-cyan-400"
                )}
              />
              {isSidebarOpen && (
                <span
                  className={cn(
                    "relative z-10 flex-1 text-left",
                    isActive && "text-cyan-400"
                  )}
                >
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </>
  );
}
