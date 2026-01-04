import Notification from "@/models/Notification.js";

export const createAdminNotification = async ({
  title,
  message,
  type,
  link,
}) => {
  await Notification.create({
    title,
    message,
    type,
    link,
  });
};