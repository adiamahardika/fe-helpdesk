export const parseFullDate = (time) => {
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
    date.getFullYear() +
    ", " +
    ("0" + date.getHours()).slice(-2) +
    "." +
    ("0" + date.getMinutes()).slice(-2)
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
