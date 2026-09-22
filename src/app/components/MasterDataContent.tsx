import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { BiayaLayanan } from "./BiayaLayanan";
import { ManajemenPengguna } from "./ManajemenPengguna";
import { HargaDasarSamsat } from "./HargaDasarSamsat";
import { EnhancedTable } from "./EnhancedTable";
import { toast } from "sonner";

const initialSamsatData = [
  { id: 1, nama: "Samsat Jakarta Timur", alamat: "Jl. Raya Pondok Gede", wilayah: "Jakarta Timur" },
  { id: 2, nama: "Samsat Jakarta Barat", alamat: "Jl. Daan Mogot", wilayah: "Jakarta Barat" },
  { id: 3, nama: "Samsat Depok", alamat: "Jl. Margonda Raya", wilayah: "Depok" },
  { id: 4, nama: "Samsat Jakarta Selatan", alamat: "Jl. TB Simatupang", wilayah: "Jakarta Selatan" },
  { id: 5, nama: "Samsat Jakarta Utara", alamat: "Jl. Yos Sudarso", wilayah: "Jakarta Utara" },
  { id: 6, nama: "Samsat Bekasi", alamat: "Jl. Ahmad Yani", wilayah: "Bekasi" },
  { id: 7, nama: "Samsat Tangerang", alamat: "Jl. Gatot Subroto", wilayah: "Tangerang" },
];

const initialKaryawanData = [
  {
    id: 1, nama: "Siti Nurhaliza", jabatan: "ADMIN", wilayah: "Jakarta Timur", status: "Aktif",
    noHp: "081234567893", email: "siti@email.com", jenisKelamin: "Perempuan",
    alamat: "Jl. Melati No. 123, Jakarta Timur", gajiPokok: 5000000, tanggalBergabung: "2023-01-15"
  },
  {
    id: 2, nama: "Andi Wijaya", jabatan: "FINANCE", wilayah: "Jakarta Selatan", status: "Aktif",
    noHp: "081234567894", email: "andi@email.com", jenisKelamin: "Laki-laki",
    alamat: "Jl. Mawar No. 45, Jakarta Selatan", gajiPokok: 7000000, tanggalBergabung: "2022-06-10"
  },
  {
    id: 3, nama: "Dewi Lestari", jabatan: "CLILEN", wilayah: "Depok", status: "Aktif",
    noHp: "081234567895", email: "dewi@email.com", jenisKelamin: "Perempuan",
    alamat: "Jl. Anggrek No. 78, Depok", gajiPokok: 5500000, tanggalBergabung: "2023-03-20"
  },
  {
    id: 4, nama: "Budi Santoso", jabatan: "SVP", wilayah: "Jakarta Barat", status: "Aktif",
    noHp: "081234567896", email: "budi@email.com", jenisKelamin: "Laki-laki",
    alamat: "Jl. Kenanga No. 12, Jakarta Barat", gajiPokok: 8500000, tanggalBergabung: "2021-09-05"
  },
  {
    id: 5, nama: "Maya Safitri", jabatan: "ADMIN", wilayah: "Bekasi", status: "Aktif",
    noHp: "081234567897", email: "maya@email.com", jenisKelamin: "Perempuan",
    alamat: "Jl. Dahlia No. 90, Bekasi", gajiPokok: 4800000, tanggalBergabung: "2023-07-12"
  },
  {
    id: 6, nama: "Rudi Hartono", jabatan: "MESSENGER", wilayah: "Jakarta Timur", status: "Aktif",
    noHp: "081234567898", email: "rudi@email.com", jenisKelamin: "Laki-laki",
    alamat: "Jl. Melati Jaya No. 34, Jakarta Timur", gajiPokok: 4500000, tanggalBergabung: "2023-02-10"
  },
  {
    id: 7, nama: "Joko Prasetyo", jabatan: "MESSENGER", wilayah: "Bekasi", status: "Aktif",
    noHp: "081234567899", email: "joko@email.com", jenisKelamin: "Laki-laki",
    alamat: "Jl. Raya Bekasi No. 56, Bekasi", gajiPokok: 4500000, tanggalBergabung: "2023-05-20"
  },
];

const wilayahOptions = [
  "Jakarta Timur", "Jakarta Barat", "Jakarta Selatan",
  "Jakarta Utara", "Jakarta Pusat", "Depok", "Bekasi", "Tangerang", "Bogor",
];

