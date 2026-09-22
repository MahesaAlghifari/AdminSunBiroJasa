import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Shield, Check, X } from "lucide-react";
import { toast } from "sonner";
import { auditLog } from "../utils/auditLog";

interface AccessManagementProps {
  currentUserId: string;
  currentUserName: string;
}

interface UserAccess {
  userId: string;
  userName: string;
  role: 'finance' | 'admin';
  permissions: {
    dashboard: boolean;
    // Finance sub-menus
    financeProfit: boolean;
    financeKasMessenger: boolean;
    financeKasKantor: boolean;
    financePengeluaran: boolean;
    financePenjualan: boolean;
    financeBelumBayar: boolean;
    financeProfitPending: boolean;
    financeCashbackPending: boolean;
    financeTagihan: boolean;
    financeLabaRugi: boolean;
    // Master Data sub-menus
    masterSamsat: boolean;
    masterKaryawan: boolean;
    masterBiayaLayanan: boolean;
    masterHargaDasar: boolean;
    masterPengguna: boolean;
    masterAccessManagement: boolean;
    masterAuditLog: boolean;
    // Messenger Task
    messengerTask: boolean;
    // Order sub-menus
    orderBuat: boolean;
    orderTracking: boolean;
    orderTrackingVerified: boolean; // Special permission for "Sudah Terverifikasi"
    orderHistory: boolean;
  };
}

