import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { MutasiCostField } from "./MutasiCostFields";
import { Search, CheckCircle, Clock, PackageCheck, Truck, FileCheck, User, MapPin, Eye, Calculator, RefreshCw, Edit, ChevronDown, ChevronUp, AlertTriangle, Upload, FileText } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner";

const trackingSteps = [
  { id: 1, title: "Verifikasi", icon: CheckCircle },
  { id: 2, title: "Penjadwalan", icon: Clock },
  { id: 3, title: "Verifikasi Dokumen", icon: FileText },
  { id: 4, title: "Proses Samsat", icon: PackageCheck },
  { id: 5, title: "Verifikasi Ulang", icon: RefreshCw },
  { id: 6, title: "Supervisi", icon: FileCheck },
  { id: 7, title: "Pengantaran", icon: Truck },
];

const messengers = ["Ahmad Rizki", "Budi Santoso", "Citra Dewi", "Dedi Cahyadi", "Eko Prasetyo"];
const layananOptions = [
  "Perpanjangan 1 Tahun",
  "Perpanjangan 5 Tahun",
  "Balik Nama",
  "Mutasi Antar Samsat",
  "Mutasi Luar Daerah"
];
const bulanOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Generate sample orders for each status
const generateOrdersByStatus = () => {
  const customers = ["PT. Maju Jaya", "John Doe", "Siti Rahayu", "Ahmad Yani", "Budi Santoso", "Dewi Lestari", "CV. Berkah", "PT. Sejahtera"];
  const wilayahAsal = ["Jakarta Timur", "Jakarta Barat", "Jakarta Selatan", "Jakarta Utara", "Depok", "Bekasi", "Tangerang"];
  
  const ordersByStatus: any = {
    "Verifikasi": [],
    "Penjadwalan": [],
    "Verifikasi Dokumen": [],
    "Proses Samsat": [],
    "Verifikasi Ulang": [],
    "Supervisi": [],
    "Pengantaran": []
  };
  
  let orderId = 1;
  
  // Generate orders per status
  ["Verifikasi", "Penjadwalan", "Verifikasi Dokumen", "Proses Samsat", "Verifikasi Ulang", "Supervisi", "Pengantaran"].forEach((status, statusIndex) => {
    const count = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < count; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomLayanan = layananOptions[Math.floor(Math.random() * layananOptions.length)];
      const randomWilayahAsal = wilayahAsal[Math.floor(Math.random() * wilayahAsal.length)];
      let randomWilayahTujuan = wilayahAsal[Math.floor(Math.random() * wilayahAsal.length)];
      while (randomWilayahTujuan === randomWilayahAsal) {
        randomWilayahTujuan = wilayahAsal[Math.floor(Math.random() * wilayahAsal.length)];
      }
      const randomMessenger = messengers[Math.floor(Math.random() * messengers.length)];
      
      const order: any = {
        orderNo: `ORD-${String(orderId).padStart(4, '0')}`,
        customer: randomCustomer,
        layanan: randomLayanan,
        currentStep: statusIndex + 1,
        
        // Form data
        namaPemilik: randomCustomer,
        nomorHP: `08${Math.floor(Math.random() * 900000000) + 100000000}`,
        kepemilikanKendaraan: Math.random() > 0.5 ? "Pribadi" : "Perusahaan",
        jenisKendaraan: Math.random() > 0.5 ? "Motor" : "Mobil",
        tahunKendaraan: 2020 + Math.floor(Math.random() * 5),
        nopol: `B${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        pkbBerlakuSd: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2023`,
        tahunPajak: "2023",
        bulanPajak: bulanOptions[Math.floor(Math.random() * 12)],
        nominalPkbTerakhir: Math.floor(Math.random() * 20) + 5,
        nominalSwdkllj: Math.floor(Math.random() * 10) + 5,
        kodePromo: Math.random() > 0.7 ? "PROMO2024" : "",
        wilayahSamsatAsal: randomWilayahAsal,
        wilayahSamsatTujuan: randomWilayahTujuan,
        domisiliPengambilan: randomWilayahAsal,
        domisiliPengembalian: randomWilayahAsal,
        detailAlamatPengambilan: `Jl. Raya ${randomWilayahAsal} No. ${Math.floor(Math.random() * 100) + 1}`,
        detailAlamatPengembalian: `Jl. Raya ${randomWilayahAsal} No. ${Math.floor(Math.random() * 100) + 1}`,
        
        // Cost calculation - simplified
        biayaJasa: 95000,
        pkb: 3,
        swdkllj: 3,
        dendaSwdkllj: 100000,
        
        // Final cost (for verified orders) - set null if not verified yet
        finalBiayaJasa: statusIndex >= 5 ? 95000 : null,
        finalPkb: statusIndex >= 5 ? 3 : null,
        finalSwdkllj: statusIndex >= 5 ? 3 : null,
        finalDendaSwdkllj: statusIndex >= 5 ? 100000 : null,
        finalMutasiKeluar: statusIndex >= 5 ? (Math.random() > 0.7 ? 50000 : 0) : null,
        finalMutasiMasuk: statusIndex >= 5 ? (Math.random() > 0.7 ? 30000 : 0) : null,
        finalBiayaLainnya: statusIndex >= 5 ? (Math.random() > 0.7 ? 25000 : 0) : null,
        keteranganMutasiKeluar: statusIndex >= 5 && Math.random() > 0.7 ? "Biaya mutasi keluar samsat" : "",
        keteranganMutasiMasuk: statusIndex >= 5 && Math.random() > 0.7 ? "Biaya mutasi masuk samsat" : "",
        keteranganBiayaLainnya: statusIndex >= 5 && Math.random() > 0.7 ? "Biaya administrasi tambahan" : "",
        isVerified: statusIndex >= 5,
        
        // Scheduling data
        tanggalJemput: statusIndex >= 2 ? `2024-11-${String(Math.floor(Math.random() * 20) + 10).padStart(2, '0')}` : "",
        messenger: statusIndex >= 2 ? randomMessenger : "",
        isScheduled: statusIndex >= 3,
        
        // Document verification data
        documentsVerified: statusIndex >= 3,
        documentsList: statusIndex >= 3 ? ["STNK.pdf", "BPKB.pdf", "KTP.pdf"] : [],
        documentNotes: statusIndex >= 3 ? "Semua dokumen lengkap dan sesuai" : "",
        
        // Delivery data
        tanggalPengantaran: statusIndex >= 6 ? `2024-11-${String(Math.floor(Math.random() * 20) + 10).padStart(2, '0')}` : "",
        isDeliveryScheduled: statusIndex >= 6,
      };
      
      ordersByStatus[status].push(order);
      orderId++;
    }
  });
  
  return ordersByStatus;
};

const initialOrdersByStatus = generateOrdersByStatus();

