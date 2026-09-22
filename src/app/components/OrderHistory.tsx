import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge, getStatusBadgeClass } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Search, Eye, FileDown, Calendar, DollarSign, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { InvoiceDialog } from "./InvoiceDialog";

// Generate sample order data
const generateOrders = () => {
  const customers = ["PT. Maju Jaya", "John Doe", "Siti Rahayu", "Ahmad Yani", "Budi Santoso", "Dewi Lestari", "CV. Berkah", "PT. Sejahtera"];
  const layanan = ["Perpanjangan 1 Tahun", "Perpanjangan 5 Tahun", "Balik Nama", "Mutasi Antar Samsat", "Mutasi Luar Daerah"];
  const statusPembayaran = ["Lunas", "Belum Lunas", "Kurang"];
  const messengers = ["Agus Riyadi", "Bambang Susilo", "Cahyo Nugroho", "Dedi Setiawan", "Eko Prasetyo"];
  const bankOptions = ["BCA", "Mandiri", "BRI", "BNI", "CIMB"];
  
  const orders = [];
  for (let i = 1; i <= 50; i++) {
    const totalBiaya = Math.floor(Math.random() * 5000000) + 500000;
    const status = statusPembayaran[Math.floor(Math.random() * statusPembayaran.length)];
    let dibayar = totalBiaya;
    
    if (status === "Belum Lunas") {
      dibayar = 0;
    } else if (status === "Kurang") {
      dibayar = Math.floor(totalBiaya * (Math.random() * 0.5 + 0.3)); // 30-80% paid
    }
    
    const orderDate = new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1);
    
    // Generate payment date (same day or few days after order)
    const paymentDate = new Date(orderDate);
    if (status !== "Belum Lunas") {
      paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 3));
    }
    
    // Generate dates for messenger tasks (1-3 days after order)
    const jemputDate = new Date(orderDate);
    jemputDate.setDate(jemputDate.getDate() + 1);
    
    const prosesDate = new Date(jemputDate);
    prosesDate.setDate(prosesDate.getDate() + 1);
    
    const antarDate = new Date(prosesDate);
    antarDate.setDate(antarDate.getDate() + 1);
    
    // Payment details
    const metodePembayaran = Math.random() > 0.3 ? "Transfer Bank" : "Cash";
    const namaBank = metodePembayaran === "Transfer Bank" ? bankOptions[Math.floor(Math.random() * bankOptions.length)] : "-";
    const noRekening = metodePembayaran === "Transfer Bank" ? `${Math.floor(Math.random() * 9000000000) + 1000000000}` : "-";
    
    const order = {
      orderNo: `ORD-${String(i).padStart(4, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      layanan: layanan[Math.floor(Math.random() * layanan.length)],
      nopol: `B${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      tanggal: orderDate,
      totalBiaya,
      dibayar,
      kurang: totalBiaya - dibayar,
      statusPembayaran: status,
      // Payment details
      metodePembayaran,
      namaBank,
      noRekening,
      tanggalBayar: status !== "Belum Lunas" ? paymentDate : null,
      // Messenger details
      jemputDokumen: {
        messenger: messengers[Math.floor(Math.random() * messengers.length)],
        tanggal: jemputDate,
      },
      prosesSamsat: {
        messenger: messengers[Math.floor(Math.random() * messengers.length)],
        tanggal: prosesDate,
      },
      pengantaranKembali: {
        messenger: messengers[Math.floor(Math.random() * messengers.length)],
        tanggal: antarDate,
      },
    };
    
    orders.push(order);
  }
  
  return orders.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
};

