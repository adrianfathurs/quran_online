// Notification utilities for prayer time reminders

// Check if notifications are supported and current permission
export function getNotificationPermission(): { permission: NotificationPermission; canRequest: boolean } {
  if (!('Notification' in window)) {
    return { permission: 'denied' as NotificationPermission, canRequest: false };
  }

  return {
    permission: Notification.permission,
    canRequest: Notification.permission === 'default',
  };
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Show prayer time notification
export function showPrayerTimeNotification(prayerName: string, time: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const options: NotificationOptions = {
    body: `Waktu sholat ${prayerName} telah tiba! (${time})`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    dir: 'auto',
    lang: 'id-ID',
    tag: `prayer-${prayerName}`,
  } as any; // Cast to any to support additional properties

  try {
    const notification = new Notification('🕌 Ayook Sholat!', options);

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    // Play sound if available
    playNotificationSound();
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Play notification sound (beep)
function playNotificationSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Calculate seconds until next prayer
export function getSecondsUntilTime(targetTime: string): number {
  const [hours, minutes] = targetTime.split(':').map(Number);
  const now = new Date();
  const target = new Date();

  target.setHours(hours, minutes, 0, 0);

  // If target time is earlier than current time, it means it's for tomorrow
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

// Parse time string "HH:MM" to minutes
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Get current time in minutes
export function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