interface MasterDataContentProps {
  tab: string;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function MasterDataContent({ tab }: MasterDataContentProps) {
  const [samsatData, setSamsatData] = useState(initialSamsatData);
  const [karyawanData, setKaryawanData] = useState(initialKaryawanData);

  const [isAddSamsatOpen, setIsAddSamsatOpen] = useState(false);
  const [isEditSamsatOpen, setIsEditSamsatOpen] = useState(false);
  const [isDeleteSamsatOpen, setIsDeleteSamsatOpen] = useState(false);
  const [selectedSamsat, setSelectedSamsat] = useState<any>(null);

  const [isAddKaryawanOpen, setIsAddKaryawanOpen] = useState(false);
  const [isEditKaryawanOpen, setIsEditKaryawanOpen] = useState(false);
  const [isDeleteKaryawanOpen, setIsDeleteKaryawanOpen] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<any>(null);

  const [samsatForm, setSamsatForm] = useState({ nama: "", alamat: "", wilayah: "" });
  const [karyawanForm, setKaryawanForm] = useState({
    nama: "", jabatan: "", email: "", wilayah: "", noHp: "", status: "Aktif",
    jenisKelamin: "", alamat: "", gajiPokok: "", tanggalBergabung: ""
  });

  // Samsat handlers
  const handleAddSamsat = () => {
    if (!samsatForm.nama || !samsatForm.alamat || !samsatForm.wilayah) {
      toast.error("Harap lengkapi semua field!");
      return;
    }
    const newId = Math.max(...samsatData.map(s => s.id), 0) + 1;
    setSamsatData([...samsatData, { ...samsatForm, id: newId }]);
    setSamsatForm({ nama: "", alamat: "", wilayah: "" });
    setIsAddSamsatOpen(false);
    toast.success("Data samsat berhasil ditambahkan!");
  };

  const handleEditSamsat = () => {
    if (!samsatForm.nama || !samsatForm.alamat || !samsatForm.wilayah) {
      toast.error("Harap lengkapi semua field!");
      return;
    }
    setSamsatData(samsatData.map(item =>
      item.id === selectedSamsat.id ? { ...item, ...samsatForm } : item
    ));
    setIsEditSamsatOpen(false);
    toast.success("Data samsat berhasil diupdate!");
  };

  const handleDeleteSamsat = () => {
    setSamsatData(samsatData.filter(item => item.id !== selectedSamsat.id));
    setIsDeleteSamsatOpen(false);
    toast.success("Data samsat berhasil dihapus!");
  };

  // Karyawan handlers
  const handleAddKaryawan = () => {
    if (!karyawanForm.nama || !karyawanForm.jabatan || !karyawanForm.email) {
      toast.error("Harap lengkapi field wajib!");
      return;
    }
    const newId = Math.max(...karyawanData.map(k => k.id), 0) + 1;
    setKaryawanData([...karyawanData, {
      ...karyawanForm,
      id: newId,
      gajiPokok: parseInt(karyawanForm.gajiPokok) || 0
    }]);
    setKaryawanForm({
      nama: "", jabatan: "", email: "", wilayah: "", noHp: "", status: "Aktif",
      jenisKelamin: "", alamat: "", gajiPokok: "", tanggalBergabung: ""
    });
    setIsAddKaryawanOpen(false);
    toast.success("Data karyawan berhasil ditambahkan!");
  };

  const handleEditKaryawan = () => {
    if (!karyawanForm.nama || !karyawanForm.jabatan || !karyawanForm.email) {
      toast.error("Harap lengkapi field wajib!");
      return;
    }
    setKaryawanData(karyawanData.map(item =>
      item.id === selectedKaryawan.id
        ? { ...item, ...karyawanForm, gajiPokok: parseInt(karyawanForm.gajiPokok) || 0 }
        : item
    ));
    setIsEditKaryawanOpen(false);
    toast.success("Data karyawan berhasil diupdate!");
  };

  const handleDeleteKaryawan = () => {
    setKaryawanData(karyawanData.filter(item => item.id !== selectedKaryawan.id));
    setIsDeleteKaryawanOpen(false);
    toast.success("Data karyawan berhasil dihapus!");
  };

  // ─── Samsat Tab ───────────────────────────────────────────────────────────
  if (tab === "samsat") {
    return (
      <>
        <Card className="glass-card p-4">
          <EnhancedTable
            columns={[
              { key: "nama", label: "Nama Samsat" },
              { key: "alamat", label: "Alamat" },
              { key: "wilayah", label: "Wilayah" },
            ]}
            data={samsatData}
            onAdd={() => {
              setSamsatForm({ nama: "", alamat: "", wilayah: "" });
              setIsAddSamsatOpen(true);
            }}
            onEdit={(item) => {
              setSelectedSamsat(item);
              setSamsatForm({ nama: item.nama, alamat: item.alamat, wilayah: item.wilayah });
              setIsEditSamsatOpen(true);
            }}
            onDelete={(item) => {
              setSelectedSamsat(item);
              setIsDeleteSamsatOpen(true);
            }}
            onExport={(format) => toast.success(`Export ${format.toUpperCase()}`)}
            searchPlaceholder="Cari samsat..."
          />
        </Card>

        {/* Add Samsat */}
        <Dialog open={isAddSamsatOpen} onOpenChange={setIsAddSamsatOpen}>
          <DialogContent className="border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Samsat</DialogTitle>
              <DialogDescription>Tambahkan data samsat baru</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-3">
              <FormField label="Nama Samsat">
                <Input
                  className="bg-input-background border-border"
                  placeholder="Samsat Jakarta Timur"
                  value={samsatForm.nama}
                  onChange={(e) => setSamsatForm({ ...samsatForm, nama: e.target.value })}
                />
              </FormField>
              <FormField label="Alamat">
                <Input
                  className="bg-input-background border-border"
                  placeholder="Jl. Raya Pondok Gede"
                  value={samsatForm.alamat}
                  onChange={(e) => setSamsatForm({ ...samsatForm, alamat: e.target.value })}
                />
              </FormField>
              <FormField label="Wilayah">
                <Select value={samsatForm.wilayah} onValueChange={(v) => setSamsatForm({ ...samsatForm, wilayah: v })}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih wilayah" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayahOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddSamsatOpen(false)}>Batal</Button>
              <Button onClick={handleAddSamsat}>Tambah</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Samsat */}
        <Dialog open={isEditSamsatOpen} onOpenChange={setIsEditSamsatOpen}>
          <DialogContent className="border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Samsat</DialogTitle>
              <DialogDescription>Update data samsat</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-3">
              <FormField label="Nama Samsat">
                <Input
                  className="bg-input-background border-border"
                  value={samsatForm.nama}
                  onChange={(e) => setSamsatForm({ ...samsatForm, nama: e.target.value })}
                />
              </FormField>
              <FormField label="Alamat">
                <Input
                  className="bg-input-background border-border"
                  value={samsatForm.alamat}
                  onChange={(e) => setSamsatForm({ ...samsatForm, alamat: e.target.value })}
                />
              </FormField>
              <FormField label="Wilayah">
                <Select value={samsatForm.wilayah} onValueChange={(v) => setSamsatForm({ ...samsatForm, wilayah: v })}>
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayahOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditSamsatOpen(false)}>Batal</Button>
              <Button onClick={handleEditSamsat}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Samsat */}
        <AlertDialog open={isDeleteSamsatOpen} onOpenChange={setIsDeleteSamsatOpen}>
          <AlertDialogContent className="border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Samsat</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data samsat "{selectedSamsat?.nama}"? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSamsat} className="bg-red-500 hover:bg-red-600">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // ─── Karyawan Tab ─────────────────────────────────────────────────────────
  if (tab === "karyawan") {
    return (
      <>
        <Card className="glass-card p-4">
          <EnhancedTable
            columns={[
              { key: "nama", label: "Nama" },
              { key: "jabatan", label: "Jabatan" },
              { key: "email", label: "Email" },
              { key: "wilayah", label: "Wilayah" },
              { key: "noHp", label: "No. HP" },
              { key: "status", label: "Status" },
            ]}
            data={karyawanData}
            onAdd={() => {
              setKaryawanForm({
                nama: "", jabatan: "", email: "", wilayah: "", noHp: "", status: "Aktif",
                jenisKelamin: "", alamat: "", gajiPokok: "", tanggalBergabung: ""
              });
              setIsAddKaryawanOpen(true);
            }}
            onEdit={(item) => {
              setSelectedKaryawan(item);
              setKaryawanForm({
                nama: item.nama, jabatan: item.jabatan, email: item.email,
                wilayah: item.wilayah, noHp: item.noHp, status: item.status,
                jenisKelamin: item.jenisKelamin, alamat: item.alamat,
                gajiPokok: item.gajiPokok?.toString() || "",
                tanggalBergabung: item.tanggalBergabung
              });
              setIsEditKaryawanOpen(true);
            }}
            onDelete={(item) => {
              setSelectedKaryawan(item);
              setIsDeleteKaryawanOpen(true);
            }}
            onExport={(format) => toast.success(`Export ${format.toUpperCase()}`)}
            searchPlaceholder="Cari karyawan..."
          />
        </Card>

        {/* Add Karyawan */}
        <Dialog open={isAddKaryawanOpen} onOpenChange={setIsAddKaryawanOpen}>
          <DialogContent className="border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Karyawan</DialogTitle>
              <DialogDescription>Tambahkan data karyawan baru</DialogDescription>
            </DialogHeader>
            <KaryawanForm form={karyawanForm} onChange={setKaryawanForm} />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddKaryawanOpen(false)}>Batal</Button>
              <Button onClick={handleAddKaryawan}>Tambah</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Karyawan */}
        <Dialog open={isEditKaryawanOpen} onOpenChange={setIsEditKaryawanOpen}>
          <DialogContent className="border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Karyawan</DialogTitle>
              <DialogDescription>Update data karyawan</DialogDescription>
            </DialogHeader>
            <KaryawanForm form={karyawanForm} onChange={setKaryawanForm} />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditKaryawanOpen(false)}>Batal</Button>
              <Button onClick={handleEditKaryawan}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Karyawan */}
        <AlertDialog open={isDeleteKaryawanOpen} onOpenChange={setIsDeleteKaryawanOpen}>
          <AlertDialogContent className="border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Karyawan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data karyawan "{selectedKaryawan?.nama}"? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteKaryawan} className="bg-red-500 hover:bg-red-600">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (tab === "biaya-layanan") return <BiayaLayanan />;
  if (tab === "harga-dasar-samsat") return <HargaDasarSamsat />;
  if (tab === "pengguna") return <ManajemenPengguna />;

  return <div>Content not found</div>;
}

