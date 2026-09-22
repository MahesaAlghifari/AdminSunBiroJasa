import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, MapPin, Calculator } from "lucide-react";
import { toast } from "sonner";

const layananOptions = [
  "Perpanjangan 1 Tahun",
  "Perpanjangan 5 Tahun",
  "Balik Nama",
  "Mutasi Antar Samsat",
  "Mutasi Luar Daerah"
];

const bulanOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export function BuatOrder() {
  const [newOrderData, setNewOrderData] = useState({
    namaPemilik: "",
    nomorHP: "",
    kepemilikanKendaraan: "",
    jenisKendaraan: "",
    tahunKendaraan: "",
    nopol: "",
    layanan: "",
    pkbBerlakuSd: "",
    tahunPajak: "",
    bulanPajak: "",
    nominalPkbTerakhir: "",
    nominalSwdkllj: "",
    kodePromo: "",
    wilayahSamsatAsal: "",
    wilayahSamsatTujuan: "",
    domisiliPengambilan: "",
    domisiliPengembalian: "",
    detailAlamatPengambilan: "",
    detailAlamatPengembalian: "",
  });

  const calculateCost = () => {
    const biayaJasa = 95000; // Antar Jemput + Biaya Jasa + Administrasi
    const pkb = parseFloat(newOrderData.nominalPkbTerakhir) || 0;
    const swdkllj = parseFloat(newOrderData.nominalSwdkllj) || 0;
    const dendaSwdkllj = 100000; // Denda SWDKLLJ
    
    const total = biayaJasa + pkb + swdkllj + dendaSwdkllj;
    
    return {
      biayaJasa,
      pkb,
      swdkllj,
      dendaSwdkllj,
      total
    };
  };

  const cost = calculateCost();

  const handleAddOrder = () => {
    // Validasi
    if (!newOrderData.namaPemilik || !newOrderData.nopol || !newOrderData.layanan) {
      toast.error("Mohon lengkapi data yang diperlukan!");
      return;
    }
    
    // Reset form
    setNewOrderData({
      namaPemilik: "",
      nomorHP: "",
      kepemilikanKendaraan: "",
      jenisKendaraan: "",
      tahunKendaraan: "",
      nopol: "",
      layanan: "",
      pkbBerlakuSd: "",
      tahunPajak: "",
      bulanPajak: "",
      nominalPkbTerakhir: "",
      nominalSwdkllj: "",
      kodePromo: "",
      wilayahSamsatAsal: "",
      wilayahSamsatTujuan: "",
      domisiliPengambilan: "",
      domisiliPengembalian: "",
      detailAlamatPengambilan: "",
      detailAlamatPengembalian: "",
    });
    
    toast.success("Order berhasil ditambahkan!");
  };

  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Buat Order Baru
        </h1>
        <p className="text-muted-foreground mt-1">Tambahkan order kendaraan baru</p>
      </motion.div>

      <Card className="glass-card p-4">
        <div className="space-y-4">
          {/* Pilih Layanan */}
          <div>
            <h4 className="mb-4">Pilih Layanan</h4>
            <Select
              value={newOrderData.layanan}
              onValueChange={(value) => setNewOrderData({...newOrderData, layanan: value})}
            >
              <SelectTrigger className="bg-input-background border-border">
                <SelectValue placeholder="Pilih jenis layanan" />
              </SelectTrigger>
              <SelectContent>
                {layananOptions.map((layanan) => (
                  <SelectItem key={layanan} value={layanan}>{layanan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Pemilik */}
          <div>
            <h4 className="mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Data Pemilik Kendaraan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Pemilik</Label>
                <Input
                  value={newOrderData.namaPemilik}
                  onChange={(e) => setNewOrderData({...newOrderData, namaPemilik: e.target.value})}
                  className="bg-input-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor HP</Label>
                <Input
                  value={newOrderData.nomorHP}
                  onChange={(e) => setNewOrderData({...newOrderData, nomorHP: e.target.value})}
                  className="bg-input-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Kepemilikan & Kendaraan */}
          <div>
            <h4 className="mb-4">Kepemilikan Kendaraan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kepemilikan</Label>
                <Select 
                  value={newOrderData.kepemilikanKendaraan}
                  onValueChange={(value) => setNewOrderData({...newOrderData, kepemilikanKendaraan: value})}
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih kepemilikan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pribadi">Pribadi</SelectItem>
                    <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jenis Kendaraan</Label>
                <Select
                  value={newOrderData.jenisKendaraan}
                  onValueChange={(value) => setNewOrderData({...newOrderData, jenisKendaraan: value})}
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Mobil">Mobil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data Kendaraan */}
          <div>
            <h4 className="mb-4">Data Kendaraan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun Kendaraan</Label>
                <Input
                  value={newOrderData.tahunKendaraan}
                  onChange={(e) => setNewOrderData({...newOrderData, tahunKendaraan: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor Polisi</Label>
                <Input
                  value={newOrderData.nopol}
                  onChange={(e) => setNewOrderData({...newOrderData, nopol: e.target.value})}
                  className="bg-input-background border-border font-mono"
                  placeholder="B 1234 ABC"
                />
              </div>
            </div>
          </div>

          {/* PKB & Pajak Info */}
          <div>
            <h4 className="mb-4">Informasi Pajak</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>PKB Berlaku S/D</Label>
                <Input
                  value={newOrderData.pkbBerlakuSd}
                  onChange={(e) => setNewOrderData({...newOrderData, pkbBerlakuSd: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="17-11-2023"
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun Pajak</Label>
                <Input
                  value={newOrderData.tahunPajak}
                  onChange={(e) => setNewOrderData({...newOrderData, tahunPajak: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="2023"
                />
              </div>
              <div className="space-y-2">
                <Label>Bulan Pajak</Label>
                <Select
                  value={newOrderData.bulanPajak}
                  onValueChange={(value) => setNewOrderData({...newOrderData, bulanPajak: value})}
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {bulanOptions.map((bulan) => (
                      <SelectItem key={bulan} value={bulan}>{bulan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nominal PKB Terakhir</Label>
                <Input
                  type="number"
                  value={newOrderData.nominalPkbTerakhir}
                  onChange={(e) => setNewOrderData({...newOrderData, nominalPkbTerakhir: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Nominal SWDKLLJ</Label>
                <Input
                  type="number"
                  value={newOrderData.nominalSwdkllj}
                  onChange={(e) => setNewOrderData({...newOrderData, nominalSwdkllj: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Promo</Label>
                <Input
                  value={newOrderData.kodePromo}
                  onChange={(e) => setNewOrderData({...newOrderData, kodePromo: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="PROMO2024"
                />
              </div>
            </div>
          </div>

          {/* Wilayah Samsat */}
          <div>
            <h4 className="mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Wilayah Samsat
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wilayah Samsat Asal</Label>
                <Select
                  value={newOrderData.wilayahSamsatAsal}
                  onValueChange={(value) => setNewOrderData({...newOrderData, wilayahSamsatAsal: value})}
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih wilayah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                    <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                    <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                    <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                    <SelectItem value="Depok">Depok</SelectItem>
                    <SelectItem value="Bekasi">Bekasi</SelectItem>
                    <SelectItem value="Tangerang">Tangerang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Wilayah Samsat Tujuan (jika mutasi)</Label>
                <Select
                  value={newOrderData.wilayahSamsatTujuan}
                  onValueChange={(value) => setNewOrderData({...newOrderData, wilayahSamsatTujuan: value})}
                >
                  <SelectTrigger className="bg-input-background border-border">
                    <SelectValue placeholder="Pilih wilayah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                    <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                    <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                    <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                    <SelectItem value="Depok">Depok</SelectItem>
                    <SelectItem value="Bekasi">Bekasi</SelectItem>
                    <SelectItem value="Tangerang">Tangerang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h4 className="mb-4">Alamat Jemput & Antar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domisili Pengambilan</Label>
                <Input
                  value={newOrderData.domisiliPengambilan}
                  onChange={(e) => setNewOrderData({...newOrderData, domisiliPengambilan: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Jakarta Timur"
                />
              </div>
              <div className="space-y-2">
                <Label>Domisili Pengembalian</Label>
                <Input
                  value={newOrderData.domisiliPengembalian}
                  onChange={(e) => setNewOrderData({...newOrderData, domisiliPengembalian: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Jakarta Timur"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Detail Alamat Pengambilan</Label>
                <Input
                  value={newOrderData.detailAlamatPengambilan}
                  onChange={(e) => setNewOrderData({...newOrderData, detailAlamatPengambilan: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Detail Alamat Pengembalian</Label>
                <Input
                  value={newOrderData.detailAlamatPengembalian}
                  onChange={(e) => setNewOrderData({...newOrderData, detailAlamatPengembalian: e.target.value})}
                  className="bg-input-background border-border"
                  placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                />
              </div>
            </div>
          </div>

          {/* Estimasi Biaya */}
          <Card className="glass-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h4 className="mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-400" />
              Estimasi Biaya
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Jasa:</span>
                <span>Rp {cost.biayaJasa.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PKB:</span>
                <span>Rp {cost.pkb.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SWDKLLJ:</span>
                <span>Rp {cost.swdkllj.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Denda SWDKLLJ:</span>
                <span>Rp {cost.dendaSwdkllj.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-lg">Total Estimasi:</span>
                <span className="text-lg text-blue-400">
                  Rp {cost.total.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => setNewOrderData({
              namaPemilik: "",
              nomorHP: "",
              kepemilikanKendaraan: "",
              jenisKendaraan: "",
              tahunKendaraan: "",
              nopol: "",
              layanan: "",
              pkbBerlakuSd: "",
              tahunPajak: "",
              bulanPajak: "",
              nominalPkbTerakhir: "",
              nominalSwdkllj: "",
              kodePromo: "",
              wilayahSamsatAsal: "",
              wilayahSamsatTujuan: "",
              domisiliPengambilan: "",
              domisiliPengembalian: "",
              detailAlamatPengambilan: "",
              detailAlamatPengembalian: "",
            })}>
              Reset
            </Button>
            <Button onClick={handleAddOrder} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Buat Order
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
