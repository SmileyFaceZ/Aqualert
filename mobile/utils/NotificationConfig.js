// utils/NotificationConfig.js
import PushNotification from "react-native-push-notification";

export const setupNotification = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    requestPermissions: true,
    popInitialNotification: true,
  });

  PushNotification.createChannel(
    {
      channelId: "water-reminder",
      channelName: "Water Reminder",
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
};
