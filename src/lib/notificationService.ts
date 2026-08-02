import { subscribeToClinicalData, saveDataPermanently, deleteDataPermanently } from "./realTimeService";

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
export type NotificationCategory = 'MEDICAL' | 'DRUG' | 'LAB' | 'BED' | 'ESCALATION' | 'AI_PREDICTIVE' | 'SYSTEM';
export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'SNOOZED';

export interface SystemNotification {
  id: string;
  userId?: string;
  targetUserId?: string;
  targetDepartment?: string;
  role?: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  bodyAr?: string;
  bodyEn?: string;
  type?: "info" | "warning" | "error" | "success" | "critical" | "alert";
  priority?: NotificationPriority;
  category?: NotificationCategory;
  status?: NotificationStatus;
  timestamp: string;
  read: boolean;
  link?: string;
  targetTab?: string;
  actionRequired?: boolean;
  actionLink?: string;
  isPinned?: boolean;
  patientId?: string;
  patientName?: string;
  metadata?: any;
}

const NOTIFICATION_COLLECTION = "hospital_system_notifications";

/**
 * Creates a new system notification
 */
export async function createNotification(notification: Partial<SystemNotification> & { titleAr: string; titleEn: string; messageAr: string; messageEn: string }) {
  const notifId = notification.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const newNotif: SystemNotification = {
    userId: "all",
    role: "all",
    type: "info",
    priority: "NORMAL",
    category: "SYSTEM",
    status: "UNREAD",
    isPinned: false,
    read: false,
    ...notification,
    id: notifId,
    timestamp: notification.timestamp || new Date().toISOString(),
  };
  await saveDataPermanently(NOTIFICATION_COLLECTION, newNotif);
  return newNotif;
}

/**
 * Save or update notification
 */
export async function saveNotification(notification: Partial<SystemNotification> & { id: string }) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, notification);
}

/**
 * Sync notifications for a specific user, role, or department
 */
export function syncNotifications(
  userId?: string, 
  role?: string, 
  department?: string, 
  onData?: (notifications: SystemNotification[]) => void
) {
  const callback = typeof department === 'function' ? (department as any) : onData;
  const userDept = typeof department === 'string' ? department : undefined;

  return subscribeToClinicalData<SystemNotification>(
    NOTIFICATION_COLLECTION,
    (allNotifs) => {
      // Sort desc by timestamp
      const sorted = [...allNotifs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const filtered = sorted.filter(n => {
        const isUserMatch = !userId || !n.userId || n.userId === "all" || n.userId === userId || n.targetUserId === userId;
        const isRoleMatch = !role || !n.role || n.role === "all" || n.role === role;
        const isDeptMatch = !userDept || !n.targetDepartment || n.targetDepartment === "ALL" || (userDept && userDept.includes(n.targetDepartment));
        return isUserMatch || isRoleMatch || isDeptMatch;
      });
      if (callback) {
        callback(filtered);
      }
    },
    (err) => console.error("Notification sync error:", err)
  );
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  await deleteDataPermanently(NOTIFICATION_COLLECTION, notificationId);
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string, currentNotif?: SystemNotification) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, {
    ...(currentNotif || {}),
    id: notificationId,
    read: true,
    status: 'READ'
  } as any);
}

/**
 * Toggle pin status
 */
export async function togglePinNotification(notificationId: string, currentPinnedStatus: boolean, currentNotif?: SystemNotification) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, {
    ...(currentNotif || {}),
    id: notificationId,
    isPinned: !currentPinnedStatus
  } as any);
}

/**
 * Snooze notification
 */
export async function snoozeNotification(notificationId: string, currentNotif?: SystemNotification) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, {
    ...(currentNotif || {}),
    id: notificationId,
    status: 'SNOOZED'
  } as any);
}

/**
 * Archive notification
 */
export async function archiveNotification(notificationId: string, currentNotif?: SystemNotification) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, {
    ...(currentNotif || {}),
    id: notificationId,
    status: 'ARCHIVED'
  } as any);
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(notifications: SystemNotification[]) {
  const unread = notifications.filter(n => !n.read || n.status === 'UNREAD');
  const promises = unread.map(n => markAsRead(n.id, n));
  await Promise.all(promises);
}
