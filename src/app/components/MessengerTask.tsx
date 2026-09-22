import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Plus, Search, Clock, CheckCircle, XCircle, AlertCircle, Truck, PackageOpen, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { cn } from "./ui/utils";

// Generate messenger task data
const generateTaskData = () => {
  const messengers = ["Ahmad Rizki", "Budi Santoso", "Citra Dewi", "Dedi Cahyadi", "Eko Prasetyo", "Fandi Kurniawan", "Gilang Ramadhan", "Hendra Wijaya"];
  const customers = ["PT. Maju Jaya", "John Doe", "Siti Rahayu", "Ahmad Yani", "Budi Santoso", "Dewi Lestari", "Eko Prasetyo", "Rina Susanti", "CV. Berkah", "PT. Sejahtera"];
  const jenisTugas = ["Perpanjangan STNK 1 Tahun", "Perpanjangan STNK 5 Tahun", "Balik Nama", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Tarik Berkas", "Duplikat STNK"];
  const lokasi = ["Samsat Jakarta Timur", "Samsat Jakarta Barat", "Samsat Jakarta Selatan", "Samsat Jakarta Utara", "Samsat Depok", "Samsat Bekasi", "Samsat Tangerang"];
  const statuses = ["Selesai", "Dalam Proses", "Belum Diambil", "Pending", "Dibatalkan"];
  const keteranganTugas = ["Jemput Dokumen", "Proses Samsat", "Pengantaran Dokumen"];
  
  const tasks = [];
  for (let i = 1; i <= 45; i++) {
    const randomMessenger = messengers[Math.floor(Math.random() * messengers.length)];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomJenisTugas = jenisTugas[Math.floor(Math.random() * jenisTugas.length)];
    const randomLokasi = lokasi[Math.floor(Math.random() * lokasi.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomKeteranganTugas = keteranganTugas[Math.floor(Math.random() * keteranganTugas.length)];
    
    const dayTerima = Math.floor(Math.random() * 30) + 1;
    const monthTerima = Math.floor(Math.random() * 3) + 9; // Sept, Oct, Nov
    const tanggalTerima = `2024-${String(monthTerima).padStart(2, '0')}-${String(dayTerima).padStart(2, '0')}`;
    
    let tanggalSelesai = "-";
    if (randomStatus === "Selesai") {
      const daySelesai = Math.min(dayTerima + Math.floor(Math.random() * 5) + 1, 30);
      tanggalSelesai = `2024-${String(monthTerima).padStart(2, '0')}-${String(daySelesai).padStart(2, '0')}`;
    }
    
    tasks.push({
      id: i,
      messenger: randomMessenger,
      customer: randomCustomer,
      jenisTugas: randomJenisTugas,
      lokasi: randomLokasi,
      tanggalTerima: tanggalTerima,
      tanggalSelesai: tanggalSelesai,
      status: randomStatus,
      noBerkas: `TSK-${String(i).padStart(4, '0')}`,
      keteranganTugas: randomKeteranganTugas,
      keterangan: randomStatus === "Selesai" ? "Sudah selesai, dokumen diantar" : randomStatus === "Dalam Proses" ? "Sedang proses di samsat" : "Menunggu messenger"
    });
  }
  return tasks;
};

const initialTaskData = generateTaskData();

const getStatusColor = (status: string) => {
  switch (status) {
    case "Selesai":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Dalam Proses":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Belum Diambil":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Pending":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Dibatalkan":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Selesai":
      return <CheckCircle className="w-4 h-4" />;
    case "Dalam Proses":
      return <Clock className="w-4 h-4" />;
    case "Belum Diambil":
      return <AlertCircle className="w-4 h-4" />;
    case "Pending":
      return <AlertCircle className="w-4 h-4" />;
    case "Dibatalkan":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Truck className="w-4 h-4" />;
  }
};

export function MessengerTask() {
  const [taskData, setTaskData] = useState(initialTaskData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMessenger, setFilterMessenger] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [newTaskData, setNewTaskData] = useState({
    messenger: "",
    customer: "",
    jenisTugas: "",
    lokasi: "",
    keteranganTugas: "",
    tanggalTerima: "",
  });
  const [editTaskData, setEditTaskData] = useState<any>(null);

  // Filter data
  const getFilteredData = () => {
    return taskData.filter(item => {
      const matchSearch = searchTerm === "" || 
        item.noBerkas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.messenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "all" || item.status === filterStatus;
      const matchMessenger = filterMessenger === "all" || item.messenger === filterMessenger;
      
      return matchSearch && matchStatus && matchMessenger;
    });
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Stats calculation
  const statusCounts = {
    belumDiambil: taskData.filter(t => t.status === "Belum Diambil").length,
    dalamProses: taskData.filter(t => t.status === "Dalam Proses").length,
    selesai: taskData.filter(t => t.status === "Selesai").length,
    pending: taskData.filter(t => t.status === "Pending").length,
  };

  // Get unique messengers for filter
  const uniqueMessengers = Array.from(new Set(taskData.map(t => t.messenger)));

  const handleAddTask = () => {
    if (!newTaskData.messenger || !newTaskData.customer || !newTaskData.jenisTugas) {
      toast.error("Mohon lengkapi data yang diperlukan!");
      return;
    }

    const newTask = {
      id: taskData.length + 1,
      ...newTaskData,
      noBerkas: `TSK-${String(taskData.length + 1).padStart(4, '0')}`,
      status: "Belum Diambil",
      tanggalSelesai: "-",
      keterangan: "Menunggu messenger"
    };

    setTaskData([...taskData, newTask]);
    setNewTaskData({
      messenger: "",
      customer: "",
      jenisTugas: "",
      lokasi: "",
      keteranganTugas: "",
      tanggalTerima: "",
    });
    setIsAddDialogOpen(false);
    toast.success("Tugas baru berhasil ditambahkan!");
  };

  const handleViewDetail = (task: any) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };

  const handleEditTask = (task: any) => {
    setEditTaskData({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editTaskData.messenger || !editTaskData.customer || !editTaskData.jenisTugas) {
      toast.error("Mohon lengkapi data yang diperlukan!");
      return;
    }

    setTaskData(taskData.map(task => 
      task.id === editTaskData.id ? editTaskData : task
    ));
    setIsEditDialogOpen(false);
    setEditTaskData(null);
    toast.success("Tugas berhasil diupdate!");
  };

  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Messenger Task</h1>
        <p className="text-muted-foreground mt-1">Kelola tugas dan aktivitas messenger</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Belum Diambil</p>
                <h3 className="text-xl text-amber-400">{statusCounts.belumDiambil}</h3>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dalam Proses</p>
                <h3 className="text-xl text-blue-400">{statusCounts.dalamProses}</h3>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <h3 className="text-xl text-green-400">{statusCounts.selesai}</h3>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/20">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-xl text-orange-400">{statusCounts.pending}</h3>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card p-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari no berkas, messenger, atau customer..." 
                className="pl-10 bg-input-background border-border"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>
            <Select 
              value={filterMessenger} 
              onValueChange={(value) => {
                setFilterMessenger(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px] bg-input-background border-border">
                <SelectValue placeholder="Semua Messenger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Messenger</SelectItem>
                {uniqueMessengers.map((messenger) => (
                  <SelectItem key={messenger} value={messenger}>
                    {messenger}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filterStatus} 
              onValueChange={(value) => {
                setFilterStatus(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px] bg-input-background border-border">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Belum Diambil">Belum Diambil</SelectItem>
                <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={String(itemsPerPage)} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[150px] bg-input-background border-border">
                <SelectValue placeholder={`${itemsPerPage} per halaman`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per halaman</SelectItem>
                <SelectItem value="25">25 per halaman</SelectItem>
                <SelectItem value="50">50 per halaman</SelectItem>
                <SelectItem value="100">100 per halaman</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tugas Baru
            </Button>
          </div>

          {/* Info Bar */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Menampilkan {paginatedData.length} dari {filteredData.length} tugas ({taskData.length} total)
            </p>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>No Berkas</TableHead>
                  <TableHead>Messenger</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Jenis Layanan</TableHead>
                  <TableHead>Keterangan Tugas</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tgl Terima</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((task, index) => (
                    <TableRow key={task.id} className="hover:bg-secondary/20 transition-colors">
                      <TableCell className="w-16">{startIndex + index + 1}</TableCell>
                      <TableCell className="font-mono text-blue-400">{task.noBerkas}</TableCell>
                      <TableCell>{task.messenger}</TableCell>
                      <TableCell>{task.customer}</TableCell>
                      <TableCell>{task.jenisTugas}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          task.keteranganTugas === "Jemput Dokumen" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                          task.keteranganTugas === "Proses Samsat" && "bg-blue-500/15 text-blue-500 border-purple-500/30",
                          task.keteranganTugas === "Pengantaran Dokumen" && "bg-green-500/20 text-green-400 border-green-500/30"
                        )}>
                          <span className="flex items-center gap-1">
                            <PackageOpen className="w-3 h-3" />
                            {task.keteranganTugas}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{task.lokasi}</TableCell>
                      <TableCell>{task.tanggalTerima}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-500/20"
                            onClick={() => handleViewDetail(task)}
                          >
                            <Eye className="w-4 h-4 text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-amber-500/20"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="w-4 h-4 text-amber-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      Tidak ada data ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </motion.div>

      {/* View Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Tugas</DialogTitle>
            <DialogDescription>Informasi lengkap tugas messenger</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">No Berkas</Label>
                  <p className="font-mono text-blue-400">{selectedTask.noBerkas}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedTask.status)}
                      {selectedTask.status}
                    </span>
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Messenger</Label>
                  <p>{selectedTask.messenger}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Customer</Label>
                  <p>{selectedTask.customer}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Jenis Layanan</Label>
                  <p>{selectedTask.jenisTugas}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Keterangan Tugas</Label>
                  <Badge className={cn(
                    selectedTask.keteranganTugas === "Jemput Dokumen" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    selectedTask.keteranganTugas === "Proses Samsat" && "bg-blue-500/15 text-blue-500 border-purple-500/30",
                    selectedTask.keteranganTugas === "Pengantaran Dokumen" && "bg-green-500/20 text-green-400 border-green-500/30"
                  )}>
                    {selectedTask.keteranganTugas}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Lokasi Samsat</Label>
                <p>{selectedTask.lokasi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tanggal Terima</Label>
                  <p>{selectedTask.tanggalTerima}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tanggal Selesai</Label>
                  <p>{selectedTask.tanggalSelesai}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Keterangan</Label>
                <p className="text-sm">{selectedTask.keterangan}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription>Perbarui informasi tugas messenger</DialogDescription>
          </DialogHeader>
          {editTaskData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Messenger</Label>
                  <Select value={editTaskData.messenger} onValueChange={(value) => setEditTaskData({...editTaskData, messenger: value})}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Pilih messenger" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueMessengers.map((messenger) => (
                        <SelectItem key={messenger} value={messenger}>{messenger}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Input 
                    value={editTaskData.customer}
                    onChange={(e) => setEditTaskData({...editTaskData, customer: e.target.value})}
                    className="bg-input-background border-border"
                    placeholder="Nama customer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Layanan</Label>
                  <Select value={editTaskData.jenisTugas} onValueChange={(value) => setEditTaskData({...editTaskData, jenisTugas: value})}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Pilih jenis layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perpanjangan STNK 1 Tahun">Perpanjangan STNK 1 Tahun</SelectItem>
                      <SelectItem value="Perpanjangan STNK 5 Tahun">Perpanjangan STNK 5 Tahun</SelectItem>
                      <SelectItem value="Balik Nama">Balik Nama</SelectItem>
                      <SelectItem value="Mutasi Antar Samsat">Mutasi Antar Samsat</SelectItem>
                      <SelectItem value="Mutasi Luar Daerah">Mutasi Luar Daerah</SelectItem>
                      <SelectItem value="Tarik Berkas">Tarik Berkas</SelectItem>
                      <SelectItem value="Duplikat STNK">Duplikat STNK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Keterangan Tugas</Label>
                  <Select value={editTaskData.keteranganTugas} onValueChange={(value) => setEditTaskData({...editTaskData, keteranganTugas: value})}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Pilih keterangan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jemput Dokumen">Jemput Dokumen</SelectItem>
                      <SelectItem value="Proses Samsat">Proses Samsat</SelectItem>
                      <SelectItem value="Pengantaran Dokumen">Pengantaran Dokumen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lokasi Samsat</Label>
                  <Select value={editTaskData.lokasi} onValueChange={(value) => setEditTaskData({...editTaskData, lokasi: value})}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Samsat Jakarta Timur">Samsat Jakarta Timur</SelectItem>
                      <SelectItem value="Samsat Jakarta Barat">Samsat Jakarta Barat</SelectItem>
                      <SelectItem value="Samsat Jakarta Selatan">Samsat Jakarta Selatan</SelectItem>
                      <SelectItem value="Samsat Jakarta Utara">Samsat Jakarta Utara</SelectItem>
                      <SelectItem value="Samsat Depok">Samsat Depok</SelectItem>
                      <SelectItem value="Samsat Bekasi">Samsat Bekasi</SelectItem>
                      <SelectItem value="Samsat Tangerang">Samsat Tangerang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editTaskData.status} onValueChange={(value) => setEditTaskData({...editTaskData, status: value})}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Diambil">Belum Diambil</SelectItem>
                      <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Terima</Label>
                  <Input 
                    type="date"
                    value={editTaskData.tanggalTerima}
                    onChange={(e) => setEditTaskData({...editTaskData, tanggalTerima: e.target.value})}
                    className="bg-input-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Selesai</Label>
                  <Input 
                    type="date"
                    value={editTaskData.tanggalSelesai === "-" ? "" : editTaskData.tanggalSelesai}
                    onChange={(e) => setEditTaskData({...editTaskData, tanggalSelesai: e.target.value || "-"})}
                    className="bg-input-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input 
                  value={editTaskData.keterangan}
                  onChange={(e) => setEditTaskData({...editTaskData, keterangan: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Keterangan tambahan"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateTask} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Update Tugas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Tugas Baru</DialogTitle>
            <DialogDescription>Buat tugas baru untuk messenger</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Messenger</Label>
                <Select value={newTaskData.messenger} onValueChange={(value) => setNewTaskData({...newTaskData, messenger: value})}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih messenger" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueMessengers.map((messenger) => (
                      <SelectItem key={messenger} value={messenger}>{messenger}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input 
                  value={newTaskData.customer}
                  onChange={(e) => setNewTaskData({...newTaskData, customer: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Nama customer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Layanan</Label>
                <Select value={newTaskData.jenisTugas} onValueChange={(value) => setNewTaskData({...newTaskData, jenisTugas: value})}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih jenis layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perpanjangan STNK 1 Tahun">Perpanjangan STNK 1 Tahun</SelectItem>
                    <SelectItem value="Perpanjangan STNK 5 Tahun">Perpanjangan STNK 5 Tahun</SelectItem>
                    <SelectItem value="Balik Nama">Balik Nama</SelectItem>
                    <SelectItem value="Mutasi Antar Samsat">Mutasi Antar Samsat</SelectItem>
                    <SelectItem value="Mutasi Luar Daerah">Mutasi Luar Daerah</SelectItem>
                    <SelectItem value="Tarik Berkas">Tarik Berkas</SelectItem>
                    <SelectItem value="Duplikat STNK">Duplikat STNK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keterangan Tugas</Label>
                <Select value={newTaskData.keteranganTugas} onValueChange={(value) => setNewTaskData({...newTaskData, keteranganTugas: value})}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih keterangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jemput Dokumen">Jemput Dokumen</SelectItem>
                    <SelectItem value="Proses Samsat">Proses Samsat</SelectItem>
                    <SelectItem value="Pengantaran Dokumen">Pengantaran Dokumen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lokasi Samsat</Label>
                <Select value={newTaskData.lokasi} onValueChange={(value) => setNewTaskData({...newTaskData, lokasi: value})}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Samsat Jakarta Timur">Samsat Jakarta Timur</SelectItem>
                    <SelectItem value="Samsat Jakarta Barat">Samsat Jakarta Barat</SelectItem>
                    <SelectItem value="Samsat Jakarta Selatan">Samsat Jakarta Selatan</SelectItem>
                    <SelectItem value="Samsat Jakarta Utara">Samsat Jakarta Utara</SelectItem>
                    <SelectItem value="Samsat Depok">Samsat Depok</SelectItem>
                    <SelectItem value="Samsat Bekasi">Samsat Bekasi</SelectItem>
                    <SelectItem value="Samsat Tangerang">Samsat Tangerang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Terima</Label>
                <Input 
                  type="date"
                  value={newTaskData.tanggalTerima}
                  onChange={(e) => setNewTaskData({...newTaskData, tanggalTerima: e.target.value})}
                  className="bg-input-background border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddTask} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Tambah Tugas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
