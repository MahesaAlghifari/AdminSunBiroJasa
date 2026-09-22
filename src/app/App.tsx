import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Wallet, 
  Database, 
  Truck, 
  ShoppingCart, 
  MapPin,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  MessageSquare,
  CreditCard,
  FileText,
  AlertCircle,
  Clock,
  DollarSign,
  Receipt,
  BarChart3,
  Building2,
  Users,
  Briefcase,
  Sun,
  Moon,
  Activity,
  Shield
} from "lucide-react";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Dashboard } from "./components/Dashboard";
import { Finance } from "./components/Finance";
import { MasterData } from "./components/MasterData";
import { MessengerTask } from "./components/MessengerTask";
import { MessengerDashboard } from "./components/MessengerDashboard";
import { Order } from "./components/Order";
import { BuatOrder } from "./components/BuatOrder";
import { OrderTracking } from "./components/OrderTracking";
import { OrderHistory } from "./components/OrderHistory";
import { Auth } from "./components/Auth";
import { ManajemenPengguna } from "./components/ManajemenPengguna";
import { Settings as SettingsPage } from "./components/Settings";
import { Profile } from "./components/Profile";
import { NotificationDialog } from "./components/NotificationDialog";
import { AuditLog } from "./components/AuditLog";
import { AccessManagement } from "./components/AccessManagement";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { cn } from "./components/ui/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    id: "finance", 
    label: "Finance", 
    icon: Wallet,
    subItems: [
      { id: "finance-profit", label: "Profit", icon: TrendingUp },
      { id: "finance-kas-messenger", label: "Kas Messenger", icon: MessageSquare },
      { id: "finance-kas-kantor", label: "Kas Kantor", icon: Building2 },
      { id: "finance-pengeluaran", label: "Pengeluaran", icon: CreditCard },
      { id: "finance-penjualan", label: "Data Penjualan", icon: FileText },
      { id: "finance-tagihan", label: "Tagihan", icon: Receipt },
      { id: "finance-laba-rugi", label: "Laba Rugi", icon: BarChart3 },
    ]
  },
  { 
    id: "master-data", 
    label: "Master Data", 
    icon: Database,
    subItems: [
      { id: "master-samsat", label: "Samsat", icon: Building2 },
      { id: "master-karyawan", label: "Karyawan", icon: Users },
      { id: "master-biaya-layanan", label: "Biaya Layanan", icon: DollarSign },
      { id: "master-harga-dasar-samsat", label: "Harga Dasar Samsat", icon: FileText },
      { id: "master-pengguna", label: "Manajemen Pengguna", icon: Users },
      { id: "access-management", label: "Pengaturan Hak Akses", icon: Shield },
      { id: "audit-log", label: "Riwayat Aktivitas", icon: Activity },
    ]
  },
  { id: "messenger-task", label: "Messenger Task", icon: Truck },
  { 
    id: "order-menu",
    label: "Order",
    icon: ShoppingCart,
    subItems: [
      { id: "buat-order", label: "Buat Order", icon: FileText },
      { id: "order-tracking", label: "Order Tracking", icon: MapPin },
      { id: "order-history", label: "Riwayat Order", icon: Clock },
    ]
  },
];

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'administrator' | 'finance' | 'admin' | 'messenger' | null>(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["finance", "master-data", "order-menu"]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { theme } = useTheme();

  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: "tagihan" as const,
      title: "Tagihan Jatuh Tempo",
      customer: "PT. MAJU JAYA",
      nopol: "B 1234 ABC",
      layanan: "Mutasi Luar Daerah",
      totalTagihan: 5000000,
      terbayar: 2000000,
      sisa: 3000000,
      jatuhTempo: "10/11/2024",
      telepon: "08123456789",
      alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
      priority: "high" as const,
      daysOverdue: 2,
    },
    {
      id: 2,
      type: "tagihan" as const,
      title: "Reminder Pembayaran",
      customer: "TOKO SEJAHTERA",
      nopol: "D 5678 DEF",
      layanan: "Balik Nama",
      totalTagihan: 6000000,
      terbayar: 3000000,
      sisa: 3000000,
      jatuhTempo: "12/11/2024",
      telepon: "08234567890",
      alamat: "Jl. Thamrin No. 456, Jakarta Pusat",
      priority: "medium" as const,
    },
    {
      id: 3,
      type: "tagihan" as const,
      title: "Pembayaran Tertunda",
      customer: "CV. MANDIRI",
      nopol: "F 9012 GHI",
      layanan: "Perpanjangan 5 Tahun",
      totalTagihan: 4800000,
      terbayar: 2000000,
      sisa: 2800000,
      jatuhTempo: "15/11/2024",
      telepon: "08345678901",
      alamat: "Jl. Gatot Subroto No. 789, Bekasi",
      priority: "medium" as const,
    },
  ];

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogin = (role: 'administrator' | 'finance' | 'admin' | 'messenger', name: string, id: string) => {
    setUserRole(role);
    setUserName(name);
    setUserId(id);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName("");
    setUserId("");
    setCurrentPage("dashboard");
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Show Messenger Dashboard if user is a messenger
  if (userRole === 'messenger') {
    return <MessengerDashboard onLogout={handleLogout} />;
  }

  // Show Admin Dashboard if user is an admin

  const renderPage = () => {
    // Finance sub-pages
    if (currentPage.startsWith("finance")) {
      return <Finance defaultTab={currentPage.replace("finance-", "")} />;
    }
    
    // Master Data sub-pages
    if (currentPage.startsWith("master")) {
      return <MasterData defaultTab={currentPage.replace("master-", "")} />;
    }

    // Main pages
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "messenger-task":
        return <MessengerTask />;
      case "order":
        return <Order />;
      case "buat-order":
        return <BuatOrder />;
      case "order-tracking":
        return <OrderTracking userRole={userRole} />;
      case "order-history":
        return <OrderHistory />;
      case "audit-log":
        return <AuditLog currentUserRole={userRole || 'admin'} />;
      case "access-management":
        return <AccessManagement currentUserId={userId} currentUserName={userName} />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const getFinanceHeaderInfo = (page: string) => {
    const subTab = page.replace("finance-", "").toLowerCase();
    switch (subTab) {
      case "profit":
      case "finance":
        return {
          title: "Profit",
          description: "Pantau margin keuntungan dan rincian transaksi per berkas"
        };
      case "kas-kantor":
        return {
          title: "Kas Kantor",
          description: "Kelola transaksi kas kantor"
        };
      case "kas-messenger":
        return {
          title: "Kas Messenger",
          description: "Kelola pencatatan kas petty cash dan operasional messenger"
        };
      case "pengeluaran":
        return {
          title: "Pengeluaran",
          description: "Catat dan monitor seluruh pos pengeluaran operasional kantor"
        };
      case "penjualan":
      case "data-penjualan":
        return {
          title: "Data Penjualan",
          description: "Kelola dan pantau data penjualan berkas"
        };
      case "tagihan":
        return {
          title: "Tagihan",
          description: "Monitoring status pelunasan dan piutang tagihan berkas"
        };
      case "laba-rugi":
        return {
          title: "Laba Rugi",
          description: "Analisis performa keuangan, total pendapatan, dan laba bersih"
        };
      default:
        return {
          title: "Profit",
          description: "Pantau margin keuntungan dan rincian transaksi per berkas"
        };
    }
  };

  const getPageTitle = () => {
    // Find in main menu
    for (const item of menuItems) {
      if (item.id === currentPage) return item.label;
      
      // Find in sub items
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === currentPage);
        if (subItem) return subItem.label;
      }
    }
    return "Dashboard";
  };

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (userRole === 'administrator') {
      // Administrator has access to all menu items
      return menuItems;
    }

    if (userRole === 'finance') {
      // Finance: Dashboard + Finance only
      return menuItems.filter(item => 
        item.id === 'dashboard' || item.id === 'finance'
      );
    }

    if (userRole === 'admin') {
      // Admin: Dashboard + Messenger Task + Order (no master data, no finance)
      return menuItems.filter(item => {
        if (item.id === 'dashboard' || item.id === 'messenger-task' || item.id === 'order-menu') {
          return true;
        }
        return false;
      });
    }

    // Default fallback (shouldn't reach here as messenger has separate dashboard)
    return [menuItems[0]]; // Just dashboard
  };

  const filteredMenuItems = getFilteredMenuItems();

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
                handleLogout={handleLogout}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                filteredMenuItems={filteredMenuItems}
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
          handleLogout={handleLogout}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          filteredMenuItems={filteredMenuItems}
        />

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 items-center justify-center rounded-full glass-card border border-border hover:bg-primary/20 transition-colors"
        >
          <ChevronRight className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-card border-b border-border px-3 py-2.5 md:px-5 md:py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-sm md:text-base leading-tight font-semibold text-foreground">
                {currentPage.startsWith("finance") ? getFinanceHeaderInfo(currentPage).title : getPageTitle()}
              </h2>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {currentPage.startsWith("finance")
                  ? getFinanceHeaderInfo(currentPage).description
                  : `Kelola ${getPageTitle().toLowerCase()} Anda`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 p-0"
              onClick={() => setIsNotificationOpen(true)}
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-0.5 -right-0.5 min-w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full px-1">
                {notifications.length}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage("settings")}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div
              className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border cursor-pointer hover:bg-secondary/50 rounded-lg px-1.5 py-1 md:px-2 transition-colors"
              onClick={() => setCurrentPage("profile")}
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-xs leading-tight">Admin</p>
                <p className="text-[11px] text-muted-foreground">admin@email.com</p>
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

      {/* Notification Dialog */}
      <NotificationDialog 
        open={isNotificationOpen}
        onOpenChange={setIsNotificationOpen}
        notifications={notifications}
      />
    </div>
  );
}

