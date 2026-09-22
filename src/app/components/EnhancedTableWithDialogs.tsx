import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { 
  Plus, 
  Download, 
  Search, 
  Edit, 
  Trash2,
  FileText,
  Filter,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Column {
  key: string;
  label: string;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: string[];
}

interface EnhancedTableWithDialogsProps {
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any, updatedData: any) => void;
  onDelete?: (item: any) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  searchPlaceholder?: string;
  itemsPerPageOptions?: number[];
  editFields?: { key: string; label: string; type: "text" | "number" | "date" | "select"; options?: string[] }[];
  hideAddButton?: boolean;
  hideEditButton?: boolean;
  hideDeleteButton?: boolean;
}

export function EnhancedTableWithDialogs({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  searchPlaceholder = "Cari data...",
  itemsPerPageOptions = [10, 25, 50, 100],
  editFields,
  hideAddButton = false,
  hideEditButton = false,
  hideDeleteButton = false
}: EnhancedTableWithDialogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Filter and search data
  const filteredData = data.filter(item => {
    // Search filter
    const matchSearch = Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Column filters
    const matchFilters = Object.entries(filters).every(([key, value]) => {
      if (!value || value === "all") return true;
      return String(item[key]).toLowerCase().includes(value.toLowerCase());
    });
    
    return matchSearch && matchFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined || value === "") return "-";
    
    // Format currency
    if (typeof value === "number" && (key.toLowerCase().includes("uang") || key.toLowerCase().includes("biaya") || key.toLowerCase().includes("profit") || key.toLowerCase().includes("cashback") || key.toLowerCase().includes("nominal") || key.toLowerCase().includes("total") || key.toLowerCase().includes("debit") || key.toLowerCase().includes("kredit"))) {
      const formatted = value.toLocaleString("id-ID");
      if (value < 0) {
        return <span className="text-red-400">-Rp {Math.abs(value).toLocaleString("id-ID")}</span>;
      } else if (key.toLowerCase().includes("profit")) {
        return <span className="text-blue-400">Rp {formatted}</span>;
      } else if (key.toLowerCase().includes("masuk") || key.toLowerCase().includes("in")) {
        return <span className="text-green-400">Rp {formatted}</span>;
      } else if (key.toLowerCase().includes("keluar") || key.toLowerCase().includes("out") || key.toLowerCase().includes("biaya")) {
        return <span className="text-orange-400">Rp {formatted}</span>;
      }
      return `Rp ${formatted}`;
    }
    
    // Format status badges
    if (key.toLowerCase().includes("status") || key.toLowerCase().includes("jenis")) {
      return <Badge status={value}>{value}</Badge>;
    }
    
    return value;
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setEditFormData({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (editFields) {
      for (const field of editFields) {
        if (!editFormData[field.key]) {
          toast.error(`${field.label} harus diisi!`);
          return;
        }
      }
    }

    if (onEdit && selectedItem) {
      onEdit(selectedItem, editFormData);
    }
    setIsEditDialogOpen(false);
    toast.success("Data berhasil diupdate!");
  };

  const handleDeleteConfirm = () => {
    if (onDelete && selectedItem) {
      onDelete(selectedItem);
    }
    setIsDeleteDialogOpen(false);
    toast.success("Data berhasil dihapus!");
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 bg-input-background border-border h-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
            className="border-border"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {onAdd && !hideAddButton && (
            <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          )}
          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-border bg-secondary/20 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm">Filter Data</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns
                  .filter(col => col.filterable)
                  .map(col => (
                    <div key={col.key} className="space-y-2">
                      <Label className="text-xs">{col.label}</Label>
                      {col.filterType === "select" && col.filterOptions ? (
                        <Select
                          value={filters[col.key] || "all"}
                          onValueChange={(value) => {
                            setFilters({ ...filters, [col.key]: value });
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="bg-input-background border-border h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {col.filterOptions.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder={`Filter ${col.label}`}
                          className="bg-input-background border-border h-9"
                          value={filters[col.key] || ""}
                          onChange={(e) => {
                            setFilters({ ...filters, [col.key]: e.target.value });
                            setCurrentPage(1);
                          }}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Info */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground">
        <span>
          Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
        </span>
        <div className="flex items-center gap-2">
          <span>Tampilkan:</span>
          <Select 
            value={String(itemsPerPage)} 
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] bg-input-background border-border h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option} per halaman
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {((onEdit && !hideEditButton) || (onDelete && !hideDeleteButton)) && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, idx) => (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors border-b border-border"
                >
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {formatValue(item[col.key], col.key)}
                    </TableCell>
                  ))}
                  {((onEdit && !hideEditButton) || (onDelete && !hideDeleteButton)) && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {onEdit && !hideEditButton && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </Button>
                        )}
                        {onDelete && !hideDeleteButton && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editFields && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Data</DialogTitle>
              <DialogDescription>
                Update informasi data yang dipilih
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {editFields.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label>{field.label}</Label>
                  {field.type === "select" && field.options ? (
                    <Select
                      value={editFormData[field.key]}
                      onValueChange={(value) => setEditFormData({ ...editFormData, [field.key]: value })}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      className="bg-input-background border-border"
                      value={editFormData[field.key] || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleEditSubmit}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini?
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
    </div>
  );
}
