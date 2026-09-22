import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Database, Key, Save } from "lucide-react";
import { toast } from "sonner";

export function Settings() {
  const [notifications, setNotifications] = useState({
    emailNotif: true,
    whatsappNotif: true,
    tagihanReminder: true,
    orderUpdate: false,
  });

  const [preferences, setPreferences] = useState({
    language: "id",
    theme: "dark",
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
  });

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="space-y-4 p-4 md:p-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Pengaturan
        </h1>
        <p className="text-muted-foreground mt-1">Kelola preferensi dan konfigurasi sistem</p>
      </motion.div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-secondary/30 p-2">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Database className="w-4 h-4 mr-2" />
            Lanjutan
          </TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="glass-card p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-4">Pengaturan Notifikasi</h3>
                <Separator className="mb-4" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Notifikasi Email</p>
                    <p className="text-sm text-muted-foreground">Terima pemberitahuan melalui email</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotif}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailNotif: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Notifikasi WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Terima pemberitahuan melalui WhatsApp</p>
                  </div>
                  <Switch 
                    checked={notifications.whatsappNotif}
                    onCheckedChange={(checked) => setNotifications({...notifications, whatsappNotif: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Reminder Tagihan</p>
                    <p className="text-sm text-muted-foreground">Pengingat otomatis untuk tagihan jatuh tempo</p>
                  </div>
                  <Switch 
                    checked={notifications.tagihanReminder}
                    onCheckedChange={(checked) => setNotifications({...notifications, tagihanReminder: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Update Order</p>
                    <p className="text-sm text-muted-foreground">Notifikasi setiap ada perubahan status order</p>
                  </div>
                  <Switch 
                    checked={notifications.orderUpdate}
                    onCheckedChange={(checked) => setNotifications({...notifications, orderUpdate: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="glass-card p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-4">Keamanan Akun</h3>
                <Separator className="mb-4" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    Password Lama
                  </Label>
                  <Input type="password" placeholder="Masukkan password lama" className="bg-input-background border-border" />
                </div>

                <div className="space-y-2">
                  <Label>Password Baru</Label>
                  <Input type="password" placeholder="Masukkan password baru" className="bg-input-background border-border" />
                </div>

                <div className="space-y-2">
                  <Label>Konfirmasi Password Baru</Label>
                  <Input type="password" placeholder="Konfirmasi password baru" className="bg-input-background border-border" />
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Keamanan tambahan dengan 2FA</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced">
          <Card className="glass-card p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-4">Pengaturan Lanjutan</h3>
                <Separator className="mb-4" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Debug Mode</p>
                    <p className="text-sm text-muted-foreground">Tampilkan informasi debugging</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <p>Auto Backup</p>
                    <p className="text-sm text-muted-foreground">Backup data otomatis setiap hari</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Items Per Page</Label>
                  <Select defaultValue="10">
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="25">25 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                      <SelectItem value="100">100 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <Card className="glass-card p-4 bg-red-500/5 border-red-500/20">
                  <h4 className="text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tindakan berikut dapat menghapus data secara permanen
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Reset Settings
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
