
const authDashHelper = (checkType) => {

  if (checkType === 'authCheck') {
    let login = sessionStorage.getItem("token")
    let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    if (login === null || user === null) {
      return true
    } else {
      return false
    }
  } else if (checkType === 'dashCheck') {
    let login = sessionStorage.getItem("token")
    let user = JSON.parse(sessionStorage.getItem("remi-user-dt"))
    if (login && user?.is_digital_Id_verified?.toString()?.toLowerCase() === "approved" && (!user?.documents?.toLowerCase().includes("pending") && user?.documents?.toLowerCase() !== "failed")) {
      return true
    } else {
      return false
    }
  }

};

export default authDashHelper;