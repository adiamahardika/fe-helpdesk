export const parseFullDate = (time) => {
  let date = new Date(time);
  date.setTime(date.getTime() - 7 * 60 * 60 * 1000);
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];
  return (
    ("0" + date.getDate()).slice(-2) +
    " " +
    monthName +
    " " +
    date.getFullYear() +
    ", " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2)
  );
};

export const parseDate = (time) => {
  let date = new Date(time);
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];
  return (
    ("0" + date.getDate()).slice(-2) +
    " " +
    monthName +
    " " +
    date.getFullYear()
  );
};

export const parseDateAndMonth = (time) => {
  let date = time;
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];
  return monthName + " " + ("0" + date.getDate()).slice(-2);
};

export const parseToRupiah = (number) => {
  var rupiah = "";
  var numberrev = number.toString().split("").reverse().join("");
  for (var i = 0; i < numberrev.length; i++)
    if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";
  return (
    "Rp. " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};

export const getShortDate = (time) => {
  let parse = new Date(time);
  let year = parse.getFullYear();
  let month = "" + (parse.getMonth() + 1);
  let date = "" + parse.getDate();
  if (month.length < 2) month = "0" + month;
  if (date.length < 2) date = "0" + date;

  return year + "-" + month + "-" + date;
};

export const emailValidation = (value) => {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(value);
};
