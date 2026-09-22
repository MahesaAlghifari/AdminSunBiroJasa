import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card } from "./ui/card";
import { Badge, getStatusBadgeClass } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Bell, AlertCircle, Calendar, User, Phone, CreditCard, Clock, MapPin } from "lucide-react";

interface NotificationItem {
  id: number;
  type: "tagihan" | "reminder" | "update";
  title: string;
  customer: string;
  nopol: string;
  layanan: string;
  totalTagihan: number;
  terbayar: number;
  sisa: number;
  jatuhTempo: string;
  telepon: string;
  alamat: string;
  priority: "high" | "medium" | "low";
  daysOverdue?: number;
}

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: NotificationItem[];
}

export function NotificationDialog({ open, onOpenChange, notifications }: NotificationDialogProps) {
  const getPriorityColor = (priority: string) => getStatusBadgeClass(priority);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Urgent";
      case "medium":
        return "Penting";
      case "low":
        return "Normal";
      default:
        return "Info";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notifikasi & Reminder Tagihan
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="glass-card p-5 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Tidak ada notifikasi baru</p>
              </Card>
            ) : (
              notifications.map((notif) => (
                <Card 
                  key={notif.id} 
                  className={`glass-card p-5 border-l-4 ${
                    notif.priority === "high" 
                      ? "border-l-red-500" 
                      : notif.priority === "medium" 
                      ? "border-l-amber-500" 
                      : "border-l-blue-500"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notif.priority === "high" 
                          ? "bg-red-500/20" 
                          : notif.priority === "medium" 
                          ? "bg-amber-500/20" 
                          : "bg-blue-500/20"
                      }`}>
                        <AlertCircle className={`w-5 h-5 ${
                          notif.priority === "high" 
                            ? "text-red-400" 
                            : notif.priority === "medium" 
                            ? "text-amber-400" 
                            : "text-blue-400"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">{notif.title}</h4>
                          <Badge status={notif.priority}>
                            {getPriorityLabel(notif.priority)}
                          </Badge>
                        </div>
                        {notif.daysOverdue && notif.daysOverdue > 0 && (
                          <p className="text-xs text-red-400">
                            Telah jatuh tempo {notif.daysOverdue} hari yang lalu
                          </p>
                        )}
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-muted-foreground">Customer:</span>
                        <span>{notif.customer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="text-muted-foreground">Telepon:</span>
                        <span className="font-mono">{notif.telepon}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Alamat:</span>
                        <span className="text-xs">{notif.alamat}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Nopol:</span>
                        <span className="font-mono text-blue-400">{notif.nopol}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Layanan:</span>
                        <span>{notif.layanan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-muted-foreground">Jatuh Tempo:</span>
                        <span className={
                          notif.daysOverdue && notif.daysOverdue > 0 
                            ? "text-red-400" 
                            : "text-amber-400"
                        }>
                          {notif.jatuhTempo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Payment Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Card className="glass-card p-3 bg-blue-500/5 border-blue-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Total Tagihan</p>
                      <p className="text-sm text-blue-400">
                        Rp {notif.totalTagihan.toLocaleString()}
                      </p>
                    </Card>
                    <Card className="glass-card p-3 bg-green-500/5 border-green-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Terbayar</p>
                      <p className="text-sm text-green-400">
                        Rp {notif.terbayar.toLocaleString()}
                      </p>
                    </Card>
                    <Card className="glass-card p-3 bg-red-500/5 border-red-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Sisa Tagihan</p>
                      <p className="text-sm text-red-400">
                        Rp {notif.sisa.toLocaleString()}
                      </p>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border"
                      onClick={() => {
                        // Copy phone number to clipboard
                        navigator.clipboard.writeText(notif.telepon);
                      }}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Copy No. HP
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => {
                        // Open WhatsApp
                        const message = `Halo ${notif.customer}, kami ingin mengingatkan bahwa tagihan untuk ${notif.layanan} (${notif.nopol}) sebesar Rp ${notif.sisa.toLocaleString()} telah jatuh tempo pada ${notif.jatuhTempo}. Mohon segera melakukan pembayaran. Terima kasih.`;
                        window.open(`https://wa.me/${notif.telepon.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Hubungi via WhatsApp
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
