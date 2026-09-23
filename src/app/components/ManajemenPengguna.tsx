import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Search, Eye, Edit, Plus, Shield } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

// Data Pengguna
const initialPenggunaData = [
  { id: 1, nama: "Admin Utama", jabatan: "ADMIN", email: "admin@birojasa.com", status: "Aktif" },
  { id: 2, nama: "Budi Santoso", jabatan: "SVP", email: "budi.santoso@birojasa.com", status: "Aktif" },
  { id: 3, nama: "Siti Nurhaliza", jabatan: "ADMIN", email: "siti.nur@birojasa.com", status: "Aktif" },
  { id: 4, nama: "Andi Wijaya", jabatan: "FINANCE", email: "andi.wijaya@birojasa.com", status: "Aktif" },
  { id: 5, nama: "Dewi Lestari", jabatan: "CLILEN", email: "dewi.lestari@birojasa.com", status: "Aktif" },
  { id: 6, nama: "Rudi Hartono", jabatan: "MESSENGER", email: "rudi.hartono@birojasa.com", status: "Aktif" },
  { id: 7, nama: "Maya Safitri", jabatan: "ADMIN", email: "maya.safitri@birojasa.com", status: "Aktif" },
  { id: 8, nama: "Joko Widodo", jabatan: "MESSENGER", email: "joko.widodo@birojasa.com", status: "Aktif" },
  { id: 9, nama: "Nina Rahayu", jabatan: "CLILEN", email: "nina.rahayu@birojasa.com", status: "Nonaktif" },
  { id: 10, nama: "Eko Prasetyo", jabatan: "FINANCE", email: "eko.prasetyo@birojasa.com", status: "Aktif" },
  { id: 11, nama: "Linda Permata", jabatan: "ADMIN", email: "linda.permata@birojasa.com", status: "Aktif" },
  { id: 12, nama: "Agus Salim", jabatan: "MESSENGER", email: "agus.salim@birojasa.com", status: "Aktif" },
  { id: 13, nama: "Rina Susanti", jabatan: "CLILEN", email: "rina.susanti@birojasa.com", status: "Nonaktif" },
  { id: 14, nama: "Dedi Cahyadi", jabatan: "SVP", email: "dedi.cahyadi@birojasa.com", status: "Aktif" },
  { id: 15, nama: "Fitri Handayani", jabatan: "ADMIN", email: "fitri.handayani@birojasa.com", status: "Aktif" },
  { id: 16, nama: "Yanto Prakarsa", jabatan: "MESSENGER", email: "yanto.prakarsa@birojasa.com", status: "Aktif" },
  { id: 17, nama: "Wati Kurniasih", jabatan: "FINANCE", email: "wati.kurniasih@birojasa.com", status: "Aktif" },
  { id: 18, nama: "Hendro Utomo", jabatan: "MESSENGER", email: "hendro.utomo@birojasa.com", status: "Nonaktif" },
  { id: 19, nama: "Sri Mulyani", jabatan: "ADMIN", email: "sri.mulyani@birojasa.com", status: "Aktif" },
  { id: 20, nama: "Bambang Suryanto", jabatan: "CLILEN", email: "bambang.suryanto@birojasa.com", status: "Aktif" },
  { id: 21, nama: "Tina Marlina", jabatan: "FINANCE", email: "tina.marlina@birojasa.com", status: "Aktif" },
  { id: 22, nama: "Aris Budiman", jabatan: "MESSENGER", email: "aris.budiman@birojasa.com", status: "Aktif" },
  { id: 23, nama: "Lilis Suryani", jabatan: "ADMIN", email: "lilis.suryani@birojasa.com", status: "Aktif" },
  { id: 24, nama: "Hadi Gunawan", jabatan: "SVP", email: "hadi.gunawan@birojasa.com", status: "Aktif" },
  { id: 25, nama: "Novi Andriani", jabatan: "CLILEN", email: "novi.andriani@birojasa.com", status: "Nonaktif" },
];

const ITEMS_PER_PAGE = 10;