function SidebarContent({ 
  isSidebarOpen, 
  currentPage, 
  setCurrentPage,
  handleLogout,
  expandedMenus,
  setExpandedMenus,
  filteredMenuItems
}: { 
  isSidebarOpen: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  handleLogout: () => void;
  expandedMenus: string[];
  setExpandedMenus: (menus: string[]) => void;
  filteredMenuItems: MenuItem[];
}) {
  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">BJ</span>
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Biro Jasa
              </h1>
              <p className="text-[11px] text-muted-foreground">Management System</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || currentPage.startsWith(item.id + "-");
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <motion.button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.id);
                    if (!isExpanded && isSidebarOpen) {
                      setCurrentPage(item.subItems![0].id);
                    }
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all relative group text-sm",
                  isActive
                    ? "bg-blue-500/12 text-blue-500 border border-blue-500/25"
                    : "hover:bg-secondary/50 text-muted-foreground"
                )}
              >
                {isActive && !hasSubItems && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg"
                    transition={{ type: "spring", damping: 25 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", isActive && "text-blue-400")} />
                {isSidebarOpen && (
                  <>
                    <span className={cn("relative z-10 flex-1 text-left", isActive && "text-blue-400")}>
                      {item.label}
                    </span>
                    {hasSubItems && (
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform relative z-10", 
                          isExpanded ? "rotate-180" : "",
                          isActive && "text-blue-400"
                        )} 
                      />
                    )}
                  </>
                )}
              </motion.button>

              {/* Sub Menu Items */}
              {hasSubItems && isSidebarOpen && (
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/60 pl-2">
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = currentPage === subItem.id;

                          return (
                            <motion.button
                              key={subItem.id}
                              onClick={() => setCurrentPage(subItem.id)}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-xs relative",
                                isSubActive
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "hover:bg-secondary/50 text-muted-foreground"
                              )}
                            >
                              <SubIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isSubActive && "text-blue-500")} />
                              <span className={cn(isSubActive && "text-blue-500")}>
                                {subItem.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-3 border-t border-border shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-2.5 text-red-500 hover:text-red-400 hover:bg-red-500/8 text-sm",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isSidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
