import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { EnhancedTableWithDialogs, Column } from "./EnhancedTableWithDialogs";
import { FinanceAddPage } from "./FinanceAddPage";
import { FinanceDetailPage } from "./FinanceDetailPage";
import { toast } from "sonner";
import {
  MUTASI_LD_COLUMNS_CONTRACT,
  MUTASI_AS_COLUMNS_CONTRACT,
  BBN_COLUMNS_CONTRACT,
  PERPANJANGAN_PAJAK_COLUMNS_CONTRACT,
  LAIN_LAIN_COLUMNS_CONTRACT,
  BELUM_KURANG_BAYAR_COLUMNS_CONTRACT,
  PROFIT_TERPENDING_COLUMNS_CONTRACT,
  CASHBACK_TERPENDING_COLUMNS_CONTRACT,
  buildTableColumnsFromContract,
  buildFieldsFromContract,
  initialMutasiLDContract,
  initialMutasiASContract,
  initialBBNContract,
  initialPerpanjanganPajakContract,
  initialLainLainContract,
  initialBelumKurangBayarContract,
  initialProfitTerpendingContract,
  initialCashbackTerpendingContract,
} from "../data/penjualanContractData";

export function DataPenjualan() {
  const [activeTab, setActiveTab] = useState("mutasi-ld");
  const [isAdding, setIsAdding] = useState(false);
  const [viewingItem, setViewingItem] = useState<{
    item: any;
    subTabTitle: string;
    columns?: Column[];
  } | null>(null);

  // Contract Datasets
  const [mutasiLD, setMutasiLD] = useState(initialMutasiLDContract);
  const [mutasiAS, setMutasiAS] = useState(initialMutasiASContract);
  const [bbn, setBBN] = useState(initialBBNContract);
  const [perpanjangan, setPerpanjangan] = useState(initialPerpanjanganPajakContract);
  const [lainLain, setLainLain] = useState(initialLainLainContract);
  const [belumBayar, setBelumBayar] = useState(initialBelumKurangBayarContract);
  const [profitPending, setProfitPending] = useState(initialProfitTerpendingContract);
  const [cashbackPending, setCashbackPending] = useState(initialCashbackTerpendingContract);

  // Build exact column contracts for each dataset
  const mutasiLDColumns = buildTableColumnsFromContract(MUTASI_LD_COLUMNS_CONTRACT);
  const mutasiASColumns = buildTableColumnsFromContract(MUTASI_AS_COLUMNS_CONTRACT);
  const bbnColumns = buildTableColumnsFromContract(BBN_COLUMNS_CONTRACT);
  const perpanjanganColumns = buildTableColumnsFromContract(PERPANJANGAN_PAJAK_COLUMNS_CONTRACT);
  const lainLainColumns = buildTableColumnsFromContract(LAIN_LAIN_COLUMNS_CONTRACT);
  const belumBayarColumns = buildTableColumnsFromContract(BELUM_KURANG_BAYAR_COLUMNS_CONTRACT);
  const profitPendingColumns = buildTableColumnsFromContract(PROFIT_TERPENDING_COLUMNS_CONTRACT);
  const cashbackPendingColumns = buildTableColumnsFromContract(CASHBACK_TERPENDING_COLUMNS_CONTRACT);

  // Active dataset properties for Add/Edit
  const getActiveTabMeta = () => {
    switch (activeTab) {
      case "mutasi-ld":
        return {
          title: "Mutasi LD",
          columns: mutasiLDColumns,
          fields: buildFieldsFromContract(MUTASI_LD_COLUMNS_CONTRACT),
          data: mutasiLD,
          setData: setMutasiLD,
        };
      case "mutasi-as":
        return {
          title: "Mutasi AS",
          columns: mutasiASColumns,
          fields: buildFieldsFromContract(MUTASI_AS_COLUMNS_CONTRACT),
          data: mutasiAS,
          setData: setMutasiAS,
        };
      case "bbn":
        return {
          title: "BBN",
          columns: bbnColumns,
          fields: buildFieldsFromContract(BBN_COLUMNS_CONTRACT),
          data: bbn,
          setData: setBBN,
        };
      case "perpanjangan-pajak":
        return {
          title: "Perpanjangan Pajak",
          columns: perpanjanganColumns,
          fields: buildFieldsFromContract(PERPANJANGAN_PAJAK_COLUMNS_CONTRACT),
          data: perpanjangan,
          setData: setPerpanjangan,
        };
      case "lain-lain":
        return {
          title: "Lain-Lain",
          columns: lainLainColumns,
          fields: buildFieldsFromContract(LAIN_LAIN_COLUMNS_CONTRACT),
          data: lainLain,
          setData: setLainLain,
        };
      case "belum-kurang-bayar":
        return {
          title: "Belum & Kurang Bayar",
          columns: belumBayarColumns,
          fields: buildFieldsFromContract(BELUM_KURANG_BAYAR_COLUMNS_CONTRACT),
          data: belumBayar,
          setData: setBelumBayar,
        };
      case "profit-terpending":
        return {
          title: "Profit Terpending",
          columns: profitPendingColumns,
          fields: buildFieldsFromContract(PROFIT_TERPENDING_COLUMNS_CONTRACT),
          data: profitPending,
          setData: setProfitPending,
        };
      case "cashback-terpending":
        return {
          title: "Cashback Terpending",
          columns: cashbackPendingColumns,
          fields: buildFieldsFromContract(CASHBACK_TERPENDING_COLUMNS_CONTRACT),
          data: cashbackPending,
          setData: setCashbackPending,
        };
      default:
        return {
          title: "Mutasi LD",
          columns: mutasiLDColumns,
          fields: buildFieldsFromContract(MUTASI_LD_COLUMNS_CONTRACT),
          data: mutasiLD,
          setData: setMutasiLD,
        };
    }
  };

  const currentMeta = getActiveTabMeta();

  // Handle Add Submit
  const handleAddSubmit = (rows: any[]) => {
    const nextId = Math.max(0, ...currentMeta.data.map((d: any) => d.id || 0)) + 1;
    const newItems = rows.map((row, idx) => ({
      id: nextId + idx,
      ...row,
    }));
    currentMeta.setData([...currentMeta.data, ...newItems]);
    setIsAdding(false);
    toast.success(`${newItems.length} data ${currentMeta.title} berhasil ditambahkan`);
  };

  // Detail View Full Screen
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

  // Add Page Full Screen
  if (isAdding) {
    return (
      <FinanceAddPage
        title={`Tambah data ${currentMeta.title}`}
        description={`Masukkan satu atau lebih data transaksi untuk kategori ${currentMeta.title}`}
        fields={currentMeta.fields}
        onBack={() => setIsAdding(false)}
        onSubmit={handleAddSubmit}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Modern Tab Navigation (Requirement 12: clean labels, no cluttering icons) */}
        <ScrollArea className="w-full">
          <TabsList className="bg-muted/40 p-1 inline-flex w-max min-w-full gap-1 border border-border rounded-lg">
            <TabsTrigger
              value="mutasi-ld"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Mutasi LD
            </TabsTrigger>
            <TabsTrigger
              value="mutasi-as"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Mutasi AS
            </TabsTrigger>
            <TabsTrigger
              value="bbn"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              BBN
            </TabsTrigger>
            <TabsTrigger
              value="perpanjangan-pajak"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Perpanjangan Pajak
            </TabsTrigger>
            <TabsTrigger
              value="lain-lain"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Lain-Lain
            </TabsTrigger>
            <TabsTrigger
              value="belum-kurang-bayar"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Belum & Kurang Bayar
            </TabsTrigger>
            <TabsTrigger
              value="profit-terpending"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Profit Terpending
            </TabsTrigger>
            <TabsTrigger
              value="cashback-terpending"
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all whitespace-nowrap px-3.5 py-1.5"
            >
              Cashback Terpending
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* 1. Mutasi LD */}
        <TabsContent value="mutasi-ld">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data mutasi luar daerah</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar transaksi pengurusan mutasi keluar dan masuk antar daerah</p>
            </div>
            <EnhancedTableWithDialogs
              columns={mutasiLDColumns}
              data={mutasiLD}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Mutasi LD", columns: mutasiLDColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setMutasiLD(mutasiLD.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setMutasiLD(mutasiLD.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data mutasi luar daerah..."
              editFields={buildFieldsFromContract(MUTASI_LD_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 2. Mutasi AS */}
        <TabsContent value="mutasi-as">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data mutasi antar samsat</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar berkas perpindahan administrasi antar kantor samsat</p>
            </div>
            <EnhancedTableWithDialogs
              columns={mutasiASColumns}
              data={mutasiAS}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Mutasi AS", columns: mutasiASColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setMutasiAS(mutasiAS.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setMutasiAS(mutasiAS.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data mutasi antar samsat..."
              editFields={buildFieldsFromContract(MUTASI_AS_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 3. BBN */}
        <TabsContent value="bbn">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data bea balik nama (BBN)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar proses pengurusan balik nama kendaraan bermotor (BBN 1 & BBN 2)</p>
            </div>
            <EnhancedTableWithDialogs
              columns={bbnColumns}
              data={bbn}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - BBN", columns: bbnColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setBBN(bbn.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setBBN(bbn.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data bea balik nama..."
              editFields={buildFieldsFromContract(BBN_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 4. Perpanjangan Pajak */}
        <TabsContent value="perpanjangan-pajak">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data perpanjangan pajak</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar berkas pembayaran pajak tahunan dan 5 tahunan STNK</p>
            </div>
            <EnhancedTableWithDialogs
              columns={perpanjanganColumns}
              data={perpanjangan}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Perpanjangan Pajak", columns: perpanjanganColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setPerpanjangan(perpanjangan.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setPerpanjangan(perpanjangan.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data perpanjangan pajak..."
              editFields={buildFieldsFromContract(PERPANJANGAN_PAJAK_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 5. Lain-Lain */}
        <TabsContent value="lain-lain">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data layanan lain-lain</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pengurusan duplikat STNK, plat nomor, ganti plat, dan administrasi lainnya</p>
            </div>
            <EnhancedTableWithDialogs
              columns={lainLainColumns}
              data={lainLain}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Lain-Lain", columns: lainLainColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setLainLain(lainLain.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setLainLain(lainLain.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data layanan lain-lain..."
              editFields={buildFieldsFromContract(LAIN_LAIN_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 6. Belum & Kurang Bayar */}
        <TabsContent value="belum-kurang-bayar">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data belum & kurang bayar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monitoring transaksi customer yang masih memiliki kekurangan pembayaran</p>
            </div>
            <EnhancedTableWithDialogs
              columns={belumBayarColumns}
              data={belumBayar}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Belum & Kurang Bayar", columns: belumBayarColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setBelumBayar(belumBayar.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setBelumBayar(belumBayar.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data belum & kurang bayar..."
              editFields={buildFieldsFromContract(BELUM_KURANG_BAYAR_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 7. Profit Terpending */}
        <TabsContent value="profit-terpending">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data profit terpending</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Transaksi dengan margin profit yang masih tertahan verifikasi atau administrasi</p>
            </div>
            <EnhancedTableWithDialogs
              columns={profitPendingColumns}
              data={profitPending}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Profit Terpending", columns: profitPendingColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setProfitPending(profitPending.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setProfitPending(profitPending.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data profit terpending..."
              editFields={buildFieldsFromContract(PROFIT_TERPENDING_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>

        {/* 8. Cashback Terpending */}
        <TabsContent value="cashback-terpending">
          <Card className="p-4 sm:p-5 border border-border bg-card shadow-xs">
            <div className="mb-4">
              <h3 className="text-base md:text-[17px] font-semibold tracking-tight text-foreground">Data cashback terpending</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar alokasi cashback rekanan atau customer yang menunggu pencairan</p>
            </div>
            <EnhancedTableWithDialogs
              columns={cashbackPendingColumns}
              data={cashbackPending}
              onView={(item) => setViewingItem({ item, subTabTitle: "Data Penjualan - Cashback Terpending", columns: cashbackPendingColumns })}
              onAdd={() => setIsAdding(true)}
              onEdit={(item, updated) => {
                setCashbackPending(cashbackPending.map(d => d.id === item.id ? { ...d, ...updated } : d));
              }}
              onDelete={(item) => {
                setCashbackPending(cashbackPending.filter(d => d.id !== item.id));
              }}
              searchPlaceholder="Cari data cashback terpending..."
              editFields={buildFieldsFromContract(CASHBACK_TERPENDING_COLUMNS_CONTRACT)}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
