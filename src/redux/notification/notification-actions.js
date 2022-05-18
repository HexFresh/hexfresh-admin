import {getNotifications} from "../../api/notification";

export function getAllNotifications(notifications) {
  return {
    type: 'notification/getAll',
    notifications,
  };
}

export function getNotificationsAction() {
  return async (dispatch) => {
    const data = await getNotifications();
    dispatch(getAllNotifications(data));
  };
}