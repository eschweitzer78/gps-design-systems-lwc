function dynamicSort(field, reverse, primer) {
  var key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (
      (a = key(a)),
      (b = key(b)),
      reverse * ((a > b ? 1 : -1) - (b > a ? 1 : -1))
    );
  };
}

export default dynamicSort;
