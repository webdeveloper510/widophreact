const authChecker = (checkType) => {

  const token = sessionStorage.getItem("token")
  let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))

  if (checkType === 'authCheck') {
    if (!token && !user) {
      return false;
    } else {
      return true;
    }
  } else if (checkType === 'dashCheck') {
    if (token && user.is_digital_Id_verified) {
      return true;
    } else {
      return false;
    }
  }
};

export default authChecker;