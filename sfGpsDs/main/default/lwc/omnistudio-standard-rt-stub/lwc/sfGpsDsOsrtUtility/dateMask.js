function dateMask(val, mask, event) {
  let target = event.target,
    start = target.selectionStart,
    dateStr;
  mask = mask.toLowerCase();

  // To get the number of days in a month.
  let daysInMonth = function (m, y) {
    if (m === 1) return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
    else if (m === 8 || m === 3 || m === 5 || m === 10) return 30;
    return 31;
  };
  // To valid date
  let isDateValid = (regs) => {
    let yearMax = JSON.stringify(new Date().getFullYear() + 100);
    let yearMin = JSON.stringify(new Date().getFullYear() - 100);
    if (
      regs[0] <= yearMax.substring(0, regs[0].length) &&
      regs[0] >= yearMin.substring(0, regs[0].length) &&
      (!regs[1] ||
        (regs[1].length > 1 && regs[1] > 0 && regs[1] < 13) ||
        (regs[1].length === 1 && regs[1] >= 0)) &&
      (!regs[2] ||
        (regs[2].length > 1 &&
          regs[2] > 0 &&
          regs[2] <= daysInMonth(regs[1] - 1, regs[0])) ||
        (regs[2].length === 1 && regs[2] >= 0))
    )
      return true;
    return false;
  };
  // To format date entered by user
  let checkDate = (str) => {
    if (
      event.key.length === 1 ||
      !event.keyCode ||
      (event.keyCode === 8 &&
        target &&
        target.selectionStart &&
        target.selectionEnd)
    ) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(function () {
        target.selectionStart = target.selectionEnd = start;
      }, 0);
      let seperator = mask.indexOf("-") !== -1 ? "-" : "/";
      if (
        /^-?\d*[-]?\d*$/.test(str[target.selectionStart - 1]) ||
        !event.keyCode ||
        event.keyCode === 8
      ) {
        if (event.keyCode === 8) {
          // If user enters backspace
          if (
            (seperator === "-" && (str.match(/-/g) || []).length < 2) ||
            (seperator === "/" && (str.match(/\//g) || []).length < 2)
          ) {
            str =
              seperator === "-"
                ? str.replace(/-/g, "")
                : str.replace(/\//g, "");
            if (mask === "yyyy-mm-dd" || mask === "yyyy/mm/dd")
              return str.length > 0
                ? str.length < 7
                  ? str.replace(
                      /(\w{4})(\w{1})/,
                      mask === "yyyy-mm-dd" ? "$1-$2" : "$1/$2"
                    )
                  : str
                      .replace(
                        /(\w{4})(\w{2})(\w{1})/,
                        mask === "yyyy-mm-dd" ? "$1-$2-$3" : "$1/$2/$3"
                      )
                      .substring(0, 10)
                : "";
            return str.length > 0
              ? str.length < 5
                ? str.replace(
                    /(\w{2})(\w{1})/,
                    mask === "dd-mm-yyyy" ? "$1-$2" : "$1/$2"
                  )
                : str
                    .replace(
                      /(\w{2})(\w{2})(\w{1})/,
                      mask === "dd-mm-yyyy" ? "$1-$2-$3" : "$1/$2/$3"
                    )
                    .substring(0, 10)
              : "";
          }
          return str.length !== 10
            ? str.replace(/\D/g, "").length !== 0
              ? str.slice(0, target.selectionStart) +
                "_" +
                str.slice(target.selectionStart)
              : ""
            : str;
        } else if (str.indexOf("_") === -1 && str.length > 10) {
          // If user enters more than 8 digits.
          str =
            str.slice(0, target.selectionStart - 1) +
            str.slice(target.selectionStart);
          return str.substring(0, 10);
        } else if (/^\d+$/.test(str[target.selectionStart]) && str.length > 10)
          return (
            str.slice(0, target.selectionStart - 1) +
            str.slice(target.selectionStart)
          );
        // validate the date when user enters each digit.
        str = str.slice(0, start) + str.slice(start + 1);
        str =
          seperator === "-" ? str.replace(/-/g, "") : str.replace(/\//g, "");
        if (mask === "yyyy-mm-dd" || mask === "yyyy/mm/dd")
          str =
            str.length < 7
              ? str.replace(
                  /(\w{4})(\w{1})/,
                  mask === "yyyy-mm-dd" ? "$1-$2" : "$1/$2"
                )
              : str
                  .replace(
                    /(\w{4})(\w{2})(\w{1})/,
                    mask === "yyyy-mm-dd" ? "$1-$2-$3" : "$1/$2/$3"
                  )
                  .substring(0, 10);
        else
          str =
            str.length < 5
              ? str.replace(
                  /(\w{2})(\w{1})/,
                  mask === "dd-mm-yyyy" ? "$1-$2" : "$1/$2"
                )
              : str
                  .replace(
                    /(\w{2})(\w{2})(\w{1})/,
                    mask === "dd-mm-yyyy" ? "$1-$2-$3" : "$1/$2/$3"
                  )
                  .substring(0, 10);
        start =
          str[target.selectionStart - 1] === seperator
            ? target.selectionStart + 1
            : target.selectionStart;
        let strArr = str.split(seperator);
        for (let i = 0; i < 3; i++) {
          strArr[i] = strArr[i] ? strArr[i].replace(/_/g, "") : "";
        }
        let regs = [strArr[0], strArr[1], strArr[2]];
        regs = mask[0].toLowerCase() === "y" ? regs : regs.reverse();
        let validDate = isDateValid(regs);
        if (validDate) {
          start = str[target.selectionStart] === seperator ? start + 1 : start;
          return str;
        }
        start =
          str[target.selectionStart - 1] === seperator ? start : start - 1;
        let index =
          str[target.selectionStart - 1] === seperator
            ? target.selectionStart
            : target.selectionStart - 1;
        str = str.slice(0, index) + "_" + str.slice(index + 1);
        return str.substring(0, 10);
      }
      start--;
      return event.key.length === 1 && target.selectionStart > 0
        ? val.slice(0, target.selectionStart - 1) +
            val.slice(target.selectionStart)
        : val;
    }
    return str;
  };

  switch (mask) {
    case "yyyy-mm-dd":
    case "dd-mm-yyyy":
    case "yyyy/mm/dd":
      dateStr = checkDate(val);
      return dateStr;
    case "dd/mm/yyyy":
      dateStr = checkDate(val);
      event.target.dataset.value = dateStr;
      return dateStr;
    default:
      return dateStr;
  }
}

export default dateMask;