export function AccessManagement({ currentUserId, currentUserName }: AccessManagementProps) {
  const [usersAccess, setUsersAccess] = useState<UserAccess[]>([
    {
      userId: "usr-002",
      userName: "Finance User",
      role: "finance",
      permissions: {
        dashboard: true,
        // Finance - default akses
        financeProfit: true,
        financeKasMessenger: true,
        financeKasKantor: true,
        financePengeluaran: true,
        financePenjualan: true,
        financeBelumBayar: true,
        financeProfitPending: true,
        financeCashbackPending: true,
        financeTagihan: true,
        financeLabaRugi: true,
        // Master Data - default tidak ada akses
        masterSamsat: false,
        masterKaryawan: false,
        masterBiayaLayanan: false,
        masterHargaDasar: false,
        masterPengguna: false,
        masterAccessManagement: false,
        masterAuditLog: false,
        // Messenger Task - default tidak ada akses
        messengerTask: false,
        // Order - default tidak ada akses
        orderBuat: false,
        orderTracking: false,
        orderTrackingVerified: false,
        orderHistory: false,
      }
    },
    {
      userId: "usr-003",
      userName: "Admin User",
      role: "admin",
      permissions: {
        dashboard: true,
        // Finance - default tidak ada akses
        financeProfit: false,
        financeKasMessenger: false,
        financeKasKantor: false,
        financePengeluaran: false,
        financePenjualan: false,
        financeBelumBayar: false,
        financeProfitPending: false,
        financeCashbackPending: false,
        financeTagihan: false,
        financeLabaRugi: false,
        // Master Data - default tidak ada akses
        masterSamsat: false,
        masterKaryawan: false,
        masterBiayaLayanan: false,
        masterHargaDasar: false,
        masterPengguna: false,
        masterAccessManagement: false,
        masterAuditLog: false,
        // Messenger Task - default ada akses
        messengerTask: true,
        // Order - default ada akses kecuali edit verified
        orderBuat: true,
        orderTracking: true,
        orderTrackingVerified: false, // Cannot edit "Sudah Terverifikasi" by default
        orderHistory: true,
      }
    }
  ]);

  const handlePermissionChange = (userId: string, permission: keyof UserAccess['permissions']) => {
    setUsersAccess(prev => prev.map(user => {
      if (user.userId === userId) {
        const newPermissions = {
          ...user.permissions,
          [permission]: !user.permissions[permission]
        };
        
        // Log the change
        auditLog.log({
          userId: currentUserId,
          userName: currentUserName,
          userRole: 'administrator',
          action: 'UPDATE',
          module: 'Access Management',
          details: `Mengubah hak akses ${user.userName} - ${permission}: ${!user.permissions[permission] ? 'Diberikan' : 'Dicabut'}`,
          metadata: {
            targetUser: user.userName,
            targetUserId: user.userId,
            permission: permission,
            granted: !user.permissions[permission]
          }
        });

        toast.success(`Hak akses ${user.userName} berhasil diperbarui!`);
        
        return {
          ...user,
          permissions: newPermissions
        };
      }
      return user;
    }));
  };

  const handleGrantAllAccess = (userId: string) => {
    setUsersAccess(prev => prev.map(user => {
      if (user.userId === userId) {
        const newPermissions = {
          dashboard: true,
          financeProfit: true,
          financeKasMessenger: true,
          financeKasKantor: true,
          financePengeluaran: true,
          financePenjualan: true,
          financeBelumBayar: true,
          financeProfitPending: true,
          financeCashbackPending: true,
          financeTagihan: true,
          financeLabaRugi: true,
          masterSamsat: true,
          masterKaryawan: true,
          masterBiayaLayanan: true,
          masterHargaDasar: true,
          masterPengguna: true,
          masterAccessManagement: true,
          masterAuditLog: true,
          messengerTask: true,
          orderBuat: true,
          orderTracking: true,
          orderTrackingVerified: true,
          orderHistory: true,
        };

        // Log the change
        auditLog.log({
          userId: currentUserId,
          userName: currentUserName,
          userRole: 'administrator',
          action: 'UPDATE',
          module: 'Access Management',
          details: `Memberikan akses penuh ke ${user.userName}`,
          metadata: {
            targetUser: user.userName,
            targetUserId: user.userId,
            accessType: 'full'
          }
        });

        toast.success(`${user.userName} sekarang memiliki akses penuh!`);
        
        return {
          ...user,
          permissions: newPermissions
        };
      }
      return user;
    }));
  };

  const getRoleBadge = (role: string) => {
    const colors: any = {
      "finance": "bg-green-500/20 text-green-400 border-green-500/30",
      "admin": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return <Badge className={colors[role] || ""}>{role.toUpperCase()}</Badge>;
  };

  const permissionLabels: Record<keyof UserAccess['permissions'], string> = {
    dashboard: "Dashboard",
    financeProfit: "Finance - Profit",
    financeKasMessenger: "Finance - Kas Messenger",
    financeKasKantor: "Finance - Kas Kantor",
    financePengeluaran: "Finance - Pengeluaran",
    financePenjualan: "Finance - Data Penjualan",
    financeBelumBayar: "Finance - Belum & Kurang Bayar",
    financeProfitPending: "Finance - Profit Terpending",
    financeCashbackPending: "Finance - Cashback Terpending",
    financeTagihan: "Finance - Tagihan",
    financeLabaRugi: "Finance - Laba Rugi",
    masterSamsat: "Master Data - Samsat",
    masterKaryawan: "Master Data - Karyawan",
    masterBiayaLayanan: "Master Data - Biaya Layanan",
    masterHargaDasar: "Master Data - Harga Dasar Samsat",
    masterPengguna: "Master Data - Manajemen Pengguna",
    masterAccessManagement: "Master Data - Pengaturan Hak Akses",
    masterAuditLog: "Master Data - Riwayat Aktivitas",
    messengerTask: "Messenger Task",
    orderBuat: "Order - Buat Order",
    orderTracking: "Order - Order Tracking",
    orderTrackingVerified: "Order - Edit 'Sudah Terverifikasi'",
    orderHistory: "Order - Riwayat Order",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg">Pengaturan Hak Akses</h2>
            <p className="text-muted-foreground">Kelola hak akses Finance dan Admin</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {usersAccess.map((user) => (
          <Card key={user.userId} className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-sm">{user.userName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{user.userName}</p>
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGrantAllAccess(user.userId)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Akses Penuh
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              {Object.entries(user.permissions).map(([key, value]) => {
                const permissionKey = key as keyof UserAccess['permissions'];
                
                // Special handling for orderTrackingVerified - only show if order tracking is enabled
                if (permissionKey === 'orderTrackingVerified' && !user.permissions.orderTracking) {
                  return null;
                }

                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <Label className="text-xs cursor-pointer">
                        {permissionLabels[permissionKey]}
                      </Label>
                      {permissionKey === 'orderTrackingVerified' && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Izinkan edit bagian "Sudah Terverifikasi"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-red-400" />
                      )}
                      <Switch
                        checked={value}
                        onCheckedChange={() => handlePermissionChange(user.userId, permissionKey)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Izin yang aktif:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(user.permissions)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {permissionLabels[key as keyof UserAccess['permissions']]}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Access Rules Info */}
      <Card className="glass-card p-4 mt-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
        <h3 className="mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Aturan Hak Akses Default
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-400 mb-2">Administrator (SVP):</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Akses penuh ke semua modul</li>
              <li>Dapat mengatur hak akses pengguna lain</li>
              <li>Dapat melihat semua audit log</li>
            </ul>
          </div>
          <div>
            <p className="text-green-400 mb-2">Finance:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard dan Finance (default)</li>
              <li>Akses tambahan dapat diberikan administrator</li>
            </ul>
          </div>
          <div>
            <p className="text-blue-400 mb-2">Admin:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard, Messenger Task, Order (default)</li>
              <li>Tidak bisa edit "Sudah Terverifikasi" (default)</li>
              <li>Akses tambahan dapat diberikan administrator</li>
            </ul>
          </div>
          <div>
            <p className="text-orange-400 mb-2">Messenger:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard dan Messenger Task</li>
              <li>Tidak dapat diubah hak aksesnya</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
