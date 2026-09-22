import { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  Filter,
  CreditCard,
  Truck,
  Wallet
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge, getStatusBadgeClass } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const recentActivities = [
  { id: 1, type: "success", message: "Perpanjangan STNK selesai - B1234ABC", time: "5 menit lalu" },
  { id: 2, type: "pending", message: "Menunggu pembayaran - D5678EFG", time: "15 menit lalu" },
  { id: 3, type: "warning", message: "Alert: Harga berbeda dari standar", time: "1 jam lalu" },
  { id: 4, type: "success", message: "Mutasi berkas masuk - F9012HIJ", time: "2 jam lalu" },
];

const chartData = [
  { name: "Jan", profit: 24000000, orders: 45 },
  { name: "Feb", profit: 28000000, orders: 52 },
  { name: "Mar", profit: 32000000, orders: 61 },
  { name: "Apr", profit: 29000000, orders: 55 },
  { name: "Mei", profit: 38000000, orders: 68 },
  { name: "Jun", profit: 45250000, orders: 79 },
];

const serviceDistribution = [
  { name: "Perpanjang STNK", value: 45, color: "#3b82f6" },
  { name: "Balik Nama", value: 25, color: "#60a5fa" },
  { name: "Mutasi", value: 20, color: "#93c5fd" },
  { name: "Lainnya", value: 10, color: "#1d4ed8" },
];

// Calendar reminders data
const reminders = [
  { 
    id: 1, 
    date: new Date(2024, 10, 5), // Nov 5
    type: "payment", 
    title: "Tagihan Belum Lunas",
    client: "PT. Maju Jaya",
    amount: "Rp 2.500.000",
    orderNo: "ORD-0012"
  },
  { 
    id: 2, 
    date: new Date(2024, 10, 6), 
    type: "pickup", 
    title: "Jadwal Penjemputan",
    messenger: "Ahmad Rizki",
    location: "Jakarta Timur",
    orderNo: "ORD-0034"
  },
  { 
    id: 3, 
    date: new Date(2024, 10, 7), 
    type: "payment", 
    title: "Tagihan Belum Lunas",
    client: "CV. Sejahtera",
    amount: "Rp 3.800.000",
    orderNo: "ORD-0018"
  },
  { 
    id: 4, 
    date: new Date(2024, 10, 8), 
    type: "delivery", 
    title: "Jadwal Pengantaran",
    messenger: "Budi Santoso",
    location: "Jakarta Selatan",
    orderNo: "ORD-0045"
  },
  { 
    id: 5, 
    date: new Date(2024, 10, 9), 
    type: "pickup", 
    title: "Jadwal Penjemputan",
    messenger: "Dedi Cahyadi",
    location: "Tangerang",
    orderNo: "ORD-0067"
  },
  { 
    id: 6, 
    date: new Date(2024, 10, 10), 
    type: "salary", 
    title: "Tanggal Gajian",
    department: "Semua Karyawan",
    amount: "Rp 45.000.000"
  },
  { 
    id: 7, 
    date: new Date(2024, 10, 12), 
    type: "payment", 
    title: "Tagihan Belum Lunas",
    client: "Siti Rahayu",
    amount: "Rp 1.200.000",
    orderNo: "ORD-0023"
  },
  { 
    id: 8, 
    date: new Date(2024, 10, 14), 
    type: "delivery", 
    title: "Jadwal Pengantaran",
    messenger: "Eko Prasetyo",
    location: "Depok",
    orderNo: "ORD-0078"
  },
  { 
    id: 9, 
    date: new Date(2024, 10, 15), 
    type: "pickup", 
    title: "Jadwal Penjemputan",
    messenger: "Citra Dewi",
    location: "Bekasi",
    orderNo: "ORD-0056"
  },
  { 
    id: 10, 
    date: new Date(2024, 10, 18), 
    type: "payment", 
    title: "Tagihan Belum Lunas",
    client: "Ahmad Yani",
    amount: "Rp 1.750.000",
    orderNo: "ORD-0082"
  },
  { 
    id: 11, 
    date: new Date(2024, 10, 20), 
    type: "delivery", 
    title: "Jadwal Pengantaran",
    messenger: "Ahmad Rizki",
    location: "Jakarta Barat",
    orderNo: "ORD-0091"
  },
  { 
    id: 12, 
    date: new Date(2024, 10, 25), 
    type: "salary", 
    title: "Tanggal Gajian",
    department: "Semua Karyawan",
    amount: "Rp 45.000.000"
  },
];

