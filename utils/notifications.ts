import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Fonction pour demander les permissions et programmer les notifications
// @ts-ignore
export async function schedulePrayerNotifications(prayerTimes) {
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

  // Planifie les notifications pour chaque prière
  // @ts-ignore
  prayerTimes.forEach(async (prayer) => {
    const { name, time } = prayer;
    const [hours, minutes] = time.split(":").map(Number);
    
    const trigger = new Date();
    trigger.setHours(hours);
    trigger.setMinutes(minutes);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕌 Heure de la prière`,
        body: `C'est l'heure de ${name} !`,
        sound: "default",
      },
      // @ts-ignore
      trigger,
    });

    console.log(`Notification programmée pour ${name} à ${time}`);
  });
}
