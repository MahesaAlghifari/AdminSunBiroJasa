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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg mb-2">Manajemen Pengguna</h2>
        <p className="text-muted-foreground">Kelola akun pengguna dan akses sistem</p>
      </div>

      <Card className="glass-card p-4">
        {/* Add Button and Filters */}
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau email..." 
              className="pl-10 bg-input-background border-border"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>
          <Select 
            value={filterJabatan} 
            onValueChange={(value) => {
              setFilterJabatan(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-full lg:w-[200px] bg-input-background border-border">
              <SelectValue placeholder="Semua Jabatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jabatan</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="SVP">SVP</SelectItem>
              <SelectItem value="FINANCE">FINANCE</SelectItem>
              <SelectItem value="CLILEN">CLILEN</SelectItem>
              <SelectItem value="MESSENGER">MESSENGER</SelectItem>
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
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info Bar */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredData.length} dari {penggunaData.length} pengguna
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="w-16">{startIndex + index + 1}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{getJabatanBadge(item.jabatan)}</TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewClick(item)}
                        >
                          <Eye className="w-4 h-4 text-cyan-400" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </Button>
                        {item.jabatan !== "SVP" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => handlePermissionClick(item)}
                          >
                            <Shield className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
