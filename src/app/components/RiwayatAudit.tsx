import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Search, Eye, FileDown, Calendar, Activity, Shield, Wallet, User, Truck } from "lucide-react";
import { toast } from "sonner";
import { auditLog, type AuditLogEntry } from "../utils/auditLog";
import { motion } from "motion/react";

const ITEMS_PER_PAGE = 15;

export function RiwayatAudit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Get filtered logs
  const getFilteredLogs = () => {
    const filters: any = {};
    
    if (filterRole !== "all") {
      filters.userRole = filterRole;
    }
    
    if (filterAction !== "all") {
      filters.action = filterAction;
    }
    
    if (filterModule !== "all") {
      filters.module = filterModule;
    }
    
    if (filterDate) {
      const selectedDate = new Date(filterDate);
      filters.startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
      filters.endDate = new Date(selectedDate.setHours(23, 59, 59, 999));
    }

    let logs = auditLog.getLogs(filters);

    // Search filter
    if (searchTerm) {
      logs = logs.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return logs;
  };

  const filteredLogs = getFilteredLogs();
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getRoleBadge = (role: string) => {
    const icons: any = {
      administrator: Shield,
      finance: Wallet,
      admin: User,
      messenger: Truck,
    };
    
    const Icon = icons[role] || User;
    
    return (
      <Badge status="role">
        <Icon className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const getActionBadge = (action: string) => {
    return <span className="text-sm font-medium">{action}</span>;
  };

  const handleExportCSV = () => {
    toast.success("Riwayat audit berhasil diekspor ke CSV!");
  };

  const handleExportPDF = () => {
    toast.success("Riwayat audit berhasil diekspor ke PDF!");
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Riwayat Audit
        </h1>
        <p className="text-muted-foreground mt-1">Lacak semua aktivitas pengguna dalam sistem</p>
      </motion.div>

      <Card className="glass-card p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna, modul, atau detail..."
              className="pl-10 bg-input-background border-border"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select value={filterRole} onValueChange={(value) => {
            setFilterRole(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[160px] bg-input-background border-border">
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

          <Select value={filterAction} onValueChange={(value) => {
            setFilterAction(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[140px] bg-input-background border-border">
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

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-[180px] bg-input-background border-border"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Aktivitas</p>
                <p className="text-2xl">{filteredLogs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Create</p>
                <p className="text-2xl text-green-400">
                  {filteredLogs.filter(l => l.action === "CREATE").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Update</p>
                <p className="text-2xl text-blue-400">
                  {filteredLogs.filter(l => l.action === "UPDATE").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delete</p>
                <p className="text-2xl text-red-400">
                  {filteredLogs.filter(l => l.action === "DELETE").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </Card>
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
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{getRoleBadge(log.userRole)}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-cyan-400">{log.module}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Tidak ada data riwayat audit
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
              Halaman {currentPage} dari {totalPages} (Total: {filteredLogs.length} aktivitas)
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

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Riwayat Audit</DialogTitle>
            <DialogDescription>
              Informasi lengkap aktivitas pengguna
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Waktu</p>
                  <p className="text-sm">
                    {new Date(selectedLog.timestamp).toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Pengguna</p>
                  <p className="text-sm font-mono">{selectedLog.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Pengguna</p>
                  <p className="text-sm">{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                  {getRoleBadge(selectedLog.userRole)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aksi</p>
                  {getActionBadge(selectedLog.action)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modul</p>
                  <p className="text-sm text-cyan-400">{selectedLog.module}</p>
                </div>
                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Detail Aktivitas</p>
                <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-border">
                  <p className="text-sm">{selectedLog.details}</p>
                </Card>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                  <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
