import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Download, 
  Search, 
  Edit, 
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter
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
import { motion } from "motion/react";

interface EnhancedTableProps {
  columns: { key: string; label: string; }[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  searchPlaceholder?: string;
  itemsPerPageOptions?: number[];
}

export function EnhancedTable({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  searchPlaceholder = "Cari data...",
  itemsPerPageOptions = [10, 25, 50, 100]
}: EnhancedTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [showFilter, setShowFilter] = useState(false);

  // Filter data based on search
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined || value === "") return "-";
    
    // Format currency
    if (typeof value === "number" && (key.toLowerCase().includes("uang") || key.toLowerCase().includes("biaya") || key.toLowerCase().includes("profit") || key.toLowerCase().includes("cashback"))) {
      const formatted = value.toLocaleString("id-ID");
      if (value < 0) {
        return <span className="text-red-400">-Rp {Math.abs(value).toLocaleString("id-ID")}</span>;
      } else if (key.toLowerCase().includes("profit")) {
        return <span className="text-blue-400">Rp {formatted}</span>;
      } else if (key.toLowerCase().includes("masuk")) {
        return <span className="text-green-400">Rp {formatted}</span>;
      } else if (key.toLowerCase().includes("keluar") || key.toLowerCase().includes("biaya")) {
        return <span className="text-orange-400">Rp {formatted}</span>;
      }
      return `Rp ${formatted}`;
    }
    
    // Format status and jabatan badges (exclude non-badge fields: jenis layanan, wilayah, dll)
    const lowerKey = key.toLowerCase();
    const isExcluded = lowerKey.includes("layanan") || lowerKey.includes("wilayah") || lowerKey.includes("kantor");
    
    if (!isExcluded && (lowerKey.includes("status") || lowerKey.includes("jabatan"))) {
      return <Badge status={value}>{value}</Badge>;
    }
    
    return value;
  };

  return (
    <div className="space-y-3">
      {/* Header Actions */}
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
          {onAdd && (
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
              {(onEdit || onDelete) && <TableHead className="text-right">Aksi</TableHead>}
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
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(item)}
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
              <ChevronLeft className="w-4 h-4" />
            </Button>
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
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-primary" : "border-border"}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
