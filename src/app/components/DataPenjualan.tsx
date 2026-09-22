import { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, Download, Search, FileText, Edit, Trash2, Eye } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { EnhancedTable } from "./EnhancedTable";
import { toast } from "sonner";
import { 
  belumKurangBayarData as initialBelumBayarData,
  profitTerpendingData as initialProfitPendingData,
  cashbackTerpendingData as initialCashbackPendingData
} from "./Finance";

// Sample data untuk setiap tabel - masing-masing 10 items
const mutasiLDData = [
  { id: 1, tglMasuk: "01/11/2024", r4r2: "R4", nopol: "B 1234 ABC", customer: "PT. MAJU JAYA", namaSesuaiBPKB: "BUDI SANTOSO", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "02/11/2024", uangMasuk: 5000000, bank: "BCA", uangKeluar: 3500000, tglUangKeluar: "03/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-001", tglInvoice: "01/11/2024", tandaTerima: "TT-001", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-001" },
  { id: 2, tglMasuk: "02/11/2024", r4r2: "R2", nopol: "D 5678 EFG", customer: "TOKO SEJAHTERA", namaSesuaiBPKB: "AHMAD WIJAYA", jenisPengurusan: "Mutasi LD", jenisBayar: "Cash", tglUangMasuk: "03/11/2024", uangMasuk: 4800000, bank: "Cash", uangKeluar: 3300000, tglUangKeluar: "04/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-002", tglInvoice: "02/11/2024", tandaTerima: "TT-002", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-002" },
  { id: 3, tglMasuk: "03/11/2024", r4r2: "R4", nopol: "F 9012 HIJ", customer: "CV. MANDIRI", namaSesuaiBPKB: "SUSAN TAN", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "04/11/2024", uangMasuk: 5200000, bank: "Mandiri", uangKeluar: 3600000, tglUangKeluar: "05/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Proses", noInvoice: "INV-LD-003", tglInvoice: "03/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 4, tglMasuk: "04/11/2024", r4r2: "R2", nopol: "B 3456 KLM", customer: "WARUNG MAKAN", namaSesuaiBPKB: "SLAMET RIYADI", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "05/11/2024", uangMasuk: 4700000, bank: "BRI", uangKeluar: 3200000, tglUangKeluar: "06/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-004", tglInvoice: "04/11/2024", tandaTerima: "TT-004", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-004" },
  { id: 5, tglMasuk: "05/11/2024", r4r2: "R4", nopol: "D 7890 NOP", customer: "SALON CANTIK", namaSesuaiBPKB: "RATNA SARI", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "06/11/2024", uangMasuk: 5100000, bank: "BCA", uangKeluar: 3450000, tglUangKeluar: "07/11/2024", uangKeluarDari: "Kas Kantor", profit: 1650000, status: "Selesai", noInvoice: "INV-LD-005", tglInvoice: "05/11/2024", tandaTerima: "TT-005", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-005" },
  { id: 6, tglMasuk: "06/11/2024", r4r2: "R2", nopol: "F 2468 QRS", customer: "BENGKEL MOTOR", namaSesuaiBPKB: "JOKO SANTOSO", jenisPengurusan: "Mutasi LD", jenisBayar: "Cash", tglUangMasuk: "07/11/2024", uangMasuk: 4900000, bank: "Cash", uangKeluar: 3400000, tglUangKeluar: "08/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-006", tglInvoice: "06/11/2024", tandaTerima: "TT-006", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-006" },
  { id: 7, tglMasuk: "07/11/2024", r4r2: "R4", nopol: "B 1357 TUV", customer: "TOKO BANGUNAN", namaSesuaiBPKB: "BAMBANG W", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "08/11/2024", uangMasuk: 5300000, bank: "Mandiri", uangKeluar: 3700000, tglUangKeluar: "09/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Proses", noInvoice: "INV-LD-007", tglInvoice: "07/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 8, tglMasuk: "08/11/2024", r4r2: "R2", nopol: "D 9753 WXY", customer: "FOTOCOPY 24 JAM", namaSesuaiBPKB: "DEDI SURYADI", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "09/11/2024", uangMasuk: 4850000, bank: "BRI", uangKeluar: 3350000, tglUangKeluar: "10/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-008", tglInvoice: "08/11/2024", tandaTerima: "TT-008", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-008" },
  { id: 9, tglMasuk: "09/11/2024", r4r2: "R4", nopol: "F 8642 ZAB", customer: "LAUNDRY KILOAN", namaSesuaiBPKB: "WATI LESTARI", jenisPengurusan: "Mutasi LD", jenisBayar: "Cash", tglUangMasuk: "10/11/2024", uangMasuk: 4750000, bank: "Cash", uangKeluar: 3250000, tglUangKeluar: "11/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-LD-009", tglInvoice: "09/11/2024", tandaTerima: "TT-009", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-009" },
  { id: 10, tglMasuk: "10/11/2024", r4r2: "R2", nopol: "B 7531 CDE", customer: "RUMAH MAKAN PADANG", namaSesuaiBPKB: "YUSUF HAKIM", jenisPengurusan: "Mutasi LD", jenisBayar: "Transfer", tglUangMasuk: "11/11/2024", uangMasuk: 5050000, bank: "BCA", uangKeluar: 3500000, tglUangKeluar: "12/11/2024", uangKeluarDari: "Kas Kantor", profit: 1550000, status: "Selesai", noInvoice: "INV-LD-010", tglInvoice: "10/11/2024", tandaTerima: "TT-010", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-010" },
];

const mutasiASData = [
  { id: 1, tglMasuk: "01/11/2024", r4r2: "R2", nopol: "D 1111 ASA", customer: "TOKO BAJU", namaSesuaiBPKB: "SANTI DEWI", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "02/11/2024", uangMasuk: 4800000, bank: "Mandiri", uangKeluar: 3200000, tglUangKeluar: "03/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Selesai", noInvoice: "INV-AS-001", tglInvoice: "01/11/2024", tandaTerima: "TT-AS-001", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-001" },
  { id: 2, tglMasuk: "02/11/2024", r4r2: "R4", nopol: "F 2222 ASB", customer: "RESTORAN PADANG", namaSesuaiBPKB: "YUSUF HAKIM", jenisPengurusan: "Mutasi AS", jenisBayar: "Cash", tglUangMasuk: "03/11/2024", uangMasuk: 4600000, bank: "Cash", uangKeluar: 3100000, tglUangKeluar: "04/11/2024", uangKeluarDari: "Kas Kantor", profit: 1500000, status: "Selesai", noInvoice: "INV-AS-002", tglInvoice: "02/11/2024", tandaTerima: "TT-AS-002", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-002" },
  { id: 3, tglMasuk: "03/11/2024", r4r2: "R2", nopol: "B 3333 ASC", customer: "MINIMARKET", namaSesuaiBPKB: "RINA OKTAVIA", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "04/11/2024", uangMasuk: 4900000, bank: "BRI", uangKeluar: 3300000, tglUangKeluar: "05/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Proses", noInvoice: "INV-AS-003", tglInvoice: "03/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 4, tglMasuk: "04/11/2024", r4r2: "R4", nopol: "D 4444 ASD", customer: "COUNTER HP", namaSesuaiBPKB: "IWAN SETIAWAN", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "05/11/2024", uangMasuk: 4700000, bank: "BCA", uangKeluar: 3150000, tglUangKeluar: "06/11/2024", uangKeluarDari: "Kas Kantor", profit: 1550000, status: "Selesai", noInvoice: "INV-AS-004", tglInvoice: "04/11/2024", tandaTerima: "TT-AS-004", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-004" },
  { id: 5, tglMasuk: "05/11/2024", r4r2: "R2", nopol: "F 5555 ASE", customer: "APOTEK SEHAT", namaSesuaiBPKB: "DWI ANGGRAENI", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "06/11/2024", uangMasuk: 4850000, bank: "Mandiri", uangKeluar: 3250000, tglUangKeluar: "07/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Selesai", noInvoice: "INV-AS-005", tglInvoice: "05/11/2024", tandaTerima: "TT-AS-005", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-005" },
  { id: 6, tglMasuk: "06/11/2024", r4r2: "R4", nopol: "B 6666 ASF", customer: "PERCETAKAN", namaSesuaiBPKB: "HADI PURNOMO", jenisPengurusan: "Mutasi AS", jenisBayar: "Cash", tglUangMasuk: "07/11/2024", uangMasuk: 4650000, bank: "Cash", uangKeluar: 3100000, tglUangKeluar: "08/11/2024", uangKeluarDari: "Kas Kantor", profit: 1550000, status: "Selesai", noInvoice: "INV-AS-006", tglInvoice: "06/11/2024", tandaTerima: "TT-AS-006", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-006" },
  { id: 7, tglMasuk: "07/11/2024", r4r2: "R2", nopol: "D 7777 ASG", customer: "TOKO SEMBAKO", namaSesuaiBPKB: "NURUL HIDAYAH", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "08/11/2024", uangMasuk: 4800000, bank: "BRI", uangKeluar: 3200000, tglUangKeluar: "09/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Proses", noInvoice: "INV-AS-007", tglInvoice: "07/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 8, tglMasuk: "08/11/2024", r4r2: "R4", nopol: "F 8888 ASH", customer: "WARUNG KOPI", namaSesuaiBPKB: "TRI WAHYUDI", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "09/11/2024", uangMasuk: 4750000, bank: "BCA", uangKeluar: 3200000, tglUangKeluar: "10/11/2024", uangKeluarDari: "Kas Kantor", profit: 1550000, status: "Selesai", noInvoice: "INV-AS-008", tglInvoice: "08/11/2024", tandaTerima: "TT-AS-008", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-008" },
  { id: 9, tglMasuk: "09/11/2024", r4r2: "R2", nopol: "B 9999 ASI", customer: "BENGKEL LAS", namaSesuaiBPKB: "SUMANTO", jenisPengurusan: "Mutasi AS", jenisBayar: "Cash", tglUangMasuk: "10/11/2024", uangMasuk: 4600000, bank: "Cash", uangKeluar: 3050000, tglUangKeluar: "11/11/2024", uangKeluarDari: "Kas Kantor", profit: 1550000, status: "Selesai", noInvoice: "INV-AS-009", tglInvoice: "09/11/2024", tandaTerima: "TT-AS-009", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-009" },
  { id: 10, tglMasuk: "10/11/2024", r4r2: "R4", nopol: "D 1010 ASJ", customer: "LAUNDRY KILOAN", namaSesuaiBPKB: "ANI SUSILOWATI", jenisPengurusan: "Mutasi AS", jenisBayar: "Transfer", tglUangMasuk: "11/11/2024", uangMasuk: 4900000, bank: "Mandiri", uangKeluar: 3300000, tglUangKeluar: "12/11/2024", uangKeluarDari: "Kas Kantor", profit: 1600000, status: "Selesai", noInvoice: "INV-AS-010", tglInvoice: "10/11/2024", tandaTerima: "TT-AS-010", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-AS-010" },
];

const bbnData = [
  { id: 1, tglMasuk: "01/11/2024", r4r2: "R4", nopol: "F 1111 BBN", customer: "SITI RAHAYU", namaSesuaiBPKB: "SITI RAHAYU", jenisPengurusan: "BBN 1", jenisBayar: "Transfer", tglUangMasuk: "02/11/2024", uangMasuk: 6000000, bank: "BRI", uangKeluar: 4200000, tglUangKeluar: "03/11/2024", uangKeluarDari: "Kas Kantor", profit: 1800000, status: "Selesai", noInvoice: "INV-BBN-001", tglInvoice: "01/11/2024", tandaTerima: "TT-BBN-001", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-001" },
  { id: 2, tglMasuk: "02/11/2024", r4r2: "R2", nopol: "B 2222 BBN", customer: "LINDA PERMATA", namaSesuaiBPKB: "LINDA PERMATA", jenisPengurusan: "BBN 1", jenisBayar: "Cash", tglUangMasuk: "03/11/2024", uangMasuk: 5800000, bank: "Cash", uangKeluar: 4000000, tglUangKeluar: "04/11/2024", uangKeluarDari: "Kas Kantor", profit: 1800000, status: "Selesai", noInvoice: "INV-BBN-002", tglInvoice: "02/11/2024", tandaTerima: "TT-BBN-002", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-002" },
  { id: 3, tglMasuk: "03/11/2024", r4r2: "R4", nopol: "D 3333 BBN", customer: "HENDRA WIJAYA", namaSesuaiBPKB: "HENDRA WIJAYA", jenisPengurusan: "BBN 2", jenisBayar: "Transfer", tglUangMasuk: "04/11/2024", uangMasuk: 5500000, bank: "BCA", uangKeluar: 3800000, tglUangKeluar: "05/11/2024", uangKeluarDari: "Kas Kantor", profit: 1700000, status: "Proses", noInvoice: "INV-BBN-003", tglInvoice: "03/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 4, tglMasuk: "04/11/2024", r4r2: "R2", nopol: "F 4444 BBN", customer: "PUTRI AMANDA", namaSesuaiBPKB: "PUTRI AMANDA", jenisPengurusan: "BBN 1", jenisBayar: "Transfer", tglUangMasuk: "05/11/2024", uangMasuk: 6100000, bank: "Mandiri", uangKeluar: 4250000, tglUangKeluar: "06/11/2024", uangKeluarDari: "Kas Kantor", profit: 1850000, status: "Selesai", noInvoice: "INV-BBN-004", tglInvoice: "04/11/2024", tandaTerima: "TT-BBN-004", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-004" },
  { id: 5, tglMasuk: "05/11/2024", r4r2: "R4", nopol: "B 5555 BBN", customer: "RUDI HARTONO", namaSesuaiBPKB: "RUDI HARTONO", jenisPengurusan: "BBN 2", jenisBayar: "Transfer", tglUangMasuk: "06/11/2024", uangMasuk: 5700000, bank: "BRI", uangKeluar: 3900000, tglUangKeluar: "07/11/2024", uangKeluarDari: "Kas Kantor", profit: 1800000, status: "Selesai", noInvoice: "INV-BBN-005", tglInvoice: "05/11/2024", tandaTerima: "TT-BBN-005", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-005" },
  { id: 6, tglMasuk: "06/11/2024", r4r2: "R2", nopol: "D 6666 BBN", customer: "MAYA SARI", namaSesuaiBPKB: "MAYA SARI", jenisPengurusan: "BBN 1", jenisBayar: "Cash", tglUangMasuk: "07/11/2024", uangMasuk: 5950000, bank: "Cash", uangKeluar: 4150000, tglUangKeluar: "08/11/2024", uangKeluarDari: "Kas Kantor", profit: 1800000, status: "Selesai", noInvoice: "INV-BBN-006", tglInvoice: "06/11/2024", tandaTerima: "TT-BBN-006", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-006" },
  { id: 7, tglMasuk: "07/11/2024", r4r2: "R4", nopol: "F 7777 BBN", customer: "TONO SUSANTO", namaSesuaiBPKB: "TONO SUSANTO", jenisPengurusan: "BBN 2", jenisBayar: "Transfer", tglUangMasuk: "08/11/2024", uangMasuk: 5600000, bank: "BCA", uangKeluar: 3850000, tglUangKeluar: "09/11/2024", uangKeluarDari: "Kas Kantor", profit: 1750000, status: "Proses", noInvoice: "INV-BBN-007", tglInvoice: "07/11/2024", tandaTerima: "-", bpkb: "Belum", statusBPKB: "Proses", ttbBPKB: "-" },
  { id: 8, tglMasuk: "08/11/2024", r4r2: "R2", nopol: "B 8888 BBN", customer: "CITRA DEWI", namaSesuaiBPKB: "CITRA DEWI", jenisPengurusan: "BBN 1", jenisBayar: "Transfer", tglUangMasuk: "09/11/2024", uangMasuk: 6050000, bank: "Mandiri", uangKeluar: 4200000, tglUangKeluar: "10/11/2024", uangKeluarDari: "Kas Kantor", profit: 1850000, status: "Selesai", noInvoice: "INV-BBN-008", tglInvoice: "08/11/2024", tandaTerima: "TT-BBN-008", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-008" },
  { id: 9, tglMasuk: "09/11/2024", r4r2: "R4", nopol: "D 9999 BBN", customer: "ANDI WIJAYA", namaSesuaiBPKB: "ANDI WIJAYA", jenisPengurusan: "BBN 2", jenisBayar: "Cash", tglUangMasuk: "10/11/2024", uangMasuk: 5650000, bank: "Cash", uangKeluar: 3900000, tglUangKeluar: "11/11/2024", uangKeluarDari: "Kas Kantor", profit: 1750000, status: "Selesai", noInvoice: "INV-BBN-009", tglInvoice: "09/11/2024", tandaTerima: "TT-BBN-009", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-009" },
  { id: 10, tglMasuk: "10/11/2024", r4r2: "R2", nopol: "F 1010 BBN", customer: "DEWI LESTARI", namaSesuaiBPKB: "DEWI LESTARI", jenisPengurusan: "BBN 1", jenisBayar: "Transfer", tglUangMasuk: "11/11/2024", uangMasuk: 6000000, bank: "BRI", uangKeluar: 4200000, tglUangKeluar: "12/11/2024", uangKeluarDari: "Kas Kantor", profit: 1800000, status: "Selesai", noInvoice: "INV-BBN-010", tglInvoice: "10/11/2024", tandaTerima: "TT-BBN-010", bpkb: "Ada", statusBPKB: "Selesai", ttbBPKB: "TTB-BBN-010" },
];

const perpanjanganPajakData = [
  { id: 1, tglMasuk: "01/11/2024", r4r2: "R2", nopol: "B 1111 PJK", customer: "AHMAD RIZKI", namaSesuaiBPKB: "AHMAD RIZKI", jenisPengurusan: "Pajak Tahunan", jenisBayar: "Transfer", tglUangMasuk: "02/11/2024", uangMasuk: 1500000, bank: "BCA", uangKeluar: 800000, tglUangKeluar: "03/11/2024", uangKeluarDari: "Kas Messenger", profit: 700000, status: "Selesai", noInvoice: "INV-PJK-001", tglInvoice: "01/11/2024", tandaTerima: "TT-PJK-001" },
  { id: 2, tglMasuk: "02/11/2024", r4r2: "R4", nopol: "D 2222 PJK", customer: "RUDI HARTONO", namaSesuaiBPKB: "RUDI HARTONO", jenisPengurusan: "Pajak Tahunan", jenisBayar: "Cash", tglUangMasuk: "03/11/2024", uangMasuk: 1200000, bank: "Cash", uangKeluar: 600000, tglUangKeluar: "04/11/2024", uangKeluarDari: "Kas Messenger", profit: 600000, status: "Selesai", noInvoice: "INV-PJK-002", tglInvoice: "02/11/2024", tandaTerima: "TT-PJK-002" },
  { id: 3, tglMasuk: "03/11/2024", r4r2: "R2", nopol: "F 3333 PJK", customer: "MAYA SARI", namaSesuaiBPKB: "MAYA SARI", jenisPengurusan: "Pajak 5 Tahunan", jenisBayar: "Transfer", tglUangMasuk: "04/11/2024", uangMasuk: 2500000, bank: "Mandiri", uangKeluar: 1800000, tglUangKeluar: "05/11/2024", uangKeluarDari: "Kas Messenger", profit: 700000, status: "Proses", noInvoice: "INV-PJK-003", tglInvoice: "03/11/2024", tandaTerima: "-" },
  { id: 4, tglMasuk: "04/11/2024", r4r2: "R4", nopol: "B 4444 PJK", customer: "LINDA PERMATA", namaSesuaiBPKB: "LINDA PERMATA", jenisPengurusan: "Perpanjangan STNK", jenisBayar: "Transfer", tglUangMasuk: "05/11/2024", uangMasuk: 1400000, bank: "BRI", uangKeluar: 750000, tglUangKeluar: "06/11/2024", uangKeluarDari: "Kas Messenger", profit: 650000, status: "Selesai", noInvoice: "INV-PJK-004", tglInvoice: "04/11/2024", tandaTerima: "TT-PJK-004" },
  { id: 5, tglMasuk: "05/11/2024", r4r2: "R2", nopol: "D 5555 PJK", customer: "HENDRA WIJAYA", namaSesuaiBPKB: "HENDRA WIJAYA", jenisPengurusan: "Pajak 5 Tahunan", jenisBayar: "Transfer", tglUangMasuk: "06/11/2024", uangMasuk: 2800000, bank: "BCA", uangKeluar: 2000000, tglUangKeluar: "07/11/2024", uangKeluarDari: "Kas Messenger", profit: 800000, status: "Selesai", noInvoice: "INV-PJK-005", tglInvoice: "05/11/2024", tandaTerima: "TT-PJK-005" },
  { id: 6, tglMasuk: "06/11/2024", r4r2: "R4", nopol: "F 6666 PJK", customer: "PUTRI AMANDA", namaSesuaiBPKB: "PUTRI AMANDA", jenisPengurusan: "Pajak Tahunan", jenisBayar: "Cash", tglUangMasuk: "07/11/2024", uangMasuk: 1350000, bank: "Cash", uangKeluar: 680000, tglUangKeluar: "08/11/2024", uangKeluarDari: "Kas Messenger", profit: 670000, status: "Selesai", noInvoice: "INV-PJK-006", tglInvoice: "06/11/2024", tandaTerima: "TT-PJK-006" },
  { id: 7, tglMasuk: "07/11/2024", r4r2: "R2", nopol: "B 7777 PJK", customer: "TONO SUSANTO", namaSesuaiBPKB: "TONO SUSANTO", jenisPengurusan: "Perpanjangan STNK", jenisBayar: "Transfer", tglUangMasuk: "08/11/2024", uangMasuk: 1450000, bank: "Mandiri", uangKeluar: 780000, tglUangKeluar: "09/11/2024", uangKeluarDari: "Kas Messenger", profit: 670000, status: "Proses", noInvoice: "INV-PJK-007", tglInvoice: "07/11/2024", tandaTerima: "-" },
  { id: 8, tglMasuk: "08/11/2024", r4r2: "R4", nopol: "D 8888 PJK", customer: "CITRA DEWI", namaSesuaiBPKB: "CITRA DEWI", jenisPengurusan: "Pajak 5 Tahunan", jenisBayar: "Transfer", tglUangMasuk: "09/11/2024", uangMasuk: 2600000, bank: "BRI", uangKeluar: 1850000, tglUangKeluar: "10/11/2024", uangKeluarDari: "Kas Messenger", profit: 750000, status: "Selesai", noInvoice: "INV-PJK-008", tglInvoice: "08/11/2024", tandaTerima: "TT-PJK-008" },
  { id: 9, tglMasuk: "09/11/2024", r4r2: "R2", nopol: "F 9999 PJK", customer: "ANDI WIJAYA", namaSesuaiBPKB: "ANDI WIJAYA", jenisPengurusan: "Pajak Tahunan", jenisBayar: "Cash", tglUangMasuk: "10/11/2024", uangMasuk: 1300000, bank: "Cash", uangKeluar: 650000, tglUangKeluar: "11/11/2024", uangKeluarDari: "Kas Messenger", profit: 650000, status: "Selesai", noInvoice: "INV-PJK-009", tglInvoice: "09/11/2024", tandaTerima: "TT-PJK-009" },
  { id: 10, tglMasuk: "10/11/2024", r4r2: "R4", nopol: "B 1010 PJK", customer: "DEWI LESTARI", namaSesuaiBPKB: "DEWI LESTARI", jenisPengurusan: "Perpanjangan STNK", jenisBayar: "Transfer", tglUangMasuk: "11/11/2024", uangMasuk: 1500000, bank: "BCA", uangKeluar: 800000, tglUangKeluar: "12/11/2024", uangKeluarDari: "Kas Messenger", profit: 700000, status: "Selesai", noInvoice: "INV-PJK-010", tglInvoice: "10/11/2024", tandaTerima: "TT-PJK-010" },
];

const lainnyaData = [
  { id: 1, tglMasuk: "01/11/2024", r4r2: "R4", nopol: "D 1111 LLL", customer: "DEWI LESTARI", namaSesuaiBPKB: "DEWI LESTARI", jenisPengurusan: "Duplikat STNK", jenisBayar: "Cash", tglUangMasuk: "02/11/2024", uangMasuk: 800000, bank: "Cash", uangKeluar: 500000, tglUangKeluar: "03/11/2024", uangKeluarDari: "Kas Messenger", profit: 300000, status: "Selesai", noInvoice: "INV-LLL-001", tglInvoice: "01/11/2024", tandaTerima: "TT-LLL-001" },
  { id: 2, tglMasuk: "02/11/2024", r4r2: "R2", nopol: "F 2222 LLL", customer: "TONO SUSANTO", namaSesuaiBPKB: "TONO SUSANTO", jenisPengurusan: "Ganti Plat", jenisBayar: "Transfer", tglUangMasuk: "03/11/2024", uangMasuk: 900000, bank: "Mandiri", uangKeluar: 550000, tglUangKeluar: "04/11/2024", uangKeluarDari: "Kas Messenger", profit: 350000, status: "Selesai", noInvoice: "INV-LLL-002", tglInvoice: "02/11/2024", tandaTerima: "TT-LLL-002" },
  { id: 3, tglMasuk: "03/11/2024", r4r2: "R4", nopol: "B 3333 LLL", customer: "LINDA PERMATA", namaSesuaiBPKB: "LINDA PERMATA", jenisPengurusan: "Duplikat BPKB", jenisBayar: "Transfer", tglUangMasuk: "04/11/2024", uangMasuk: 1200000, bank: "BCA", uangKeluar: 850000, tglUangKeluar: "05/11/2024", uangKeluarDari: "Kas Messenger", profit: 350000, status: "Proses", noInvoice: "INV-LLL-003", tglInvoice: "03/11/2024", tandaTerima: "-" },
  { id: 4, tglMasuk: "04/11/2024", r4r2: "R2", nopol: "D 4444 LLL", customer: "HENDRA WIJAYA", namaSesuaiBPKB: "HENDRA WIJAYA", jenisPengurusan: "Ganti Plat", jenisBayar: "Cash", tglUangMasuk: "05/11/2024", uangMasuk: 950000, bank: "Cash", uangKeluar: 600000, tglUangKeluar: "06/11/2024", uangKeluarDari: "Kas Messenger", profit: 350000, status: "Selesai", noInvoice: "INV-LLL-004", tglInvoice: "04/11/2024", tandaTerima: "TT-LLL-004" },
  { id: 5, tglMasuk: "05/11/2024", r4r2: "R4", nopol: "F 5555 LLL", customer: "PUTRI AMANDA", namaSesuaiBPKB: "PUTRI AMANDA", jenisPengurusan: "Duplikat STNK", jenisBayar: "Transfer", tglUangMasuk: "06/11/2024", uangMasuk: 850000, bank: "BRI", uangKeluar: 520000, tglUangKeluar: "07/11/2024", uangKeluarDari: "Kas Messenger", profit: 330000, status: "Selesai", noInvoice: "INV-LLL-005", tglInvoice: "05/11/2024", tandaTerima: "TT-LLL-005" },
  { id: 6, tglMasuk: "06/11/2024", r4r2: "R2", nopol: "B 6666 LLL", customer: "RUDI HARTONO", namaSesuaiBPKB: "RUDI HARTONO", jenisPengurusan: "Ganti Nama STNK", jenisBayar: "Transfer", tglUangMasuk: "07/11/2024", uangMasuk: 1000000, bank: "Mandiri", uangKeluar: 650000, tglUangKeluar: "08/11/2024", uangKeluarDari: "Kas Messenger", profit: 350000, status: "Selesai", noInvoice: "INV-LLL-006", tglInvoice: "06/11/2024", tandaTerima: "TT-LLL-006" },
  { id: 7, tglMasuk: "07/11/2024", r4r2: "R4", nopol: "D 7777 LLL", customer: "MAYA SARI", namaSesuaiBPKB: "MAYA SARI", jenisPengurusan: "Ganti Plat", jenisBayar: "Cash", tglUangMasuk: "08/11/2024", uangMasuk: 920000, bank: "Cash", uangKeluar: 580000, tglUangKeluar: "09/11/2024", uangKeluarDari: "Kas Messenger", profit: 340000, status: "Proses", noInvoice: "INV-LLL-007", tglInvoice: "07/11/2024", tandaTerima: "-" },
  { id: 8, tglMasuk: "08/11/2024", r4r2: "R2", nopol: "F 8888 LLL", customer: "TONO SUSANTO", namaSesuaiBPKB: "TONO SUSANTO", jenisPengurusan: "Duplikat STNK", jenisBayar: "Transfer", tglUangMasuk: "09/11/2024", uangMasuk: 880000, bank: "BCA", uangKeluar: 540000, tglUangKeluar: "10/11/2024", uangKeluarDari: "Kas Messenger", profit: 340000, status: "Selesai", noInvoice: "INV-LLL-008", tglInvoice: "08/11/2024", tandaTerima: "TT-LLL-008" },
  { id: 9, tglMasuk: "09/11/2024", r4r2: "R4", nopol: "B 9999 LLL", customer: "CITRA DEWI", namaSesuaiBPKB: "CITRA DEWI", jenisPengurusan: "Ganti Plat Hilang", jenisBayar: "Transfer", tglUangMasuk: "10/11/2024", uangMasuk: 1100000, bank: "BRI", uangKeluar: 750000, tglUangKeluar: "11/11/2024", uangKeluarDari: "Kas Messenger", profit: 350000, status: "Selesai", noInvoice: "INV-LLL-009", tglInvoice: "09/11/2024", tandaTerima: "TT-LLL-009" },
  { id: 10, tglMasuk: "10/11/2024", r4r2: "R2", nopol: "D 1010 LLL", customer: "ANDI WIJAYA", namaSesuaiBPKB: "ANDI WIJAYA", jenisPengurusan: "Duplikat STNK", jenisBayar: "Cash", tglUangMasuk: "11/11/2024", uangMasuk: 820000, bank: "Cash", uangKeluar: 500000, tglUangKeluar: "12/11/2024", uangKeluarDari: "Kas Messenger", profit: 320000, status: "Selesai", noInvoice: "INV-LLL-010", tglInvoice: "10/11/2024", tandaTerima: "TT-LLL-010" },
];

export function DataPenjualan() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = (format: 'csv' | 'pdf', tabName: string) => {
    toast.success(`Export ${format.toUpperCase()} untuk ${tabName} berhasil!`);
  };

  const handleAdd = (tabName: string) => {
    toast.info(`Form tambah data ${tabName} akan dibuka`);
  };

  const handleEdit = (item: any, tabName: string) => {
    toast.info(`Edit data ${tabName}: ${item.customer}`);
  };

  const handleDelete = (item: any, tabName: string) => {
    toast.error(`Data ${tabName} dihapus: ${item.customer}`);
  };

  const handleView = (item: any, tabName: string) => {
    toast.info(`View detail ${tabName}: ${item.noInvoice}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari berdasarkan nopol, customer, atau invoice..." 
            className="pl-10 bg-input-background border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="mutasi-ld" className="space-y-6">
        <ScrollArea className="w-full">
          <TabsList className="glass-card p-1 inline-flex w-max min-w-full gap-1">
            <TabsTrigger value="mutasi-ld" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Mutasi LD
            </TabsTrigger>
            <TabsTrigger value="mutasi-as" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Mutasi AS
            </TabsTrigger>
            <TabsTrigger value="bbn" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              BBN
            </TabsTrigger>
            <TabsTrigger value="perpanjangan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Perpanjangan
            </TabsTrigger>
            <TabsTrigger value="lainnya" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Lain-lain
            </TabsTrigger>
            <TabsTrigger value="belum-kurang-bayar" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Belum & Kurang Bayar
            </TabsTrigger>
            <TabsTrigger value="profit-pending" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Profit Terpending
            </TabsTrigger>
            <TabsTrigger value="cashback-pending" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
              Cashback Terpending
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="mutasi-ld">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Mutasi LD</h3>
            <EnhancedTable
              columns={[
                { key: "tglMasuk", label: "Tgl Masuk" },
                { key: "r4r2", label: "R4/R2" },
                { key: "nopol", label: "Plat No" },
                { key: "customer", label: "Customer" },
                { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
                { key: "jenisPengurusan", label: "Jenis" },
                { key: "jenisBayar", label: "Bayar" },
                { key: "tglUangMasuk", label: "Tgl Masuk" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "bank", label: "Bank" },
                { key: "uangKeluar", label: "Uang Keluar" },
                { key: "tglUangKeluar", label: "Tgl Keluar" },
                { key: "uangKeluarDari", label: "Dari" },
                { key: "profit", label: "Profit" },
                { key: "status", label: "Status" },
                { key: "noInvoice", label: "Invoice" },
                { key: "bpkb", label: "BPKB" },
                { key: "statusBPKB", label: "Status BPKB" },
                { key: "ttbBPKB", label: "TTB BPKB" },
              ]}
              data={mutasiLDData}
              onAdd={() => handleAdd("Mutasi LD")}
              onEdit={(item) => handleEdit(item, "Mutasi LD")}
              onDelete={(item) => handleDelete(item, "Mutasi LD")}
              onView={(item) => handleView(item, "Mutasi LD")}
              onExport={(format) => handleExport(format, "Mutasi LD")}
              searchPlaceholder="Cari data Mutasi LD..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="mutasi-as">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Mutasi AS</h3>
            <EnhancedTable
              columns={[
                { key: "tglMasuk", label: "Tgl Masuk" },
                { key: "r4r2", label: "R4/R2" },
                { key: "nopol", label: "Plat No" },
                { key: "customer", label: "Customer" },
                { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
                { key: "jenisPengurusan", label: "Jenis" },
                { key: "jenisBayar", label: "Bayar" },
                { key: "tglUangMasuk", label: "Tgl Masuk" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "bank", label: "Bank" },
                { key: "uangKeluar", label: "Uang Keluar" },
                { key: "tglUangKeluar", label: "Tgl Keluar" },
                { key: "uangKeluarDari", label: "Dari" },
                { key: "profit", label: "Profit" },
                { key: "status", label: "Status" },
                { key: "noInvoice", label: "Invoice" },
                { key: "bpkb", label: "BPKB" },
                { key: "statusBPKB", label: "Status BPKB" },
                { key: "ttbBPKB", label: "TTB BPKB" },
              ]}
              data={mutasiASData}
              onAdd={() => handleAdd("Mutasi AS")}
              onEdit={(item) => handleEdit(item, "Mutasi AS")}
              onDelete={(item) => handleDelete(item, "Mutasi AS")}
              onView={(item) => handleView(item, "Mutasi AS")}
              onExport={(format) => handleExport(format, "Mutasi AS")}
              searchPlaceholder="Cari data Mutasi AS..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="bbn">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel BBN</h3>
            <EnhancedTable
              columns={[
                { key: "tglMasuk", label: "Tgl Masuk" },
                { key: "r4r2", label: "R4/R2" },
                { key: "nopol", label: "Plat No" },
                { key: "customer", label: "Customer" },
                { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
                { key: "jenisPengurusan", label: "Jenis" },
                { key: "jenisBayar", label: "Bayar" },
                { key: "tglUangMasuk", label: "Tgl Masuk" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "bank", label: "Bank" },
                { key: "uangKeluar", label: "Uang Keluar" },
                { key: "tglUangKeluar", label: "Tgl Keluar" },
                { key: "uangKeluarDari", label: "Dari" },
                { key: "profit", label: "Profit" },
                { key: "status", label: "Status" },
                { key: "noInvoice", label: "Invoice" },
                { key: "bpkb", label: "BPKB" },
                { key: "statusBPKB", label: "Status BPKB" },
                { key: "ttbBPKB", label: "TTB BPKB" },
              ]}
              data={bbnData}
              onAdd={() => handleAdd("BBN")}
              onEdit={(item) => handleEdit(item, "BBN")}
              onDelete={(item) => handleDelete(item, "BBN")}
              onView={(item) => handleView(item, "BBN")}
              onExport={(format) => handleExport(format, "BBN")}
              searchPlaceholder="Cari data BBN..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="perpanjangan">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Perpanjangan Pajak</h3>
            <EnhancedTable
              columns={[
                { key: "tglMasuk", label: "Tgl Masuk" },
                { key: "r4r2", label: "R4/R2" },
                { key: "nopol", label: "Plat No" },
                { key: "customer", label: "Customer" },
                { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
                { key: "jenisPengurusan", label: "Jenis" },
                { key: "jenisBayar", label: "Bayar" },
                { key: "tglUangMasuk", label: "Tgl Masuk" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "bank", label: "Bank" },
                { key: "uangKeluar", label: "Uang Keluar" },
                { key: "tglUangKeluar", label: "Tgl Keluar" },
                { key: "uangKeluarDari", label: "Dari" },
                { key: "profit", label: "Profit" },
                { key: "status", label: "Status" },
                { key: "noInvoice", label: "Invoice" },
                { key: "tandaTerima", label: "TTB" },
              ]}
              data={perpanjanganPajakData}
              onAdd={() => handleAdd("Perpanjangan Pajak")}
              onEdit={(item) => handleEdit(item, "Perpanjangan Pajak")}
              onDelete={(item) => handleDelete(item, "Perpanjangan Pajak")}
              onView={(item) => handleView(item, "Perpanjangan Pajak")}
              onExport={(format) => handleExport(format, "Perpanjangan Pajak")}
              searchPlaceholder="Cari data Perpanjangan..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="lainnya">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Lain-lain</h3>
            <EnhancedTable
              columns={[
                { key: "tglMasuk", label: "Tgl Masuk" },
                { key: "r4r2", label: "R4/R2" },
                { key: "nopol", label: "Plat No" },
                { key: "customer", label: "Customer" },
                { key: "namaSesuaiBPKB", label: "Nama BPKB/STNK" },
                { key: "jenisPengurusan", label: "Jenis" },
                { key: "jenisBayar", label: "Bayar" },
                { key: "tglUangMasuk", label: "Tgl Masuk" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "bank", label: "Bank" },
                { key: "uangKeluar", label: "Uang Keluar" },
                { key: "tglUangKeluar", label: "Tgl Keluar" },
                { key: "uangKeluarDari", label: "Dari" },
                { key: "profit", label: "Profit" },
                { key: "status", label: "Status" },
                { key: "noInvoice", label: "Invoice" },
                { key: "tandaTerima", label: "TTB" },
              ]}
              data={lainnyaData}
              onAdd={() => handleAdd("Lain-lain")}
              onEdit={(item) => handleEdit(item, "Lain-lain")}
              onDelete={(item) => handleDelete(item, "Lain-lain")}
              onView={(item) => handleView(item, "Lain-lain")}
              onExport={(format) => handleExport(format, "Lain-lain")}
              searchPlaceholder="Cari data lain-lain..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="belum-kurang-bayar">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Belum & Kurang Bayar</h3>
            <EnhancedTable
              columns={[
                { key: "tanggal", label: "Tanggal" },
                { key: "customer", label: "Customer" },
                { key: "nopol", label: "Nopol" },
                { key: "pengurusan", label: "Pengurusan" },
                { key: "totalTagihan", label: "Total Tagihan" },
                { key: "terbayar", label: "Terbayar" },
                { key: "kurangBayar", label: "Kurang Bayar" },
                { key: "status", label: "Status" },
                { key: "invoice", label: "Invoice" },
              ]}
              data={initialBelumBayarData}
              onAdd={() => handleAdd("Belum & Kurang Bayar")}
              onEdit={(item) => handleEdit(item, "Belum & Kurang Bayar")}
              onDelete={(item) => handleDelete(item, "Belum & Kurang Bayar")}
              onView={(item) => handleView(item, "Belum & Kurang Bayar")}
              onExport={(format) => handleExport(format, "Belum & Kurang Bayar")}
              searchPlaceholder="Cari data belum & kurang bayar..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="profit-pending">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Profit Terpending</h3>
            <EnhancedTable
              columns={[
                { key: "tanggal", label: "Tanggal" },
                { key: "customer", label: "Customer" },
                { key: "nopol", label: "Nopol" },
                { key: "pengurusan", label: "Pengurusan" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "biayaSamsat", label: "Biaya Samsat" },
                { key: "profit", label: "Profit" },
                { key: "statusProfit", label: "Status Profit" },
                { key: "alasanPending", label: "Alasan Pending" },
                { key: "invoice", label: "Invoice" },
              ]}
              data={initialProfitPendingData}
              onAdd={() => handleAdd("Profit Terpending")}
              onEdit={(item) => handleEdit(item, "Profit Terpending")}
              onDelete={(item) => handleDelete(item, "Profit Terpending")}
              onView={(item) => handleView(item, "Profit Terpending")}
              onExport={(format) => handleExport(format, "Profit Terpending")}
              searchPlaceholder="Cari data profit terpending..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="cashback-pending">
          <Card className="glass-card p-6">
            <h3 className="text-lg mb-4">Tabel Cashback Terpending</h3>
            <EnhancedTable
              columns={[
                { key: "tanggal", label: "Tanggal" },
                { key: "customer", label: "Customer" },
                { key: "nopol", label: "Nopol" },
                { key: "pengurusan", label: "Pengurusan" },
                { key: "uangMasuk", label: "Uang Masuk" },
                { key: "profit", label: "Profit" },
                { key: "cashbackPersen", label: "Cashback %" },
                { key: "jumlahCashback", label: "Jumlah Cashback" },
                { key: "statusCashback", label: "Status Cashback" },
                { key: "invoice", label: "Invoice" },
              ]}
              data={initialCashbackPendingData}
              onAdd={() => handleAdd("Cashback Terpending")}
              onEdit={(item) => handleEdit(item, "Cashback Terpending")}
              onDelete={(item) => handleDelete(item, "Cashback Terpending")}
              onView={(item) => handleView(item, "Cashback Terpending")}
              onExport={(format) => handleExport(format, "Cashback Terpending")}
              searchPlaceholder="Cari data cashback terpending..."
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
