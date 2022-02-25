const initialState = { request: null, message: null };

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ui/pending':
      console.log('request is pending');
      return {
        ...state,
        request: 'pending',
      };
    case 'ui/success':
      console.log('request is success');
      return {
        ...state,
        request: 'success',
      };
    case 'ui/error':
      console.log('Request is failed.!');
      return {
        ...state,
        request: 'error',
        message: action.message,
      };
    default:
      return { ...state };
  }
};

export default uiReducer;