const getStatusColor = (step: number) => {
  switch (step) {
    case 1:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case 2:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case 3:
      return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
    case 4:
      return "bg-blue-500/15 text-blue-500 border-purple-500/30";
    case 5:
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case 6:
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case 7:
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case 8:
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

interface OrderTrackingProps {
  userRole?: 'administrator' | 'finance' | 'admin' | 'messenger' | null;
}

export function OrderTracking({ userRole = 'administrator' }: OrderTrackingProps) {
  const [currentTab, setCurrentTab] = useState("Isi Formulir");
  const [ordersByStatus, setOrdersByStatus] = useState(initialOrdersByStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isEditScheduleDialogOpen, setIsEditScheduleDialogOpen] = useState(false);
  const [isDocumentVerificationDialogOpen, setIsDocumentVerificationDialogOpen] = useState(false);
  const [isFinalCostDialogOpen, setIsFinalCostDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isUploadUpdatedDocDialogOpen, setIsUploadUpdatedDocDialogOpen] = useState(false);
  const [isViewUpdatedDocDialogOpen, setIsViewUpdatedDocDialogOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [updatedDocuments, setUpdatedDocuments] = useState<File[]>([]);
  const [isSamsatProgressDialogOpen, setIsSamsatProgressDialogOpen] = useState(false);
  const [samsatProgress, setSamsatProgress] = useState({
    mutasiKeluar: {
      legalisirHadir: false,
      legalisirCf: false,
      cfBantuanHadir: false,
      cekBlokir: false,
      lokPembukuan: false,
      lokTu: false,
      lokTuNopil: false,
      loksus: false,
      cetakSkp: false,
      cetakFiskal: false,
      lokArsip: false,
      cekProgresif: false,
      matiinNopil: false,
      daftarMutmasNormal: false,
      daftarMutmasKilat: false,
    },
    mutasiMasuk: {
      legalisirMutmas: false,
      byPendaftaran: false,
      reqGanjilGenap: false,
      acak: false,
      lokTu: false,
      lokPembukuan: false,
      daftarBpkb: false,
      penulisanBpkb: false,
      cetakNotice: false,
      cetakStnk: false,
      cetakPlat: false,
    }
  });
  
  // Check if user can edit "Supervisi" tab
  const canEditVerified = userRole === 'administrator' || userRole === 'finance';

  // New order form state
  const [newOrderData, setNewOrderData] = useState({
    namaPemilik: "",
    nomorHP: "",
    kepemilikanKendaraan: "",
    jenisKendaraan: "",
    tahunKendaraan: "",
    nopol: "",
    layanan: "",
    pkbBerlakuSd: "",
    tahunPajak: "",
    bulanPajak: "",
    nominalPkbTerakhir: "",
    nominalSwdkllj: "",
    kodePromo: "",
    wilayahSamsatAsal: "",
    wilayahSamsatTujuan: "",
    domisiliPengambilan: "",
    domisiliPengembalian: "",
    detailAlamatPengambilan: "",
    detailAlamatPengembalian: "",
  });

  // Schedule form state
  const [scheduleData, setScheduleData] = useState({
    tanggalJemput: "",
    messenger: "",
  });

  // Final cost state
  const [finalCostData, setFinalCostData] = useState({
    finalBiayaJasa: "",
    finalPkb: "",
    finalSwdkllj: "",
    finalDendaSwdkllj: "",
    finalMutasiKeluar: "",
    finalMutasiMasuk: "",
    finalBiayaLainnya: "",
    keteranganMutasiKeluar: "",
    keteranganMutasiMasuk: "",
    keteranganBiayaLainnya: "",
    // Mutasi Keluar
    mutasiKeluarLegalisir: "",
    mutasiKeluarHadir: "",
    mutasiKeluarLegalisirCf: "",
    mutasiKeluarCf: "",
    mutasiKeluarBantuanHadir: "",
    mutasiKeluarCekBlokir: "",
    mutasiKeluarLokPembukuan: "",
    mutasiKeluarLokTu: "",
    mutasiKeluarLokTuNopil: "",
    mutasiKeluarLoksus: "",
    mutasiKeluarCetakSkp: "",
    mutasiKeluarCetakFiskal: "",
    mutasiKeluarLokArsip: "",
    mutasiKeluarCekProgresif: "",
    mutasiKeluarMatiinNopil: "",
    mutasiKeluarDaftarMutmasNormal: "",
    mutasiKeluarDaftarMutmasKilat: "",
    // Mutasi Masuk
    mutasiMasukLegalisir: "",
    mutasiMasukMutmas: "",
    mutasiMasukBy: "",
    mutasiMasukPendaftaran: "",
    mutasiMasukReqGanjilGenap: "",
    mutasiMasukAcak: "",
    mutasiMasukLokTu: "",
    mutasiMasukLokPembukuan: "",
    mutasiMasukDaftarBpkb: "",
    mutasiMasukPenulisanBpkb: "",
    mutasiMasukCetakNotice: "",
    mutasiMasukCetakStnk: "",
    mutasiMasukCetakPlat: "",
  });

  // Collapsible states for mutasi sections
  const [showMutasiKeluar, setShowMutasiKeluar] = useState(false);
  const [showMutasiMasuk, setShowMutasiMasuk] = useState(false);

  // Harga dasar untuk setiap item mutasi
  const hargaDasarMutasiKeluar = {
    mutasiKeluarLegalisir: 50000,
    mutasiKeluarHadir: 75000,
    mutasiKeluarLegalisirCf: 60000,
    mutasiKeluarCf: 40000,
    mutasiKeluarBantuanHadir: 80000,
    mutasiKeluarCekBlokir: 30000,
    mutasiKeluarLokPembukuan: 45000,
    mutasiKeluarLokTu: 45000,
    mutasiKeluarLokTuNopil: 50000,
    mutasiKeluarLoksus: 100000,
    mutasiKeluarCetakSkp: 35000,
    mutasiKeluarCetakFiskal: 35000,
    mutasiKeluarLokArsip: 40000,
    mutasiKeluarCekProgresif: 30000,
    mutasiKeluarMatiinNopil: 45000,
    mutasiKeluarDaftarMutmasNormal: 70000,
    mutasiKeluarDaftarMutmasKilat: 120000,
  };

  const hargaDasarMutasiMasuk = {
    mutasiMasukLegalisir: 50000,
    mutasiMasukMutmas: 65000,
    mutasiMasukBy: 55000,
    mutasiMasukPendaftaran: 80000,
    mutasiMasukReqGanjilGenap: 40000,
    mutasiMasukAcak: 35000,
    mutasiMasukLokTu: 45000,
    mutasiMasukLokPembukuan: 45000,
    mutasiMasukDaftarBpkb: 90000,
    mutasiMasukPenulisanBpkb: 75000,
    mutasiMasukCetakNotice: 35000,
    mutasiMasukCetakStnk: 40000,
    mutasiMasukCetakPlat: 50000,
  };

  // Document verification state
  const [documentData, setDocumentData] = useState({
    documentsList: [] as string[],
    documentNotes: "",
  });

  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    tanggalPengantaran: "",
  });

  // Calculate cost estimation
  const calculateCost = () => {
    const biayaJasa = 95000; // Antar Jemput + Biaya Jasa + Administrasi
    const pkb = parseFloat(newOrderData.nominalPkbTerakhir) || 0;
    const swdkllj = parseFloat(newOrderData.nominalSwdkllj) || 0;
    const dendaSwdkllj = 100000; // Denda SWDKLLJ
    
    const total = biayaJasa + pkb + swdkllj + dendaSwdkllj;
    
    return {
      biayaJasa,
      pkb,
      swdkllj,
      dendaSwdkllj,
      total
    };
  };

  const cost = calculateCost();

  const handleAddOrder = () => {
    const newOrder = {
      ...newOrderData,
      orderNo: `ORD-${String(Object.values(ordersByStatus).flat().length + 1).padStart(4, '0')}`,
      customer: newOrderData.namaPemilik,
      currentStep: 2,
      biayaJasa: cost.biayaJasa,
      pkb: cost.pkb,
      swdkllj: cost.swdkllj,
      dendaSwdkllj: cost.dendaSwdkllj,
      finalBiayaJasa: null,
      finalPkb: null,
      finalSwdkllj: null,
      finalDendaSwdkllj: null,
      finalMutasiKeluar: null,
      finalMutasiMasuk: null,
      finalBiayaLainnya: null,
      keteranganMutasiKeluar: "",
      keteranganMutasiMasuk: "",
      keteranganBiayaLainnya: "",
      isVerified: false,
      isScheduled: false,
      isDelivered: false,
    };
    
    setOrdersByStatus({
      ...ordersByStatus,
      "Verifikasi": [...(ordersByStatus["Verifikasi"] || []), newOrder]
    });
    
    // Reset form
    setNewOrderData({
      namaPemilik: "",
      nomorHP: "",
      kepemilikanKendaraan: "",
      jenisKendaraan: "",
      tahunKendaraan: "",
      nopol: "",
      layanan: "",
      pkbBerlakuSd: "",
      tahunPajak: "",
      bulanPajak: "",
      nominalPkbTerakhir: "",
      nominalSwdkllj: "",
      kodePromo: "",
      wilayahSamsatAsal: "",
      wilayahSamsatTujuan: "",
      domisiliPengambilan: "",
      domisiliPengembalian: "",
      detailAlamatPengambilan: "",
      detailAlamatPengembalian: "",
    });
    
    toast.success("Order berhasil ditambahkan!");
  };

  const handleVerify = () => {
    if (selectedOrder) {
      const updatedOrder = { ...selectedOrder, currentStep: 3 };
      
      setOrdersByStatus({
        ...ordersByStatus,
        "Verifikasi": ordersByStatus["Verifikasi"]?.filter((o: any) => o.orderNo !== selectedOrder.orderNo) || [],
        "Penjadwalan": [...(ordersByStatus["Penjadwalan"] || []), updatedOrder]
      });
      
      setIsVerifyDialogOpen(false);
      setSelectedOrder(null);
      toast.success("Order berhasil diverifikasi!");
    }
  };

  const handleSchedule = () => {
    if (selectedOrder) {
      const updatedOrder = { 
        ...selectedOrder, 
        ...scheduleData,
        currentStep: 3,
        isScheduled: true
      };
      
      // Move to Verifikasi Dokumen
      setOrdersByStatus({
        ...ordersByStatus,
        "Penjadwalan": ordersByStatus["Penjadwalan"]?.filter((o: any) => o.orderNo !== selectedOrder.orderNo) || [],
        "Verifikasi Dokumen": [...(ordersByStatus["Verifikasi Dokumen"] || []), updatedOrder]
      });
      
      setIsScheduleDialogOpen(false);
      setSelectedOrder(null);
      setScheduleData({
        tanggalJemput: "",
        messenger: "",
      });
      toast.success("Jadwal berhasil dibuat dan order dipindahkan ke Verifikasi Dokumen!");
    }
  };

  const handleEditSchedule = () => {
    if (selectedOrder) {
      const updatedOrder = { 
        ...selectedOrder, 
        ...scheduleData,
      };
      
      // Just update the schedule data, keep it in Penjadwalan (scheduled table)
      setOrdersByStatus({
        ...ordersByStatus,
        "Penjadwalan": (ordersByStatus["Penjadwalan"] || []).map((o: any) => 
          o.orderNo === selectedOrder.orderNo ? updatedOrder : o
        )
      });
      
      setIsEditScheduleDialogOpen(false);
      setSelectedOrder(null);
      setScheduleData({
        tanggalJemput: "",
        messenger: "",
      });
      toast.success("Jadwal berhasil diubah!");
    }
  };

  const handleDocumentVerification = () => {
    if (selectedOrder) {
      const updatedOrder = { 
        ...selectedOrder, 
        ...documentData,
        currentStep: 4,
        documentsVerified: true
      };
      
      // Move to Proses Samsat
      setOrdersByStatus({
        ...ordersByStatus,
        "Verifikasi Dokumen": ordersByStatus["Verifikasi Dokumen"]?.filter((o: any) => o.orderNo !== selectedOrder.orderNo) || [],
        "Proses Samsat": [...(ordersByStatus["Proses Samsat"] || []), updatedOrder]
      });
      
      setIsDocumentVerificationDialogOpen(false);
      setSelectedOrder(null);
      setDocumentData({
        documentsList: [],
        documentNotes: "",
      });
      toast.success("Dokumen berhasil diverifikasi dan order dipindahkan ke Proses Samsat!");
    }
  };

  const moveToPengantaran = (order: any) => {
    const updatedOrder = { ...order, currentStep: 7 };
    
    setOrdersByStatus({
      ...ordersByStatus,
      "Supervisi": ordersByStatus["Supervisi"]?.filter((o: any) => o.orderNo !== order.orderNo) || [],
      "Pengantaran": [...(ordersByStatus["Pengantaran"] || []), updatedOrder]
    });
    
    toast.success("Order dipindahkan ke Pengantaran!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUpdatedDocuments([...updatedDocuments, ...filesArray]);
      toast.success(`${filesArray.length} dokumen ditambahkan`);
    }
  };

  const removeUploadedDocument = (index: number) => {
    const newDocs = updatedDocuments.filter((_, i) => i !== index);
    setUpdatedDocuments(newDocs);
    toast.info("Dokumen dihapus");
  };

  const handleFinalCost = () => {
    if (selectedOrder) {
      // Check for items exceeding harga dasar
      const exceededItems: string[] = [];
      
      // Check Mutasi Keluar
      Object.keys(hargaDasarMutasiKeluar).forEach((key) => {
        const value = parseFloat(finalCostData[key as keyof typeof finalCostData] as string);
        const baseCost = hargaDasarMutasiKeluar[key as keyof typeof hargaDasarMutasiKeluar];
        if (value && value > baseCost) {
          const itemName = key.replace('mutasiKeluar', '').replace(/([A-Z])/g, ' $1').trim();
          exceededItems.push(`Mutasi Keluar - ${itemName}: Rp ${value.toLocaleString('id-ID')} (Harga Dasar: Rp ${baseCost.toLocaleString('id-ID')})`);
        }
      });
      
      // Check Mutasi Masuk
      Object.keys(hargaDasarMutasiMasuk).forEach((key) => {
        const value = parseFloat(finalCostData[key as keyof typeof finalCostData] as string);
        const baseCost = hargaDasarMutasiMasuk[key as keyof typeof hargaDasarMutasiMasuk];
        if (value && value > baseCost) {
          const itemName = key.replace('mutasiMasuk', '').replace(/([A-Z])/g, ' $1').trim();
          exceededItems.push(`Mutasi Masuk - ${itemName}: Rp ${value.toLocaleString('id-ID')} (Harga Dasar: Rp ${baseCost.toLocaleString('id-ID')})`);
        }
      });
      
      // Prepare updated documents list
      const updatedDocsList = updatedDocuments.map(file => file.name);
      
      const updatedOrder = { 
        ...selectedOrder, 
        ...finalCostData,
        finalBiayaJasa: parseFloat(finalCostData.finalBiayaJasa),
        finalPkb: parseFloat(finalCostData.finalPkb),
        finalSwdkllj: parseFloat(finalCostData.finalSwdkllj),
        finalDendaSwdkllj: parseFloat(finalCostData.finalDendaSwdkllj),
        finalMutasiKeluar: parseFloat(finalCostData.finalMutasiKeluar || "0"),
        finalMutasiMasuk: parseFloat(finalCostData.finalMutasiMasuk || "0"),
        finalBiayaLainnya: parseFloat(finalCostData.finalBiayaLainnya || "0"),
        keteranganMutasiKeluar: finalCostData.keteranganMutasiKeluar || "",
        keteranganMutasiMasuk: finalCostData.keteranganMutasiMasuk || "",
        keteranganBiayaLainnya: finalCostData.keteranganBiayaLainnya || "",
        // Parse all mutasi fields
        ...Object.keys(finalCostData).reduce((acc, key) => {
          if (key.startsWith('mutasi') && !key.includes('Keluar') && !key.includes('Masuk')) {
            acc[key] = parseFloat(finalCostData[key as keyof typeof finalCostData] as string || "0");
          }
          return acc;
        }, {} as any),
        isVerified: true,
        exceededItems: exceededItems.length > 0 ? exceededItems : null,
        updatedDocuments: updatedDocsList,
      };
      
      // Move to Supervisi tab
      setOrdersByStatus({
        ...ordersByStatus,
        "Verifikasi Ulang": ordersByStatus["Verifikasi Ulang"]?.filter((o: any) => o.orderNo !== selectedOrder.orderNo) || [],
        "Supervisi": [...(ordersByStatus["Supervisi"] || []), { ...updatedOrder, currentStep: 6 }]
      });
      
      setIsFinalCostDialogOpen(false);
      setSelectedOrder(null);
      setUpdatedDocuments([]);
      setFinalCostData({
        finalBiayaJasa: "",
        finalPkb: "",
        finalSwdkllj: "",
        finalDendaSwdkllj: "",
        finalMutasiKeluar: "",
        finalMutasiMasuk: "",
        finalBiayaLainnya: "",
        keteranganMutasiKeluar: "",
        keteranganMutasiMasuk: "",
        keteranganBiayaLainnya: "",
        // Reset mutasi keluar
        mutasiKeluarLegalisir: "",
        mutasiKeluarHadir: "",
        mutasiKeluarLegalisirCf: "",
        mutasiKeluarCf: "",
        mutasiKeluarBantuanHadir: "",
        mutasiKeluarCekBlokir: "",
        mutasiKeluarLokPembukuan: "",
        mutasiKeluarLokTu: "",
        mutasiKeluarLokTuNopil: "",
        mutasiKeluarLoksus: "",
        mutasiKeluarCetakSkp: "",
        mutasiKeluarCetakFiskal: "",
        mutasiKeluarLokArsip: "",
        mutasiKeluarCekProgresif: "",
        mutasiKeluarMatiinNopil: "",
        mutasiKeluarDaftarMutmasNormal: "",
        mutasiKeluarDaftarMutmasKilat: "",
        // Reset mutasi masuk
        mutasiMasukLegalisir: "",
        mutasiMasukMutmas: "",
        mutasiMasukBy: "",
        mutasiMasukPendaftaran: "",
        mutasiMasukReqGanjilGenap: "",
        mutasiMasukAcak: "",
        mutasiMasukLokTu: "",
        mutasiMasukLokPembukuan: "",
        mutasiMasukDaftarBpkb: "",
        mutasiMasukPenulisanBpkb: "",
        mutasiMasukCetakNotice: "",
        mutasiMasukCetakStnk: "",
        mutasiMasukCetakPlat: "",
      });
      
      // Show alert if there are exceeded items
      if (exceededItems.length > 0) {
        toast.warning("Beberapa item melebihi harga dasar!", {
          description: exceededItems.join('\n'),
          duration: 8000,
        });
      }
      
      toast.success("Biaya final berhasil disimpan!");
    }
  };

  const handleDelivery = () => {
    if (selectedOrder) {
      const updatedOrder = { 
        ...selectedOrder, 
        ...deliveryData,
        isDeliveryScheduled: true
      };
      
      // Update in the same tab
      setOrdersByStatus({
        ...ordersByStatus,
        "Pengantaran": (ordersByStatus["Pengantaran"] || []).map((o: any) => 
          o.orderNo === selectedOrder.orderNo ? updatedOrder : o
        )
      });
      
      setIsDeliveryDialogOpen(false);
      setSelectedOrder(null);
      setDeliveryData({
        tanggalPengantaran: "",
      });
      toast.success("Jadwal pengantaran berhasil diatur! Status: Terjadwal");
    }
  };

  const getFilteredOrders = () => {
    const orders = ordersByStatus[currentTab] || [];
    if (searchTerm === "") return orders;
    
    return orders.filter((order: any) =>
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nopol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredOrders = getFilteredOrders();

  // Helper function to render input field with base price validation
  const renderCostInput = (
    label: string,
    fieldKey: keyof typeof finalCostData,
    basePrice: number,
    isMutasi: boolean = false
  ) => {
    const value = finalCostData[fieldKey] as string;
    const exceeds = parseFloat(value || "0") > basePrice;
    
    return (
      <div className="space-y-2">
        <Label className={cn("text-xs flex flex-col gap-1", isMutasi && "")}>
          {label}
          {isMutasi && (
            <span className="text-[10px] text-muted-foreground">
              Harga Dasar: Rp {basePrice.toLocaleString('id-ID')}
            </span>
          )}
        </Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setFinalCostData({...finalCostData, [fieldKey]: e.target.value})}
          className={cn(
            "bg-input-background h-9",
            exceeds && isMutasi
              ? "border-red-500 border-2 focus-visible:ring-red-500"
              : "border-border"
          )}
          placeholder="0"
        />
        {exceeds && isMutasi && (
          <p className="text-[10px] text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Melebihi harga dasar Rp {(parseFloat(value) - basePrice).toLocaleString('id-ID')}
          </p>
        )}
      </div>
    );
  };

  // For Penjadwalan tab - split into scheduled and unscheduled
  const unscheduledOrders = filteredOrders.filter((o: any) => !o.isScheduled);
  const scheduledOrders = filteredOrders.filter((o: any) => o.isScheduled);

  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Order Tracking</h1>
        <p className="text-muted-foreground mt-1">Lacak dan kelola status order kendaraan</p>
      </motion.div>

      {/* Progress Steps */}
      <Card className="glass-card p-3 md:p-6">
        {/* Mobile: Dropdown Select */}
        <div className="block md:hidden">
          <Select value={currentTab} onValueChange={setCurrentTab}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {trackingSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <SelectItem key={step.id} value={step.title}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{step.title}</span>
                      <Badge className={cn("ml-auto", getStatusColor(step.id))}>
                        {ordersByStatus[step.title]?.length || 0}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Progress Steps */}
        <div className="hidden md:flex items-center justify-between">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = trackingSteps.findIndex(s => s.title === currentTab) >= index;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer",
                      isActive 
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white" 
                        : "bg-secondary text-muted-foreground"
                    )}
                    onClick={() => setCurrentTab(step.title)}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <p className={cn(
                    "text-sm mt-2 text-center",
                    isActive ? "text-blue-400" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <Badge className={cn("mt-1", getStatusColor(step.id))}>
                    {ordersByStatus[step.title]?.length || 0}
                  </Badge>
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={cn(
                    "h-1 flex-1 mx-2 transition-all",
                    trackingSteps.findIndex(s => s.title === currentTab) > index
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-secondary"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="hidden">
          {trackingSteps.map((step) => (
            <TabsTrigger key={step.id} value={step.title}>
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Isi Formulir Tab */}
        <TabsContent value="Isi Formulir">
          <Card className="glass-card p-4">
            <h3 className="text-lg mb-6">Formulir Order Baru</h3>
            
            <div className="space-y-4">
              {/* Pilih Layanan */}
              <div>
                <h4 className="mb-4">Pilih Layanan</h4>
                <Select
                  value={newOrderData.layanan}
                  onValueChange={(value) => setNewOrderData({...newOrderData, layanan: value})}
                >
                  <SelectTrigger className="bg-input-background border-border text-foreground">
                    <SelectValue placeholder="Pilih jenis layanan" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {layananOptions.map((layanan) => (
                      <SelectItem key={layanan} value={layanan}>{layanan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data Pemilik */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Data Pemilik Kendaraan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Pemilik</Label>
                    <Input
                      value={newOrderData.namaPemilik}
                      onChange={(e) => setNewOrderData({...newOrderData, namaPemilik: e.target.value})}
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor HP</Label>
                    <Input
                      value={newOrderData.nomorHP}
                      onChange={(e) => setNewOrderData({...newOrderData, nomorHP: e.target.value})}
                      className="bg-input-background border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Kepemilikan & Kendaraan */}
              <div>
                <h4 className="mb-4">Kepemilikan Kendaraan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kepemilikan</Label>
                    <Select 
                      value={newOrderData.kepemilikanKendaraan}
                      onValueChange={(value) => setNewOrderData({...newOrderData, kepemilikanKendaraan: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border text-foreground">
                        <SelectValue placeholder="Pilih kepemilikan" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground border-border">
                        <SelectItem value="Pribadi">Pribadi</SelectItem>
                        <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kendaraan</Label>
                    <Select
                      value={newOrderData.jenisKendaraan}
                      onValueChange={(value) => setNewOrderData({...newOrderData, jenisKendaraan: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Motor">Motor</SelectItem>
                        <SelectItem value="Mobil">Mobil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Data Kendaraan */}
              <div>
                <h4 className="mb-4">Data Kendaraan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tahun Kendaraan</Label>
                    <Input
                      value={newOrderData.tahunKendaraan}
                      onChange={(e) => setNewOrderData({...newOrderData, tahunKendaraan: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Polisi</Label>
                    <Input
                      value={newOrderData.nopol}
                      onChange={(e) => setNewOrderData({...newOrderData, nopol: e.target.value})}
                      className="bg-input-background border-border font-mono"
                      placeholder="B 1234 ABC"
                    />
                  </div>
                </div>
              </div>

              {/* PKB & Pajak Info */}
              <div>
                <h4 className="mb-4">Informasi Pajak</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>PKB Berlaku S/D</Label>
                    <Input
                      value={newOrderData.pkbBerlakuSd}
                      onChange={(e) => setNewOrderData({...newOrderData, pkbBerlakuSd: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="17-11-2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tahun Pajak</Label>
                    <Input
                      value={newOrderData.tahunPajak}
                      onChange={(e) => setNewOrderData({...newOrderData, tahunPajak: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bulan Pajak</Label>
                    <Select
                      value={newOrderData.bulanPajak}
                      onValueChange={(value) => setNewOrderData({...newOrderData, bulanPajak: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        {bulanOptions.map((bulan) => (
                          <SelectItem key={bulan} value={bulan}>{bulan}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nominal PKB Terakhir</Label>
                    <Input
                      type="number"
                      value={newOrderData.nominalPkbTerakhir}
                      onChange={(e) => setNewOrderData({...newOrderData, nominalPkbTerakhir: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nominal SWDKLLJ</Label>
                    <Input
                      type="number"
                      value={newOrderData.nominalSwdkllj}
                      onChange={(e) => setNewOrderData({...newOrderData, nominalSwdkllj: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kode Promo</Label>
                    <Input
                      value={newOrderData.kodePromo}
                      onChange={(e) => setNewOrderData({...newOrderData, kodePromo: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="PROMO2024"
                    />
                  </div>
                </div>
              </div>

              {/* Wilayah Samsat */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Wilayah Samsat
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Wilayah Samsat Asal</Label>
                    <Select
                      value={newOrderData.wilayahSamsatAsal}
                      onValueChange={(value) => setNewOrderData({...newOrderData, wilayahSamsatAsal: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih wilayah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                        <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                        <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                        <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                        <SelectItem value="Depok">Depok</SelectItem>
                        <SelectItem value="Bekasi">Bekasi</SelectItem>
                        <SelectItem value="Tangerang">Tangerang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Wilayah Samsat Tujuan (jika mutasi)</Label>
                    <Select
                      value={newOrderData.wilayahSamsatTujuan}
                      onValueChange={(value) => setNewOrderData({...newOrderData, wilayahSamsatTujuan: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih wilayah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                        <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                        <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                        <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                        <SelectItem value="Depok">Depok</SelectItem>
                        <SelectItem value="Bekasi">Bekasi</SelectItem>
                        <SelectItem value="Tangerang">Tangerang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <h4 className="mb-4">Alamat Jemput & Antar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Domisili Pengambilan</Label>
                    <Select
                      value={newOrderData.domisiliPengambilan}
                      onValueChange={(value) => setNewOrderData({...newOrderData, domisiliPengambilan: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih domisili" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                        <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                        <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                        <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                        <SelectItem value="Depok">Depok</SelectItem>
                        <SelectItem value="Bekasi">Bekasi</SelectItem>
                        <SelectItem value="Tangerang">Tangerang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Domisili Pengembalian</Label>
                    <Select
                      value={newOrderData.domisiliPengembalian}
                      onValueChange={(value) => setNewOrderData({...newOrderData, domisiliPengembalian: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue placeholder="Pilih domisili" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                        <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                        <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                        <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                        <SelectItem value="Depok">Depok</SelectItem>
                        <SelectItem value="Bekasi">Bekasi</SelectItem>
                        <SelectItem value="Tangerang">Tangerang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Detail Alamat Pengambilan</Label>
                    <Input
                      value={newOrderData.detailAlamatPengambilan}
                      onChange={(e) => setNewOrderData({...newOrderData, detailAlamatPengambilan: e.target.value})}
                      placeholder="Jl. Nama Jalan No. XX, RT/RW"
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Detail Alamat Pengembalian</Label>
                    <Input
                      value={newOrderData.detailAlamatPengembalian}
                      onChange={(e) => setNewOrderData({...newOrderData, detailAlamatPengembalian: e.target.value})}
                      placeholder="Jl. Nama Jalan No. XX, RT/RW"
                      className="bg-input-background border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Estimasi Biaya - MOVED TO BOTTOM */}
              <div className="border-t border-border pt-6">
                <h4 className="mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-green-400" />
                  Estimasi Biaya
                </h4>
                <Card className="glass-card p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Biaya Jasa</span>
                      <span>Rp {cost.biayaJasa.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">PKB</span>
                      <span>Rp {cost.pkb.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SWDKLLJ</span>
                      <span>Rp {cost.swdkllj.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Denda SWDKLLJ</span>
                      <span>Rp {cost.dendaSwdkllj.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="flex justify-between border-t border-border pt-2 mt-2 text-green-400">
                      <span>Total</span>
                      <span className="text-lg">Rp {cost.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" className="border-border">
                  Reset
                </Button>
                <Button onClick={handleAddOrder} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  Submit Order
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Verifikasi Tab */}
        <TabsContent value="Verifikasi">
          <Card className="glass-card p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg">Verifikasi</h3>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} order dalam tahap ini</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari order..." 
                  className="pl-10 bg-input-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">No Order</TableHead>
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="whitespace-nowrap">Nopol</TableHead>
                    <TableHead className="whitespace-nowrap">Layanan</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-mono text-blue-400 whitespace-nowrap">{order.orderNo}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                        <TableCell className="font-mono whitespace-nowrap">{order.nopol}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.layanan}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={getStatusColor(order.currentStep)}>
                            {trackingSteps[order.currentStep - 1].title}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 shrink-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm"
                              className="shrink-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsVerifyDialogOpen(true);
                              }}
                            >
                              Verifikasi
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada order ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Penjadwalan Tab - WITH 2 TABLES */}
        <TabsContent value="Penjadwalan">
          <div className="space-y-4">
            {/* Table 1: Belum Terjadwal */}
            <Card className="glass-card p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg">Belum Terjadwal</h3>
                  <p className="text-sm text-muted-foreground">{unscheduledOrders.length} order belum dijadwalkan</p>
                </div>
                
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari order..." 
                    className="pl-10 bg-input-background border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">No Order</TableHead>
                      <TableHead className="whitespace-nowrap">Customer</TableHead>
                      <TableHead className="whitespace-nowrap">Nopol</TableHead>
                      <TableHead className="whitespace-nowrap">Layanan</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unscheduledOrders.length > 0 ? (
                      unscheduledOrders.map((order: any) => (
                        <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                          <TableCell className="font-mono text-blue-400 whitespace-nowrap">{order.orderNo}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                          <TableCell className="font-mono whitespace-nowrap">{order.nopol}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.layanan}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className={getStatusColor(order.currentStep)}>
                              Belum Dijadwal
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-blue-400" />
                              </Button>
                              <Button 
                                size="sm"
                                className="shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setScheduleData({
                                    tanggalJemput: "",
                                    messenger: "",
                                  });
                                  setIsScheduleDialogOpen(true);
                                }}
                              >
                                Jadwalkan
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Tidak ada order yang belum dijadwalkan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Table 2: Sudah Terjadwal */}
            <Card className="glass-card p-4 md:p-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg">Sudah Terjadwal</h3>
                  <p className="text-sm text-muted-foreground">{scheduledOrders.length} order sudah dijadwalkan</p>
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">No Order</TableHead>
                      <TableHead className="whitespace-nowrap">Customer</TableHead>
                      <TableHead className="whitespace-nowrap">Nopol</TableHead>
                      <TableHead className="whitespace-nowrap">Layanan</TableHead>
                      <TableHead className="whitespace-nowrap">Messenger</TableHead>
                      <TableHead className="whitespace-nowrap">Tanggal Jemput</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledOrders.length > 0 ? (
                      scheduledOrders.map((order: any) => (
                        <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                          <TableCell className="font-mono text-blue-400 whitespace-nowrap">{order.orderNo}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                          <TableCell className="font-mono whitespace-nowrap">{order.nopol}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.layanan}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.messenger}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.tanggalJemput}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Terjadwal
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-blue-400" />
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setScheduleData({
                                    tanggalJemput: order.tanggalJemput,
                                    messenger: order.messenger,
                                  });
                                  setIsEditScheduleDialogOpen(true);
                                }}
                              >
                                Ubah Jadwal
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Tidak ada order yang sudah dijadwalkan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Verifikasi Dokumen Tab */}
        <TabsContent value="Verifikasi Dokumen">
          <Card className="glass-card p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg">Verifikasi Dokumen</h3>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} order menunggu verifikasi dokumen</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari order..." 
                  className="pl-10 bg-input-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">No Order</TableHead>
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="whitespace-nowrap">Nopol</TableHead>
                    <TableHead className="whitespace-nowrap">Layanan</TableHead>
                    <TableHead className="whitespace-nowrap">Messenger</TableHead>
                    <TableHead className="whitespace-nowrap">Tanggal Jemput</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-mono text-blue-400 whitespace-nowrap">{order.orderNo}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                        <TableCell className="font-mono whitespace-nowrap">{order.nopol}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.layanan}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.messenger}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.tanggalJemput}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={cn(
                            order.documentsVerified 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          )}>
                            {order.documentsVerified ? "Terverifikasi" : "Belum Verifikasi"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 shrink-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </Button>
                            {order.documentsVerified ? (
                              <Button 
                                size="sm"
                                variant="outline"
                                className="shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setDocumentData({
                                    documentsList: order.documentsList || [],
                                    documentNotes: order.documentNotes || "",
                                  });
                                  setIsDocumentVerificationDialogOpen(true);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Lihat Dokumen
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                className="shrink-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setDocumentData({
                                    documentsList: [],
                                    documentNotes: "",
                                  });
                                  setIsDocumentVerificationDialogOpen(true);
                                }}
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                Verifikasi Dokumen
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Tidak ada order ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Proses Samsat Tab - VIEW ONLY */}
        <TabsContent value="Proses Samsat">
          <Card className="glass-card p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg">Proses Samsat</h3>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} order dalam proses</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari order..." 
                  className="pl-10 bg-input-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>No Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Nopol</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Messenger</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-mono text-blue-400">{order.orderNo}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="font-mono">{order.nopol}</TableCell>
                        <TableCell>{order.layanan}</TableCell>
                        <TableCell>{order.messenger}</TableCell>
                        <TableCell>{order.tanggalJemput}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.currentStep)}>
                            Dalam Proses
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500"
                              onClick={() => {
                                setSelectedOrder(order);
                                // Load existing progress if available
                                if (order.samsatProgress) {
                                  setSamsatProgress(order.samsatProgress);
                                } else {
                                  setSamsatProgress({
                                    mutasiKeluar: {
                                      legalisirHadir: false,
                                      legalisirCf: false,
                                      cfBantuanHadir: false,
                                      cekBlokir: false,
                                      lokPembukuan: false,
                                      lokTu: false,
                                      lokTuNopil: false,
                                      loksus: false,
                                      cetakSkp: false,
                                      cetakFiskal: false,
                                      lokArsip: false,
                                      cekProgresif: false,
                                      matiinNopil: false,
                                      daftarMutmasNormal: false,
                                      daftarMutmasKilat: false,
                                    },
                                    mutasiMasuk: {
                                      legalisirMutmas: false,
                                      byPendaftaran: false,
                                      reqGanjilGenap: false,
                                      acak: false,
                                      lokTu: false,
                                      lokPembukuan: false,
                                      daftarBpkb: false,
                                      penulisanBpkb: false,
                                      cetakNotice: false,
                                      cetakStnk: false,
                                      cetakPlat: false,
                                    }
                                  });
                                }
                                setIsSamsatProgressDialogOpen(true);
                              }}
                            >
                              <PackageCheck className="w-4 h-4 mr-1" />
                              Proses
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Tidak ada order ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Verifikasi Ulang Tab - 2 TABLES */}
        <TabsContent value="Verifikasi Ulang">
          <div className="space-y-4">
            {/* Table 1: Belum Verifikasi */}
            <Card className="glass-card p-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg">Belum Verifikasi Total Biaya</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredOrders.filter((o: any) => !o.isVerified).length} order belum terverifikasi
                  </p>
                </div>
                
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari order..." 
                    className="pl-10 bg-input-background border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>No Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Nopol</TableHead>
                      <TableHead>Layanan</TableHead>
                      <TableHead>Estimasi Biaya Awal</TableHead>
                      <TableHead>Total Biaya</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.filter((o: any) => !o.isVerified).length > 0 ? (
                      filteredOrders.filter((o: any) => !o.isVerified).map((order: any) => {
                        const estimasiBiaya = order.biayaJasa + order.pkb + order.swdkllj + order.dendaSwdkllj;
                        
                        return (
                          <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-mono text-blue-400">{order.orderNo}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell className="font-mono">{order.nopol}</TableCell>
                            <TableCell>{order.layanan}</TableCell>
                            <TableCell className="text-green-400">
                              Rp {estimasiBiaya.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              --
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Belum Verifikasi
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 text-blue-400" />
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setFinalCostData({
                                      finalBiayaJasa: order.biayaJasa.toString(),
                                      finalPkb: order.pkb.toString(),
                                      finalSwdkllj: order.swdkllj.toString(),
                                      finalDendaSwdkllj: order.dendaSwdkllj.toString(),
                                      finalMutasiKeluar: "0",
                                      finalMutasiMasuk: "0",
                                      finalBiayaLainnya: "0",
                                      keteranganMutasiKeluar: "",
                                      keteranganMutasiMasuk: "",
                                      keteranganBiayaLainnya: "",
                                      // Initialize mutasi keluar
                                      mutasiKeluarLegalisir: "",
                                      mutasiKeluarHadir: "",
                                      mutasiKeluarLegalisirCf: "",
                                      mutasiKeluarCf: "",
                                      mutasiKeluarBantuanHadir: "",
                                      mutasiKeluarCekBlokir: "",
                                      mutasiKeluarLokPembukuan: "",
                                      mutasiKeluarLokTu: "",
                                      mutasiKeluarLokTuNopil: "",
                                      mutasiKeluarLoksus: "",
                                      mutasiKeluarCetakSkp: "",
                                      mutasiKeluarCetakFiskal: "",
                                      mutasiKeluarLokArsip: "",
                                      mutasiKeluarCekProgresif: "",
                                      mutasiKeluarMatiinNopil: "",
                                      mutasiKeluarDaftarMutmasNormal: "",
                                      mutasiKeluarDaftarMutmasKilat: "",
                                      // Initialize mutasi masuk
                                      mutasiMasukLegalisir: "",
                                      mutasiMasukMutmas: "",
                                      mutasiMasukBy: "",
                                      mutasiMasukPendaftaran: "",
                                      mutasiMasukReqGanjilGenap: "",
                                      mutasiMasukAcak: "",
                                      mutasiMasukLokTu: "",
                                      mutasiMasukLokPembukuan: "",
                                      mutasiMasukDaftarBpkb: "",
                                      mutasiMasukPenulisanBpkb: "",
                                      mutasiMasukCetakNotice: "",
                                      mutasiMasukCetakStnk: "",
                                      mutasiMasukCetakPlat: "",
                                    });
                                    setIsFinalCostDialogOpen(true);
                                  }}
                                >
                                  Verifikasi
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Tidak ada order yang belum terverifikasi
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>


          </div>
        </TabsContent>

        {/* Supervisi Tab */}
        <TabsContent value="Supervisi">
          <Card className="glass-card p-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg">Supervisi</h3>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} order dalam supervisi</p>
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>No Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Nopol</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Estimasi Biaya Awal</TableHead>
                    <TableHead>Total Biaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => {
                      const estimasiBiaya = order.biayaJasa + order.pkb + order.swdkllj + order.dendaSwdkllj;
                      const totalBiaya = order.finalBiayaJasa + 
                                         order.finalPkb + 
                                         order.finalSwdkllj + 
                                         order.finalDendaSwdkllj +
                                         (order.finalMutasiKeluar || 0) +
                                         (order.finalMutasiMasuk || 0) +
                                         (order.finalBiayaLainnya || 0);
                      
                      const hasExceededItems = order.exceededItems && order.exceededItems.length > 0;
                      
                      return (
                        <TableRow key={order.orderNo} className={cn(
                          "hover:bg-secondary/20 transition-colors",
                          hasExceededItems && "bg-orange-500/5 border-l-4 border-l-orange-500"
                        )}>
                          <TableCell className="font-mono text-blue-400">{order.orderNo}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="font-mono">{order.nopol}</TableCell>
                          <TableCell>{order.layanan}</TableCell>
                          <TableCell className="text-green-400">
                            Rp {estimasiBiaya.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell className="text-blue-400">
                            Rp {totalBiaya.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Terverifikasi
                              </Badge>
                              {hasExceededItems && (
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Melebihi Harga Dasar
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-blue-400" />
                              </Button>
                              <Button 
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setFinalCostData({
                                    finalBiayaJasa: order.finalBiayaJasa?.toString() || "",
                                    finalPkb: order.finalPkb?.toString() || "",
                                    finalSwdkllj: order.finalSwdkllj?.toString() || "",
                                    finalDendaSwdkllj: order.finalDendaSwdkllj?.toString() || "",
                                    finalMutasiKeluar: order.finalMutasiKeluar?.toString() || "",
                                    finalMutasiMasuk: order.finalMutasiMasuk?.toString() || "",
                                    finalBiayaLainnya: order.finalBiayaLainnya?.toString() || "",
                                    keteranganMutasiKeluar: order.keteranganMutasiKeluar || "",
                                    keteranganMutasiMasuk: order.keteranganMutasiMasuk || "",
                                    keteranganBiayaLainnya: order.keteranganBiayaLainnya || "",
                                    // Load existing mutasi keluar data
                                    mutasiKeluarLegalisir: order.mutasiKeluarLegalisir?.toString() || "",
                                    mutasiKeluarHadir: order.mutasiKeluarHadir?.toString() || "",
                                    mutasiKeluarLegalisirCf: order.mutasiKeluarLegalisirCf?.toString() || "",
                                    mutasiKeluarCf: order.mutasiKeluarCf?.toString() || "",
                                    mutasiKeluarBantuanHadir: order.mutasiKeluarBantuanHadir?.toString() || "",
                                    mutasiKeluarCekBlokir: order.mutasiKeluarCekBlokir?.toString() || "",
                                    mutasiKeluarLokPembukuan: order.mutasiKeluarLokPembukuan?.toString() || "",
                                    mutasiKeluarLokTu: order.mutasiKeluarLokTu?.toString() || "",
                                    mutasiKeluarLokTuNopil: order.mutasiKeluarLokTuNopil?.toString() || "",
                                    mutasiKeluarLoksus: order.mutasiKeluarLoksus?.toString() || "",
                                    mutasiKeluarCetakSkp: order.mutasiKeluarCetakSkp?.toString() || "",
                                    mutasiKeluarCetakFiskal: order.mutasiKeluarCetakFiskal?.toString() || "",
                                    mutasiKeluarLokArsip: order.mutasiKeluarLokArsip?.toString() || "",
                                    mutasiKeluarCekProgresif: order.mutasiKeluarCekProgresif?.toString() || "",
                                    mutasiKeluarMatiinNopil: order.mutasiKeluarMatiinNopil?.toString() || "",
                                    mutasiKeluarDaftarMutmasNormal: order.mutasiKeluarDaftarMutmasNormal?.toString() || "",
                                    mutasiKeluarDaftarMutmasKilat: order.mutasiKeluarDaftarMutmasKilat?.toString() || "",
                                    // Load existing mutasi masuk data
                                    mutasiMasukLegalisir: order.mutasiMasukLegalisir?.toString() || "",
                                    mutasiMasukMutmas: order.mutasiMasukMutmas?.toString() || "",
                                    mutasiMasukBy: order.mutasiMasukBy?.toString() || "",
                                    mutasiMasukPendaftaran: order.mutasiMasukPendaftaran?.toString() || "",
                                    mutasiMasukReqGanjilGenap: order.mutasiMasukReqGanjilGenap?.toString() || "",
                                    mutasiMasukAcak: order.mutasiMasukAcak?.toString() || "",
                                    mutasiMasukLokTu: order.mutasiMasukLokTu?.toString() || "",
                                    mutasiMasukLokPembukuan: order.mutasiMasukLokPembukuan?.toString() || "",
                                    mutasiMasukDaftarBpkb: order.mutasiMasukDaftarBpkb?.toString() || "",
                                    mutasiMasukPenulisanBpkb: order.mutasiMasukPenulisanBpkb?.toString() || "",
                                    mutasiMasukCetakNotice: order.mutasiMasukCetakNotice?.toString() || "",
                                    mutasiMasukCetakStnk: order.mutasiMasukCetakStnk?.toString() || "",
                                    mutasiMasukCetakPlat: order.mutasiMasukCetakPlat?.toString() || "",
                                  });
                                  setIsFinalCostDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 text-blue-400" />
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => moveToPengantaran(order)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Lanjut
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Tidak ada order yang sudah terverifikasi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Pengantaran Tab - DELIVERY SCHEDULE HERE */}
        <TabsContent value="Pengantaran">
          <Card className="glass-card p-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg">Pengantaran</h3>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} order siap diantar</p>
              </div>
              
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari order..." 
                  className="pl-10 bg-input-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>No Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Nopol</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Messenger</TableHead>
                    <TableHead>Tanggal Pengantaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-mono text-blue-400">{order.orderNo}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="font-mono">{order.nopol}</TableCell>
                        <TableCell>{order.layanan}</TableCell>
                        <TableCell>{order.messenger}</TableCell>
                        <TableCell>{order.tanggalPengantaran || "--"}</TableCell>
                        <TableCell>
                          {order.isDeliveryScheduled ? (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                              Terjadwal
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Belum Dijadwalkan
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600"
                              onClick={() => {
                                setSelectedOrder(order);
                                setDeliveryData({
                                  tanggalPengantaran: order.tanggalPengantaran || "",
                                });
                                setIsDeliveryDialogOpen(true);
                              }}
                            >
                              {order.isDeliveryScheduled ? "Ubah Jadwal" : "Atur Pengantaran"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Tidak ada order ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Detail Order - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Informasi lengkap tentang order ini
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Data Pemilik */}
              <div>
                <h4 className="mb-3 text-foreground">Data Pemilik</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nama Pemilik</p>
                    <p className="text-foreground">{selectedOrder.namaPemilik}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nomor HP</p>
                    <p className="text-foreground">{selectedOrder.nomorHP}</p>
                  </div>
                </div>
              </div>

              {/* Layanan & Kendaraan */}
              <div>
                <h4 className="mb-3 text-foreground">Layanan & Kendaraan</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Layanan</p>
                    <p className="text-foreground">{selectedOrder.layanan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kepemilikan</p>
                    <p className="text-foreground">{selectedOrder.kepemilikanKendaraan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jenis Kendaraan</p>
                    <p className="text-foreground">{selectedOrder.jenisKendaraan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tahun Kendaraan</p>
                    <p className="text-foreground">{selectedOrder.tahunKendaraan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nopol</p>
                    <p className="font-mono text-foreground">{selectedOrder.nopol}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedOrder.currentStep)}>
                      {trackingSteps[selectedOrder.currentStep - 1].title}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Informasi Pajak */}
              <div>
                <h4 className="mb-3 text-foreground">Informasi Pajak</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">PKB Berlaku S/D</p>
                    <p className="text-foreground">{selectedOrder.pkbBerlakuSd}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tahun Pajak</p>
                    <p className="text-foreground">{selectedOrder.tahunPajak}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bulan Pajak</p>
                    <p className="text-foreground">{selectedOrder.bulanPajak}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nominal PKB Terakhir</p>
                    <p className="text-foreground">{selectedOrder.nominalPkbTerakhir}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nominal SWDKLLJ</p>
                    <p className="text-foreground">{selectedOrder.nominalSwdkllj}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kode Promo</p>
                    <p className="text-foreground">{selectedOrder.kodePromo || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Wilayah */}
              <div>
                <h4 className="mb-3 text-foreground">Wilayah Samsat</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Wilayah Samsat Asal</p>
                    <p className="text-foreground">{selectedOrder.wilayahSamsatAsal}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Wilayah Samsat Tujuan</p>
                    <p className="text-foreground">{selectedOrder.wilayahSamsatTujuan || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <h4 className="mb-3 text-foreground">Alamat Jemput & Antar</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Domisili Pengambilan</p>
                    <p className="text-foreground">{selectedOrder.domisiliPengambilan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Domisili Pengembalian</p>
                    <p className="text-foreground">{selectedOrder.domisiliPengembalian}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Detail Alamat Pengambilan</p>
                    <p className="text-foreground">{selectedOrder.detailAlamatPengambilan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Detail Alamat Pengembalian</p>
                    <p className="text-foreground">{selectedOrder.detailAlamatPengembalian}</p>
                  </div>
                </div>
              </div>

              {/* Estimasi Biaya */}
              <div>
                <h4 className="mb-3 text-foreground">Estimasi Biaya</h4>
                <Card className="glass-card p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biaya Jasa</span>
                      <span className="text-foreground">Rp {selectedOrder.biayaJasa?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PKB</span>
                      <span className="text-foreground">Rp {selectedOrder.pkb?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SWDKLLJ</span>
                      <span className="text-foreground">Rp {selectedOrder.swdkllj?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Denda SWDKLLJ</span>
                      <span className="text-foreground">Rp {selectedOrder.dendaSwdkllj?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-green-400">
                      <span>Total</span>
                      <span className="text-lg">
                        Rp {(selectedOrder.biayaJasa + selectedOrder.pkb + selectedOrder.swdkllj + selectedOrder.dendaSwdkllj)?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Biaya Final (if exists) */}
              {selectedOrder.currentStep >= 5 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-foreground">
                      <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                      Biaya Final
                    </h4>
                    <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Biaya Jasa</span>
                          <span className="text-foreground">Rp {selectedOrder.finalBiayaJasa?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PKB</span>
                          <span className="text-foreground">Rp {selectedOrder.finalPkb?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SWDKLLJ</span>
                          <span className="text-foreground">Rp {selectedOrder.finalSwdkllj?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Denda SWDKLLJ</span>
                          <span className="text-foreground">Rp {selectedOrder.finalDendaSwdkllj?.toLocaleString('id-ID')}</span>
                        </div>
                        
                        {(selectedOrder.finalMutasiKeluar > 0 || selectedOrder.finalMutasiMasuk > 0 || selectedOrder.finalBiayaLainnya > 0) && (
                          <>
                            <Separator className="my-2" />
                            {selectedOrder.finalMutasiKeluar > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Mutasi Keluar</span>
                                  <span className="text-foreground">Rp {selectedOrder.finalMutasiKeluar?.toLocaleString('id-ID')}</span>
                                </div>
                                {selectedOrder.keteranganMutasiKeluar && (
                                  <p className="text-xs text-muted-foreground italic pl-2">
                                    Ket: {selectedOrder.keteranganMutasiKeluar}
                                  </p>
                                )}
                              </div>
                            )}
                            {selectedOrder.finalMutasiMasuk > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Mutasi Masuk</span>
                                  <span className="text-foreground">Rp {selectedOrder.finalMutasiMasuk?.toLocaleString('id-ID')}</span>
                                </div>
                                {selectedOrder.keteranganMutasiMasuk && (
                                  <p className="text-xs text-muted-foreground italic pl-2">
                                    Ket: {selectedOrder.keteranganMutasiMasuk}
                                  </p>
                                )}
                              </div>
                            )}
                            {selectedOrder.finalBiayaLainnya > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Biaya Lainnya</span>
                                  <span className="text-foreground">Rp {selectedOrder.finalBiayaLainnya?.toLocaleString('id-ID')}</span>
                                </div>
                                {selectedOrder.keteranganBiayaLainnya && (
                                  <p className="text-xs text-muted-foreground italic pl-2">
                                    Ket: {selectedOrder.keteranganBiayaLainnya}
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        
                        <Separator className="my-2" />
                        <div className="flex justify-between text-blue-400">
                          <span>Total Final</span>
                          <span className="text-lg">
                            Rp {(parseFloat(selectedOrder.finalBiayaJasa || 0) + parseFloat(selectedOrder.finalPkb || 0) + parseFloat(selectedOrder.finalSwdkllj || 0) + parseFloat(selectedOrder.finalDendaSwdkllj || 0) + parseFloat(selectedOrder.finalMutasiKeluar || 0) + parseFloat(selectedOrder.finalMutasiMasuk || 0) + parseFloat(selectedOrder.finalBiayaLainnya || 0))?.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Warning untuk item yang melebihi harga dasar */}
                  {selectedOrder.exceededItems && selectedOrder.exceededItems.length > 0 && (
                    <Card className="glass-card p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="text-orange-400 mb-2">Perhatian: Item Melebihi Harga Dasar</h5>
                          <div className="space-y-1 text-xs">
                            {selectedOrder.exceededItems.map((item: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-orange-400">•</span>
                                <span className="text-foreground">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {selectedOrder.currentStep >= 3 && (
                <div>
                  <h4 className="mb-3 text-foreground">Informasi Jadwal</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Messenger</p>
                      <p className="text-foreground">{selectedOrder.messenger || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tanggal Jemput</p>
                      <p className="text-foreground">{selectedOrder.tanggalJemput || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.currentStep >= 6 && (
                <div>
                  <h4 className="mb-3 text-foreground">Informasi Pengantaran</h4>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Tanggal Pengantaran</p>
                    <p className="text-foreground">{selectedOrder.tanggalPengantaran || "-"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="border-border bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Verifikasi Order - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Pastikan semua data sudah benar sebelum verifikasi
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleVerify} className="bg-green-500 hover:bg-green-600 text-white">
              Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="border-border bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Penjadwalan Order - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atur jadwal pengambilan dokumen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Tanggal Jemput Dokumen</Label>
              <Input
                type="date"
                value={scheduleData.tanggalJemput}
                onChange={(e) => setScheduleData({...scheduleData, tanggalJemput: e.target.value})}
                className="bg-input-background border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Pilih Messenger</Label>
              <Select
                value={scheduleData.messenger}
                onValueChange={(value) => setScheduleData({...scheduleData, messenger: value})}
              >
                <SelectTrigger className="bg-input-background border-border text-foreground">
                  <SelectValue placeholder="Pilih messenger" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  {messengers.map((messenger) => (
                    <SelectItem key={messenger} value={messenger}>
                      {messenger}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSchedule} className="bg-blue-500 hover:bg-blue-600 text-white">
              Simpan Jadwal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isEditScheduleDialogOpen} onOpenChange={setIsEditScheduleDialogOpen}>
        <DialogContent className="border-border bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Ubah Jadwal - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Perbarui jadwal pengambilan dokumen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Tanggal Jemput Dokumen</Label>
              <Input
                type="date"
                value={scheduleData.tanggalJemput}
                onChange={(e) => setScheduleData({...scheduleData, tanggalJemput: e.target.value})}
                className="bg-input-background border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Pilih Messenger</Label>
              <Select
                value={scheduleData.messenger}
                onValueChange={(value) => setScheduleData({...scheduleData, messenger: value})}
              >
                <SelectTrigger className="bg-input-background border-border text-foreground">
                  <SelectValue placeholder="Pilih messenger" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  {messengers.map((messenger) => (
                    <SelectItem key={messenger} value={messenger}>
                      {messenger}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditScheduleDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSchedule} className="bg-blue-500 hover:bg-blue-600 text-white">
              Update Jadwal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Verification Dialog */}
      <Dialog open={isDocumentVerificationDialogOpen} onOpenChange={setIsDocumentVerificationDialogOpen}>
        <DialogContent className="border-border max-w-2xl bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-indigo-400" />
              Verifikasi Dokumen - {selectedOrder?.orderNo}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedOrder?.documentsVerified 
                ? "Lihat dokumen yang telah diverifikasi"
                : "Upload dan verifikasi dokumen yang diperlukan"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Document List */}
            <div className="space-y-2">
              <Label className="text-foreground">Daftar Dokumen</Label>
              {selectedOrder?.documentsVerified ? (
                <div className="space-y-2">
                  {(selectedOrder.documentsList || []).map((doc: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                    >
                      <FileText className="w-5 h-5 text-green-400" />
                      <span className="flex-1 text-foreground">{doc}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-7 text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Klik untuk upload dokumen atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (Max. 10MB)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">Dokumen yang dibutuhkan:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["STNK", "BPKB", "KTP Pemilik", "SKKP (jika ada)"].map((docName, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 text-sm p-2 rounded bg-secondary/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <span className="text-foreground">{docName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mock uploaded files */}
                  {documentData.documentsList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-sm text-foreground">Dokumen yang diupload:</p>
                      {documentData.documentsList.map((doc: string, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/30"
                        >
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="flex-1 text-sm text-foreground">{doc}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            onClick={() => {
                              setDocumentData({
                                ...documentData,
                                documentsList: documentData.documentsList.filter((_, i) => i !== index)
                              });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick add mock documents button */}
                  {!selectedOrder?.documentsVerified && documentData.documentsList.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setDocumentData({
                          ...documentData,
                          documentsList: ["STNK.pdf", "BPKB.pdf", "KTP_Pemilik.pdf"]
                        });
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Simulasi Upload Dokumen
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-foreground">Catatan Verifikasi</Label>
              {selectedOrder?.documentsVerified ? (
                <div className="p-3 rounded-lg bg-secondary/20 border border-border text-sm text-foreground">
                  {selectedOrder.documentNotes || "Tidak ada catatan"}
                </div>
              ) : (
                <Input
                  value={documentData.documentNotes}
                  onChange={(e) => setDocumentData({...documentData, documentNotes: e.target.value})}
                  className="bg-input-background border-border text-foreground"
                  placeholder="Tambahkan catatan (opsional)"
                />
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentVerificationDialogOpen(false)}>
              {selectedOrder?.documentsVerified ? "Tutup" : "Batal"}
            </Button>
            {!selectedOrder?.documentsVerified && (
              <Button 
                onClick={handleDocumentVerification} 
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={documentData.documentsList.length === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verifikasi & Lanjutkan
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Cost Dialog */}
      <Dialog open={isFinalCostDialogOpen} onOpenChange={setIsFinalCostDialogOpen}>
        <DialogContent className="border-border max-w-5xl max-h-[90vh] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Calculator className="w-5 h-5 text-blue-400" />
              Atur Biaya Final - {selectedOrder?.orderNo}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Masukkan biaya final yang sebenarnya. Field dengan border merah melebihi harga dasar.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(90vh-200px)] pr-4">
            <div className="space-y-4">
              {/* Biaya Utama */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  <h4 className="text-blue-400">Biaya Utama</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Biaya Jasa</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalBiayaJasa}
                      onChange={(e) => setFinalCostData({...finalCostData, finalBiayaJasa: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">PKB</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalPkb}
                      onChange={(e) => setFinalCostData({...finalCostData, finalPkb: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">SWDKLLJ</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalSwdkllj}
                      onChange={(e) => setFinalCostData({...finalCostData, finalSwdkllj: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Denda SWDKLLJ</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalDendaSwdkllj}
                      onChange={(e) => setFinalCostData({...finalCostData, finalDendaSwdkllj: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Biaya Tambahan dengan Keterangan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  <h4 className="text-blue-500">Biaya Tambahan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Mutasi Keluar</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalMutasiKeluar}
                      onChange={(e) => setFinalCostData({...finalCostData, finalMutasiKeluar: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                    <Input
                      type="text"
                      value={finalCostData.keteranganMutasiKeluar}
                      onChange={(e) => setFinalCostData({...finalCostData, keteranganMutasiKeluar: e.target.value})}
                      className="bg-input-background border-border h-9 text-xs text-foreground"
                      placeholder="Keterangan (opsional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Mutasi Masuk</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalMutasiMasuk}
                      onChange={(e) => setFinalCostData({...finalCostData, finalMutasiMasuk: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                    <Input
                      type="text"
                      value={finalCostData.keteranganMutasiMasuk}
                      onChange={(e) => setFinalCostData({...finalCostData, keteranganMutasiMasuk: e.target.value})}
                      className="bg-input-background border-border h-9 text-xs text-foreground"
                      placeholder="Keterangan (opsional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">Biaya Lainnya</Label>
                    <Input
                      type="number"
                      value={finalCostData.finalBiayaLainnya}
                      onChange={(e) => setFinalCostData({...finalCostData, finalBiayaLainnya: e.target.value})}
                      className="bg-input-background border-border h-9 text-foreground"
                      placeholder="0"
                    />
                    <Input
                      type="text"
                      value={finalCostData.keteranganBiayaLainnya}
                      onChange={(e) => setFinalCostData({...finalCostData, keteranganBiayaLainnya: e.target.value})}
                      className="bg-input-background border-border h-9 text-xs text-foreground"
                      placeholder="Keterangan (opsional)"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Mutasi Keluar */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowMutasiKeluar(!showMutasiKeluar)}
                  className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    <h4 className="text-red-400">Mutasi Keluar</h4>
                  </div>
                  {showMutasiKeluar ? <ChevronUp className="w-5 h-5 text-red-400" /> : <ChevronDown className="w-5 h-5 text-red-400" />}
                </button>
              
                {showMutasiKeluar && (
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <MutasiCostField
                      label="Legalisir"
                      value={finalCostData.mutasiKeluarLegalisir}
                      basePrice={hargaDasarMutasiKeluar.mutasiKeluarLegalisir}
                      onChange={(value) => setFinalCostData({...finalCostData, mutasiKeluarLegalisir: value})}
                    />
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Hadir
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarHadir.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarHadir}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarHadir: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Legalisir CF
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLegalisirCf.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLegalisirCf}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLegalisirCf: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      CF
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarCf.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarCf}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarCf: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Bantuan Hadir
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarBantuanHadir.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarBantuanHadir}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarBantuanHadir: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cek Blokir
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarCekBlokir.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarCekBlokir}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarCekBlokir: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. Pembukuan
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLokPembukuan.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLokPembukuan}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLokPembukuan: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. TU
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLokTu.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLokTu}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLokTu: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. TU Nopil
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLokTuNopil.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLokTuNopil}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLokTuNopil: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Loksus
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLoksus.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLoksus}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLoksus: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cetak SKP
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarCetakSkp.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarCetakSkp}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarCetakSkp: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cetak Fiskal
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarCetakFiskal.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarCetakFiskal}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarCetakFiskal: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. Arsip
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarLokArsip.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarLokArsip}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarLokArsip: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cek Progresif
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarCekProgresif.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarCekProgresif}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarCekProgresif: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Matiin Nopil
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarMatiinNopil.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarMatiinNopil}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarMatiinNopil: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Daftar Mutmas Normal
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarDaftarMutmasNormal.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarDaftarMutmasNormal}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarDaftarMutmasNormal: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Daftar Mutmas Kilat
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiKeluar.mutasiKeluarDaftarMutmasKilat.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiKeluarDaftarMutmasKilat}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiKeluarDaftarMutmasKilat: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mutasi Masuk */}
            <div className="border border-border rounded-lg p-4 bg-green-500/5">
              <button
                type="button"
                onClick={() => setShowMutasiMasuk(!showMutasiMasuk)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h4 className="text-green-400">Mutasi Masuk</h4>
                {showMutasiMasuk ? <ChevronUp className="w-5 h-5 text-green-400" /> : <ChevronDown className="w-5 h-5 text-green-400" />}
              </button>
              
              {showMutasiMasuk && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Legalisir
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukLegalisir.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukLegalisir}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukLegalisir: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Mutmas
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukMutmas.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukMutmas}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukMutmas: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      BY
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukBy.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukBy}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukBy: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Pendaftaran
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukPendaftaran.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukPendaftaran}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukPendaftaran: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Req. Ganjil / Genap
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukReqGanjilGenap.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukReqGanjilGenap}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukReqGanjilGenap: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Acak
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukAcak.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukAcak}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukAcak: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. TU
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukLokTu.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukLokTu}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukLokTu: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Lok. Pembukuan
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukLokPembukuan.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukLokPembukuan}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukLokPembukuan: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Daftar BPKB
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukDaftarBpkb.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukDaftarBpkb}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukDaftarBpkb: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Penulisan BPKB
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukPenulisanBpkb.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukPenulisanBpkb}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukPenulisanBpkb: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cetak Notice
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukCetakNotice.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukCetakNotice}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukCetakNotice: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cetak STNK
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukCetakStnk.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukCetakStnk}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukCetakStnk: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Cetak Plat
                      <span className="text-xs text-muted-foreground">(Harga Dasar: Rp {hargaDasarMutasiMasuk.mutasiMasukCetakPlat.toLocaleString('id-ID')})</span>
                    </Label>
                    <Input
                      type="number"
                      value={finalCostData.mutasiMasukCetakPlat}
                      onChange={(e) => setFinalCostData({...finalCostData, mutasiMasukCetakPlat: e.target.value})}
                      className="bg-input-background border-border"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Dokumen Surat Terbaru */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                <h4 className="text-green-400">Dokumen Surat Terbaru</h4>
              </div>
              <div className="space-y-3">
                <Label className="text-xs text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Dokumen (STNK, BPKB, dll)
                </Label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="bg-input-background border-border cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                {updatedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Dokumen yang akan diupload:</p>
                    {updatedDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-input-background border border-border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadedDocument(index)}
                          className="h-6 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <AlertTriangle className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Total Preview */}
            <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Biaya Final</span>
                  <span className="text-blue-400 text-lg">
                    Rp {(
                      parseFloat(finalCostData.finalBiayaJasa || "0") +
                      parseFloat(finalCostData.finalPkb || "0") +
                      parseFloat(finalCostData.finalSwdkllj || "0") +
                      parseFloat(finalCostData.finalDendaSwdkllj || "0") +
                      parseFloat(finalCostData.finalMutasiKeluar || "0") +
                      parseFloat(finalCostData.finalMutasiMasuk || "0") +
                      parseFloat(finalCostData.finalBiayaLainnya || "0") +
                      // Add all mutasi keluar costs
                      parseFloat(finalCostData.mutasiKeluarLegalisir || "0") +
                      parseFloat(finalCostData.mutasiKeluarHadir || "0") +
                      parseFloat(finalCostData.mutasiKeluarLegalisirCf || "0") +
                      parseFloat(finalCostData.mutasiKeluarCf || "0") +
                      parseFloat(finalCostData.mutasiKeluarBantuanHadir || "0") +
                      parseFloat(finalCostData.mutasiKeluarCekBlokir || "0") +
                      parseFloat(finalCostData.mutasiKeluarLokPembukuan || "0") +
                      parseFloat(finalCostData.mutasiKeluarLokTu || "0") +
                      parseFloat(finalCostData.mutasiKeluarLokTuNopil || "0") +
                      parseFloat(finalCostData.mutasiKeluarLoksus || "0") +
                      parseFloat(finalCostData.mutasiKeluarCetakSkp || "0") +
                      parseFloat(finalCostData.mutasiKeluarCetakFiskal || "0") +
                      parseFloat(finalCostData.mutasiKeluarLokArsip || "0") +
                      parseFloat(finalCostData.mutasiKeluarCekProgresif || "0") +
                      parseFloat(finalCostData.mutasiKeluarMatiinNopil || "0") +
                      parseFloat(finalCostData.mutasiKeluarDaftarMutmasNormal || "0") +
                      parseFloat(finalCostData.mutasiKeluarDaftarMutmasKilat || "0") +
                      // Add all mutasi masuk costs
                      parseFloat(finalCostData.mutasiMasukLegalisir || "0") +
                      parseFloat(finalCostData.mutasiMasukMutmas || "0") +
                      parseFloat(finalCostData.mutasiMasukBy || "0") +
                      parseFloat(finalCostData.mutasiMasukPendaftaran || "0") +
                      parseFloat(finalCostData.mutasiMasukReqGanjilGenap || "0") +
                      parseFloat(finalCostData.mutasiMasukAcak || "0") +
                      parseFloat(finalCostData.mutasiMasukLokTu || "0") +
                      parseFloat(finalCostData.mutasiMasukLokPembukuan || "0") +
                      parseFloat(finalCostData.mutasiMasukDaftarBpkb || "0") +
                      parseFloat(finalCostData.mutasiMasukPenulisanBpkb || "0") +
                      parseFloat(finalCostData.mutasiMasukCetakNotice || "0") +
                      parseFloat(finalCostData.mutasiMasukCetakStnk || "0") +
                      parseFloat(finalCostData.mutasiMasukCetakPlat || "0")
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinalCostDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFinalCost} className="bg-orange-500 hover:bg-orange-600">
              Simpan Biaya Final
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Dialog */}
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Jadwal Pengantaran - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription>
              Atur jadwal pengantaran dokumen ke customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tanggal Pengantaran</Label>
              <Input
                type="date"
                value={deliveryData.tanggalPengantaran}
                onChange={(e) => setDeliveryData({...deliveryData, tanggalPengantaran: e.target.value})}
                className="bg-input-background border-border"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleDelivery} className="bg-purple-500 hover:bg-purple-600">
              Konfirmasi Pengantaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Samsat Progress Dialog */}
      <Dialog open={isSamsatProgressDialogOpen} onOpenChange={setIsSamsatProgressDialogOpen}>
        <DialogContent className="border-border max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-blue-500" />
              Detail Proses Samsat - {selectedOrder?.orderNo}
            </DialogTitle>
            <DialogDescription>
              Tandai setiap tahapan proses samsat yang sudah dilalui
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="space-y-4">
              {/* Customer & Layanan Info */}
              <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Customer</p>
                    <p className="text-foreground">{selectedOrder?.customer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Nopol</p>
                    <p className="font-mono text-foreground">{selectedOrder?.nopol}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Layanan</p>
                    <p className="text-foreground">{selectedOrder?.layanan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Messenger</p>
                    <p className="text-foreground">{selectedOrder?.messenger}</p>
                  </div>
                </div>
              </Card>

              {/* Mutasi Keluar Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  <h4 className="text-red-400">Mutasi Keluar</h4>
                  <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30">
                    {Object.values(samsatProgress.mutasiKeluar).filter(Boolean).length} / {Object.keys(samsatProgress.mutasiKeluar).length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'legalisirHadir', label: 'Legalisir Hadir' },
                    { key: 'legalisirCf', label: 'Legalisir CF' },
                    { key: 'cfBantuanHadir', label: 'CF Bantuan Hadir' },
                    { key: 'cekBlokir', label: 'Cek Blokir' },
                    { key: 'lokPembukuan', label: 'Lok. Pembukuan' },
                    { key: 'lokTu', label: 'Lok. TU' },
                    { key: 'lokTuNopil', label: 'Lok. TU Nopil' },
                    { key: 'loksus', label: 'Loksus' },
                    { key: 'cetakSkp', label: 'Cetak SKP' },
                    { key: 'cetakFiskal', label: 'Cetak Fiskal' },
                    { key: 'lokArsip', label: 'Lok. Arsip' },
                    { key: 'cekProgresif', label: 'Cek Progresif' },
                    { key: 'matiinNopil', label: 'Matiin Nopil' },
                    { key: 'daftarMutmasNormal', label: 'Daftar Mutmas Normal' },
                    { key: 'daftarMutmasKilat', label: 'Daftar Mutmas Kilat' },
                  ].map((item) => (
                    <motion.div
                      key={item.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSamsatProgress({
                            ...samsatProgress,
                            mutasiKeluar: {
                              ...samsatProgress.mutasiKeluar,
                              [item.key]: !samsatProgress.mutasiKeluar[item.key as keyof typeof samsatProgress.mutasiKeluar]
                            }
                          });
                        }}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-all duration-300",
                          samsatProgress.mutasiKeluar[item.key as keyof typeof samsatProgress.mutasiKeluar]
                            ? "bg-red-500/20 border-red-500/50 text-red-300"
                            : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            samsatProgress.mutasiKeluar[item.key as keyof typeof samsatProgress.mutasiKeluar]
                              ? "bg-red-500"
                              : "bg-secondary border border-border"
                          )}>
                            {samsatProgress.mutasiKeluar[item.key as keyof typeof samsatProgress.mutasiKeluar] && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm">{item.label}</span>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <Separator />

              {/* Mutasi Masuk Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                  <h4 className="text-green-400">Mutasi Masuk</h4>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                    {Object.values(samsatProgress.mutasiMasuk).filter(Boolean).length} / {Object.keys(samsatProgress.mutasiMasuk).length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'legalisirMutmas', label: 'Legalisir Mutmas' },
                    { key: 'byPendaftaran', label: 'BY Pendaftaran' },
                    { key: 'reqGanjilGenap', label: 'REQ. Ganjil / Genap' },
                    { key: 'acak', label: 'Acak' },
                    { key: 'lokTu', label: 'Lok. TU' },
                    { key: 'lokPembukuan', label: 'Lok. Pembukuan' },
                    { key: 'daftarBpkb', label: 'Daftar BPKB' },
                    { key: 'penulisanBpkb', label: 'Penulisan BPKB' },
                    { key: 'cetakNotice', label: 'Cetak Notice' },
                    { key: 'cetakStnk', label: 'Cetak STNK' },
                    { key: 'cetakPlat', label: 'Cetak Plat' },
                  ].map((item) => (
                    <motion.div
                      key={item.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSamsatProgress({
                            ...samsatProgress,
                            mutasiMasuk: {
                              ...samsatProgress.mutasiMasuk,
                              [item.key]: !samsatProgress.mutasiMasuk[item.key as keyof typeof samsatProgress.mutasiMasuk]
                            }
                          });
                        }}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-all duration-300",
                          samsatProgress.mutasiMasuk[item.key as keyof typeof samsatProgress.mutasiMasuk]
                            ? "bg-green-500/20 border-green-500/50 text-green-300"
                            : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            samsatProgress.mutasiMasuk[item.key as keyof typeof samsatProgress.mutasiMasuk]
                              ? "bg-green-500"
                              : "bg-secondary border border-border"
                          )}>
                            {samsatProgress.mutasiMasuk[item.key as keyof typeof samsatProgress.mutasiMasuk] && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm">{item.label}</span>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>


            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSamsatProgressDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={() => {
                if (selectedOrder) {
                  const updatedOrder = {
                    ...selectedOrder,
                    samsatProgress: samsatProgress
                  };
                  
                  // Update order in state
                  setOrdersByStatus({
                    ...ordersByStatus,
                    "Proses Samsat": (ordersByStatus["Proses Samsat"] || []).map((o: any) => 
                      o.orderNo === selectedOrder.orderNo ? updatedOrder : o
                    )
                  });
                  
                  setIsSamsatProgressDialogOpen(false);
                  toast.success("Progress proses samsat berhasil disimpan!");
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Simpan Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
