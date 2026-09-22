import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Edit, Trash2, FileText, Car, MapPin, FileSignature, FolderOpen, Copy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

// Data Dummy untuk Harga Dasar
const initialHargaDasar = [
  { 
    id: 1, 
    namaSamsat: "Samsat Jakarta Timur",
    hargaDasar: 150000,
    adminSamsat: 50000,
    jasa: 75000,
    totalEstimasi: 275000
  },
  { 
    id: 2, 
    namaSamsat: "Samsat Jakarta Barat",
    hargaDasar: 150000,
    adminSamsat: 50000,
    jasa: 75000,
    totalEstimasi: 275000
  },
  { 
    id: 3, 
    namaSamsat: "Samsat Jakarta Selatan",
    hargaDasar: 150000,
    adminSamsat: 50000,
    jasa: 75000,
    totalEstimasi: 275000
  },
];

// Data Dummy untuk Mutasi Antar Samsat (AS)
const initialMutasiAS = [
  { 
    id: 1, 
    namaSamsat: "Samsat Jakarta Timur",
    // Mutasi Keluar
    legalisir: 50000,
    hadir: 75000,
    legalisirCf: 100000,
    cf: 80000,
    bantuan: 60000,
    hadir2: 70000,
    cekBlokir: 25000,
    lokPembukuan: 30000,
    lokTu: 35000,
    lokTuNopil: 40000,
    loksus: 45000,
    cetakSkp: 20000,
    cetakFiskal: 25000,
    lokArsip: 30000,
    cekProgresif: 50000,
    matiinNopil: 35000,
    daftarMutmasNormal: 150000,
    daftarMutmasKilat: 250000,
    // Mutasi Masuk
    legalisirMutmas: 100000,
    mutmasByPendaftaran: 50000,
    reqGanjilGenap: 50000,
    acak: 40000,
    lokTuMasuk: 35000,
    lokPembukuanMasuk: 30000,
    daftarBpkb: 150000,
    penulisanBpkb: 100000,
    cetakNotice: 25000,
    cetakStnk: 50000,
    cetakPlat: 75000,
  },
  { 
    id: 2, 
    namaSamsat: "Samsat Jakarta Barat",
    legalisir: 50000,
    hadir: 75000,
    legalisirCf: 100000,
    cf: 80000,
    bantuan: 60000,
    hadir2: 70000,
    cekBlokir: 25000,
    lokPembukuan: 30000,
    lokTu: 35000,
    lokTuNopil: 40000,
    loksus: 45000,
    cetakSkp: 20000,
    cetakFiskal: 25000,
    lokArsip: 30000,
    cekProgresif: 50000,
    matiinNopil: 35000,
    daftarMutmasNormal: 150000,
    daftarMutmasKilat: 250000,
    legalisirMutmas: 100000,
    mutmasByPendaftaran: 50000,
    reqGanjilGenap: 50000,
    acak: 40000,
    lokTuMasuk: 35000,
    lokPembukuanMasuk: 30000,
    daftarBpkb: 150000,
    penulisanBpkb: 100000,
    cetakNotice: 25000,
    cetakStnk: 50000,
    cetakPlat: 75000,
  },
  { 
    id: 3, 
    namaSamsat: "Samsat Depok",
    legalisir: 45000,
    hadir: 70000,
    legalisirCf: 95000,
    cf: 75000,
    bantuan: 55000,
    hadir2: 65000,
    cekBlokir: 23000,
    lokPembukuan: 28000,
    lokTu: 33000,
    lokTuNopil: 38000,
    loksus: 43000,
    cetakSkp: 18000,
    cetakFiskal: 23000,
    lokArsip: 28000,
    cekProgresif: 48000,
    matiinNopil: 33000,
    daftarMutmasNormal: 140000,
    daftarMutmasKilat: 240000,
    legalisirMutmas: 95000,
    mutmasByPendaftaran: 48000,
    reqGanjilGenap: 48000,
    acak: 38000,
    lokTuMasuk: 33000,
    lokPembukuanMasuk: 28000,
    daftarBpkb: 140000,
    penulisanBpkb: 95000,
    cetakNotice: 23000,
    cetakStnk: 48000,
    cetakPlat: 70000,
  },
];

