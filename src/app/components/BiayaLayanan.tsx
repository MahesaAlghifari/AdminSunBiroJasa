import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

// Data Biaya Layanan per Wilayah
const initialBiayaLayananData = [
  // Perpanjangan 1 Tahun
  { id: 1, layanan: "Perpanjangan 1 Tahun", wilayah: "Jakarta Timur", biayaJasaLengkap: 250000, biayaJasaNembak: 150000, biayaAntarJemput: 50000 },
  { id: 2, layanan: "Perpanjangan 1 Tahun", wilayah: "Jakarta Barat", biayaJasaLengkap: 250000, biayaJasaNembak: 150000, biayaAntarJemput: 50000 },
  { id: 3, layanan: "Perpanjangan 1 Tahun", wilayah: "Jakarta Selatan", biayaJasaLengkap: 250000, biayaJasaNembak: 150000, biayaAntarJemput: 50000 },
  { id: 4, layanan: "Perpanjangan 1 Tahun", wilayah: "Jakarta Utara", biayaJasaLengkap: 250000, biayaJasaNembak: 150000, biayaAntarJemput: 50000 },
  { id: 5, layanan: "Perpanjangan 1 Tahun", wilayah: "Jakarta Pusat", biayaJasaLengkap: 250000, biayaJasaNembak: 150000, biayaAntarJemput: 50000 },
  { id: 6, layanan: "Perpanjangan 1 Tahun", wilayah: "Depok", biayaJasaLengkap: 230000, biayaJasaNembak: 140000, biayaAntarJemput: 60000 },
  { id: 7, layanan: "Perpanjangan 1 Tahun", wilayah: "Bekasi", biayaJasaLengkap: 240000, biayaJasaNembak: 145000, biayaAntarJemput: 55000 },
  { id: 8, layanan: "Perpanjangan 1 Tahun", wilayah: "Tangerang", biayaJasaLengkap: 240000, biayaJasaNembak: 145000, biayaAntarJemput: 55000 },
  { id: 9, layanan: "Perpanjangan 1 Tahun", wilayah: "Bogor", biayaJasaLengkap: 230000, biayaJasaNembak: 140000, biayaAntarJemput: 65000 },
  { id: 10, layanan: "Perpanjangan 1 Tahun", wilayah: "Tangerang Selatan", biayaJasaLengkap: 245000, biayaJasaNembak: 148000, biayaAntarJemput: 52000 },
  
  // Perpanjangan 5 Tahun
  { id: 11, layanan: "Perpanjangan 5 Tahun", wilayah: "Jakarta Timur", biayaJasaLengkap: 500000, biayaJasaNembak: 300000, biayaAntarJemput: 50000 },
  { id: 12, layanan: "Perpanjangan 5 Tahun", wilayah: "Jakarta Barat", biayaJasaLengkap: 500000, biayaJasaNembak: 300000, biayaAntarJemput: 50000 },
  { id: 13, layanan: "Perpanjangan 5 Tahun", wilayah: "Jakarta Selatan", biayaJasaLengkap: 500000, biayaJasaNembak: 300000, biayaAntarJemput: 50000 },
  { id: 14, layanan: "Perpanjangan 5 Tahun", wilayah: "Jakarta Utara", biayaJasaLengkap: 500000, biayaJasaNembak: 300000, biayaAntarJemput: 50000 },
  { id: 15, layanan: "Perpanjangan 5 Tahun", wilayah: "Jakarta Pusat", biayaJasaLengkap: 500000, biayaJasaNembak: 300000, biayaAntarJemput: 50000 },
  { id: 16, layanan: "Perpanjangan 5 Tahun", wilayah: "Depok", biayaJasaLengkap: 480000, biayaJasaNembak: 290000, biayaAntarJemput: 60000 },
  { id: 17, layanan: "Perpanjangan 5 Tahun", wilayah: "Bekasi", biayaJasaLengkap: 490000, biayaJasaNembak: 295000, biayaAntarJemput: 55000 },
  { id: 18, layanan: "Perpanjangan 5 Tahun", wilayah: "Tangerang", biayaJasaLengkap: 490000, biayaJasaNembak: 295000, biayaAntarJemput: 55000 },
  { id: 19, layanan: "Perpanjangan 5 Tahun", wilayah: "Bogor", biayaJasaLengkap: 480000, biayaJasaNembak: 290000, biayaAntarJemput: 65000 },
  { id: 20, layanan: "Perpanjangan 5 Tahun", wilayah: "Tangerang Selatan", biayaJasaLengkap: 495000, biayaJasaNembak: 298000, biayaAntarJemput: 52000 },
  
  // Mutasi Antar Samsat
  { id: 21, layanan: "Mutasi Antar Samsat", wilayah: "Jakarta Timur", biayaJasa: 800000, biayaAntarJemput: 50000 },
  { id: 22, layanan: "Mutasi Antar Samsat", wilayah: "Jakarta Barat", biayaJasa: 800000, biayaAntarJemput: 50000 },
  { id: 23, layanan: "Mutasi Antar Samsat", wilayah: "Jakarta Selatan", biayaJasa: 800000, biayaAntarJemput: 50000 },
  { id: 24, layanan: "Mutasi Antar Samsat", wilayah: "Jakarta Utara", biayaJasa: 800000, biayaAntarJemput: 50000 },
  { id: 25, layanan: "Mutasi Antar Samsat", wilayah: "Jakarta Pusat", biayaJasa: 800000, biayaAntarJemput: 50000 },
  { id: 26, layanan: "Mutasi Antar Samsat", wilayah: "Depok", biayaJasa: 750000, biayaAntarJemput: 60000 },
  { id: 27, layanan: "Mutasi Antar Samsat", wilayah: "Bekasi", biayaJasa: 780000, biayaAntarJemput: 55000 },
  { id: 28, layanan: "Mutasi Antar Samsat", wilayah: "Tangerang", biayaJasa: 780000, biayaAntarJemput: 55000 },
  { id: 29, layanan: "Mutasi Antar Samsat", wilayah: "Bogor", biayaJasa: 750000, biayaAntarJemput: 65000 },
  { id: 30, layanan: "Mutasi Antar Samsat", wilayah: "Tangerang Selatan", biayaJasa: 790000, biayaAntarJemput: 52000 },
  
  // Mutasi Luar Daerah
  { id: 31, layanan: "Mutasi Luar Daerah", wilayah: "Jakarta Timur", biayaJasa: 1500000, biayaAntarJemput: 50000 },
  { id: 32, layanan: "Mutasi Luar Daerah", wilayah: "Jakarta Barat", biayaJasa: 1500000, biayaAntarJemput: 50000 },
  { id: 33, layanan: "Mutasi Luar Daerah", wilayah: "Jakarta Selatan", biayaJasa: 1500000, biayaAntarJemput: 50000 },
  { id: 34, layanan: "Mutasi Luar Daerah", wilayah: "Jakarta Utara", biayaJasa: 1500000, biayaAntarJemput: 50000 },
  { id: 35, layanan: "Mutasi Luar Daerah", wilayah: "Jakarta Pusat", biayaJasa: 1500000, biayaAntarJemput: 50000 },
  { id: 36, layanan: "Mutasi Luar Daerah", wilayah: "Depok", biayaJasa: 1400000, biayaAntarJemput: 60000 },
  { id: 37, layanan: "Mutasi Luar Daerah", wilayah: "Bekasi", biayaJasa: 1450000, biayaAntarJemput: 55000 },
  { id: 38, layanan: "Mutasi Luar Daerah", wilayah: "Tangerang", biayaJasa: 1450000, biayaAntarJemput: 55000 },
  { id: 39, layanan: "Mutasi Luar Daerah", wilayah: "Bogor", biayaJasa: 1400000, biayaAntarJemput: 65000 },
  { id: 40, layanan: "Mutasi Luar Daerah", wilayah: "Tangerang Selatan", biayaJasa: 1475000, biayaAntarJemput: 52000 },
  
  // Balik Nama
  { id: 41, layanan: "Balik Nama", wilayah: "Jakarta Timur", biayaJasa: 1200000, biayaAntarJemput: 50000 },
  { id: 42, layanan: "Balik Nama", wilayah: "Jakarta Barat", biayaJasa: 1200000, biayaAntarJemput: 50000 },
  { id: 43, layanan: "Balik Nama", wilayah: "Jakarta Selatan", biayaJasa: 1200000, biayaAntarJemput: 50000 },
  { id: 44, layanan: "Balik Nama", wilayah: "Jakarta Utara", biayaJasa: 1200000, biayaAntarJemput: 50000 },
  { id: 45, layanan: "Balik Nama", wilayah: "Jakarta Pusat", biayaJasa: 1200000, biayaAntarJemput: 50000 },
  { id: 46, layanan: "Balik Nama", wilayah: "Depok", biayaJasa: 1100000, biayaAntarJemput: 60000 },
  { id: 47, layanan: "Balik Nama", wilayah: "Bekasi", biayaJasa: 1150000, biayaAntarJemput: 55000 },
  { id: 48, layanan: "Balik Nama", wilayah: "Tangerang", biayaJasa: 1150000, biayaAntarJemput: 55000 },
  { id: 49, layanan: "Balik Nama", wilayah: "Bogor", biayaJasa: 1100000, biayaAntarJemput: 65000 },
  { id: 50, layanan: "Balik Nama", wilayah: "Tangerang Selatan", biayaJasa: 1175000, biayaAntarJemput: 52000 },
  
  // Tarik Berkas
  { id: 51, layanan: "Tarik Berkas", wilayah: "Jakarta Timur", biayaJasa: 600000, biayaAntarJemput: 50000 },
  { id: 52, layanan: "Tarik Berkas", wilayah: "Jakarta Barat", biayaJasa: 600000, biayaAntarJemput: 50000 },
  { id: 53, layanan: "Tarik Berkas", wilayah: "Jakarta Selatan", biayaJasa: 600000, biayaAntarJemput: 50000 },
  { id: 54, layanan: "Tarik Berkas", wilayah: "Jakarta Utara", biayaJasa: 600000, biayaAntarJemput: 50000 },
  { id: 55, layanan: "Tarik Berkas", wilayah: "Jakarta Pusat", biayaJasa: 600000, biayaAntarJemput: 50000 },
  { id: 56, layanan: "Tarik Berkas", wilayah: "Depok", biayaJasa: 550000, biayaAntarJemput: 60000 },
  { id: 57, layanan: "Tarik Berkas", wilayah: "Bekasi", biayaJasa: 580000, biayaAntarJemput: 55000 },
  { id: 58, layanan: "Tarik Berkas", wilayah: "Tangerang", biayaJasa: 580000, biayaAntarJemput: 55000 },
  { id: 59, layanan: "Tarik Berkas", wilayah: "Bogor", biayaJasa: 550000, biayaAntarJemput: 65000 },
  { id: 60, layanan: "Tarik Berkas", wilayah: "Tangerang Selatan", biayaJasa: 590000, biayaAntarJemput: 52000 },
  
  // Duplikat STNK
  { id: 61, layanan: "Duplikat STNK", wilayah: "Jakarta Timur", biayaJasa: 350000, biayaAntarJemput: 50000 },
  { id: 62, layanan: "Duplikat STNK", wilayah: "Jakarta Barat", biayaJasa: 350000, biayaAntarJemput: 50000 },
  { id: 63, layanan: "Duplikat STNK", wilayah: "Jakarta Selatan", biayaJasa: 350000, biayaAntarJemput: 50000 },
  { id: 64, layanan: "Duplikat STNK", wilayah: "Jakarta Utara", biayaJasa: 350000, biayaAntarJemput: 50000 },
  { id: 65, layanan: "Duplikat STNK", wilayah: "Jakarta Pusat", biayaJasa: 350000, biayaAntarJemput: 50000 },
  { id: 66, layanan: "Duplikat STNK", wilayah: "Depok", biayaJasa: 320000, biayaAntarJemput: 60000 },
  { id: 67, layanan: "Duplikat STNK", wilayah: "Bekasi", biayaJasa: 340000, biayaAntarJemput: 55000 },
  { id: 68, layanan: "Duplikat STNK", wilayah: "Tangerang", biayaJasa: 340000, biayaAntarJemput: 55000 },
  { id: 69, layanan: "Duplikat STNK", wilayah: "Bogor", biayaJasa: 320000, biayaAntarJemput: 65000 },
  { id: 70, layanan: "Duplikat STNK", wilayah: "Tangerang Selatan", biayaJasa: 345000, biayaAntarJemput: 52000 },
];

