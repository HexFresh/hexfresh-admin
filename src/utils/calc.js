export const unrecordRoute = ['/signin', '/signup', '/change-password', '/courses', '/',];

export const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const expiredTime = new Date(expirationTime).getTime();
  return expiredTime - currentTime;
};

export const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  console.log(remainingTime);

  // if (remainingTime <= 3600000) {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('expirationTime');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('roleId');
  //   return null;
  // }

  return {
    token: storedToken, duration: remainingTime,
  };
};