// Data Dummy untuk Mutasi Luar Daerah (LD)
const initialMutasiLD = [
  { id: 1, namaSamsat: "Samsat Jakarta Timur", totalBiaya: 500000 },
  { id: 2, namaSamsat: "Samsat Jakarta Barat", totalBiaya: 500000 },
  { id: 3, namaSamsat: "Samsat Depok", totalBiaya: 480000 },
  { id: 4, namaSamsat: "Samsat Tangerang", totalBiaya: 520000 },
  { id: 5, namaSamsat: "Samsat Bekasi", totalBiaya: 490000 },
];

// Data Dummy untuk Balik Nama
const initialBalikNama = [
  { 
    id: 1, 
    namaSamsat: "Samsat Jakarta Timur",
    biayaPengurusan: 200000,
    biayaAdmin: 50000,
    biayaLegalisir: 75000,
    biayaCetak: 100000,
    totalEstimasi: 425000
  },
  { 
    id: 2, 
    namaSamsat: "Samsat Jakarta Barat",
    biayaPengurusan: 200000,
    biayaAdmin: 50000,
    biayaLegalisir: 75000,
    biayaCetak: 100000,
    totalEstimasi: 425000
  },
  { 
    id: 3, 
    namaSamsat: "Samsat Depok",
    biayaPengurusan: 190000,
    biayaAdmin: 48000,
    biayaLegalisir: 70000,
    biayaCetak: 95000,
    totalEstimasi: 403000
  },
];

// Data Dummy untuk Tarik Berkas
const initialTarikBerkas = [
  { 
    id: 1, 
    namaSamsat: "Samsat Jakarta Timur",
    biayaPengambilan: 150000,
    biayaAdmin: 50000,
    biayaEkspedisi: 75000,
    totalEstimasi: 275000
  },
  { 
    id: 2, 
    namaSamsat: "Samsat Jakarta Barat",
    biayaPengambilan: 150000,
    biayaAdmin: 50000,
    biayaEkspedisi: 75000,
    totalEstimasi: 275000
  },
  { 
    id: 3, 
    namaSamsat: "Samsat Depok",
    biayaPengambilan: 140000,
    biayaAdmin: 48000,
    biayaEkspedisi: 70000,
    totalEstimasi: 258000
  },
];

// Data Dummy untuk Duplikat STNK
const initialDuplikatSTNK = [
  { 
    id: 1, 
    namaSamsat: "Samsat Jakarta Timur",
    biayaPembuatan: 100000,
    biayaAdmin: 50000,
    biayaCetak: 75000,
    biayaValidasi: 50000,
    totalEstimasi: 275000
  },
  { 
    id: 2, 
    namaSamsat: "Samsat Jakarta Barat",
    biayaPembuatan: 100000,
    biayaAdmin: 50000,
    biayaCetak: 75000,
    biayaValidasi: 50000,
    totalEstimasi: 275000
  },
  { 
    id: 3, 
    namaSamsat: "Samsat Depok",
    biayaPembuatan: 95000,
    biayaAdmin: 48000,
    biayaCetak: 70000,
    biayaValidasi: 48000,
    totalEstimasi: 261000
  },
];

