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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
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
    return <span className="text-sm font-medium">{action}</span>;
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
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Riwayat Aktivitas
            </h1>
            <p className="text-muted-foreground mt-1">Pantau semua aktivitas pengguna dalam sistem</p>
          </div>
        </div>
      </motion.div>

      <Card className="glass-card p-4">
        {/* Export Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-border">
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="border-border">
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna, modul, atau detail..."
              className="pl-10 bg-input-background border-border"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          <Select 
            value={filterRole} 
            onValueChange={(value) => {
              setFilterRole(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Semua Jabatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jabatan</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="messenger">Messenger</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filterAction} 
            onValueChange={(value) => {
              setFilterAction(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Semua Aksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aksi</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
              <SelectItem value="VIEW">View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info Bar */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredLogs.length} aktivitas
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Modul</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="text-xs">
                      {log.timestamp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <br />
                      <span className="text-muted-foreground">
                        {log.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{getRoleBadge(log.userRole)}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.module}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{log.details}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedLog(log);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Tidak ada data aktivitas
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
