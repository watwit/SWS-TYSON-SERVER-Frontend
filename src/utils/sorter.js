export const sorterStringWithNull = (a, b, key) => {
    if (a[key] == null || b[key] == null) {
        if (a[key] == null && b[key] == null) {
            return 0;
        } else if (a[key] == null) {
            return 1;
        } else {
            return -1;
        }
    }
    return a[key].localeCompare(b[key]);
  };
  
export const sorterNumerWithNull = (a, b, key) => {
    if (isNaN(a[key]) || isNaN(b[key])) {
        if (isNaN(a[key]) && isNaN(b[key])) {
            return 0;
        } else if (a[key] == null) {
            return 1;
        } else {
            return -1;
        }
    }
    return a[key]-(b[key]);
  };