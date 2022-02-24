import { combineReducers } from 'redux';

import authReducer from './auth/auth-reducer';
import uiReducer from './ui/ui-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

export default rootReducer;