export function OrderHistory() {
  const [orders] = useState(generateOrders());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("bulan");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.nopol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (filterTanggal) {
      const selectedDate = new Date(filterTanggal);
      filtered = filtered.filter(order => {
        const orderDate = order.tanggal;
        
        if (filterPeriode === "hari") {
          return orderDate.toDateString() === selectedDate.toDateString();
        } else if (filterPeriode === "minggu") {
          const weekStart = new Date(selectedDate);
          weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return orderDate >= weekStart && orderDate <= weekEnd;
        } else if (filterPeriode === "bulan") {
          return orderDate.getMonth() === selectedDate.getMonth() && 
                 orderDate.getFullYear() === selectedDate.getFullYear();
        } else if (filterPeriode === "tahun") {
          return orderDate.getFullYear() === selectedDate.getFullYear();
        }
        return true;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusColor = (status: string) => getStatusBadgeClass(status);

  const handleExportCSV = () => {
    toast.success("Data berhasil diekspor ke CSV!");
  };

  const handleExportPDF = () => {
    toast.success("Data berhasil diekspor ke PDF!");
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Order History
        </h1>
        <p className="text-muted-foreground mt-1">Riwayat semua order dengan status pembayaran</p>
      </motion.div>

      <Card className="glass-card p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari order, customer, atau nopol..."
              className="pl-10 bg-input-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterPeriode} onValueChange={setFilterPeriode}>
            <SelectTrigger className="w-[160px] bg-input-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hari">Per Hari</SelectItem>
              <SelectItem value="minggu">Per Minggu</SelectItem>
              <SelectItem value="bulan">Per Bulan</SelectItem>
              <SelectItem value="tahun">Per Tahun</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-[180px] bg-input-background border-border"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-border">
              <FileDown className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="border-border">
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Order</p>
                <p className="text-2xl">{filteredOrders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileDown className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lunas</p>
                <p className="text-2xl text-green-400">
                  {filteredOrders.filter(o => o.statusPembayaran === "Lunas").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Belum Lunas</p>
                <p className="text-2xl text-red-400">
                  {filteredOrders.filter(o => o.statusPembayaran === "Belum Lunas").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kurang</p>
                <p className="text-2xl text-yellow-400">
                  {filteredOrders.filter(o => o.statusPembayaran === "Kurang").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Nopol</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Total Biaya</TableHead>
                <TableHead>Dibayar</TableHead>
                <TableHead>Kurang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.orderNo} className="hover:bg-secondary/20 transition-colors">
                    <TableCell>{order.tanggal.toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="font-mono">{order.nopol}</TableCell>
                    <TableCell>{order.layanan}</TableCell>
                    <TableCell>Rp {order.totalBiaya.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-green-400">
                      Rp {order.dibayar.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className={order.kurang > 0 ? "text-red-400" : ""}>
                      Rp {order.kurang.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge status={order.statusPembayaran}>
                        {order.statusPembayaran}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                            setIsPDFDialogOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsInvoiceDialogOpen(true);
                          }}
                        >
                          <Printer className="w-4 h-4 text-green-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Tidak ada data order
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Menampilkan {filteredOrders.length} dari {orders.length} order
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Order - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription>Informasi lengkap tentang order ini</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tanggal Order</p>
                  <p>{selectedOrder.tanggal.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nomor Polisi</p>
                  <p className="font-mono">{selectedOrder.nopol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jenis Layanan</p>
                  <p>{selectedOrder.layanan}</p>
                </div>
              </div>

              <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                <h4 className="mb-3">Detail Pembayaran</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Biaya</span>
                    <span>Rp {selectedOrder.totalBiaya.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sudah Dibayar</span>
                    <span className="text-green-400">Rp {selectedOrder.dibayar.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Kekurangan</span>
                    <span className={selectedOrder.kurang > 0 ? "text-red-400" : "text-green-400"}>
                      Rp {selectedOrder.kurang.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span>Status Pembayaran</span>
                    <Badge status={selectedOrder.statusPembayaran}>
                      {selectedOrder.statusPembayaran}
                    </Badge>
                  </div>
                  
                  {/* Metode Pembayaran */}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Metode Pembayaran</span>
                      <span className="text-blue-400">{selectedOrder.metodePembayaran}</span>
                    </div>
                    
                    {selectedOrder.metodePembayaran === "Transfer Bank" && (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Nama Bank</span>
                          <span>{selectedOrder.namaBank}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">No. Rekening</span>
                          <span className="font-mono">{selectedOrder.noRekening}</span>
                        </div>
                      </>
                    )}
                    
                    {selectedOrder.tanggalBayar && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tanggal Bayar</span>
                        <span className="text-cyan-400">
                          {selectedOrder.tanggalBayar.toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-border">
                <h4 className="mb-3">Detail Proses Messenger</h4>
                <div className="space-y-4">
                  {/* Jemput Dokumen */}
                  <div className="flex items-start gap-4 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Jemput Dokumen</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedOrder.jemputDokumen.tanggal.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Messenger: </span>
                        <span className="text-blue-400">{selectedOrder.jemputDokumen.messenger}</span>
                      </p>
                    </div>
                  </div>

                  {/* Proses Samsat */}
                  <div className="flex items-start gap-4 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Proses Samsat</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedOrder.prosesSamsat.tanggal.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Messenger: </span>
                        <span className="text-emerald-400">{selectedOrder.prosesSamsat.messenger}</span>
                      </p>
                    </div>
                  </div>

                  {/* Pengantaran Kembali */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-500">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Pengantaran Kembali</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedOrder.pengantaranKembali.tanggal.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Messenger: </span>
                        <span className="text-blue-500">{selectedOrder.pengantaranKembali.messenger}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPDFDialogOpen} onOpenChange={setIsPDFDialogOpen}>
        <DialogContent className="border-border max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dokumen Order - {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription>
              Lihat dokumen yang sudah diurus dan diupload
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Document List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-card p-4 border-border cursor-pointer hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">STNK</p>
                      <p className="text-xs text-muted-foreground">Surat Tanda Nomor Kendaraan</p>
                      <Button size="sm" variant="outline" className="mt-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat PDF
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4 border-border cursor-pointer hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">BPKB</p>
                      <p className="text-xs text-muted-foreground">Buku Pemilik Kendaraan Bermotor</p>
                      <Button size="sm" variant="outline" className="mt-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat PDF
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4 border-border cursor-pointer hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">KTP</p>
                      <p className="text-xs text-muted-foreground">Kartu Tanda Penduduk</p>
                      <Button size="sm" variant="outline" className="mt-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat PDF
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4 border-border cursor-pointer hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">Bukti Pembayaran</p>
                      <p className="text-xs text-muted-foreground">Bukti transfer/pembayaran</p>
                      <Button size="sm" variant="outline" className="mt-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* PDF Preview Placeholder */}
              <Card className="glass-card p-5 border-border bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-muted-foreground mb-2">Pilih dokumen di atas untuk melihat preview</p>
                  <p className="text-sm text-muted-foreground">Format: PDF, Max 10MB</p>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPDFDialogOpen(false)}>
              Tutup
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <FileDown className="w-4 h-4 mr-2" />
              Download Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <InvoiceDialog 
        open={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
