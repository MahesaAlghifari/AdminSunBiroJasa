import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DataPenjualan } from "./DataPenjualan";
import { EnhancedTableWithDialogs } from "./EnhancedTableWithDialogs";
import { FinanceAddDialog } from "./FinanceAddDialog";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { useState } from "react";

// Import all data from Finance.tsx
import { 
  profitData as initialProfitData, 
  kasMessengerData as initialKasMessengerData, 
  kasKantorData as initialKasKantorData, 
  pengeluaranKantorData as initialPengeluaranData, 
  belumKurangBayarData as initialBelumBayarData,
  profitTerpendingData as initialProfitPendingData,
  cashbackTerpendingData as initialCashbackPendingData,
  tagihanData as initialTagihanData,
  labaRugiData
} from "./Finance";

interface FinanceContentProps {
  tab: string;
}

export function FinanceContent({ tab }: FinanceContentProps) {
  const [filterPeriod, setFilterPeriod] = useState("monthly");
  
  // State untuk setiap tab
  const [profitData, setProfitData] = useState(initialProfitData);
  const [kasMessengerData, setKasMessengerData] = useState(initialKasMessengerData);
  const [kasKantorData, setKasKantorData] = useState(initialKasKantorData);
  const [pengeluaranData, setPengeluaranData] = useState(initialPengeluaranData);
  const [belumBayarData, setBelumBayarData] = useState(initialBelumBayarData);
  const [profitPendingData, setProfitPendingData] = useState(initialProfitPendingData);
  const [cashbackPendingData, setCashbackPendingData] = useState(initialCashbackPendingData);
  const [tagihanData, setTagihanData] = useState(initialTagihanData);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Export PDF untuk Laba Rugi
  const handleExportLabaRugiPDF = () => {
    toast.success("Export PDF Laba Rugi berhasil!");
  };

  // Profit Tab - VIEW ONLY
  if (tab === "profit") {
    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Data Profit</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "nopol", label: "Plat Nopol", filterable: true, filterType: "text" },
            { key: "customer", label: "Customer", filterable: true, filterType: "text" },
            { key: "namaBerkas", label: "Nama Berkas" },
            { key: "pengurusan", label: "Pengurusan", filterable: true, filterType: "select", filterOptions: ["PAJAK TAHUNAN", "PAJAK 5 TAHUNAN", "MUTASI LD", "MUTASI AS", "BALIK NAMA", "BBN 1", "BBN 2"] },
            { key: "uangMasuk", label: "Uang Masuk" },
            { key: "biayaSamsat", label: "Biaya Samsat" },
            { key: "profit", label: "Profit" },
            { key: "rekening", label: "Rekening", filterable: true, filterType: "select", filterOptions: ["BCA", "Mandiri", "BRI", "BNI", "CIMB", "Cash"] },
            { key: "invoice", label: "Invoice" },
            { key: "tanggalTTB", label: "Tanggal TTB" },
            { key: "ttb", label: "Nomer TTB" },
          ]}
          data={profitData}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Data Profit berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan nopol, customer, invoice..."
          hideAddButton={true}
          hideEditButton={true}
          hideDeleteButton={true}
        />
      </Card>
    );
  }

  // Kas Messenger Tab
  if (tab === "kas-messenger") {
    const kasMessengerFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "jenis", label: "Jenis", type: "select" as const, options: ["Masuk", "Keluar"] },
      { key: "messenger", label: "Messenger", type: "text" as const },
      { key: "keterangan", label: "Keterangan", type: "text" as const },
      { key: "in", label: "Masuk", type: "number" as const },
      { key: "out", label: "Keluar", type: "number" as const },
      { key: "total", label: "Total", type: "number" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Kas Messenger</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "jenis", label: "Jenis", filterable: true, filterType: "select", filterOptions: ["Masuk", "Keluar"] },
            { key: "messenger", label: "Messenger", filterable: true, filterType: "text" },
            { key: "keterangan", label: "Keterangan" },
            { 
              key: "in", 
              label: "Masuk",
              render: (value: any) => value > 0 ? (
                <span className="text-green-400">Rp {value.toLocaleString()}</span>
              ) : "-"
            },
            { 
              key: "out", 
              label: "Keluar",
              render: (value: any) => value > 0 ? (
                <span className="text-red-400">Rp {value.toLocaleString()}</span>
              ) : "-"
            },
            { key: "total", label: "Total" },
          ]}
          data={kasMessengerData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setKasMessengerData(kasMessengerData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setKasMessengerData(kasMessengerData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Kas Messenger berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan messenger, jenis..."
          editFields={kasMessengerFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Kas Messenger"
          description="Tambahkan satu atau lebih transaksi kas messenger"
          fields={kasMessengerFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...kasMessengerData.map(d => d.id)) + idx + 1,
              ...row,
              in: parseInt(row.in) || 0,
              out: parseInt(row.out) || 0,
              total: parseInt(row.total),
            }));
            setKasMessengerData([...kasMessengerData, ...newData]);
            toast.success(`${newData.length} data kas messenger berhasil ditambahkan!`);
          }}
        />
      </Card>
    );
  }

  // Kas Kantor Tab
  if (tab === "kas-kantor") {
    const kasKantorFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "status", label: "Status", type: "select" as const, options: ["Debit", "Kredit"] },
      { key: "keterangan", label: "Keterangan", type: "text" as const },
      { key: "debit", label: "Debit", type: "number" as const },
      { key: "kredit", label: "Kredit", type: "number" as const },
      { key: "total", label: "Total", type: "number" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Kas Kantor</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "status", label: "Status", filterable: true, filterType: "select", filterOptions: ["Debit", "Kredit"] },
            { key: "keterangan", label: "Keterangan", filterable: true, filterType: "text" },
            { 
              key: "debit", 
              label: "Debit",
              render: (value: any) => value > 0 ? (
                <span className="text-green-400">Rp {value.toLocaleString()}</span>
              ) : "-"
            },
            { 
              key: "kredit", 
              label: "Kredit",
              render: (value: any) => value > 0 ? (
                <span className="text-red-400">Rp {value.toLocaleString()}</span>
              ) : "-"
            },
            { key: "total", label: "Total" },
          ]}
          data={kasKantorData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setKasKantorData(kasKantorData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setKasKantorData(kasKantorData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Kas Kantor berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan keterangan..."
          editFields={kasKantorFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Kas Kantor"
          description="Tambahkan satu atau lebih transaksi kas kantor"
          fields={kasKantorFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...kasKantorData.map(d => d.id)) + idx + 1,
              ...row,
              debit: parseInt(row.debit) || 0,
              kredit: parseInt(row.kredit) || 0,
              total: parseInt(row.total),
            }));
            setKasKantorData([...kasKantorData, ...newData]);
            toast.success(`${newData.length} data kas kantor berhasil ditambahkan!`);
          }}
        />
      </Card>
    );
  }

  // Pengeluaran Tab
  if (tab === "pengeluaran") {
    const pengeluaranFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "keterangan", label: "Keterangan", type: "text" as const },
      { key: "nominal", label: "Nominal", type: "number" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Pengeluaran Kantor</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "keterangan", label: "Keterangan", filterable: true, filterType: "text" },
            { 
              key: "nominal", 
              label: "Nominal",
              render: (value: any) => (
                <span className="text-red-400">Rp {value.toLocaleString()}</span>
              )
            },
          ]}
          data={pengeluaranData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setPengeluaranData(pengeluaranData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setPengeluaranData(pengeluaranData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Pengeluaran berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan keterangan..."
          editFields={pengeluaranFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Pengeluaran"
          description="Tambahkan satu atau lebih data pengeluaran"
          fields={pengeluaranFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...pengeluaranData.map(d => d.id)) + idx + 1,
              ...row,
              nominal: parseInt(row.nominal),
            }));
            setPengeluaranData([...pengeluaranData, ...newData]);
            toast.success(`${newData.length} data pengeluaran berhasil ditambahkan!`);
          }}
        />
        
        <div className="mt-6 p-4 rounded-lg bg-secondary/30">
          <div className="flex justify-between items-center">
            <span>Total Pengeluaran Bulan Ini:</span>
            <span className="text-2xl text-red-400">
              Rp {pengeluaranData.reduce((acc, item) => acc + item.nominal, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Data Penjualan Tab
  if (tab === "penjualan") {
    return <DataPenjualan />;
  }

  // Belum & Kurang Bayar Tab
  if (tab === "belum-bayar") {
    const belumBayarFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "nopol", label: "Plat Nopol", type: "text" as const },
      { key: "customer", label: "Customer", type: "text" as const },
      { key: "namaBerkas", label: "Nama Berkas", type: "text" as const },
      { key: "pengurusan", label: "Pengurusan", type: "select" as const, options: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
      { key: "uangMasuk", label: "Uang Masuk", type: "number" as const },
      { key: "biayaSamsat", label: "Biaya Samsat", type: "number" as const },
      { key: "profit", label: "Profit/Rugi", type: "number" as const },
      { key: "kekurangan", label: "Kekurangan", type: "number" as const },
      { key: "status", label: "Status", type: "select" as const, options: ["Belum Bayar", "Kurang Bayar"] },
      { key: "invoice", label: "Invoice", type: "text" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Data Belum & Kurang Bayar</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "nopol", label: "Plat Nopol", filterable: true, filterType: "text" },
            { key: "customer", label: "Customer", filterable: true, filterType: "text" },
            { key: "namaBerkas", label: "Nama Berkas" },
            { key: "pengurusan", label: "Pengurusan", filterable: true, filterType: "select", filterOptions: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
            { key: "uangMasuk", label: "Uang Masuk" },
            { key: "biayaSamsat", label: "Biaya Samsat" },
            { key: "profit", label: "Profit/Rugi" },
            { key: "kekurangan", label: "Kekurangan" },
            { key: "status", label: "Status", filterable: true, filterType: "select", filterOptions: ["Belum Bayar", "Kurang Bayar"] },
            { key: "invoice", label: "Invoice" },
          ]}
          data={belumBayarData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setBelumBayarData(belumBayarData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setBelumBayarData(belumBayarData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Belum & Kurang Bayar berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan customer, nopol..."
          editFields={belumBayarFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Belum & Kurang Bayar"
          description="Tambahkan satu atau lebih data belum & kurang bayar"
          fields={belumBayarFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...belumBayarData.map(d => d.id)) + idx + 1,
              ...row,
              uangMasuk: parseInt(row.uangMasuk),
              biayaSamsat: parseInt(row.biayaSamsat),
              profit: parseInt(row.profit),
              kekurangan: parseInt(row.kekurangan),
            }));
            setBelumBayarData([...belumBayarData, ...newData]);
            toast.success(`${newData.length} data berhasil ditambahkan!`);
          }}
        />
      </Card>
    );
  }

  // Profit Terpending Tab
  if (tab === "profit-pending") {
    const profitPendingFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "nopol", label: "Plat Nopol", type: "text" as const },
      { key: "customer", label: "Customer", type: "text" as const },
      { key: "namaBerkas", label: "Nama Berkas", type: "text" as const },
      { key: "pengurusan", label: "Pengurusan", type: "select" as const, options: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
      { key: "uangMasuk", label: "Uang Masuk", type: "number" as const },
      { key: "biayaSamsat", label: "Biaya Samsat", type: "number" as const },
      { key: "profit", label: "Profit", type: "number" as const },
      { key: "status", label: "Status", type: "select" as const, options: ["Pending"] },
      { key: "invoice", label: "Invoice", type: "text" as const },
      { key: "alasan", label: "Alasan Pending", type: "text" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Profit Terpending</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "nopol", label: "Plat Nopol", filterable: true, filterType: "text" },
            { key: "customer", label: "Customer", filterable: true, filterType: "text" },
            { key: "namaBerkas", label: "Nama Berkas" },
            { key: "pengurusan", label: "Pengurusan", filterable: true, filterType: "select", filterOptions: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
            { key: "uangMasuk", label: "Uang Masuk" },
            { key: "biayaSamsat", label: "Biaya Samsat" },
            { key: "profit", label: "Profit" },
            { key: "status", label: "Status" },
            { key: "invoice", label: "Invoice" },
            { key: "alasan", label: "Alasan Pending" },
          ]}
          data={profitPendingData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setProfitPendingData(profitPendingData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setProfitPendingData(profitPendingData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Profit Terpending berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan customer, nopol, alasan..."
          editFields={profitPendingFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Profit Terpending"
          description="Tambahkan satu atau lebih data profit terpending"
          fields={profitPendingFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...profitPendingData.map(d => d.id)) + idx + 1,
              ...row,
              uangMasuk: parseInt(row.uangMasuk),
              biayaSamsat: parseInt(row.biayaSamsat),
              profit: parseInt(row.profit),
            }));
            setProfitPendingData([...profitPendingData, ...newData]);
            toast.success(`${newData.length} data profit terpending berhasil ditambahkan!`);
          }}
        />
      </Card>
    );
  }

  // Cashback Terpending Tab
  if (tab === "cashback-pending") {
    const cashbackPendingFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "nopol", label: "Plat Nopol", type: "text" as const },
      { key: "customer", label: "Customer", type: "text" as const },
      { key: "namaBerkas", label: "Nama Berkas", type: "text" as const },
      { key: "pengurusan", label: "Pengurusan", type: "select" as const, options: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
      { key: "uangMasuk", label: "Uang Masuk", type: "number" as const },
      { key: "profit", label: "Profit", type: "number" as const },
      { key: "jumlahCashback", label: "Jumlah Cashback", type: "number" as const },
      { key: "cashbackPersen", label: "%", type: "number" as const },
      { key: "status", label: "Status", type: "select" as const, options: ["Pending", "Dibayarkan"] },
      { key: "invoice", label: "Invoice", type: "text" as const },
    ];

    return (
      <Card className="glass-card p-4">
        <h3 className="text-sm mb-3">Cashback Terpending</h3>
        <EnhancedTableWithDialogs
          columns={[
            { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
            { key: "nopol", label: "Plat Nopol", filterable: true, filterType: "text" },
            { key: "customer", label: "Customer", filterable: true, filterType: "text" },
            { key: "namaBerkas", label: "Nama Berkas" },
            { key: "pengurusan", label: "Pengurusan", filterable: true, filterType: "select", filterOptions: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
            { key: "uangMasuk", label: "Uang Masuk" },
            { key: "profit", label: "Profit" },
            { key: "jumlahCashback", label: "Jumlah Cashback" },
            { key: "cashbackPersen", label: "%" },
            { key: "status", label: "Status", filterable: true, filterType: "select", filterOptions: ["Pending", "Dibayarkan"] },
            { key: "invoice", label: "Invoice" },
          ]}
          data={cashbackPendingData}
          onAdd={() => setIsAddDialogOpen(true)}
          onEdit={(item, updatedData) => {
            setCashbackPendingData(cashbackPendingData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
          }}
          onDelete={(item) => {
            setCashbackPendingData(cashbackPendingData.filter(d => d.id !== item.id));
          }}
          onExport={(format) => {
            toast.success(`Export ${format.toUpperCase()} Cashback Terpending berhasil!`);
          }}
          searchPlaceholder="Cari berdasarkan customer, nopol..."
          editFields={cashbackPendingFields}
        />

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Cashback Terpending"
          description="Tambahkan satu atau lebih data cashback terpending"
          fields={cashbackPendingFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...cashbackPendingData.map(d => d.id)) + idx + 1,
              ...row,
              uangMasuk: parseInt(row.uangMasuk),
              profit: parseInt(row.profit),
              jumlahCashback: parseInt(row.jumlahCashback),
              cashbackPersen: parseInt(row.cashbackPersen),
            }));
            setCashbackPendingData([...cashbackPendingData, ...newData]);
            toast.success(`${newData.length} data cashback terpending berhasil ditambahkan!`);
          }}
        />
      </Card>
    );
  }

  // Tagihan Tab
  if (tab === "tagihan") {
    const tagihanFields = [
      { key: "tanggal", label: "Tanggal", type: "date" as const },
      { key: "customer", label: "Customer", type: "text" as const },
      { key: "nopol", label: "Nopol", type: "text" as const },
      { key: "jenisLayanan", label: "Jenis Layanan", type: "select" as const, options: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
      { key: "totalTagihan", label: "Total Tagihan", type: "number" as const },
      { key: "terbayar", label: "Terbayar", type: "number" as const },
      { key: "sisa", label: "Sisa", type: "number" as const },
      { key: "jatuhTempo", label: "Jatuh Tempo", type: "date" as const },
      { key: "status", label: "Status", type: "select" as const, options: ["Lunas", "Belum Lunas", "Menunggak"] },
    ];

    // Pisahkan tagihan lunas dan belum lunas
    const tagihanLunas = tagihanData.filter(d => d.status === "Lunas");
    const tagihanBelumLunas = tagihanData.filter(d => d.status !== "Lunas");

    return (
      <div className="space-y-4">
        <h3 className="text-sm">Data Tagihan</h3>
        
        {/* Tagihan Belum Lunas */}
        <Card className="glass-card p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg text-red-400">Tagihan Belum Lunas</h4>
              <p className="text-sm text-muted-foreground">Total: {tagihanBelumLunas.length} tagihan</p>
            </div>
            <Card className="glass-card px-4 py-2 bg-red-500/10 border-red-500/20">
              <p className="text-xs text-muted-foreground">Total Piutang</p>
              <p className="text-lg text-red-400">
                Rp {tagihanBelumLunas.reduce((acc, item) => acc + item.sisa, 0).toLocaleString()}
              </p>
            </Card>
          </div>
          <EnhancedTableWithDialogs
            columns={[
              { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
              { key: "customer", label: "Customer", filterable: true, filterType: "text" },
              { key: "nopol", label: "Nopol", filterable: true, filterType: "text" },
              { key: "jenisLayanan", label: "Jenis Layanan", filterable: true, filterType: "select", filterOptions: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
              { key: "totalTagihan", label: "Total Tagihan" },
              { key: "terbayar", label: "Terbayar" },
              { key: "sisa", label: "Sisa" },
              { key: "jatuhTempo", label: "Jatuh Tempo" },
              { key: "status", label: "Status" },
            ]}
            data={tagihanBelumLunas}
            onAdd={() => setIsAddDialogOpen(true)}
            onEdit={(item, updatedData) => {
              setTagihanData(tagihanData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
            }}
            onDelete={(item) => {
              setTagihanData(tagihanData.filter(d => d.id !== item.id));
            }}
            onExport={(format) => {
              toast.success(`Export ${format.toUpperCase()} Tagihan Belum Lunas berhasil!`);
            }}
            searchPlaceholder="Cari customer atau nopol..."
            editFields={tagihanFields}
          />
        </Card>

        {/* Tagihan Lunas */}
        <Card className="glass-card p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg text-green-400">Tagihan Lunas</h4>
              <p className="text-sm text-muted-foreground">Total: {tagihanLunas.length} tagihan</p>
            </div>
            <Card className="glass-card px-4 py-2 bg-green-500/10 border-green-500/20">
              <p className="text-xs text-muted-foreground">Total Terbayar</p>
              <p className="text-lg text-green-400">
                Rp {tagihanLunas.reduce((acc, item) => acc + item.totalTagihan, 0).toLocaleString()}
              </p>
            </Card>
          </div>
          <EnhancedTableWithDialogs
            columns={[
              { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
              { key: "customer", label: "Customer", filterable: true, filterType: "text" },
              { key: "nopol", label: "Nopol", filterable: true, filterType: "text" },
              { key: "jenisLayanan", label: "Jenis Layanan", filterable: true, filterType: "select", filterOptions: ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Mutasi Antar Samsat", "Mutasi Luar Daerah", "Balik Nama"] },
              { key: "totalTagihan", label: "Total Tagihan" },
              { key: "terbayar", label: "Terbayar" },
              { key: "jatuhTempo", label: "Tanggal Lunas" },
              { key: "status", label: "Status" },
            ]}
            data={tagihanLunas}
            onEdit={(item, updatedData) => {
              setTagihanData(tagihanData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
            }}
            onDelete={(item) => {
              setTagihanData(tagihanData.filter(d => d.id !== item.id));
            }}
            onExport={(format) => {
              toast.success(`Export ${format.toUpperCase()} Tagihan Lunas berhasil!`);
            }}
            searchPlaceholder="Cari customer atau nopol..."
            editFields={tagihanFields}
          />
        </Card>

        <FinanceAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Tagihan"
          description="Tambahkan satu atau lebih data tagihan"
          fields={tagihanFields}
          onSubmit={(rows) => {
            const newData = rows.map((row, idx) => ({
              id: Math.max(...tagihanData.map(d => d.id)) + idx + 1,
              ...row,
              totalTagihan: parseInt(row.totalTagihan),
              terbayar: parseInt(row.terbayar),
              sisa: parseInt(row.sisa),
            }));
            setTagihanData([...tagihanData, ...newData]);
            toast.success(`${newData.length} data tagihan berhasil ditambahkan!`);
          }}
        />
      </div>
    );
  }

  // Laba Rugi Tab
  if (tab === "laba-rugi") {
    // Hitung total pemasukan dari profit data
    const totalPemasukan = profitData.reduce((acc, item) => {
      // Hanya hitung uang masuk yang positif (bukan minus/kurang bayar)
      return acc + (item.uangMasuk > 0 ? item.uangMasuk : 0);
    }, 0);
    
    // Hitung total pengeluaran dari berbagai sumber
    const pengeluaranKantor = pengeluaranData.reduce((acc, item) => acc + item.nominal, 0);
    const pengeluaranMessenger = kasMessengerData.reduce((acc, item) => acc + item.out, 0);
    const pengeluaranKasKantor = kasKantorData.reduce((acc, item) => acc + item.kredit, 0);
    const biayaSamsat = profitData.reduce((acc, item) => acc + (item.biayaSamsat > 0 ? item.biayaSamsat : 0), 0);
    
    const totalPengeluaran = pengeluaranKantor + pengeluaranMessenger + pengeluaranKasKantor + biayaSamsat;
    const labaRugiBersih = totalPemasukan - totalPengeluaran;

    // Prepare data untuk tabel
    const tablePemasukan = profitData
      .filter(item => item.uangMasuk > 0)
      .map(item => ({
        tanggal: item.tanggal,
        kategori: "Pemasukan",
        keterangan: `${item.pengurusan} - ${item.nopol} (${item.customer})`,
        invoice: item.invoice,
        nominal: item.uangMasuk,
        type: "in" as const
      }));
    
    const tablePengeluaranKantor = pengeluaranData.map(item => ({
      tanggal: item.tanggal,
      kategori: "Pengeluaran Kantor",
      keterangan: item.keterangan,
      invoice: "-",
      nominal: item.nominal,
      type: "out" as const
    }));
    
    const tablePengeluaranMessenger = kasMessengerData
      .filter(item => item.out > 0)
      .map(item => ({
        tanggal: item.tanggal,
        kategori: `Pengeluaran Messenger - ${item.jenis}`,
        keterangan: `${item.keterangan} (${item.messenger})`,
        invoice: "-",
        nominal: item.out,
        type: "out" as const
      }));
    
    const tablePengeluaranKasKantor = kasKantorData
      .filter(item => item.kredit > 0)
      .map(item => ({
        tanggal: item.tanggal,
        kategori: "Pengeluaran Kas Kantor",
        keterangan: item.keterangan,
        invoice: "-",
        nominal: item.kredit,
        type: "out" as const
      }));

    const tableBiayaSamsat = profitData
      .filter(item => item.biayaSamsat > 0)
      .map(item => ({
        tanggal: item.tanggal,
        kategori: "Biaya Samsat",
        keterangan: `${item.pengurusan} - ${item.nopol}`,
        invoice: item.invoice,
        nominal: item.biayaSamsat,
        type: "out" as const
      }));
    
    const combinedData = [
      ...tablePemasukan,
      ...tablePengeluaranKantor,
      ...tablePengeluaranMessenger,
      ...tablePengeluaranKasKantor,
      ...tableBiayaSamsat
    ].sort((a, b) => {
      // Sort by date (simple string comparison for DD/MM/YYYY format)
      const [dayA, monthA, yearA] = a.tanggal.split('/');
      const [dayB, monthB, yearB] = b.tanggal.split('/');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
      return dateB.getTime() - dateA.getTime(); // Descending order
    });

    return (
      <div className="space-y-4">
        <Card className="glass-card p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3>Laporan Laba Rugi</h3>
              <p className="text-sm text-muted-foreground">Analisis keuangan bisnis Anda</p>
            </div>
            <div className="flex gap-2">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[180px] bg-input-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleExportLabaRugiPDF}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <h3 className="text-2xl text-green-400 mt-1">
                    Rp {totalPemasukan.toLocaleString()}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tablePemasukan.length} transaksi
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                  <h3 className="text-2xl text-red-400 mt-1">
                    Rp {totalPengeluaran.toLocaleString()}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tablePengeluaranKantor.length + tablePengeluaranMessenger.length + tablePengeluaranKasKantor.length + tableBiayaSamsat.length} transaksi
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </Card>
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Laba/Rugi Bersih</p>
                  <h3 className={`text-2xl mt-1 ${labaRugiBersih >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    Rp {labaRugiBersih.toLocaleString()}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {labaRugiBersih >= 0 ? 'Laba' : 'Rugi'}
                  </p>
                </div>
                {labaRugiBersih >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-400" />
                )}
              </div>
            </Card>
          </div>

          {/* Detail breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="glass-card p-4 border-l-4 border-l-green-500">
              <h4 className="text-sm mb-3 text-green-400">Detail Pendapatan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uang Masuk Transaksi:</span>
                  <span className="text-green-400">Rp {totalPemasukan.toLocaleString()}</span>
                </div>
              </div>
            </Card>
            <Card className="glass-card p-4 border-l-4 border-l-red-500">
              <h4 className="text-sm mb-3 text-red-400">Detail Pengeluaran</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengeluaran Kantor:</span>
                  <span className="text-red-400">Rp {pengeluaranKantor.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengeluaran Messenger:</span>
                  <span className="text-red-400">Rp {pengeluaranMessenger.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengeluaran Kas Kantor:</span>
                  <span className="text-red-400">Rp {pengeluaranKasKantor.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Samsat:</span>
                  <span className="text-red-400">Rp {biayaSamsat.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span>Total:</span>
                  <span className="text-red-400">Rp {totalPengeluaran.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labaRugiData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#374151" />
                <XAxis key="x-axis" dataKey="bulan" stroke="#9CA3AF" />
                <YAxis key="y-axis" stroke="#9CA3AF" />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar key="bar-pendapatan" dataKey="pendapatan" fill="#10b981" name="Pendapatan" />
                <Bar key="bar-pengeluaran" dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" />
                <Bar key="bar-laba" dataKey="laba" fill="#3b82f6" name="Laba" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tabel Detail Transaksi */}
        <Card className="glass-card p-4">
          <h3 className="text-sm mb-3">Detail Transaksi Pemasukan & Pengeluaran</h3>
          <EnhancedTableWithDialogs
            columns={[
              { key: "tanggal", label: "Tanggal", filterable: true, filterType: "text" },
              { key: "kategori", label: "Kategori", filterable: true, filterType: "select", 
                filterOptions: [
                  "Pemasukan", 
                  "Pengeluaran Kantor", 
                  "Pengeluaran Messenger - OPERASIONAL",
                  "Pengeluaran Messenger - BIAYA SAMSAT",
                  "Pengeluaran Messenger - PETTY CASH",
                  "Pengeluaran Kas Kantor",
                  "Biaya Samsat"
                ] 
              },
              { key: "keterangan", label: "Keterangan", filterable: true, filterType: "text" },
              { key: "invoice", label: "Invoice", filterable: true, filterType: "text" },
              { 
                key: "nominal", 
                label: "Nominal",
                render: (value: any, row: any) => {
                  const isIncome = row.type === "in";
                  return (
                    <span className={isIncome ? "text-green-400" : "text-red-400"}>
                      {isIncome ? "+" : "-"} Rp {value.toLocaleString()}
                    </span>
                  );
                }
              },
            ]}
            data={combinedData.map((item, idx) => ({ id: idx + 1, ...item }))}
            onExport={(format) => {
              toast.success(`Export ${format.toUpperCase()} Detail Laba Rugi berhasil!`);
            }}
            searchPlaceholder="Cari berdasarkan tanggal, kategori, keterangan, invoice..."
            hideAddButton={true}
            hideEditButton={true}
            hideDeleteButton={true}
          />
          
          {/* Summary di bawah tabel */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card p-4 bg-green-500/10 border-green-500/20">
              <p className="text-sm text-muted-foreground">Total Pemasukan</p>
              <p className="text-xl text-green-400 mt-1">
                Rp {totalPemasukan.toLocaleString()}
              </p>
            </Card>
            <Card className="glass-card p-4 bg-red-500/10 border-red-500/20">
              <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
              <p className="text-xl text-red-400 mt-1">
                Rp {totalPengeluaran.toLocaleString()}
              </p>
            </Card>
            <Card className={`glass-card p-4 ${labaRugiBersih >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <p className="text-sm text-muted-foreground">Laba/Rugi Bersih</p>
              <p className={`text-xl mt-1 ${labaRugiBersih >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                Rp {labaRugiBersih.toLocaleString()}
              </p>
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