export function HargaDasarSamsat() {
  const [hargaDasar, setHargaDasar] = useState(initialHargaDasar);
  const [mutasiAS, setMutasiAS] = useState(initialMutasiAS);
  const [mutasiLD, setMutasiLD] = useState(initialMutasiLD);
  const [balikNama, setBalikNama] = useState(initialBalikNama);
  const [tarikBerkas, setTarikBerkas] = useState(initialTarikBerkas);
  const [duplikatSTNK, setDuplikatSTNK] = useState(initialDuplikatSTNK);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("harga-dasar");
  const [editFormData, setEditFormData] = useState<any>({});
  const [addFormData, setAddFormData] = useState<any>({});

  const handleEdit = (item: any, tab: string) => {
    setSelectedItem(item);
    setEditFormData(item);
    setCurrentTab(tab);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updateFunction = (items: any[]) => 
      items.map(item => item.id === selectedItem.id ? editFormData : item);

    switch(currentTab) {
      case "harga-dasar":
        setHargaDasar(updateFunction(hargaDasar));
        break;
      case "mutasi-as":
        setMutasiAS(updateFunction(mutasiAS));
        break;
      case "mutasi-ld":
        setMutasiLD(updateFunction(mutasiLD));
        break;
      case "balik-nama":
        setBalikNama(updateFunction(balikNama));
        break;
      case "tarik-berkas":
        setTarikBerkas(updateFunction(tarikBerkas));
        break;
      case "duplikat-stnk":
        setDuplikatSTNK(updateFunction(duplikatSTNK));
        break;
    }
    
    setIsEditDialogOpen(false);
    toast.success("Data berhasil diupdate!");
  };

  const handleDelete = (id: number, tab: string) => {
    const deleteFunction = (items: any[]) => items.filter(item => item.id !== id);

    switch(tab) {
      case "harga-dasar":
        setHargaDasar(deleteFunction(hargaDasar));
        break;
      case "mutasi-as":
        setMutasiAS(deleteFunction(mutasiAS));
        break;
      case "mutasi-ld":
        setMutasiLD(deleteFunction(mutasiLD));
        break;
      case "balik-nama":
        setBalikNama(deleteFunction(balikNama));
        break;
      case "tarik-berkas":
        setTarikBerkas(deleteFunction(tarikBerkas));
        break;
      case "duplikat-stnk":
        setDuplikatSTNK(deleteFunction(duplikatSTNK));
        break;
    }
    
    toast.success("Data berhasil dihapus!");
  };

  const handleAddNew = (tab: string) => {
    setCurrentTab(tab);
    
    switch(tab) {
      case "harga-dasar":
        setAddFormData({
          namaSamsat: "",
          hargaDasar: 0,
          adminSamsat: 0,
          jasa: 0,
          totalEstimasi: 0
        });
        break;
      case "mutasi-as":
        setAddFormData({
          namaSamsat: "",
          legalisir: 0, hadir: 0, legalisirCf: 0, cf: 0, bantuan: 0, hadir2: 0,
          cekBlokir: 0, lokPembukuan: 0, lokTu: 0, lokTuNopil: 0, loksus: 0,
          cetakSkp: 0, cetakFiskal: 0, lokArsip: 0, cekProgresif: 0, matiinNopil: 0,
          daftarMutmasNormal: 0, daftarMutmasKilat: 0,
          legalisirMutmas: 0, mutmasByPendaftaran: 0, reqGanjilGenap: 0, acak: 0, lokTuMasuk: 0,
          lokPembukuanMasuk: 0, daftarBpkb: 0, penulisanBpkb: 0,
          cetakNotice: 0, cetakStnk: 0, cetakPlat: 0,
        });
        break;
      case "mutasi-ld":
        setAddFormData({ namaSamsat: "", totalBiaya: 0 });
        break;
      case "balik-nama":
        setAddFormData({
          namaSamsat: "",
          biayaPengurusan: 0,
          biayaAdmin: 0,
          biayaLegalisir: 0,
          biayaCetak: 0,
          totalEstimasi: 0
        });
        break;
      case "tarik-berkas":
        setAddFormData({
          namaSamsat: "",
          biayaPengambilan: 0,
          biayaAdmin: 0,
          biayaEkspedisi: 0,
          totalEstimasi: 0
        });
        break;
      case "duplikat-stnk":
        setAddFormData({
          namaSamsat: "",
          biayaPembuatan: 0,
          biayaAdmin: 0,
          biayaCetak: 0,
          biayaValidasi: 0,
          totalEstimasi: 0
        });
        break;
    }
    
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    let newId = 1;
    let newItem;

    switch(currentTab) {
      case "harga-dasar":
        newId = Math.max(...hargaDasar.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setHargaDasar([...hargaDasar, newItem]);
        break;
      case "mutasi-as":
        newId = Math.max(...mutasiAS.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setMutasiAS([...mutasiAS, newItem]);
        break;
      case "mutasi-ld":
        newId = Math.max(...mutasiLD.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setMutasiLD([...mutasiLD, newItem]);
        break;
      case "balik-nama":
        newId = Math.max(...balikNama.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setBalikNama([...balikNama, newItem]);
        break;
      case "tarik-berkas":
        newId = Math.max(...tarikBerkas.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setTarikBerkas([...tarikBerkas, newItem]);
        break;
      case "duplikat-stnk":
        newId = Math.max(...duplikatSTNK.map(s => s.id), 0) + 1;
        newItem = { ...addFormData, id: newId };
        setDuplikatSTNK([...duplikatSTNK, newItem]);
        break;
    }
    
    setIsAddDialogOpen(false);
    toast.success("Data berhasil ditambahkan!");
  };

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg">Harga Dasar Layanan Samsat</h3>
          <p className="text-sm text-muted-foreground">Kelola harga dasar untuk semua jenis layanan di setiap Samsat</p>
        </div>
      </motion.div>

      <Tabs defaultValue="harga-dasar" className="space-y-4" onValueChange={setCurrentTab}>
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="inline-flex w-full min-w-max lg:grid lg:w-full lg:grid-cols-6 bg-secondary/30 gap-1">
            <TabsTrigger value="harga-dasar" className="whitespace-nowrap">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Harga Dasar</span>
              <span className="sm:hidden">Dasar</span>
            </TabsTrigger>
            <TabsTrigger value="mutasi-as" className="whitespace-nowrap">
              <Car className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Mutasi AS</span>
              <span className="sm:hidden">AS</span>
            </TabsTrigger>
            <TabsTrigger value="mutasi-ld" className="whitespace-nowrap">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Mutasi LD</span>
              <span className="sm:hidden">LD</span>
            </TabsTrigger>
            <TabsTrigger value="balik-nama" className="whitespace-nowrap">
              <FileSignature className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Balik Nama</span>
              <span className="sm:hidden">BN</span>
            </TabsTrigger>
            <TabsTrigger value="tarik-berkas" className="whitespace-nowrap">
              <FolderOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Tarik Berkas</span>
              <span className="sm:hidden">Tarik</span>
            </TabsTrigger>
            <TabsTrigger value="duplikat-stnk" className="whitespace-nowrap">
              <Copy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Duplikat STNK</span>
              <span className="sm:hidden">Duplikat</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Harga Dasar */}
        <TabsContent value="harga-dasar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Harga Dasar Layanan</h4>
                <Button onClick={() => handleAddNew("harga-dasar")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Nama Samsat</TableHead>
                      <TableHead>Harga Dasar</TableHead>
                      <TableHead>Admin Samsat</TableHead>
                      <TableHead>Jasa</TableHead>
                      <TableHead>Total Estimasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hargaDasar.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium">{item.namaSamsat}</TableCell>
                        <TableCell>Rp {item.hargaDasar.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.adminSamsat.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.jasa.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.totalEstimasi.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "harga-dasar")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "harga-dasar")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab Mutasi AS */}
        <TabsContent value="mutasi-as">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Mutasi Keluar & Mutasi Masuk (Antar Samsat)</h4>
                <Button onClick={() => handleAddNew("mutasi-as")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead className="min-w-[200px] sticky left-0 bg-secondary/30 z-10">Nama Samsat</TableHead>
                      <TableHead colSpan={18} className="text-center border-b border-border">Mutasi Keluar</TableHead>
                      <TableHead colSpan={11} className="text-center border-b border-border">Mutasi Masuk</TableHead>
                      <TableHead className="text-right sticky right-0 bg-secondary/30">Aksi</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-secondary/30 z-10"></TableHead>
                      {/* Mutasi Keluar */}
                      <TableHead className="min-w-[100px]">Legalisir</TableHead>
                      <TableHead className="min-w-[100px]">Hadir</TableHead>
                      <TableHead className="min-w-[120px]">Legalisir CF</TableHead>
                      <TableHead className="min-w-[80px]">CF</TableHead>
                      <TableHead className="min-w-[100px]">Bantuan</TableHead>
                      <TableHead className="min-w-[100px]">Hadir</TableHead>
                      <TableHead className="min-w-[110px]">Cek Blokir</TableHead>
                      <TableHead className="min-w-[140px]">Lok. Pembukuan</TableHead>
                      <TableHead className="min-w-[100px]">Lok. TU</TableHead>
                      <TableHead className="min-w-[130px]">Lok. TU Nopil</TableHead>
                      <TableHead className="min-w-[100px]">Loksus</TableHead>
                      <TableHead className="min-w-[110px]">Cetak SKP</TableHead>
                      <TableHead className="min-w-[120px]">Cetak Fiskal</TableHead>
                      <TableHead className="min-w-[110px]">Lok. Arsip</TableHead>
                      <TableHead className="min-w-[130px]">Cek Progresif</TableHead>
                      <TableHead className="min-w-[130px]">Matiin Nopil</TableHead>
                      <TableHead className="min-w-[180px]">Daftar Mutmas Normal</TableHead>
                      <TableHead className="min-w-[180px]">Daftar Mutmas Kilat</TableHead>
                      {/* Mutasi Masuk */}
                      <TableHead className="min-w-[140px]">Legalisir</TableHead>
                      <TableHead className="min-w-[200px]">Mutmas By Pendaftaran</TableHead>
                      <TableHead className="min-w-[180px]">Req. Ganjil/Genap</TableHead>
                      <TableHead className="min-w-[100px]">Acak</TableHead>
                      <TableHead className="min-w-[100px]">Lok. TU</TableHead>
                      <TableHead className="min-w-[140px]">Lok. Pembukuan</TableHead>
                      <TableHead className="min-w-[120px]">Daftar BPKB</TableHead>
                      <TableHead className="min-w-[140px]">Penulisan BPKB</TableHead>
                      <TableHead className="min-w-[120px]">Cetak Notice</TableHead>
                      <TableHead className="min-w-[120px]">Cetak STNK</TableHead>
                      <TableHead className="min-w-[120px]">Cetak Plat</TableHead>
                      <TableHead className="sticky right-0 bg-secondary/30"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mutasiAS.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 z-10">{item.namaSamsat}</TableCell>
                        {/* Mutasi Keluar */}
                        <TableCell>Rp {item.legalisir.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.hadir.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.legalisirCf.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cf.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.bantuan.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.hadir2.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cekBlokir.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokPembukuan.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokTu.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokTuNopil.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.loksus.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cetakSkp.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cetakFiskal.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokArsip.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cekProgresif.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.matiinNopil.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.daftarMutmasNormal.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.daftarMutmasKilat.toLocaleString('id-ID')}</TableCell>
                        {/* Mutasi Masuk */}
                        <TableCell>Rp {item.legalisirMutmas.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.mutmasByPendaftaran.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.reqGanjilGenap.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.acak.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokTuMasuk.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.lokPembukuanMasuk.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.daftarBpkb.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.penulisanBpkb.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cetakNotice.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cetakStnk.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.cetakPlat.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="sticky right-0 bg-background/95">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "mutasi-as")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "mutasi-as")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab Mutasi LD */}
        <TabsContent value="mutasi-ld">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Harga Total Mutasi Luar Daerah</h4>
                <Button onClick={() => handleAddNew("mutasi-ld")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Nama Samsat</TableHead>
                      <TableHead>Total Biaya</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mutasiLD.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium">{item.namaSamsat}</TableCell>
                        <TableCell>Rp {item.totalBiaya.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "mutasi-ld")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "mutasi-ld")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab Balik Nama */}
        <TabsContent value="balik-nama">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Harga Balik Nama Kendaraan</h4>
                <Button onClick={() => handleAddNew("balik-nama")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Nama Samsat</TableHead>
                      <TableHead>Biaya Pengurusan</TableHead>
                      <TableHead>Biaya Admin</TableHead>
                      <TableHead>Biaya Legalisir</TableHead>
                      <TableHead>Biaya Cetak</TableHead>
                      <TableHead>Total Estimasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balikNama.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium">{item.namaSamsat}</TableCell>
                        <TableCell>Rp {item.biayaPengurusan.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaAdmin.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaLegalisir.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaCetak.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.totalEstimasi.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "balik-nama")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "balik-nama")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab Tarik Berkas */}
        <TabsContent value="tarik-berkas">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Harga Tarik Berkas</h4>
                <Button onClick={() => handleAddNew("tarik-berkas")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Nama Samsat</TableHead>
                      <TableHead>Biaya Pengambilan</TableHead>
                      <TableHead>Biaya Admin</TableHead>
                      <TableHead>Biaya Ekspedisi</TableHead>
                      <TableHead>Total Estimasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarikBerkas.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium">{item.namaSamsat}</TableCell>
                        <TableCell>Rp {item.biayaPengambilan.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaAdmin.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaEkspedisi.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.totalEstimasi.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "tarik-berkas")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "tarik-berkas")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab Duplikat STNK */}
        <TabsContent value="duplikat-stnk">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <h4>Harga Duplikat STNK</h4>
                <Button onClick={() => handleAddNew("duplikat-stnk")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Nama Samsat</TableHead>
                      <TableHead>Biaya Pembuatan</TableHead>
                      <TableHead>Biaya Admin</TableHead>
                      <TableHead>Biaya Cetak</TableHead>
                      <TableHead>Biaya Validasi</TableHead>
                      <TableHead>Total Estimasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duplikatSTNK.map((item) => (
                      <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium">{item.namaSamsat}</TableCell>
                        <TableCell>Rp {item.biayaPembuatan.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaAdmin.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaCetak.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.biayaValidasi.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.totalEstimasi.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item, "duplikat-stnk")}
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(item.id, "duplikat-stnk")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-border max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Harga Dasar Samsat</DialogTitle>
            <DialogDescription>Update harga dasar untuk samsat ini</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Samsat</Label>
              <Input
                value={editFormData.namaSamsat || ""}
                onChange={(e) => setEditFormData({...editFormData, namaSamsat: e.target.value})}
                className="bg-input-background border-border"
              />
            </div>

            {currentTab === "harga-dasar" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "hargaDasar", label: "Harga Dasar" },
                  { key: "adminSamsat", label: "Admin Samsat" },
                  { key: "jasa", label: "Jasa" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={editFormData[field.key] || 0}
                      onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "mutasi-as" && (
              <>
                <h4 className="text-sm mt-4 mb-2">Mutasi Keluar</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "legalisir", label: "Legalisir" },
                    { key: "hadir", label: "Hadir" },
                    { key: "legalisirCf", label: "Legalisir CF" },
                    { key: "cf", label: "CF" },
                    { key: "bantuan", label: "Bantuan" },
                    { key: "hadir2", label: "Hadir 2" },
                    { key: "cekBlokir", label: "Cek Blokir" },
                    { key: "lokPembukuan", label: "Lok. Pembukuan" },
                    { key: "lokTu", label: "Lok. TU" },
                    { key: "lokTuNopil", label: "Lok. TU Nopil" },
                    { key: "loksus", label: "Loksus" },
                    { key: "cetakSkp", label: "Cetak SKP" },
                    { key: "cetakFiskal", label: "Cetak Fiskal" },
                    { key: "lokArsip", label: "Lok. Arsip" },
                    { key: "cekProgresif", label: "Cek Progresif" },
                    { key: "matiinNopil", label: "Matiin Nopil" },
                    { key: "daftarMutmasNormal", label: "Daftar Mutmas Normal" },
                    { key: "daftarMutmasKilat", label: "Daftar Mutmas Kilat" },
                  ].map(field => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      <Input
                        type="number"
                        value={editFormData[field.key] || 0}
                        onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                        className="bg-input-background border-border"
                      />
                    </div>
                  ))}
                </div>

                <h4 className="text-sm mt-4 mb-2">Mutasi Masuk</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "legalisirMutmas", label: "Legalisir" },
                    { key: "mutmasByPendaftaran", label: "Mutmas By Pendaftaran" },
                    { key: "reqGanjilGenap", label: "Req. Ganjil/Genap" },
                    { key: "acak", label: "Acak" },
                    { key: "lokTuMasuk", label: "Lok. TU" },
                    { key: "lokPembukuanMasuk", label: "Lok. Pembukuan" },
                    { key: "daftarBpkb", label: "Daftar BPKB" },
                    { key: "penulisanBpkb", label: "Penulisan BPKB" },
                    { key: "cetakNotice", label: "Cetak Notice" },
                    { key: "cetakStnk", label: "Cetak STNK" },
                    { key: "cetakPlat", label: "Cetak Plat" },
                  ].map(field => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      <Input
                        type="number"
                        value={editFormData[field.key] || 0}
                        onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                        className="bg-input-background border-border"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === "mutasi-ld" && (
              <div className="space-y-2">
                <Label>Total Biaya</Label>
                <Input
                  type="number"
                  value={editFormData.totalBiaya || 0}
                  onChange={(e) => setEditFormData({...editFormData, totalBiaya: parseInt(e.target.value) || 0})}
                  className="bg-input-background border-border"
                />
              </div>
            )}

            {currentTab === "balik-nama" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPengurusan", label: "Biaya Pengurusan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaLegalisir", label: "Biaya Legalisir" },
                  { key: "biayaCetak", label: "Biaya Cetak" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={editFormData[field.key] || 0}
                      onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "tarik-berkas" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPengambilan", label: "Biaya Pengambilan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaEkspedisi", label: "Biaya Ekspedisi" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={editFormData[field.key] || 0}
                      onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "duplikat-stnk" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPembuatan", label: "Biaya Pembuatan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaCetak", label: "Biaya Cetak" },
                  { key: "biayaValidasi", label: "Biaya Validasi" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={editFormData[field.key] || 0}
                      onChange={(e) => setEditFormData({...editFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="border-border max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Harga Dasar Samsat</DialogTitle>
            <DialogDescription>Tambahkan harga dasar untuk samsat baru</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Samsat</Label>
              <Input
                value={addFormData.namaSamsat || ""}
                onChange={(e) => setAddFormData({...addFormData, namaSamsat: e.target.value})}
                className="bg-input-background border-border"
                placeholder="Masukkan nama samsat"
              />
            </div>

            {currentTab === "harga-dasar" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "hargaDasar", label: "Harga Dasar" },
                  { key: "adminSamsat", label: "Admin Samsat" },
                  { key: "jasa", label: "Jasa" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={addFormData[field.key] || 0}
                      onChange={(e) => setAddFormData({...addFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "mutasi-ld" && (
              <div className="space-y-2">
                <Label>Total Biaya</Label>
                <Input
                  type="number"
                  value={addFormData.totalBiaya || 0}
                  onChange={(e) => setAddFormData({...addFormData, totalBiaya: parseInt(e.target.value) || 0})}
                  className="bg-input-background border-border"
                />
              </div>
            )}

            {currentTab === "balik-nama" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPengurusan", label: "Biaya Pengurusan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaLegalisir", label: "Biaya Legalisir" },
                  { key: "biayaCetak", label: "Biaya Cetak" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={addFormData[field.key] || 0}
                      onChange={(e) => setAddFormData({...addFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "tarik-berkas" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPengambilan", label: "Biaya Pengambilan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaEkspedisi", label: "Biaya Ekspedisi" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={addFormData[field.key] || 0}
                      onChange={(e) => setAddFormData({...addFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "duplikat-stnk" && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "biayaPembuatan", label: "Biaya Pembuatan" },
                  { key: "biayaAdmin", label: "Biaya Admin" },
                  { key: "biayaCetak", label: "Biaya Cetak" },
                  { key: "biayaValidasi", label: "Biaya Validasi" },
                  { key: "totalEstimasi", label: "Total Estimasi" },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      value={addFormData[field.key] || 0}
                      onChange={(e) => setAddFormData({...addFormData, [field.key]: parseInt(e.target.value) || 0})}
                      className="bg-input-background border-border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
