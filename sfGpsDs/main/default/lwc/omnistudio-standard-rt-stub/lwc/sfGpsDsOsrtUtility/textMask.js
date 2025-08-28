function textMask(val, mask, event) {
  if (!val || !mask) {
    return val;
  }
  if (event && event.type === "keydown" && val && event.keyCode === 8) {
    let target = event.target;
    let char = target.value[target.selectionStart - 1];
    let reg = new RegExp("\\" + char, "g");
    let maskCharCount = mask.match(reg) ? mask.match(reg).length : 0;
    let strCharCount = target.value.match(reg)
      ? target.value.match(reg).length
      : 0;
    if (
      mask.indexOf(char) !== -1 &&
      maskCharCount &&
      maskCharCount === strCharCount &&
      target &&
      target.selectionStart &&
      target.selectionEnd
    ) {
      target.selectionStart = target.selectionEnd = target.selectionStart - 1;
      event.preventDefault();
      event.stopPropagation();
    }
  } else if ((event && event.type === "keyup") || !event) {
    if (
      typeof val === "string" &&
      val.length === 1 &&
      val.indexOf(mask) === -1
    ) {
      val = val + mask;
    } else {
      let maskArray = mask.split("");
      for (let i = 0; i < maskArray.length; i++) {
        if (val.indexOf(maskArray[i]) === -1) {
          val = val + mask;
          break;
        }
      }
    }
  }
  return val;
}

export default textMask;