export function Dashboard() {
  const [berkasFilter, setBerkasFilter] = useState("hari");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Calculate berkas aktif based on filter
  const getBerkasCount = () => {
    switch(berkasFilter) {
      case "hari": return "12";
      case "minggu": return "68";
      case "bulan": return "127";
      case "tahun": return "1.453";
      default: return "127";
    }
  };

  // Get reminders for selected date
  const getRemindersForDate = (date: Date | undefined) => {
    if (!date) return [];
    return reminders.filter(r => 
      r.date.getDate() === date.getDate() &&
      r.date.getMonth() === date.getMonth() &&
      r.date.getFullYear() === date.getFullYear()
    );
  };

  const todaysReminders = getRemindersForDate(selectedDate);

  // Check if date has reminders
  const hasReminders = (date: Date) => {
    return reminders.some(r => 
      r.date.getDate() === date.getDate() &&
      r.date.getMonth() === date.getMonth() &&
      r.date.getFullYear() === date.getFullYear()
    );
  };

  const getReminderIcon = (type: string) => {
    switch(type) {
      case "payment": return <CreditCard className="w-4 h-4" />;
      case "pickup": return <Truck className="w-4 h-4" />;
      case "delivery": return <Truck className="w-4 h-4" />;
      case "salary": return <Wallet className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getReminderColor = (type: string) => getStatusBadgeClass(type);

  const statsData = [
    {
      icon: FileText,
      label: "Berkas Aktif",
      value: getBerkasCount(),
      change: "+8",
      color: "from-blue-500 to-blue-600",
      filter: true
    },
    {
      icon: Users,
      label: "Total Client",
      value: "234",
      change: "+15%",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Package,
      label: "Task Pending",
      value: "12",
      change: "-3",
      color: "from-blue-600 to-indigo-600"
    },
  ];

  return (
    <div className="space-y-4 p-4 md:p-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-lg md:text-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Selamat datang kembali! Berikut ringkasan bisnis Anda.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-4 relative overflow-hidden group hover:shadow-md hover:shadow-blue-500/15 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-8 transition-opacity duration-300`} />
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                    <p className="text-muted-foreground text-xs">{stat.label}</p>
                    {stat.filter && (
                      <Select value={berkasFilter} onValueChange={setBerkasFilter}>
                        <SelectTrigger className="w-24 h-6 text-[11px] bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hari">Per Hari</SelectItem>
                          <SelectItem value="minggu">Per Minggu</SelectItem>
                          <SelectItem value="bulan">Per Bulan</SelectItem>
                          <SelectItem value="tahun">Per Tahun</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <h3 className="text-2xl mb-1">{stat.value}</h3>
                  <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} ml-3 shrink-0`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts & Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Profit Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm">Tren Profit & Order</h3>
                <p className="text-xs text-muted-foreground">6 bulan terakhir</p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop key="stop-top" offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop key="stop-bottom" offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                <XAxis key="x-axis" dataKey="name" stroke="#8b92b8" />
                <YAxis key="y-axis" stroke="#8b92b8" />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: 'rgba(15, 20, 51, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  key="area-profit"
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card p-4">
            <h3 className="mb-4 text-sm">Distribusi Layanan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 20, 51, 0.9)', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Calendar & Reminders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm">Kalender Reminder</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-border"
              modifiers={{
                hasReminder: (date) => hasReminders(date)
              }}
              modifiersStyles={{
                hasReminder: {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-500/20" />
                <span>Tanggal dengan reminder</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Reminders for Selected Date */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card p-4">
            <h3 className="mb-3 text-sm">
              <span className="hidden md:inline">Reminder - {selectedDate?.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="md:hidden">Reminder - {selectedDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </h3>
            <div className="space-y-3">
              {todaysReminders.length > 0 ? (
                todaysReminders.map((reminder) => (
                  <Card key={reminder.id} className={`glass-card p-3 md:p-4 border ${getReminderColor(reminder.type)}`}>
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className={`p-1.5 md:p-2 rounded-lg ${getReminderColor(reminder.type)}`}>
                        {getReminderIcon(reminder.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm">{reminder.title}</p>
                            {reminder.type === "payment" && (
                              <div className="text-[10px] md:text-xs text-muted-foreground mt-1 space-y-0.5">
                                <p className="truncate">Client: {reminder.client}</p>
                                <p className="truncate">Order: {reminder.orderNo}</p>
                                <p className="text-red-400 truncate">{reminder.amount}</p>
                              </div>
                            )}
                            {reminder.type === "pickup" && (
                              <div className="text-[10px] md:text-xs text-muted-foreground mt-1 space-y-0.5">
                                <p className="truncate">Messenger: {reminder.messenger}</p>
                                <p className="truncate">Lokasi: {reminder.location}</p>
                                <p className="truncate">Order: {reminder.orderNo}</p>
                              </div>
                            )}
                            {reminder.type === "delivery" && (
                              <div className="text-[10px] md:text-xs text-muted-foreground mt-1 space-y-0.5">
                                <p className="truncate">Messenger: {reminder.messenger}</p>
                                <p className="truncate">Lokasi: {reminder.location}</p>
                                <p className="truncate">Order: {reminder.orderNo}</p>
                              </div>
                            )}
                            {reminder.type === "salary" && (
                              <div className="text-[10px] md:text-xs text-muted-foreground mt-1 space-y-0.5">
                                <p className="truncate">{reminder.department}</p>
                                <p className="text-blue-500 truncate">{reminder.amount}</p>
                              </div>
                            )}
                          </div>
                          <Badge status={reminder.type}>
                            {reminder.type === "payment" && "Tagihan"}
                            {reminder.type === "pickup" && "Jemput"}
                            {reminder.type === "delivery" && "Antar"}
                            {reminder.type === "salary" && "Gaji"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Tidak ada reminder untuk tanggal ini</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card p-4">
          <h3 className="mb-3 text-sm">Aktivitas Terbaru</h3>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {activity.type === "success" && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
                {activity.type === "pending" && <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                {activity.type === "warning" && <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs">{activity.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}