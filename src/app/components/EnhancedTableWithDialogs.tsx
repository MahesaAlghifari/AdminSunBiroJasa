import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter, 
  X, 
  FileQuestion,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  SlidersHorizontal
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { 
  formatDateDDMMYYYY, 
  parseDateTimestamp,
  formatRupiah, 
  PlateNumberBadge, 
  PlainTextStatus,
  formatCustomerName,
  formatBerkasName
} from "../utils/financeFormatters";

export interface Column {
  key: string;
  label: string;
  filterable?: boolean;
  filterType?: "text" | "select" | "date";
  filterOptions?: string[];
  align?: "left" | "right";
  isPrimaryMobile?: boolean; // True for the 2 primary columns on mobile
  render?: (value: any, item?: any) => React.ReactNode;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
  placeholder?: string;
}

interface EnhancedTableWithDialogsProps {
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any, updatedData: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  searchPlaceholder?: string;
  itemsPerPageOptions?: number[];
  editFields?: FieldConfig[];
  hideAddButton?: boolean;
  hideEditButton?: boolean;
  hideDeleteButton?: boolean;
  subTabTitle?: string;
}

type SortDirection = "asc" | "desc" | null;

export function EnhancedTableWithDialogs({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Cari nama / nopol...",
  itemsPerPageOptions = [10, 25, 50, 100],
  editFields,
  hideAddButton = false,
  hideEditButton = false,
  hideDeleteButton = false
}: EnhancedTableWithDialogsProps) {
  // Search inputs (Requirement 12: separate date and text searches)
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Sorting state (Requirement 10 & 11)
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Desktop Table Settings: Font size & column visibility (Requirements 20-26)
  const [tableFontSize, setTableFontSize] = useState<"1x" | "2x" | "3x">("1x");
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(() => new Set(columns.map(c => c.key)));

  // Synchronize visibleColumnKeys when columns prop updates
  React.useEffect(() => {
    setVisibleColumnKeys(prev => {
      const currentKeys = new Set(columns.map(c => c.key));
      if (prev.size === 0) return currentKeys;
      const next = new Set<string>();
      columns.forEach(c => {
        if (prev.has(c.key)) next.add(c.key);
      });
      return next.size > 0 ? next : currentKeys;
    });
  }, [columns]);

  const isAllColumnsVisible = visibleColumnKeys.size === columns.length;
  const isSomeColumnsVisible = visibleColumnKeys.size > 0 && visibleColumnKeys.size < columns.length;
  const selectAllState: boolean | "indeterminate" = isAllColumnsVisible ? true : (isSomeColumnsVisible ? "indeterminate" : false);

  const handleToggleSelectAll = () => {
    if (isAllColumnsVisible) {
      setVisibleColumnKeys(new Set());
    } else {
      setVisibleColumnKeys(new Set(columns.map(c => c.key)));
    }
  };

  const handleToggleColumn = (key: string) => {
    const next = new Set(visibleColumnKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setVisibleColumnKeys(next);
  };

  // Structured filter columns (Requirements 4 & 5: Pengurusan, Rekening, and dropdown categories)
  // Free text search fields (nopol, customer, invoice, etc.) are excluded because they belong in the toolbar search.
  const structuredFilterColumns = useMemo(() => {
    return columns.filter(col => {
      if (!col.filterable) return false;
      const lower = col.key.toLowerCase();
      if (
        lower.includes("nopol") || 
        lower.includes("plat") || 
        lower.includes("customer") || 
        lower.includes("invoice") || 
        lower.includes("nama") ||
        lower.includes("keterangan") ||
        lower.includes("alasan")
      ) {
        return false;
      }
      if (lower.includes("tanggal") || lower.includes("tgl") || lower.includes("tempo")) {
        return false;
      }
      return true;
    });
  }, [columns]);

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Check if date column exists
  const hasDateColumn = useMemo(() => {
    return columns.some(c => {
      const k = c.key.toLowerCase();
      return k.includes("tanggal") || k.includes("tgl") || k.includes("tempo");
    });
  }, [columns]);

  // Identify the 2 primary columns for mobile (Requirement 18 & 26)
  const mobilePrimaryColumns = useMemo(() => {
    const specified = columns.filter(c => c.isPrimaryMobile);
    if (specified.length >= 2) return specified.slice(0, 2);

    // Auto-detect: first date/id column + first name/entity column
    const dateCol = columns.find(c => {
      const k = c.key.toLowerCase();
      return k.includes("tanggal") || k.includes("tgl");
    }) || columns[0];

    const descriptorCol = columns.find(c => {
      const k = c.key.toLowerCase();
      return (
        k !== dateCol.key &&
        (k.includes("customer") ||
         k.includes("nama") ||
         k.includes("keterangan") ||
         k.includes("transaksi") ||
         k.includes("nopol") ||
         k.includes("jenis"))
      );
    }) || columns[1] || columns[0];

    return [dateCol, descriptorCol];
  }, [columns]);

  const mobilePrimaryKeys = useMemo(() => {
    return new Set(mobilePrimaryColumns.map(c => c.key));
  }, [mobilePrimaryColumns]);

  // Handle column sorting toggle
  const handleSortToggle = (colKey: string) => {
    if (sortKey !== colKey) {
      setSortKey(colKey);
      setSortDirection("asc");
    } else {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    }
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Text Search (nama, nopol, etc.)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesQuery = Object.entries(item).some(([k, val]) => {
          if (val === null || val === undefined) return false;
          // Don't match internal ids
          if (k === "id") return false;
          return String(val).toLowerCase().includes(query);
        });
        if (!matchesQuery) return false;
      }

      // 2. Date Search (Requirement 12)
      if (dateSearchTerm.trim() !== "") {
        const dateQuery = dateSearchTerm.trim().toLowerCase();
        const matchesDate = Object.entries(item).some(([k, val]) => {
          const lowerK = k.toLowerCase();
          if (lowerK.includes("tanggal") || lowerK.includes("tgl") || lowerK.includes("tempo")) {
            const formatted = formatDateDDMMYYYY(String(val)).toLowerCase();
            return formatted.includes(dateQuery) || String(val).toLowerCase().includes(dateQuery);
          }
          return false;
        });
        if (!matchesDate) return false;
      }

      // 3. Column Dropdown Filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all") return true;
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      });

      return matchesFilters;
    });
  }, [data, searchTerm, dateSearchTerm, filters]);

  // Sorted data (Requirement 10 & 11)
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    const lowerKey = sortKey.toLowerCase();
    const isDate = lowerKey.includes("tanggal") || lowerKey.includes("tgl") || lowerKey.includes("tempo");

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      // Date sort using numeric timestamp (Requirement 10)
      if (isDate) {
        const timeA = parseDateTimestamp(valA);
        const timeB = parseDateTimestamp(valB);
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      // Numeric sort
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      // Text sort (A -> Z or Z -> A) (Requirement 11)
      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return sortDirection === "asc" 
        ? strA.localeCompare(strB, "id-ID")
        : strB.localeCompare(strA, "id-ID");
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Column Alignment: text left, numbers right (Requirement 5)
  const getColumnAlignment = (col: Column): "left" | "right" => {
    if (col.align) return col.align;
    const lower = col.key.toLowerCase();
    if (
      lower.includes("uang") || 
      lower.includes("biaya") || 
      lower.includes("profit") || 
      lower.includes("cashback") || 
      lower.includes("nominal") || 
      lower.includes("total") || 
      lower.includes("debit") || 
      lower.includes("kredit") || 
      lower.includes("tagihan") ||
      lower.includes("terbayar") ||
      lower.includes("sisa") ||
      lower.includes("kekurangan") ||
      lower === "in" ||
      lower === "out"
    ) {
      return "right";
    }
    return "left";
  };

  const formatCellValue = (value: any, key: string, item: any, col: Column) => {
    if (col.render) {
      return col.render(value, item);
    }

    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">-</span>;
    }

    const lowerKey = key.toLowerCase();

    // Plate numbers (Requirement 22)
    if (lowerKey === "nopol" || lowerKey.includes("plat")) {
      return <PlateNumberBadge plate={String(value)} />;
    }

    // Dates in numeric DD/MM/YYYY (Requirement 9 & 15)
    if (lowerKey.includes("tanggal") || lowerKey.includes("tgl") || lowerKey.includes("tempo")) {
      return (
        <span className="finance-table__date font-mono text-xs text-foreground/90 whitespace-nowrap">
          {formatDateDDMMYYYY(String(value))}
        </span>
      );
    }

    // Customer name with sentence case preserving acronyms (Requirement 7)
    if (lowerKey === "customer") {
      return <span className="text-foreground/90 font-medium">{formatCustomerName(String(value))}</span>;
    }

    // Nama berkas with sentence case preserving acronyms (Requirement 8)
    if (lowerKey === "namaberkas" || lowerKey === "namasesuaibpkb") {
      return <span className="text-foreground/90">{formatBerkasName(String(value))}</span>;
    }

    // Status as PLAIN TEXT without pill/badge (Requirement 23)
    if (lowerKey === "status" || lowerKey === "statusbpkb" || lowerKey === "statusprofit" || lowerKey === "statuscashback") {
      return <PlainTextStatus status={String(value)} />;
    }

    // Currency values
    if (typeof value === "number") {
      const isMonetary = 
        lowerKey.includes("uang") || 
        lowerKey.includes("biaya") || 
        lowerKey.includes("profit") || 
        lowerKey.includes("cashback") || 
        lowerKey.includes("nominal") || 
        lowerKey.includes("total") || 
        lowerKey.includes("debit") || 
        lowerKey.includes("kredit") || 
        lowerKey.includes("tagihan") ||
        lowerKey.includes("terbayar") ||
        lowerKey.includes("sisa") ||
        lowerKey.includes("kekurangan") ||
        lowerKey === "in" ||
        lowerKey === "out";

      if (isMonetary) {
        if (value < 0) {
          return <span className="finance-table__currency font-mono tabular-nums text-rose-600 dark:text-rose-400 font-medium">{formatRupiah(value)}</span>;
        } else if (lowerKey.includes("profit") || lowerKey.includes("masuk") || lowerKey === "in" || lowerKey === "debit") {
          return <span className="finance-table__currency font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">{formatRupiah(value)}</span>;
        } else if (lowerKey.includes("keluar") || lowerKey === "out" || lowerKey === "kredit" || lowerKey.includes("biaya")) {
          return <span className="finance-table__currency font-mono tabular-nums text-rose-500 dark:text-rose-400 font-medium">{formatRupiah(value)}</span>;
        }
        return <span className="finance-table__currency font-mono tabular-nums text-foreground font-medium">{formatRupiah(value)}</span>;
      }
    }

    return <span className="text-foreground/90">{String(value)}</span>;
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
        if (!editFormData[field.key] && editFormData[field.key] !== 0) {
          toast.error(`${field.label} wajib diisi`);
          return;
        }
      }
    }

    if (onEdit && selectedItem) {
      onEdit(selectedItem, editFormData);
    }
    setIsEditDialogOpen(false);
    toast.success("Data transaksi berhasil diperbarui");
  };

  const handleDeleteConfirm = () => {
    if (onDelete && selectedItem) {
      onDelete(selectedItem);
    }
    setIsDeleteDialogOpen(false);
    toast.success("Data transaksi berhasil dihapus");
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setDateSearchTerm("");
    setSortKey(null);
    setSortDirection(null);
  };

  const hasActiveFilters = 
    Object.values(filters).some(v => v && v !== "all") || 
    searchTerm !== "" || 
    dateSearchTerm !== "" ||
    sortKey !== null;

  return (
    <div className="finance-table-container space-y-3.5">
      {/* Table Toolbar (Requirement 14: Action Tambah ALIGN LEFT, Settings, Single Search) */}
      <div className="flex flex-col md:flex-row gap-2.5 justify-between items-stretch md:items-center">
        {/* Left Section: Action Tambah (ALIGN LEFT) + Filter Toggle + Pengaturan Tabel (Desktop Only) */}
        <div className="flex items-center gap-2 flex-wrap">
          {onAdd && !hideAddButton && (
            <Button
              onClick={onAdd}
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
            className={`h-8 text-xs border-border gap-1.5 shrink-0 ${showFilter || hasActiveFilters ? "border-primary/50 text-primary bg-primary/5" : ""}`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Button>

          {/* Desktop Table Settings (Requirements 20-26: Desktop Only) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex h-8 text-xs border-border gap-1.5 shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Pengaturan tabel</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-4 space-y-4 bg-popover text-popover-foreground border-border shadow-md">
              <div>
                <h4 className="font-semibold text-sm leading-tight text-foreground">Pengaturan tabel</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Sesuaikan ukuran font dan visibilitas kolom desktop</p>
              </div>

              {/* Font Size Setting (Requirement 21: 1x, 2x, 3x) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground/85">Ukuran teks</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1x", "2x", "3x"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTableFontSize(size)}
                      className={`py-1.5 px-2 rounded-md text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                        tableFontSize === size
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-background hover:bg-muted text-foreground border-border"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full border ${tableFontSize === size ? "bg-primary-foreground border-primary-foreground" : "border-muted-foreground"}`} />
                      <span>{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Visibility Setting (Requirements 22, 23, 24, 25, 26) */}
              <div className="space-y-2 pt-2 border-t border-border/70">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground/85">Kolom yang ditampilkan</Label>
                  <span className="text-[11px] text-muted-foreground">
                    {visibleColumnKeys.size} dari {columns.length} aktif
                  </span>
                </div>

                <div className="border border-border rounded-md p-2 bg-muted/20 space-y-2">
                  {/* Select All Checkbox (Requirement 23) */}
                  <label className="flex items-center gap-2.5 p-1 rounded hover:bg-muted/50 cursor-pointer text-xs font-semibold select-none border-b border-border/60 pb-1.5">
                    <Checkbox
                      checked={selectAllState}
                      onCheckedChange={handleToggleSelectAll}
                    />
                    <span className="text-foreground">Pilih semua</span>
                  </label>

                  {/* Scrollable list of individual columns */}
                  <ScrollArea className="h-44 pr-1.5">
                    <div className="space-y-1">
                      {columns.map((col) => {
                        const isChecked = visibleColumnKeys.has(col.key);
                        return (
                          <label
                            key={col.key}
                            className="flex items-center gap-2.5 p-1 rounded hover:bg-muted/50 cursor-pointer text-xs select-none"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => handleToggleColumn(col.key)}
                            />
                            <span className={isChecked ? "text-foreground font-medium" : "text-muted-foreground"}>
                              {col.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Section: Single Main Search Field (Requirements 2 & 3: NO duplicate date search here) */}
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || "Cari berdasarkan nopol, customer, invoice..."}
            className="pl-8 bg-background border-border h-8 text-xs font-normal placeholder:font-normal placeholder:text-muted-foreground/60"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Collapsible Filter Panel (Requirements 4, 5, 7, 8) */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <h4 className="text-xs font-semibold text-muted-foreground">Filter data tabel</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3 mr-1" />
                  Reset filter
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Date Filter (Requirement 7: Tanggal exclusively in filter panel) */}
                {hasDateColumn && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground/80">Tanggal</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Cari tanggal (DD/MM/YYYY)..."
                        className="pl-8 bg-background border-border h-8 text-xs font-normal placeholder:font-normal placeholder:text-muted-foreground/60"
                        value={dateSearchTerm}
                        onChange={(e) => {
                          setDateSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Structured Dropdown Filters (Requirements 4 & 5: Pengurusan, Rekening, etc.) */}
                {structuredFilterColumns.map(col => {
                  const options = col.filterOptions || Array.from(new Set(data.map(d => d[col.key]).filter(Boolean))).sort();
                  return (
                    <div key={col.key} className="space-y-1">
                      <Label className="text-xs font-medium text-foreground/80">{col.label}</Label>
                      <Select
                        value={filters[col.key] || "all"}
                        onValueChange={(value) => {
                          setFilters({ ...filters, [col.key]: value });
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="bg-background border-border h-8 text-xs font-normal">
                          <SelectValue placeholder={`Semua ${col.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-xs">Semua</SelectItem>
                          {options.map((opt: any) => (
                            <SelectItem key={String(opt)} value={String(opt)} className="text-xs">{String(opt)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Count & Page Size Bar */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground px-0.5">
        <span>
          Menampilkan {sortedData.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, sortedData.length)} dari {sortedData.length} data
        </span>
        <div className="flex items-center gap-1.5">
          <span>Baris per halaman:</span>
          <Select 
            value={String(itemsPerPage)} 
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[75px] bg-background border-border h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map(option => (
                <SelectItem key={option} value={String(option)} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table: Desktop (Full Columns with desktop settings) & Mobile (2 Primary Columns + Actions) */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <Table className={`finance-table finance-table--font-${tableFontSize === "1x" ? "1" : tableFontSize === "2x" ? "2" : "3"} w-full`}>
            <TableHeader className="finance-table__header bg-muted/40 border-b border-border">
              <TableRow className="hover:bg-transparent">
                {columns.map(col => {
                  const isVisibleDesktop = visibleColumnKeys.has(col.key);
                  const isMobileVisible = mobilePrimaryKeys.has(col.key);

                  if (!isVisibleDesktop && !isMobileVisible) return null;

                  const visibilityClass = isMobileVisible && isVisibleDesktop
                    ? ""
                    : isVisibleDesktop
                      ? "hidden md:table-cell"
                      : "table-cell md:hidden";

                  const align = getColumnAlignment(col);
                  const alignClass = align === "right" ? "text-right" : "text-left";
                  const isSorted = sortKey === col.key;

                  return (
                    <TableHead 
                      key={col.key} 
                      onClick={() => handleSortToggle(col.key)}
                      className={`h-9 px-3.5 font-semibold text-foreground/80 whitespace-nowrap text-xs select-none cursor-pointer hover:text-foreground ${alignClass} ${visibilityClass}`}
                    >
                      <div className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : "flex-row"}`}>
                        <span>{col.label}</span>
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-primary shrink-0" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-primary shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown className="w-2.5 h-2.5 opacity-30 hover:opacity-100 shrink-0" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}

                {/* Actions Column Header (Desktop & Mobile, Requirement 10 & 11) */}
                <TableHead className="h-9 px-2 font-semibold text-foreground/80 text-center whitespace-nowrap text-xs w-[95px]">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="finance-table__body">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.filter(c => visibleColumnKeys.has(c.key) || mobilePrimaryKeys.has(c.key)).length + 1} 
                    className="h-36 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <FileQuestion className="w-7 h-7 text-muted-foreground/60" />
                      <p className="text-xs font-medium text-foreground/80">Tidak ada data transaksi yang ditemukan</p>
                      <p className="text-[11px] text-muted-foreground">Periksa filter pencarian atau tambahkan transaksi baru</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, idx) => (
                  <TableRow
                    key={item.id || idx}
                    className="hover:bg-muted/30 transition-colors border-b border-border/60 last:border-0 h-10"
                  >
                    {columns.map(col => {
                      const isVisibleDesktop = visibleColumnKeys.has(col.key);
                      const isMobileVisible = mobilePrimaryKeys.has(col.key);

                      if (!isVisibleDesktop && !isMobileVisible) return null;

                      const visibilityClass = isMobileVisible && isVisibleDesktop
                        ? ""
                        : isVisibleDesktop
                          ? "hidden md:table-cell"
                          : "table-cell md:hidden";

                      const align = getColumnAlignment(col);
                      const alignClass = align === "right" ? "text-right" : "text-left";

                      return (
                        <TableCell 
                          key={col.key} 
                          className={`px-3.5 py-2 text-xs ${alignClass} ${visibilityClass}`}
                        >
                          {formatCellValue(item[col.key], col.key, item, col)}
                        </TableCell>
                      );
                    })}

                    {/* Actions Cell (Requirements 10 & 11: Direct visible View, Edit, Delete with soft default and distinct hover) */}
                    <TableCell className="px-2 py-1.5 text-center">
                      <div className="finance-table__actions flex items-center justify-center gap-1">
                        {onView && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(item)}
                            aria-label="Lihat detail transaksi"
                            className="finance-action-btn h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {onEdit && !hideEditButton && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(item)}
                            aria-label="Ubah transaksi"
                            className="finance-action-btn h-7 w-7 p-0 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {onDelete && !hideDeleteButton && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            aria-label="Hapus transaksi"
                            className="finance-action-btn h-7 w-7 p-0 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls (Requirement 4: Table -> Pagination -> Summary) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="text-muted-foreground text-[11px]">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 text-xs border-border px-2.5"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 text-xs border-border px-2.5"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Edit Data Modal (For surgical inline update) */}
      {editFields && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="border-border sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">Ubah data transaksi</DialogTitle>
              <DialogDescription className="text-xs">
                Perbarui rincian informasi data transaksi
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {editFields.map(field => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs font-medium text-foreground/80">{field.label}</Label>
                  {field.type === "select" && field.options ? (
                    <Select
                      value={editFormData[field.key] || ""}
                      onValueChange={(value) => setEditFormData({ ...editFormData, [field.key]: value })}
                    >
                      <SelectTrigger className="bg-background border-border h-8 text-xs">
                        <SelectValue placeholder={`Pilih ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map(opt => (
                          <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      className="bg-background border-border h-8 text-xs"
                      value={editFormData[field.key] !== undefined ? editFormData[field.key] : ""}
                      onChange={(e) => setEditFormData({ ...editFormData, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="mt-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)} className="text-xs h-8">
                Batal
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs h-8" onClick={handleEditSubmit}>
                Simpan perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-semibold">Hapus data transaksi?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-8">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs h-8"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
