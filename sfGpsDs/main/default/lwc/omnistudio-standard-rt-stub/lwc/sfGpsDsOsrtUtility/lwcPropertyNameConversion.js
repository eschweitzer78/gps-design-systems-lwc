function lwcPropertyNameConversion(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export default lwcPropertyNameConversion;
