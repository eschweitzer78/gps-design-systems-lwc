function inputMask(val, mask, range, placeholder, event) {
  let target = event ? event.target : "",
    start = target ? target.selectionStart : "";
  if (
    (val || (!val && placeholder && range)) &&
    mask &&
    mask.indexOf("#") !== -1
  ) {
    if (event && event.type === "keydown") {
      let charCode = event.which || event.keyCode;
      if (
        event.keyCode !== 8 &&
        !event.metaKey &&
        event.key.length === 1 &&
        (((charCode < 48 || charCode > 57) && !event.key.match(/\.|-|\+/i)) ||
          (val.replace(/\D/g, "").replace(/^0+/, "").length === Number(range) &&
            Number(val.replace(/\D/g, "")) !== 0))
      ) {
        event.preventDefault();
        event.stopPropagation();
      } else if (
        event.keyCode === 8 &&
        !/^[0-9-]$/.test(target.value[start - 1]) &&
        target &&
        target.selectionStart &&
        target.selectionEnd
      ) {
        if (placeholder && range && val && val.indexOf("_") !== -1)
          target.selectionStart = target.selectionEnd = val.indexOf("_");
        else target.selectionStart = target.selectionEnd = start - 1;
        event.preventDefault();
        event.stopPropagation();
      }
    } else if ((event && event.type === "keyup") || !event) {
      let rangeCopy = range ? range : "";
      val = typeof val === "number" ? JSON.stringify(val) : val;
      if (
        event &&
        target &&
        target.selectionStart &&
        target.selectionEnd &&
        (event.keyCode === 8 ||
          placeholder ||
          (target.selectionStart !== val.length &&
            event.key &&
            event.key.length === 1))
      ) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(function () {
          target.selectionStart = target.selectionEnd = start;
        }, 0);
      }
      // To create a Regex Pattern for user defined mask.
      let createRegex = (str) => {
        if (
          (event && (event.key.length === 1 || event.keyCode === 8)) ||
          !event
        ) {
          let pretext = "",
            posttext = "",
            count = 0,
            seperator = [],
            maskCopy = mask;
          let decimal =
            maskCopy.lastIndexOf(".") !== -1 ? maskCopy.lastIndexOf(".") : "";
          let decimalCount = 0;
          if (maskCopy[decimal]) {
            // To extract the decimal point
            if (maskCopy[decimal + 1]) {
              for (let i = decimal + 1; i < maskCopy.length; i++) {
                if (maskCopy[i] && /^[0-9]$/.test(maskCopy[i])) {
                  maskCopy = maskCopy.slice(0, i) + "#" + maskCopy.slice(i + 1);
                  decimalCount++;
                }
              }
            } else
              maskCopy =
                maskCopy.slice(0, decimal) + maskCopy.slice(decimal + 1);
          }
          while (!/^#$/.test(maskCopy[0])) {
            // To extract the pretext
            pretext += maskCopy[0];
            maskCopy = maskCopy.slice(1);
          }
          while (!/^#$/.test(maskCopy[maskCopy.length - 1])) {
            // To extract the posttext
            posttext += maskCopy[maskCopy.length - 1];
            maskCopy = maskCopy.slice(0, -1);
          }
          for (let i = maskCopy.length - 1; i >= 0; i--) {
            // To keep the mask seprators in an array
            if (/^[#_]$/.test(maskCopy[i])) count++;
            else {
              if (count !== 0) {
                seperator.unshift(count);
                seperator.unshift(maskCopy[i]);
              } else if (count === 0) {
                seperator[0] = maskCopy[i] + seperator[0];
              }
              count = 0;
            }
          }
          /*** To remove pretext posttext and other special charecters from the string  *****/
          str = pretext ? str.replace(pretext, "") : str;
          str = posttext ? str.replace(posttext, "") : str;
          range = rangeCopy ? rangeCopy : str.replace(/\D/g, "").length;
          str =
            mask.indexOf(".") !== -1
              ? str.replace(/[^0-9.-]/g, "")
              : str.replace(/[^0-9-]/g, "");
          str = str === "0" ? str : str.replace(/^0+/, "");

          /*  Split decimal number and whole number from the string */
          let sign = Math.sign(str) === -1 ? "-" : "+";
          let decimalStr;
          if (str.indexOf(".") !== -1 && mask.indexOf(".") !== -1) {
            let strArray = str.split(".");
            str = strArray[0].replace(/\D/g, "");
            decimalStr = strArray[1] ? strArray[1].replace(/\D/g, "") : "";
            str = Number(str).toString();
          }
          str =
            rangeCopy && placeholder && decimalCount
              ? str.replace(/\D/g, "").substring(0, range - decimalCount)
              : decimalStr && range > decimalStr.length
                ? str.replace(/\D/g, "").substring(0, range - decimalStr.length)
                : str.replace(/\D/g, "").substring(0, range);
          /*  To create placeholder for mask */
          let strCopy = str;
          if (rangeCopy && placeholder) {
            str = decimalCount
              ? "9".repeat(rangeCopy - decimalCount)
              : "9".repeat(rangeCopy);
          }
          if (seperator.length > 0) {
            // To format input value using mask.
            let extraStr = "";
            if (seperator[seperator.length - 2] === ".") {
              // To format input value with decimals using mask.
              if (decimalStr)
                decimalStr = decimalStr.substring(0, decimalCount);
              else
                decimalStr =
                  rangeCopy && placeholder
                    ? "_".repeat(decimalCount)
                    : "0".repeat(decimalCount);
              if (
                rangeCopy &&
                placeholder &&
                decimalStr.length !== decimalCount &&
                decimalCount > decimalStr.length
              ) {
                decimalStr =
                  decimalStr + "_".repeat(decimalCount - decimalStr.length);
              }
            }
            if (seperator.length > 2) {
              for (let i = seperator.length - 2; i >= 2; i -= 2) {
                if (
                  seperator[i] &&
                  seperator[i + 1] &&
                  ((seperator[i] !== "." && i === seperator.length - 2) ||
                    i !== seperator.length - 2)
                ) {
                  if (str.length > seperator[i + 1]) {
                    extraStr =
                      seperator[i] + str.slice(-seperator[i + 1]) + extraStr;
                    str =
                      str.length > seperator[i + 1]
                        ? str.slice(0, str.length - seperator[i + 1])
                        : str;
                  }
                }
              }
            }
            // Formatting throughout the  string
            if (seperator[0] && seperator[1] && seperator[0] !== ".") {
              let reg = new RegExp(
                "(\\d)(?=(\\d{" + seperator[1] + "})+(?!\\d))",
                "g"
              );
              str = str.replace(reg, "$1" + seperator[0]);
            }
            if (extraStr) str += extraStr;
            // Formatting the  string with placeholder
            if (rangeCopy && str && placeholder) {
              str = str.replace(/9/g, "_");
              if (strCopy && Number(strCopy) !== 0 && Number(strCopy)) {
                let j = 0;
                for (let i = 0; i < str.length; i++) {
                  if (strCopy[j]) {
                    if (str[i] === "_") {
                      str = str.substr(0, i) + strCopy[j] + str.substr(i + 1);
                      j++;
                    }
                  } else break;
                }
              }
            }
          }
          str =
            (sign === "-" ? sign : "") +
            str +
            (decimalStr ? "." + decimalStr : "");
          str = str.length > 0 ? pretext + str + posttext : ""; // Adding the pretext and posttext to the formatted value.
          /**** Cursor postion for string with placeholder ****/
          if (
            event &&
            start &&
            (event.keyCode === 8 || event.key.length === 1) &&
            !event.metaKey &&
            placeholder &&
            range &&
            str
          ) {
            if (event.keyCode === 8) {
              while (!/^[0-9_]$/.test(str[start - 1]) && start > 0) {
                start = start - 1;
              }
              start =
                start === 0 && str.indexOf("_") !== -1
                  ? str.indexOf("_")
                  : start;
            } else {
              while (!/^[0-9_]$/.test(str[start]) && start < str.length) {
                start = start + 1;
              }
            }
          }
          return str;
        }
        return str;
      };
      let str = createRegex(val);
      return str;
    }
  }
  return val;
}

export default inputMask;
