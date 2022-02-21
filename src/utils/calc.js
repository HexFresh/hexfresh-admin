export const unrecordRoute = ['/signin', '/signup', '/change-password', '/courses', '/'];

export const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const expiredTime = new Date(expirationTime).getTime();
  const remainingTime = expiredTime - currentTime;
  return remainingTime;
};

export const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};