export function ManajemenPengguna() {
  const [penggunaData, setPenggunaData] = useState(initialPenggunaData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJabatan, setFilterJabatan] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedPengguna, setSelectedPengguna] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    email: "",
    password: "",
    status: ""
  });
  
  // Permission states
  const [permissions, setPermissions] = useState({
    dashboard: true,
    finance: false,
    masterData: false,
    messengerTask: false,
    order: false,
    orderTracking: false,
    orderTrackingEdit: false,
  });

  // Filter data
  const getFilteredData = () => {
    return penggunaData.filter(item => {
      const matchSearch = searchTerm === "" || 
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "all" || item.status === filterStatus;
      const matchJabatan = filterJabatan === "all" || item.jabatan === filterJabatan;
      
      return matchSearch && matchStatus && matchJabatan;
    });
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handlers
  const handleViewClick = (pengguna: any) => {
    setSelectedPengguna(pengguna);
    setIsViewDialogOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      nama: "",
      jabatan: "",
      email: "",
      password: "",
      status: "Aktif"
    });
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (pengguna: any) => {
    setSelectedPengguna(pengguna);
    setFormData({
      nama: pengguna.nama,
      jabatan: pengguna.jabatan,
      email: pengguna.email,
      password: "",
      status: pengguna.status
    });
    setIsEditDialogOpen(true);
  };
  
  const handlePermissionClick = (pengguna: any) => {
    setSelectedPengguna(pengguna);
    // Set default permissions based on role
    if (pengguna.jabatan === "FINANCE") {
      setPermissions({
        dashboard: true,
        finance: true,
        masterData: false,
        messengerTask: false,
        order: true,
        orderTracking: true,
        orderTrackingEdit: false,
      });
    } else if (pengguna.jabatan === "ADMIN") {
      setPermissions({
        dashboard: true,
        finance: false,
        masterData: true,
        messengerTask: true,
        order: true,
        orderTracking: true,
        orderTrackingEdit: false,
      });
    } else if (pengguna.jabatan === "MESSENGER") {
      setPermissions({
        dashboard: true,
        finance: false,
        masterData: false,
        messengerTask: true,
        order: false,
        orderTracking: false,
        orderTrackingEdit: false,
      });
    } else {
      setPermissions({
        dashboard: true,
        finance: true,
        masterData: true,
        messengerTask: true,
        order: true,
        orderTracking: true,
        orderTrackingEdit: true,
      });
    }
    setIsPermissionDialogOpen(true);
  };
  
  const handleSavePermissions = () => {
    toast.success(`Hak akses ${selectedPengguna.nama} berhasil diperbarui!`);
    setIsPermissionDialogOpen(false);
  };

  const handleAddSubmit = () => {
    if (!formData.nama || !formData.jabatan || !formData.email || !formData.password) {
      toast.error("Harap lengkapi semua field!");
      return;
    }

    const newId = Math.max(...penggunaData.map(p => p.id), 0) + 1;
    const newPengguna = {
      id: newId,
      nama: formData.nama,
      jabatan: formData.jabatan,
      email: formData.email,
      status: formData.status
    };

    setPenggunaData([...penggunaData, newPengguna]);
    setIsAddDialogOpen(false);
    toast.success("Pengguna berhasil ditambahkan!");
  };

  const handleEditSubmit = () => {
    if (!formData.nama || !formData.jabatan || !formData.status) {
      toast.error("Harap lengkapi semua field!");
      return;
    }

    setPenggunaData(penggunaData.map(item => 
      item.id === selectedPengguna.id 
        ? { 
            ...item, 
            nama: formData.nama, 
            jabatan: formData.jabatan,
            email: formData.email,
            status: formData.status
          }
        : item
    ));
    setIsEditDialogOpen(false);
    toast.success("Data pengguna berhasil diupdate!");
  };

  const getStatusBadge = (status: string) => {
    return <Badge status={status}>{status}</Badge>;
  };

  const getJabatanBadge = (jabatan: string) => {
    return <Badge status={jabatan}>{jabatan}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div>
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 pb-2" aria-label="Breadcrumb">
          <span>Master Data</span>
          <span>/</span>
          <span className="text-foreground font-medium">Manajemen Pengguna</span>
        </nav>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Manajemen Pengguna</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Kelola akun pengguna dan akses sistem</p>
        </div>
      </div>

      <Card className="glass-card p-4 space-y-3.5">
        {/* Filters and Add Button Toolbar (Requirement: Add on Left, compact inputs) */}
        <div className="flex flex-col md:flex-row gap-2.5 justify-between items-stretch md:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              size="sm" 
              onClick={handleAddClick} 
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna</span>
            </Button>

            <Select 
              value={filterJabatan} 
              onValueChange={(value) => {
                setFilterJabatan(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-background border-border h-8 text-xs font-normal">
                <SelectValue placeholder="Semua Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Jabatan</SelectItem>
                <SelectItem value="ADMIN" className="text-xs">ADMIN</SelectItem>
                <SelectItem value="SVP" className="text-xs">SVP</SelectItem>
                <SelectItem value="FINANCE" className="text-xs">FINANCE</SelectItem>
                <SelectItem value="CLILEN" className="text-xs">CLILEN</SelectItem>
                <SelectItem value="MESSENGER" className="text-xs">MESSENGER</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filterStatus} 
              onValueChange={(value) => {
                setFilterStatus(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px] bg-background border-border h-8 text-xs font-normal">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
                <SelectItem value="Aktif" className="text-xs">Aktif</SelectItem>
                <SelectItem value="Nonaktif" className="text-xs">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau email..." 
              className="pl-8 bg-background border-border h-8 text-xs font-normal placeholder:font-normal placeholder:text-muted-foreground/60"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
          <Table className="w-full">
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 w-12 text-center">No</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80">Nama</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 text-center">Jabatan</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80">Email</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 text-center">Status</TableHead>
                <TableHead className="h-9 px-2 text-xs font-semibold text-foreground/80 text-center w-[110px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-b border-border/60 last:border-0 h-10">
                    <TableCell className="px-3.5 py-2 text-xs text-muted-foreground text-center">{startIndex + index + 1}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs font-medium text-foreground/90">{item.nama}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs text-center">{getJabatanBadge(item.jabatan)}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs text-muted-foreground">{item.email}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs text-center">{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded transition-colors"
                          onClick={() => handleViewClick(item)}
                          title="Lihat Detail"
                          aria-label="Lihat detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          onClick={() => handleEditClick(item)}
                          title="Edit Pengguna"
                          aria-label="Edit pengguna"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        {item.jabatan !== "SVP" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                            onClick={() => handlePermissionClick(item)}
                            title="Atur Hak Akses"
                            aria-label="Atur hak akses"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-xs">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="text-muted-foreground text-[11px]">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} pengguna
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-7 text-xs border-border px-2.5"
              >
                Sebelumnya
              </Button>
              <div className="text-[11px] text-muted-foreground px-1">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-7 text-xs border-border px-2.5"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap pengguna sistem
            </DialogDescription>
          </DialogHeader>
          {selectedPengguna && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                  <p className="text-sm">{selectedPengguna.nama}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Jabatan</Label>
                  {getJabatanBadge(selectedPengguna.jabatan)}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedPengguna.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status Akun</Label>
                  {getStatusBadge(selectedPengguna.status)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna</DialogTitle>
            <DialogDescription>
              Tambahkan pengguna baru ke sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                type="email"
                placeholder="email@birojasa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Select value={formData.jabatan} onValueChange={(value) => setFormData({ ...formData, jabatan: value })}>
                <SelectTrigger className="bg-input-background border-border mt-2">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="SVP">SVP</SelectItem>
                  <SelectItem value="FINANCE">FINANCE</SelectItem>
                  <SelectItem value="CLILEN">CLILEN</SelectItem>
                  <SelectItem value="MESSENGER">MESSENGER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Password</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Status Aktivasi Akun</Label>
                <p className="text-xs text-muted-foreground">
                  {formData.status === "Aktif" ? "Akun aktif dan dapat mengakses sistem" : "Akun nonaktif dan tidak dapat login"}
                </p>
              </div>
              <Switch 
                checked={formData.status === "Aktif"}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "Aktif" : "Nonaktif" })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAddSubmit}>
              Tambah Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Atur Hak Akses - {selectedPengguna?.nama}
            </DialogTitle>
            <DialogDescription>
              Kelola akses modul untuk pengguna ini. Administrator (SVP) memiliki akses penuh ke semua modul.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Dashboard</Label>
                  <p className="text-xs text-muted-foreground">Akses ke halaman dashboard utama</p>
                </div>
                <Switch 
                  checked={permissions.dashboard}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, dashboard: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Finance</Label>
                  <p className="text-xs text-muted-foreground">Akses ke modul keuangan dan laporan</p>
                </div>
                <Switch 
                  checked={permissions.finance}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, finance: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Master Data</Label>
                  <p className="text-xs text-muted-foreground">Akses ke pengelolaan data master</p>
                </div>
                <Switch 
                  checked={permissions.masterData}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, masterData: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Messenger Task</Label>
                  <p className="text-xs text-muted-foreground">Akses ke pengelolaan tugas messenger</p>
                </div>
                <Switch 
                  checked={permissions.messengerTask}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, messengerTask: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Order</Label>
                  <p className="text-xs text-muted-foreground">Akses ke modul order dan tracking</p>
                </div>
                <Switch 
                  checked={permissions.order}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, order: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Order Tracking</Label>
                  <p className="text-xs text-muted-foreground">Akses untuk melihat tracking order</p>
                </div>
                <Switch 
                  checked={permissions.orderTracking}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, orderTracking: checked })}
                  disabled={!permissions.order}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="space-y-0.5">
                  <Label>Edit Sudah Terverifikasi</Label>
                  <p className="text-xs text-muted-foreground">Izin untuk edit bagian sudah terverifikasi di order tracking</p>
                </div>
                <Switch 
                  checked={permissions.orderTrackingEdit}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, orderTrackingEdit: checked })}
                  disabled={!permissions.orderTracking}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600" onClick={handleSavePermissions}>
              <Shield className="w-4 h-4 mr-2" />
              Simpan Hak Akses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Update informasi pengguna dan status akun
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Select value={formData.jabatan} onValueChange={(value) => setFormData({ ...formData, jabatan: value })}>
                <SelectTrigger className="bg-input-background border-border mt-2">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="SVP">SVP</SelectItem>
                  <SelectItem value="FINANCE">FINANCE</SelectItem>
                  <SelectItem value="CLILEN">CLILEN</SelectItem>
                  <SelectItem value="MESSENGER">MESSENGER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Password Baru</Label>
              <Input 
                className="bg-input-background border-border mt-2" 
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Kosongkan field ini jika tidak ingin mengubah password
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Status Aktivasi Akun</Label>
                <p className="text-xs text-muted-foreground">
                  {formData.status === "Aktif" ? "Akun aktif dan dapat mengakses sistem" : "Akun nonaktif dan tidak dapat login"}
                </p>
              </div>
              <Switch 
                checked={formData.status === "Aktif"}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "Aktif" : "Nonaktif" })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleEditSubmit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
