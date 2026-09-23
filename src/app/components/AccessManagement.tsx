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
    return <Badge status={role}>{role.toUpperCase()}</Badge>;
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
    <div className="space-y-4 px-2 sm:px-3 lg:px-4 py-4 md:py-6 max-w-7xl mx-auto">
      <div>
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 pb-2" aria-label="Breadcrumb">
          <span>Master Data</span>
          <span>/</span>
          <span className="text-foreground font-medium">Pengaturan Hak Akses</span>
        </nav>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Pengaturan Hak Akses</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Kelola hak akses Finance dan Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {usersAccess.map((user) => (
          <Card key={user.userId} className="glass-card p-5 border border-border/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-medium text-foreground">
                  <span className="text-sm">{user.userName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{user.userName}</p>
                  <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGrantAllAccess(user.userId)}
                className="h-8 border-primary/50 text-primary hover:bg-primary/10 text-xs font-medium gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Akses Penuh</span>
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {Object.entries(user.permissions).map(([key, value]) => {
                const permissionKey = key as keyof UserAccess['permissions'];
                
                // Special handling for orderTrackingVerified - only show if order tracking is enabled
                if (permissionKey === 'orderTrackingVerified' && !user.permissions.orderTracking) {
                  return null;
                }

                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <div className="flex-1 pr-3">
                      <Label className="text-xs font-medium cursor-pointer text-foreground">
                        {permissionLabels[permissionKey]}
                      </Label>
                      {permissionKey === 'orderTrackingVerified' && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Izinkan edit bagian "Sudah Terverifikasi"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {value ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted-foreground/50" />
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
              <p className="mb-2 font-medium">Izin yang aktif:</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(user.permissions)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge key={key} variant="outline" className="text-[11px] font-normal">
                      {permissionLabels[key as keyof UserAccess['permissions']]}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Access Rules Info */}
      <Card className="glass-card p-5 mt-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
        <h4 className="mb-3 font-semibold text-foreground text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          Aturan Hak Akses Default
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-blue-500 font-semibold mb-1">Administrator (SVP):</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Akses penuh ke semua modul</li>
              <li>Dapat mengatur hak akses pengguna lain</li>
              <li>Dapat melihat semua audit log</li>
            </ul>
          </div>
          <div>
            <p className="text-emerald-500 font-semibold mb-1">Finance:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard dan Finance (default)</li>
              <li>Akses tambahan dapat diberikan administrator</li>
            </ul>
          </div>
          <div>
            <p className="text-blue-500 font-semibold mb-1">Admin:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard, Messenger Task, Order (default)</li>
              <li>Tidak bisa edit "Sudah Terverifikasi" (default)</li>
              <li>Akses tambahan dapat diberikan administrator</li>
            </ul>
          </div>
          <div>
            <p className="text-amber-500 font-semibold mb-1">Messenger:</p>
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
