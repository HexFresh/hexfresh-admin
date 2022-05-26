const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case 'notification/getAll':
      return action.notifications
    default:
      return state
  }
}

export default notificationsReducer;

