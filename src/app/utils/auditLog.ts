// Audit Log Utility for tracking user actions

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: 'administrator' | 'finance' | 'admin' | 'messenger';
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];

  // Initialize with some sample data
  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: new Date('2024-11-04T08:30:00'),
        userId: 'usr-001',
        userName: 'Admin Super',
        userRole: 'administrator',
        action: 'CREATE',
        module: 'Order',
        details: 'Membuat order baru ORD-0045',
        ipAddress: '192.168.1.100',
        metadata: { orderNo: 'ORD-0045', customer: 'PT Maju Jaya' }
      },
      {
        id: '2',
        timestamp: new Date('2024-11-04T09:15:00'),
        userId: 'usr-002',
        userName: 'Finance User',
        userRole: 'finance',
        action: 'UPDATE',
        module: 'Finance - Kas Kantor',
        details: 'Menambahkan data kas kantor Rp 5.000.000',
        ipAddress: '192.168.1.101',
        metadata: { amount: 5000000, type: 'cash_in' }
      },
      {
        id: '3',
        timestamp: new Date('2024-11-04T10:00:00'),
        userId: 'usr-003',
        userName: 'Admin User',
        userRole: 'admin',
        action: 'CREATE',
        module: 'Master Data - Karyawan',
        details: 'Menambahkan karyawan baru: Budi Santoso',
        ipAddress: '192.168.1.102',
        metadata: { employeeName: 'Budi Santoso', position: 'Messenger' }
      },
      {
        id: '4',
        timestamp: new Date('2024-11-04T11:30:00'),
        userId: 'usr-004',
        userName: 'Messenger 1',
        userRole: 'messenger',
        action: 'UPDATE',
        module: 'Messenger Task',
        details: 'Menyelesaikan tugas penjemputan dokumen ORD-0042',
        ipAddress: '192.168.1.103',
        metadata: { orderNo: 'ORD-0042', taskType: 'pickup' }
      },
      {
        id: '5',
        timestamp: new Date('2024-11-04T13:00:00'),
        userId: 'usr-002',
        userName: 'Finance User',
        userRole: 'finance',
        action: 'DELETE',
        module: 'Finance - Pengeluaran',
        details: 'Menghapus data pengeluaran ID: EXP-123',
        ipAddress: '192.168.1.101',
        metadata: { expenseId: 'EXP-123', amount: 500000 }
      },
      {
        id: '6',
        timestamp: new Date('2024-11-04T14:20:00'),
        userId: 'usr-001',
        userName: 'Admin Super',
        userRole: 'administrator',
        action: 'UPDATE',
        module: 'Access Management',
        details: 'Mengubah hak akses Finance User - Memberikan akses ke Order Tracking',
        ipAddress: '192.168.1.100',
        metadata: { targetUser: 'Finance User', permission: 'order_tracking', granted: true }
      },
      {
        id: '7',
        timestamp: new Date('2024-11-04T15:45:00'),
        userId: 'usr-003',
        userName: 'Admin User',
        userRole: 'admin',
        action: 'UPDATE',
        module: 'Order Tracking',
        details: 'Memperbarui status order ORD-0043 ke "Proses Samsat"',
        ipAddress: '192.168.1.102',
        metadata: { orderNo: 'ORD-0043', newStatus: 'Proses Samsat' }
      },
      {
        id: '8',
        timestamp: new Date('2024-11-03T16:30:00'),
        userId: 'usr-002',
        userName: 'Finance User',
        userRole: 'finance',
        action: 'EXPORT',
        module: 'Finance - Data Penjualan',
        details: 'Mengekspor data penjualan ke PDF',
        ipAddress: '192.168.1.101',
        metadata: { format: 'PDF', recordCount: 150 }
      },
      {
        id: '9',
        timestamp: new Date('2024-11-03T17:00:00'),
        userId: 'usr-001',
        userName: 'Admin Super',
        userRole: 'administrator',
        action: 'CREATE',
        module: 'Master Data - Biaya Layanan',
        details: 'Menambahkan biaya layanan baru: Mutasi Antar Samsat',
        ipAddress: '192.168.1.100',
        metadata: { serviceName: 'Mutasi Antar Samsat', price: 1500000 }
      },
      {
        id: '10',
        timestamp: new Date('2024-11-03T09:00:00'),
        userId: 'usr-004',
        userName: 'Messenger 1',
        userRole: 'messenger',
        action: 'UPDATE',
        module: 'Messenger Task',
        details: 'Menyelesaikan tugas pengantaran dokumen ORD-0040',
        ipAddress: '192.168.1.103',
        metadata: { orderNo: 'ORD-0040', taskType: 'delivery' }
      },
    ];

    this.logs = sampleLogs;
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    this.logs.unshift(newEntry);
  }

  getLogs(filters?: {
    userId?: string;
    userRole?: string;
    module?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.userRole) {
        filteredLogs = filteredLogs.filter(log => log.userRole === filters.userRole);
      }
      if (filters.module) {
        filteredLogs = filteredLogs.filter(log => 
          log.module.toLowerCase().includes(filters.module!.toLowerCase())
        );
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLogById(id: string): AuditLogEntry | undefined {
    return this.logs.find(log => log.id === id);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const auditLog = new AuditLogService();
