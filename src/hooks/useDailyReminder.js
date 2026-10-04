import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const STORAGE_KEY = 'reminder-enabled';
const TIME_KEY = 'reminder-time';
const LAST_KEY = 'reminder-last-sent';
const NATIVE_REMINDER_ID = 1;
const REMINDER_TITLE = 'Time to check in 🌿';
const REMINDER_BODY = 'Log your mood and check your clean streak today.';

// On iOS/Android the browser Notification API doesn't exist, so the reminder is
// scheduled with the OS instead — it fires daily even when the app is closed.
const isNative = Capacitor.isNativePlatform();

async function scheduleNativeReminder() {
  await LocalNotifications.cancel({ notifications: [{ id: NATIVE_REMINDER_ID }] });
  if (!getReminderEnabled()) return;
  const [hour, minute] = getReminderTime().split(':').map(Number);
  await LocalNotifications.schedule({
    notifications: [{
      id: NATIVE_REMINDER_ID,
      title: REMINDER_TITLE,
      body: REMINDER_BODY,
      // Shows a 1 on the app icon; SceneDelegate clears it when the app opens
      badge: 1,
      schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
    }],
  });
}

export function getReminderEnabled() {
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export function getReminderTime() {
  return localStorage.getItem(TIME_KEY) || '20:00';
}

export function setReminderEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  if (isNative) scheduleNativeReminder().catch(() => {});
}

export function setReminderTime(time) {
  localStorage.setItem(TIME_KEY, time);
  if (isNative) scheduleNativeReminder().catch(() => {});
}

export async function requestNotificationPermission() {
  if (isNative) {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Web: fires a daily reminder notification at the user's chosen time.
 * Only triggers while the app is open. Checks every 30s.
 * Native: the OS-scheduled reminder needs no polling (see scheduleNativeReminder).
 */
export function useDailyReminder() {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isNative) {
      // Re-schedule on launch so reminders set up by an older version of the
      // app pick up changes to the notification (e.g. the badge)
      scheduleNativeReminder().catch(() => {});
      return undefined;
    }

    const check = () => {
      if (!getReminderEnabled()) return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const lastSent = localStorage.getItem(LAST_KEY);

      // Already reminded today
      if (lastSent === todayStr) return;

      const [h, m] = getReminderTime().split(':').map(Number);
      const reminderTime = new Date(now);
      reminderTime.setHours(h, m, 0, 0);

      // Past the reminder time today → fire
      if (now >= reminderTime) {
        localStorage.setItem(LAST_KEY, todayStr);
        try {
          new Notification(REMINDER_TITLE, { body: REMINDER_BODY });
        } catch (_) {
          // Some browsers require a service worker — silently ignore
        }
      }
    };

    // Check immediately, then every 30 seconds
    check();
    intervalRef.current = setInterval(check, 30000);

    return () => clearInterval(intervalRef.current);
  }, []);
}