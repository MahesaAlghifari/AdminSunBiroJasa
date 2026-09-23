import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Search, Eye, FileDown, FileText, Printer, Activity } from "lucide-react";
import { toast } from "sonner";
import { auditLog, AuditLogEntry } from "../utils/auditLog";

const ITEMS_PER_PAGE = 15;

interface AuditLogProps {
  currentUserRole: 'administrator' | 'finance' | 'admin' | 'messenger';
}

export function AuditLog({ currentUserRole }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [isInvoiceViewOpen, setIsInvoiceViewOpen] = useState(false);

  // Get filtered logs
  const getFilteredLogs = () => {
    let logs = auditLog.getLogs();
    
    if (searchTerm) {
      logs = logs.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      logs = auditLog.getLogs({ userRole: filterRole });
    }

    if (filterModule !== "all") {
      logs = logs.filter(log => log.module.includes(filterModule));
    }

    if (filterAction !== "all") {
      logs = logs.filter(log => log.action === filterAction);
    }

    return logs;
  };

  const filteredLogs = getFilteredLogs();
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getRoleBadge = (role: string) => {
    return <Badge status="role">{role}</Badge>;
  };

  const getActionBadge = (action: string) => {
    return <span className="text-xs font-medium text-foreground/80">{action}</span>;
  };

  const handleExportCSV = () => {
    toast.success("Data audit log berhasil diekspor ke CSV!");
  };

  const handleExportPDF = () => {
    toast.success("Data audit log berhasil diekspor ke PDF!");
  };

  const handleViewDocument = () => {
    setIsDocumentViewOpen(true);
  };

  const handlePrintInvoice = () => {
    setIsInvoiceViewOpen(true);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Invoice siap dicetak!");
  };

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 px-2 sm:px-3 lg:px-4 py-4 md:py-6 max-w-7xl mx-auto">
      <div>
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 pb-2" aria-label="Breadcrumb">
          <span>Master Data</span>
          <span>/</span>
          <span className="text-foreground font-medium">Riwayat Aktivitas</span>
        </nav>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Riwayat Aktivitas</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Pantau semua aktivitas pengguna dalam sistem</p>
        </div>
      </div>

      <Card className="glass-card p-4 space-y-3.5">
        {/* Filters and Export Toolbar */}
        <div className="flex flex-col lg:flex-row gap-2.5 justify-between items-stretch lg:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Select 
              value={filterRole} 
              onValueChange={(value) => {
                setFilterRole(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-background border-border h-8 text-xs font-normal">
                <SelectValue placeholder="Semua Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Jabatan</SelectItem>
                <SelectItem value="administrator" className="text-xs">Administrator</SelectItem>
                <SelectItem value="finance" className="text-xs">Finance</SelectItem>
                <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                <SelectItem value="messenger" className="text-xs">Messenger</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filterAction} 
              onValueChange={(value) => {
                setFilterAction(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[125px] bg-background border-border h-8 text-xs font-normal">
                <SelectValue placeholder="Semua Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Aksi</SelectItem>
                <SelectItem value="CREATE" className="text-xs">Create</SelectItem>
                <SelectItem value="UPDATE" className="text-xs">Update</SelectItem>
                <SelectItem value="DELETE" className="text-xs">Delete</SelectItem>
                <SelectItem value="EXPORT" className="text-xs">Export</SelectItem>
                <SelectItem value="VIEW" className="text-xs">View</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-border text-xs h-8 px-2.5 gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                <span>CSV</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} className="border-border text-xs h-8 px-2.5 gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF</span>
              </Button>
            </div>
          </div>

          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna, modul, atau detail..."
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
        <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-2xs">
          <Table className="w-full min-w-[700px]">
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 min-w-[110px]">Waktu</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80">Pengguna</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 text-center">Jabatan</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80 text-center">Jenis Aksi</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80">Modul</TableHead>
                <TableHead className="h-9 px-3.5 text-xs font-semibold text-foreground/80">Detail</TableHead>
                <TableHead className="h-9 px-2 text-xs font-semibold text-foreground/80 text-center w-[75px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors border-b border-border/60 last:border-0 h-10">
                    <TableCell className="px-3.5 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      <span className="font-medium text-foreground/90">
                        {log.timestamp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {" "}
                      <span className="text-[11px] text-muted-foreground/75 font-mono">
                        {log.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>
                    <TableCell className="px-3.5 py-2 text-xs font-medium text-foreground/90">{log.userName}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs text-center">{getRoleBadge(log.userRole)}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs text-center">{getActionBadge(log.action)}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs font-medium text-foreground/80">{log.module}</TableCell>
                    <TableCell className="px-3.5 py-2 text-xs max-w-xs truncate text-muted-foreground">{log.details}</TableCell>
                    <TableCell className="px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded transition-colors"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsViewDialogOpen(true);
                          }}
                          title="Lihat Detail"
                          aria-label="Lihat detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                    Tidak ada data aktivitas
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
              Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} dari {filteredLogs.length} aktivitas
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

      {/* View Log Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Aktivitas</DialogTitle>
            <DialogDescription>Informasi lengkap tentang aktivitas ini</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Waktu</Label>
                  <p className="text-sm">
                    {selectedLog.timestamp.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    <br />
                    <span className="text-muted-foreground">
                      {selectedLog.timestamp.toLocaleTimeString('id-ID')}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pengguna</Label>
                  <p className="text-sm">{selectedLog.userName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Jabatan</Label>
                  <div className="mt-1">{getRoleBadge(selectedLog.userRole)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Aksi</Label>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Modul</Label>
                  <p className="text-sm">{selectedLog.module}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">IP Address</Label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Detail Aktivitas</Label>
                <Card className="glass-card p-3 mt-2 bg-secondary/20">
                  <p className="text-sm">{selectedLog.details}</p>
                </Card>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Metadata</Label>
                  <Card className="glass-card p-3 mt-2 bg-secondary/20">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}

              {/* Action buttons for order-related logs */}
              {selectedLog.module.includes('Order') && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewDocument}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat Dokumen PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrintInvoice}
                    className="flex-1"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Invoice
                  </Button>
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

      {/* Document View Dialog */}
      <Dialog open={isDocumentViewOpen} onOpenChange={setIsDocumentViewOpen}>
        <DialogContent className="border-border max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dokumen PDF</DialogTitle>
            <DialogDescription>Pratinjau dokumen yang telah diupload</DialogDescription>
          </DialogHeader>

          <div className="bg-secondary/10 rounded-lg p-8 min-h-[500px] flex items-center justify-center border border-border">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Pratinjau Dokumen PDF</p>
              <p className="text-sm text-muted-foreground mb-4">
                (Dalam implementasi production, ini akan menampilkan PDF viewer)
              </p>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                Download Dokumen
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentViewOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceViewOpen} onOpenChange={setIsInvoiceViewOpen}>
        <DialogContent className="border-border max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
            <DialogDescription>Cetak invoice untuk customer</DialogDescription>
          </DialogHeader>

          {/* Invoice Content */}
          <div className="bg-white text-black p-8 rounded-lg" id="invoice-content">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-2">SUN 89 BIRO JASA</h2>
                <p className="text-sm">Jl. Raya Sukahati No. 6</p>
                <p className="text-sm">Kel. Sukahati, Kec. Cibinong-Bogor</p>
                <p className="text-sm">Tel: 021-83715981</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl mb-2">INVOICE</h3>
                <p className="text-sm">No Faktur: BJ_25-09_1915</p>
                <p className="text-sm">Tanggal: 16/09/2025</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm">Customer: BP DEDE</p>
              <p className="text-sm">Alamat: -</p>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-2">KETERANGAN</th>
                  <th className="text-right py-2">HARGA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">Perpanjangan STNK 1 Tahun</td>
                  <td className="text-right">Rp 750.000</td>
                </tr>
                <tr>
                  <td className="py-2">Biaya Jasa</td>
                  <td className="text-right">Rp 150.000</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="py-2">Total</td>
                  <td className="text-right">Rp 900.000</td>
                </tr>
              </tbody>
            </table>

            <div className="text-sm mb-6">
              <p>Catatan: Pembayaran ke Rekening BCA 7175095764 a/n. ANISA SUSANTI</p>
            </div>

            <div className="flex justify-between mt-12">
              <div className="text-center">
                <p className="mb-12">Tanda Terima</p>
                <p>_______________</p>
              </div>
              <div className="text-center">
                <p className="mb-12">Hormat Kami</p>
                <p>_______________</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceViewOpen(false)}>
              Batal
            </Button>
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
              <Printer className="w-4 h-4 mr-2" />
              Cetak Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
