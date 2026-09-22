import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { FileText } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { EnhancedTableWithDialogs, Column } from "./EnhancedTableWithDialogs";
import { FinanceAddPage, FieldConfig } from "./FinanceAddPage";
import { FinanceDetailPage } from "./FinanceDetailPage";
import { toast } from "sonner";
import { 
  mutasiLDData as initialMutasiLDData,
  mutasiASData as initialMutasiASData,
  bbnData as initialBBNData,
  perpanjanganPajakData as initialPerpanjanganData,
  lainnyaData as initialLainnyaData,
  belumKurangBayarData as initialBelumBayarData,
  profitTerpendingData as initialProfitPendingData,
  cashbackTerpendingData as initialCashbackPendingData
} from "../data/financeDummyData";

export function DataPenjualan() {
  const [activeTab, setActiveTab] = useState("mutasi-ld");
  const [isAdding, setIsAdding] = useState(false);
  const [viewingItem, setViewingItem] = useState<{
    item: any;
    subTabTitle: string;
    columns?: Column[];
  } | null>(null);

  // Data states
  const [mutasiLD, setMutasiLD] = useState(initialMutasiLDData);
  const [mutasiAS, setMutasiAS] = useState(initialMutasiASData);
  const [bbn, setBBN] = useState(initialBBNData);
  const [perpanjangan, setPerpanjangan] = useState(initialPerpanjanganData);
  const [lainnya, setLainnya] = useState(initialLainnyaData);
  const [belumBayar, setBelumBayar] = useState(initialBelumBayarData);
  const [profitPending, setProfitPending] = useState(initialProfitPendingData);
  const [cashbackPending, setCashbackPending] = useState(initialCashbackPendingData);

  // Common fields configuration for Penjualan
  const penjualanFields: FieldConfig[] = [
    { key: "tglMasuk", label: "Tanggal masuk", type: "date" },
    { key: "r4r2", label: "Roda (R4/R2)", type: "select", options: ["R4", "R2"] },
    { key: "nopol", label: "Plat nomor", type: "text", placeholder: "Contoh: B 1234 ABC" },
    { key: "customer", label: "Customer", type: "text" },
    { key: "namaSesuaiBPKB", label: "Nama sesuai BPKB/STNK", type: "text" },
    { key: "jenisPengurusan", label: "Jenis pengurusan", type: "text" },
    { key: "jenisBayar", label: "Metode pembayaran", type: "select", options: ["Transfer", "Cash", "Tempo"] },
    { key: "uangMasuk", label: "Uang masuk", type: "number" },
    { key: "bank", label: "Bank", type: "select", options: ["BCA", "Mandiri", "BRI", "BNI", "Cash"] },
    { key: "uangKeluar", label: "Uang keluar", type: "number" },
    { key: "uangKeluarDari", label: "Sumber uang keluar", type: "select", options: ["Kas Kantor", "Kas Messenger", "Bank"] },
    { key: "profit", label: "Profit", type: "number" },
    { key: "status", label: "Status berkas", type: "select", options: ["Proses", "Selesai", "Pending"] },
    { key: "noInvoice", label: "Nomor invoice", type: "text" },
    { key: "bpkb", label: "Kelengkapan BPKB", type: "select", options: ["Ada", "Belum"] },
    { key: "statusBPKB", label: "Status BPKB", type: "select", options: ["Selesai", "Proses"] },
    { key: "ttbBPKB", label: "Nomor TTB BPKB", type: "text" },
  ];

  // Standard columns for Penjualan tables
  const penjualanColumns: Column[] = [
    { key: "tglMasuk", label: "Tanggal masuk", filterable: true, filterType: "text" },
    { key: "r4r2", label: "Roda", filterable: true, filterType: "select", filterOptions: ["R4", "R2"] },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
    { key: "jenisPengurusan", label: "Jenis pengurusan" },
    { key: "jenisBayar", label: "Bayar", filterable: true, filterType: "select", filterOptions: ["Transfer", "Cash", "Tempo"] },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "bank", label: "Bank" },
    { key: "uangKeluar", label: "Uang keluar" },
    { key: "profit", label: "Profit" },
    { key: "status", label: "Status", filterable: true, filterType: "select", filterOptions: ["Selesai", "Proses", "Pending"] },
    { key: "noInvoice", label: "Invoice" },
    { key: "statusBPKB", label: "Status BPKB" },
    { key: "ttbBPKB", label: "TTB BPKB" },
  ];

  const perpanjanganColumns: Column[] = [
    { key: "tglMasuk", label: "Tanggal masuk", filterable: true, filterType: "text" },
    { key: "r4r2", label: "Roda", filterable: true, filterType: "select", filterOptions: ["R4", "R2"] },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
    { key: "jenisPengurusan", label: "Jenis pengurusan" },
    { key: "jenisBayar", label: "Bayar" },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "bank", label: "Bank" },
    { key: "uangKeluar", label: "Uang keluar" },
    { key: "profit", label: "Profit" },
    { key: "status", label: "Status" },
    { key: "noInvoice", label: "Invoice" },
    { key: "tandaTerima", label: "TTB" },
  ];

  const lainnyaColumns: Column[] = [
    { key: "tglMasuk", label: "Tanggal masuk", filterable: true, filterType: "text" },
    { key: "r4r2", label: "Roda", filterable: true, filterType: "select", filterOptions: ["R4", "R2"] },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
    { key: "jenisPengurusan", label: "Jenis pengurusan" },
    { key: "jenisBayar", label: "Bayar" },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "bank", label: "Bank" },
    { key: "uangKeluar", label: "Uang keluar" },
    { key: "profit", label: "Profit" },
    { key: "status", label: "Status" },
    { key: "noInvoice", label: "Invoice" },
    { key: "tandaTerima", label: "TTB" },
  ];

  const belumBayarColumns: Column[] = [
    { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "pengurusan", label: "Pengurusan" },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "biayaSamsat", label: "Biaya samsat" },
    { key: "kekurangan", label: "Kekurangan" },
    { key: "status", label: "Status", filterable: true, filterType: "select", filterOptions: ["Belum Bayar", "Kurang Bayar"] },
    { key: "invoice", label: "Invoice" },
  ];

  const profitPendingColumns: Column[] = [
    { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "pengurusan", label: "Pengurusan" },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "biayaSamsat", label: "Biaya samsat" },
    { key: "profit", label: "Profit" },
    { key: "status", label: "Status" },
    { key: "alasan", label: "Alasan pending" },
    { key: "invoice", label: "Invoice" },
  ];

  const cashbackPendingColumns: Column[] = [
    { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
    { key: "customer", label: "Customer", filterable: true, filterType: "text" },
    { key: "nopol", label: "Plat nomor", filterable: true, filterType: "text" },
    { key: "pengurusan", label: "Pengurusan" },
    { key: "uangMasuk", label: "Uang masuk" },
    { key: "profit", label: "Profit" },
    { key: "jumlahCashback", label: "Jumlah cashback" },
    { key: "cashbackPersen", label: "%" },
    { key: "status", label: "Status" },
    { key: "invoice", label: "Invoice" },
  ];

  const handleAddSubmit = (rows: any[]) => {
    const formatNumeric = (row: any) => ({
      ...row,
      uangMasuk: parseInt(row.uangMasuk) || 0,
      uangKeluar: parseInt(row.uangKeluar) || 0,
      profit: parseInt(row.profit) || 0,
    });

    if (activeTab === "mutasi-ld") {
      const nextId = Math.max(0, ...mutasiLD.map(d => d.id)) + 1;
      const newItems = rows.map((r, i) => ({ id: nextId + i, ...formatNumeric(r) }));
      setMutasiLD([...mutasiLD, ...newItems]);
    } else if (activeTab === "mutasi-as") {
      const nextId = Math.max(0, ...mutasiAS.map(d => d.id)) + 1;
      const newItems = rows.map((r, i) => ({ id: nextId + i, ...formatNumeric(r) }));
      setMutasiAS([...mutasiAS, ...newItems]);
    } else if (activeTab === "bbn") {
      const nextId = Math.max(0, ...bbn.map(d => d.id)) + 1;
      const newItems = rows.map((r, i) => ({ id: nextId + i, ...formatNumeric(r) }));
      setBBN([...bbn, ...newItems]);
    } else if (activeTab === "perpanjangan") {
      const nextId = Math.max(0, ...perpanjangan.map(d => d.id)) + 1;
      const newItems = rows.map((r, i) => ({ id: nextId + i, ...formatNumeric(r) }));
      setPerpanjangan([...perpanjangan, ...newItems]);
    } else if (activeTab === "lainnya") {
      const nextId = Math.max(0, ...lainnya.map(d => d.id)) + 1;
      const newItems = rows.map((r, i) => ({ id: nextId + i, ...formatNumeric(r) }));
      setLainnya([...lainnya, ...newItems]);
    }

    setIsAdding(false);
    toast.success(`${rows.length} data transaksi berhasil disimpan`);
  };

  if (viewingItem) {
    return (
      <FinanceDetailPage
        subTabTitle={viewingItem.subTabTitle}
        item={viewingItem.item}
        columns={viewingItem.columns}
        onBack={() => setViewingItem(null)}
      />
    );
  }

  if (isAdding) {
    const getTabTitle = () => {
      switch (activeTab) {
        case "mutasi-ld": return "Mutasi luar daerah (LD)";
        case "mutasi-as": return "Mutasi antar samsat (AS)";
        case "bbn": return "Bea balik nama (BBN)";
        case "perpanjangan": return "Perpanjangan pajak";
        default: return "Lain-lain";
      }
    };

    return (
      <FinanceAddPage
        title={`Tambah data penjualan ${getTabTitle().toLowerCase()}`}
        description={`Masukkan satu atau lebih data transaksi untuk kategori ${getTabTitle().toLowerCase()}`}
        fields={penjualanFields}
        onBack={() => setIsAdding(false)}
        onSubmit={handleAddSubmit}
      />
    );
  }

  return (
    <div className="space-y-5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <ScrollArea className="w-full">
          <TabsList className="bg-muted/40 p-1 inline-flex w-max min-w-full gap-1 border border-border rounded-lg">
            <TabsTrigger 
              value="mutasi-ld" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Mutasi LD
            </TabsTrigger>
            <TabsTrigger 
              value="mutasi-as" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Mutasi AS
            </TabsTrigger>
            <TabsTrigger 
              value="bbn" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              BBN
            </TabsTrigger>
            <TabsTrigger 
              value="perpanjangan" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Perpanjangan
            </TabsTrigger>
            <TabsTrigger 
              value="lainnya" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Lain-lain
            </TabsTrigger>
            <TabsTrigger 
              value="belum-kurang-bayar" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Belum & kurang bayar
            </TabsTrigger>
            <TabsTrigger 
              value="profit-pending" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Profit terpending
            </TabsTrigger>
            <TabsTrigger 
              value="cashback-pending" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Cashback terpending
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* Mutasi LD */}
        <TabsContent value="mutasi-ld">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data mutasi luar daerah</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar transaksi pengurusan mutasi keluar dan masuk antar daerah</p>
            </div>
            <EnhancedTableWithDialogs
              columns={penjualanColumns}
              data={mutasiLD}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Mutasi LD", columns: penjualanColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setMutasiLD(mutasiLD.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setMutasiLD(mutasiLD.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data mutasi luar daerah..."
              editFields={penjualanFields}
            />
          </Card>
        </TabsContent>

        {/* Mutasi AS */}
        <TabsContent value="mutasi-as">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data mutasi antar samsat</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar berkas perpindahan administrasi antar kantor samsat</p>
            </div>
            <EnhancedTableWithDialogs
              columns={penjualanColumns}
              data={mutasiAS}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Mutasi AS", columns: penjualanColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setMutasiAS(mutasiAS.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setMutasiAS(mutasiAS.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data mutasi antar samsat..."
              editFields={penjualanFields}
            />
          </Card>
        </TabsContent>

        {/* BBN */}
        <TabsContent value="bbn">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data bea balik nama (BBN)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar proses pengurusan balik nama kendaraan bermotor (BBN 1 & BBN 2)</p>
            </div>
            <EnhancedTableWithDialogs
              columns={penjualanColumns}
              data={bbn}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - BBN", columns: penjualanColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setBBN(bbn.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setBBN(bbn.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data balik nama..."
              editFields={penjualanFields}
            />
          </Card>
        </TabsContent>

        {/* Perpanjangan */}
        <TabsContent value="perpanjangan">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data perpanjangan pajak</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar berkas pembayaran pajak tahunan dan 5 tahunan STNK</p>
            </div>
            <EnhancedTableWithDialogs
              columns={perpanjanganColumns}
              data={perpanjangan}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Perpanjangan", columns: perpanjanganColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setPerpanjangan(perpanjangan.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setPerpanjangan(perpanjangan.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data perpanjangan..."
              editFields={penjualanFields}
            />
          </Card>
        </TabsContent>

        {/* Lain-lain */}
        <TabsContent value="lainnya">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data layanan lainnya</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pengurusan duplikat STNK, plat nomor hilang, ganti plat, dan administrasi lainnya</p>
            </div>
            <EnhancedTableWithDialogs
              columns={lainnyaColumns}
              data={lainnya}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Lain-lain", columns: lainnyaColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setLainnya(lainnya.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setLainnya(lainnya.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data layanan lainnya..."
              editFields={penjualanFields}
            />
          </Card>
        </TabsContent>

        {/* Belum & Kurang Bayar */}
        <TabsContent value="belum-kurang-bayar">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data belum & kurang bayar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monitoring transaksi customer yang masih memiliki kekurangan pembayaran</p>
            </div>
            <EnhancedTableWithDialogs
              columns={belumBayarColumns}
              data={belumBayar}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Belum & Kurang Bayar", columns: belumBayarColumns })}
              onEdit={(item, updated) => {
                setBelumBayar(belumBayar.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setBelumBayar(belumBayar.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data belum & kurang bayar..."
              hideAddButton={true}
            />
          </Card>
        </TabsContent>

        {/* Profit Terpending */}
        <TabsContent value="profit-pending">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data profit terpending</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Transaksi dengan margin profit yang masih tertahan verifikasi atau administrasi</p>
            </div>
            <EnhancedTableWithDialogs
              columns={profitPendingColumns}
              data={profitPending}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Profit Terpending", columns: profitPendingColumns })}
              onEdit={(item, updated) => {
                setProfitPending(profitPending.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setProfitPending(profitPending.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data profit terpending..."
              hideAddButton={true}
            />
          </Card>
        </TabsContent>

        {/* Cashback Terpending */}
        <TabsContent value="cashback-pending">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Data cashback terpending</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar alokasi cashback rekanan atau customer yang menunggu pencairan</p>
            </div>
            <EnhancedTableWithDialogs
              columns={cashbackPendingColumns}
              data={cashbackPending}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Cashback Terpending", columns: cashbackPendingColumns })}
              onEdit={(item, updated) => {
                setCashbackPending(cashbackPending.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setCashbackPending(cashbackPending.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data cashback terpending..."
              hideAddButton={true}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