// ─── Karyawan form extracted to avoid duplication ─────────────────────────
type KaryawanFormData = {
  nama: string; jabatan: string; email: string; wilayah: string;
  noHp: string; status: string; jenisKelamin: string; alamat: string;
  gajiPokok: string; tanggalBergabung: string;
};

function KaryawanForm({ form, onChange }: {
  form: KaryawanFormData;
  onChange: (f: KaryawanFormData) => void;
}) {
  const set = (key: keyof KaryawanFormData) => (val: string) =>
    onChange({ ...form, [key]: val });

  const wilayahOpts = [
    "Jakarta Timur", "Jakarta Barat", "Jakarta Selatan",
    "Jakarta Utara", "Jakarta Pusat", "Depok", "Bekasi", "Tangerang",
  ];

  return (
    <div className="space-y-3 mt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Nama Lengkap *</Label>
          <Input
            className="bg-input-background border-border"
            placeholder="Nama karyawan"
            value={form.nama}
            onChange={(e) => set("nama")(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Jenis Kelamin</Label>
          <Select value={form.jenisKelamin} onValueChange={set("jenisKelamin")}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Jabatan *</Label>
          <Select value={form.jabatan} onValueChange={set("jabatan")}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Pilih jabatan" />
            </SelectTrigger>
            <SelectContent>
              {["ADMIN", "SVP", "FINANCE", "CLILEN", "MESSENGER"].map(j => (
                <SelectItem key={j} value={j}>{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Wilayah</Label>
          <Select value={form.wilayah} onValueChange={set("wilayah")}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Pilih wilayah" />
            </SelectTrigger>
            <SelectContent>
              {wilayahOpts.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Email *</Label>
          <Input
            className="bg-input-background border-border"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>No. HP</Label>
          <Input
            className="bg-input-background border-border"
            placeholder="081234567890"
            value={form.noHp}
            onChange={(e) => set("noHp")(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Alamat</Label>
        <Input
          className="bg-input-background border-border"
          placeholder="Alamat lengkap"
          value={form.alamat}
          onChange={(e) => set("alamat")(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Gaji Pokok</Label>
          <Input
            className="bg-input-background border-border"
            type="number"
            placeholder="5000000"
            value={form.gajiPokok}
            onChange={(e) => set("gajiPokok")(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Tanggal Bergabung</Label>
          <Input
            className="bg-input-background border-border"
            type="date"
            value={form.tanggalBergabung}
            onChange={(e) => set("tanggalBergabung")(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={set("status")}>
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
