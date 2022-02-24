const initialState = {
  username: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  console.log({ name: 'auth', state, action });
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,
        username: action.user.username,
        token: action.user.token,
      };
    case 'auth/fetchProfile':
      return {
        ...state,
        username: action.user.username,
        token: action.user.token,
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
