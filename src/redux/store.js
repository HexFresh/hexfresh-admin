import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth/auth-slice";
import notificationReducer from "./notification/notification-slice";
import profileReducer from "./profile/profile-slice";
import countNotificationReducer from "./count-notification-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    profile: profileReducer,
    countNotification: countNotificationReducer,
  }
})
