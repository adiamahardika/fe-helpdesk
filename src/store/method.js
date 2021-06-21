import general_constant from "../helpers/general_constant.json";
require("dotenv").config();

export const getMethod = async (data) => {
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

export const postMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify(data.body),
  });
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const putMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify(data.body),
  });
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const deleteMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.delete_url, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  const responseGet = await fetch(process.env.REACT_APP_API + data.read_url, {
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
  } else if (
    response.json().responseCode === general_constant.success_response_code
  ) {
    return response.json();
  } else {
    return responseGet.json();
  }
};
