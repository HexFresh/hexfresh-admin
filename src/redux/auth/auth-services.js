import { retrieveStoredToken } from '../../utils/calc';
import { retrieveTokenAction } from './auth-actions';

export function checkAutoLogin(dispatch, history, location) {
  const tokenData = retrieveStoredToken();
  if (tokenData) {
    dispatch(retrieveTokenAction(tokenData.token));
    history(location.pathname + location.search);
  }
}
