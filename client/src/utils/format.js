export function formatDateToLocaleDateString(datestring) {
  return new Date(datestring).toLocaleDateString();
}

// Returns date in format dd/mm/yyyy as string
export function formatDate(datestring) {
  let d = new Date(datestring);
  let hours = d.getHours();
  let minutes = d.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${d.getDate()}.${
    d.getMonth() + 1
  }.${d.getFullYear()}, ${hours}:${minutes}`;
}

export function getTime(datestring) {
  let d = new Date(datestring);
  let hours = d.getHours();
  let minutes = d.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

export function getYear(date) {
  return new Date(date).getFullYear();
}

export function validateTime(input) {
  return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(input);
}

// Capitalize all the words in given string. Takes account all the characters like "-", "'" etc.
export function capitalize_words(str) {
  return str.replace(
    /(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,
    function (txt) {
      return txt.toUpperCase();
    },
  );
}

export function replaceAllChars(text, obj) {
  return [...text]
    .map((each) => {
      for (const o in obj) {
        each == o ? (each = obj[o]) : o;
      }
      return each;
    })
    .join("");
}

// For naming the pdf, replace certain characters
export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// Custom range function for for loop, with recursion which is more efficient
export function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}

export function sortBy(field, isAscending) {
  return function (a, b) {
    if (isAscending) {
      return (b[field] < a[field]) - (b[field] > a[field]);
    } else {
      return (b[field] > a[field]) - (b[field] < a[field]);
    }
  };
}

export function isNumber(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    if (charCode == 46) {
      evt.preventDefault();
    } else {
      return true;
    }
  }
}
