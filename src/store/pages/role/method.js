import general_constant from "../../../helpers/general_constant.json";
require("dotenv").config();

export const createRoleMethod = async (data) => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/role`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify(data),
  });
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const readRoleMethod = async () => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/role`, {
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

export const updateRoleMethod = async ({ data }) => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/role`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify(data),
  });
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const deleteRoleMethod = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/role/${id}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  const responseGet = await fetch(`${process.env.REACT_APP_API}/api/role`, {
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
