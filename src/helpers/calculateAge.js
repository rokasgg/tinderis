export const calculateAge = (date, status) => {
  let todaysYear = new Date().getFullYear();
  let todayMonth = new Date().getMonth() + 1;
  let todaysDay = new Date().getDate();

  if (status === "receive") {
    let birthYear = parseInt(date.year);
    let birthMonth = parseInt(date.month);
    let birthDay = parseInt(date.day);
    let differences = todaysYear - birthYear;
    if (differences > 18) {
      const age = differences;

      if (birthMonth < todayMonth) {
        let olderAge = differences;

        return olderAge;
      } else {
        if (birthMonth === todayMonth) {
          //You Sir might have a change!
          if (birthDay <= todaysDay) {
            let olderAge = differences;

            return olderAge;
          } else {
            let ageRemains = differences - 1;

            return ageRemains;
          }
        } else {
          let ageRemains = differences - 1;

          return ageRemains;
        }
      }
    } else {
      if (differences === 18) {
        //CHECK IF MONTH IS MORE THAN TODAYS MONTH
        if (birthMonth < todayMonth) {
          let olderAge = differences;

          return olderAge;
        } else {
          if (birthMonth === todayMonth) {
            //You Sir might have a change!
            if (birthDay <= todaysDay) {
              let olderAge = differences;

              return olderAge;
            } else {
              let ageRemains = differences - 1;

              return ageRemains;
            }
          } else {
            let ageRemains = differences - 1;

            return ageRemains;
          }
        }
      } else {
        return null;
      }
    }
  } else if (status === "change") {
    let selectedYear = date.getFullYear();
    let selectedMonth = date.getMonth() + 1;

    let selectedDay = date.getDate();
    let difference = todaysYear - selectedYear;
    if (difference > 18) {
      const age = difference;

      if (selectedMonth < todayMonth) {
        let olderAge = difference;
        console.log("Age is ", olderAge);
        return olderAge;
      } else {
        if (selectedMonth === todayMonth) {
          //You Sir might have a change!
          if (selectedDay <= todaysDay) {
            let olderAge = difference;
            console.log("Age is ", olderAge);
            return olderAge;
          } else {
            let ageRemains = difference - 1;
            console.log("Age is ", ageRemains);
            return ageRemains;
          }
        } else {
          let ageRemains = difference - 1;
          console.log("Age is ", ageRemains);
          return ageRemains;
        }
      }
    } else {
      if (difference === 18) {
        //CHECK IF MONTH IS MORE THAN TODAYS MONTH
        if (selectedMonth < todayMonth) {
          let olderAge = difference;
          console.log("Age is ", olderAge);
          return olderAge;
        } else {
          if (selectedMonth === todayMonth) {
            //You Sir might have a change!
            if (selectedDay <= todaysDay) {
              let olderAge = difference;
              console.log("Age is ", olderAge);
              return olderAge;
            } else {
              let ageRemains = difference - 1;
              console.log("Age is ", ageRemains);
              return ageRemains;
            }
          } else {
            let ageRemains = difference - 1;
            console.log("Age is ", ageRemains);
            return ageRemains;
          }
        }
      } else {
        return null;
      }
    }
  }
};