const wilayahList = [
  "Jakarta Timur", "Jakarta Barat", "Jakarta Selatan", "Jakarta Utara", "Jakarta Pusat",
  "Depok", "Bekasi", "Tangerang", "Bogor", "Tangerang Selatan"
];

const layananTabs = [
  { value: "perpanjangan-1", label: "Perpanjangan 1 Tahun", key: "Perpanjangan 1 Tahun" },
  { value: "perpanjangan-5", label: "Perpanjangan 5 Tahun", key: "Perpanjangan 5 Tahun" },
  { value: "mutasi-antar", label: "Mutasi Antar Samsat", key: "Mutasi Antar Samsat" },
  { value: "mutasi-luar", label: "Mutasi Luar Daerah", key: "Mutasi Luar Daerah" },
  { value: "balik-nama", label: "Balik Nama", key: "Balik Nama" },
  { value: "tarik-berkas", label: "Tarik Berkas", key: "Tarik Berkas" },
  { value: "duplikat-stnk", label: "Duplikat STNK", key: "Duplikat STNK" },
];

const ITEMS_PER_PAGE = 5;

export function BiayaLayanan() {
  const [biayaData, setBiayaData] = useState(initialBiayaLayananData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("perpanjangan-1");
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    wilayah: "",
    biayaJasa: "",
    biayaJasaLengkap: "",
    biayaJasaNembak: "",
    biayaAntarJemput: ""
  });

  const getCurrentLayanan = () => {
    return layananTabs.find(tab => tab.value === activeTab)?.key || "";
  };

  const isPerpanjangan = () => {
    const layanan = getCurrentLayanan();
    return layanan === "Perpanjangan 1 Tahun" || layanan === "Perpanjangan 5 Tahun";
  };

  // Filter data berdasarkan tab dan search
  const getFilteredData = () => {
    const currentLayanan = getCurrentLayanan();
    return biayaData.filter(item => 
      item.layanan === currentLayanan &&
      (searchTerm === "" || item.wilayah.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when changing tabs or search
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handlers
  const handleAddClick = () => {
    setFormData({ 
      wilayah: "", 
      biayaJasa: "",
      biayaJasaLengkap: "", 
      biayaJasaNembak: "", 
      biayaAntarJemput: "" 
    });
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    if (isPerpanjangan()) {
      setFormData({
        wilayah: item.wilayah,
        biayaJasa: "",
        biayaJasaLengkap: item.biayaJasaLengkap?.toString() || "",
        biayaJasaNembak: item.biayaJasaNembak?.toString() || "",
        biayaAntarJemput: item.biayaAntarJemput?.toString() || ""
      });
    } else {
      setFormData({
        wilayah: item.wilayah,
        biayaJasa: item.biayaJasa?.toString() || "",
        biayaJasaLengkap: "",
        biayaJasaNembak: "",
        biayaAntarJemput: item.biayaAntarJemput?.toString() || ""
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = () => {
    if (!formData.wilayah || !formData.biayaAntarJemput) {
      toast.error("Harap lengkapi semua field!");
      return;
    }

    if (isPerpanjangan()) {
      if (!formData.biayaJasaLengkap || !formData.biayaJasaNembak) {
        toast.error("Harap lengkapi semua field!");
        return;
      }
    } else {
      if (!formData.biayaJasa) {
        toast.error("Harap lengkapi semua field!");
        return;
      }
    }

    const newItem: any = {
      id: Math.max(...biayaData.map(item => item.id)) + 1,
      layanan: getCurrentLayanan(),
      wilayah: formData.wilayah,
      biayaAntarJemput: parseInt(formData.biayaAntarJemput)
    };

    if (isPerpanjangan()) {
      newItem.biayaJasaLengkap = parseInt(formData.biayaJasaLengkap);
      newItem.biayaJasaNembak = parseInt(formData.biayaJasaNembak);
    } else {
      newItem.biayaJasa = parseInt(formData.biayaJasa);
    }

    setBiayaData([...biayaData, newItem]);
    setIsAddDialogOpen(false);
    toast.success("Biaya layanan berhasil ditambahkan!");
  };

  const handleEditSubmit = () => {
    if (!formData.wilayah || !formData.biayaAntarJemput) {
      toast.error("Harap lengkapi semua field!");
      return;
    }

    if (isPerpanjangan()) {
      if (!formData.biayaJasaLengkap || !formData.biayaJasaNembak) {
        toast.error("Harap lengkapi semua field!");
        return;
      }
    } else {
      if (!formData.biayaJasa) {
        toast.error("Harap lengkapi semua field!");
        return;
      }
    }

    setBiayaData(biayaData.map(item => {
      if (item.id === selectedItem.id) {
        const updated: any = { 
          ...item, 
          wilayah: formData.wilayah,
          biayaAntarJemput: parseInt(formData.biayaAntarJemput)
        };
        
        if (isPerpanjangan()) {
          updated.biayaJasaLengkap = parseInt(formData.biayaJasaLengkap);
          updated.biayaJasaNembak = parseInt(formData.biayaJasaNembak);
        } else {
          updated.biayaJasa = parseInt(formData.biayaJasa);
        }
        
        return updated;
      }
      return item;
    }));
    
    setIsEditDialogOpen(false);
    toast.success("Biaya layanan berhasil diupdate!");
  };

  const handleDeleteConfirm = () => {
    setBiayaData(biayaData.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    toast.success("Biaya layanan berhasil dihapus!");
  };

  const renderTableHeaders = () => {
    if (isPerpanjangan()) {
      return (
        <>
          <TableHead>No</TableHead>
          <TableHead>Wilayah Samsat</TableHead>
          <TableHead>Biaya Jasa Lengkap</TableHead>
          <TableHead>Biaya Jasa Nembak</TableHead>
          <TableHead>Biaya Antar & Jemput</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </>
      );
    }
    
    return (
      <>
        <TableHead>No</TableHead>
        <TableHead>Wilayah Samsat</TableHead>
        <TableHead>Biaya Jasa</TableHead>
        <TableHead>Biaya Antar & Jemput</TableHead>
        <TableHead className="text-right">Aksi</TableHead>
      </>
    );
  };

  const renderTableRow = (item: any, index: number) => {
    if (isPerpanjangan()) {
      return (
        <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
          <TableCell className="w-16">{startIndex + index + 1}</TableCell>
          <TableCell>
            {item.wilayah}
          </TableCell>
          <TableCell className="text-green-400">
            Rp {item.biayaJasaLengkap?.toLocaleString()}
          </TableCell>
          <TableCell className="text-cyan-400">
            Rp {item.biayaJasaNembak?.toLocaleString()}
          </TableCell>
          <TableCell className="text-blue-500">
            Rp {item.biayaAntarJemput?.toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => handleEditClick(item)}
              >
                <Edit className="w-4 h-4 text-blue-400" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => handleDeleteClick(item)}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
        <TableCell className="w-16">{startIndex + index + 1}</TableCell>
        <TableCell>
          {item.wilayah}
        </TableCell>
        <TableCell className="text-green-400">
          Rp {item.biayaJasa?.toLocaleString()}
        </TableCell>
        <TableCell className="text-blue-500">
          Rp {item.biayaAntarJemput?.toLocaleString()}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => handleEditClick(item)}
            >
              <Edit className="w-4 h-4 text-blue-400" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => handleDeleteClick(item)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderFormFields = () => {
    if (isPerpanjangan()) {
      return (
        <>
          <div>
            <Label>Wilayah Samsat</Label>
            <Select value={formData.wilayah} onValueChange={(value) => setFormData({ ...formData, wilayah: value })}>
              <SelectTrigger className="bg-input-background border-border mt-2">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                {wilayahList.map((wilayah) => (
                  <SelectItem key={wilayah} value={wilayah}>
                    {wilayah}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Biaya Jasa Lengkap (Rp)</Label>
            <Input 
              className="bg-input-background border-border mt-2" 
              type="number"
              placeholder="250000"
              value={formData.biayaJasaLengkap}
              onChange={(e) => setFormData({ ...formData, biayaJasaLengkap: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Proses lengkap termasuk semua dokumen</p>
          </div>
          <div>
            <Label>Biaya Jasa Nembak (Rp)</Label>
            <Input 
              className="bg-input-background border-border mt-2" 
              type="number"
              placeholder="150000"
              value={formData.biayaJasaNembak}
              onChange={(e) => setFormData({ ...formData, biayaJasaNembak: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Proses cepat tanpa dokumen lengkap</p>
          </div>
          <div>
            <Label>Biaya Antar & Jemput (Rp)</Label>
            <Input 
              className="bg-input-background border-border mt-2" 
              type="number"
              placeholder="50000"
              value={formData.biayaAntarJemput}
              onChange={(e) => setFormData({ ...formData, biayaAntarJemput: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Biaya pengantaran dokumen</p>
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <Label>Wilayah Samsat</Label>
          <Select value={formData.wilayah} onValueChange={(value) => setFormData({ ...formData, wilayah: value })}>
            <SelectTrigger className="bg-input-background border-border mt-2">
              <SelectValue placeholder="Pilih wilayah" />
            </SelectTrigger>
            <SelectContent>
              {wilayahList.map((wilayah) => (
                <SelectItem key={wilayah} value={wilayah}>
                  {wilayah}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Biaya Jasa (Rp)</Label>
          <Input 
            className="bg-input-background border-border mt-2" 
            type="number"
            placeholder="800000"
            value={formData.biayaJasa}
            onChange={(e) => setFormData({ ...formData, biayaJasa: e.target.value })}
          />
        </div>
        <div>
          <Label>Biaya Antar & Jemput (Rp)</Label>
          <Input 
            className="bg-input-background border-border mt-2" 
            type="number"
            placeholder="50000"
            value={formData.biayaAntarJemput}
            onChange={(e) => setFormData({ ...formData, biayaAntarJemput: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Biaya pengantaran dokumen</p>
        </div>
      </>
    );
  };

  return (
    <Card className="glass-card p-4">
      <div className="mb-6">
        <h3 className="text-lg mb-2">Biaya Layanan</h3>
        <p className="text-sm text-muted-foreground">
          Kelola biaya layanan berdasarkan wilayah samsat
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="inline-flex w-full min-w-max lg:grid lg:w-full lg:grid-cols-7 gap-2 bg-secondary/30 p-2">
            {layananTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {layananTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {/* Search & Add Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari wilayah..." 
                  className="pl-10 bg-input-background border-border"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleAddClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Biaya
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    {renderTableHeaders()}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => renderTableRow(item, index))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isPerpanjangan() ? 6 : 5} className="text-center text-muted-foreground py-8">
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
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
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

            {/* Summary */}
            <Card className="glass-card p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Wilayah</p>
                  <p className="text-2xl">{filteredData.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {isPerpanjangan() ? "Rata-rata Biaya Lengkap" : "Rata-rata Biaya Jasa"}
                  </p>
                  <p className="text-2xl text-green-400">
                    Rp {filteredData.length > 0 
                      ? Math.round(
                          filteredData.reduce((acc, item) => {
                            if (isPerpanjangan()) {
                              return acc + (item.biayaJasaLengkap || 0);
                            }
                            return acc + (item.biayaJasa || 0);
                          }, 0) / filteredData.length
                        ).toLocaleString()
                      : 0
                    }
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Biaya Layanan</DialogTitle>
            <DialogDescription>
              Tambahkan biaya untuk {getCurrentLayanan()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {renderFormFields()}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAddSubmit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Biaya Layanan</DialogTitle>
            <DialogDescription>
              Update biaya untuk {getCurrentLayanan()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {renderFormFields()}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleEditSubmit}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Biaya Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus biaya layanan untuk wilayah{" "}
              <span className="text-foreground">{selectedItem?.wilayah}</span>?
              Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
