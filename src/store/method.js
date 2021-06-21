import general_constant from "../helpers/general_constant.json";
require("dotenv").config();

export const readMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};
