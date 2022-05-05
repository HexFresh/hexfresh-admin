const initialState = {
  token: null,
  id: null,
  email: null,
  username: null,
  roleId: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,
        username: action.user.username,
        token: action.user.token,
        id: action.user.id,
        email: action.user.email,
        roleId: action.user.roleId,
      };
    case 'auth/fetchProfile':
      return {
        ...state,
        username: action.user.username,
        token: action.user.token,
        id: action.user.id,
        email: action.user.email,
        roleId: action.user.roleId,
      };
    case 'auth/retrieveToken':
      return {
        ...state,
        token: action.token,
      };
    case 'auth/LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default authReducer;
