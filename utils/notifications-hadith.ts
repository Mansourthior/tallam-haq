import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Fonction pour demander les permissions et programmer les notifications
// @ts-ignore
export async function scheduleHadithNotifications(hadith) {
  if (!Device.isDevice) {
    console.log("Les notifications ne fonctionnent pas sur simulateur !");
    // Retourner ici mais ne pas essayer d'accéder aux notifications
    return false;
  }
  
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.log("Permission refusée");
      return;
    }
  }
  
  // Supprime les notifications existantes avant d'ajouter les nouvelles
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Planifie une notification pour le hadith du jour
  // @ts-ignore
  const trigger = new Date();
  trigger.setHours(12);
  trigger.setMinutes(30);
  trigger.setSeconds(0);

  let message = hadith.hadith_text.length > 100 
    ? hadith.hadith_text.substr(0, 100) + '...' 
    : hadith.hadith_text;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Hadith du jour`,
      body: `${message}`,
      sound: "default",
    },
    // @ts-ignore
    trigger,
  });
  
  console.log(`Notification programmée pour hadith`);
}
