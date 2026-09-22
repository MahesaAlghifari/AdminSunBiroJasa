import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, Mail, Eye, EyeOff, Sparkles, User, Truck } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface AuthProps {
  onLogin: (role: 'administrator' | 'finance' | 'admin' | 'messenger', userName: string, userId: string) => void;
}

// Demo credentials
const credentials = {
  administrator: {
    email: "svp@birojasa.com",
    password: "admin123",
    name: "Admin Super (SVP)",
    userId: "usr-001"
  },
  finance: {
    email: "finance@birojasa.com",
    password: "finance123",
    name: "Finance User",
    userId: "usr-002"
  },
  admin: {
    email: "admin@birojasa.com",
    password: "admin123",
    name: "Admin User",
    userId: "usr-003"
  },
  messenger: {
    email: "messenger@birojasa.com",
    password: "messenger123",
    name: "Messenger User",
    userId: "usr-004"
  },
};

export function Auth({ onLogin }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Check credentials
      if (email === credentials.administrator.email && password === credentials.administrator.password) {
        setIsLoading(false);
        toast.success("Login berhasil sebagai Administrator!");
        onLogin('administrator', credentials.administrator.name, credentials.administrator.userId);
      } else if (email === credentials.finance.email && password === credentials.finance.password) {
        setIsLoading(false);
        toast.success("Login berhasil sebagai Finance!");
        onLogin('finance', credentials.finance.name, credentials.finance.userId);
      } else if (email === credentials.admin.email && password === credentials.admin.password) {
        setIsLoading(false);
        toast.success("Login berhasil sebagai Admin!");
        onLogin('admin', credentials.admin.name, credentials.admin.userId);
      } else if (email === credentials.messenger.email && password === credentials.messenger.password) {
        setIsLoading(false);
        toast.success("Login berhasil sebagai Messenger!");
        onLogin('messenger', credentials.messenger.name, credentials.messenger.userId);
      } else {
        setIsLoading(false);
        toast.error("Email atau password salah!");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card p-6 border-border">
          {/* Logo/Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-3">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Biro Jasa System
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola bisnis Anda dengan mudah</p>
          </motion.div>

          {/* Login Form */}
          <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-3.5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 bg-input-background border-border"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-input-background border-border"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Ingat saya</span>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Login"}
                  </Button>
                </motion.div>
              </form>

              {/* Demo Credentials Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-5 pt-5 border-t border-border"
              >
                <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 border border-border rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 text-[10px] px-1.5">Admin (SVP)</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{credentials.administrator.email}</p>
                    <p className="text-[11px] text-muted-foreground">{credentials.administrator.password}</p>
                  </div>
                  <div className="p-2.5 border border-border rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-green-500/15 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <Badge className="bg-green-500/15 text-green-700 border-green-500/25 text-[10px] px-1.5">Finance</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{credentials.finance.email}</p>
                    <p className="text-[11px] text-muted-foreground">{credentials.finance.password}</p>
                  </div>
                  <div className="p-2.5 border border-border rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 text-[10px] px-1.5">Admin</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{credentials.admin.email}</p>
                    <p className="text-[11px] text-muted-foreground">{credentials.admin.password}</p>
                  </div>
                  <div className="p-2.5 border border-border rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-cyan-500/15 flex items-center justify-center">
                        <Truck className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <Badge className="bg-cyan-500/15 text-cyan-700 border-cyan-500/25 text-[10px] px-1.5">Messenger</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{credentials.messenger.email}</p>
                    <p className="text-[11px] text-muted-foreground">{credentials.messenger.password}</p>
                  </div>
                </div>
              </motion.div>
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
