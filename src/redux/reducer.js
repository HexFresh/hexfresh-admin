import { combineReducers } from 'redux';

import authReducer from './auth/auth-reducer';
import uiReducer from './ui/ui-reducer';
import notificationReducer from "./notification/notification-reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notification: notificationReducer,
});

export default rootReducer;
