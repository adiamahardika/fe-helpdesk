import general_constant from "../../../helpers/general_constant.json";
require("dotenv").config();

export const createUserMethod = async (data) => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/user/add`, {
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

export const readUserMethod = async (data) => {
  const size = data.size || 10;
  const page_no = data.page_no || 0;
  const search = data.search || "*";
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/user/${search}/${size}/${page_no}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const readUserDetailMethod = async (data) => {
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/user/${data}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const updateUserMethod = async (data) => {
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/user/edituser`,
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    }
  );
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const updateUserProfileMethod = async (data) => {
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/user/edit-user-profile`,
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    }
  );
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};

export const deleteUserMethod = async (data) => {
  const size = data.size || 10;
  const page_no = data.page_no || 0;
  const search = data.search || "*";
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/user/${data.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      mode: "cors",
    }
  );
  const responseGet = await fetch(
    `${process.env.REACT_APP_API}/api/user/${search}/${size}/${page_no}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
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

export const resetPasswordMethod = async (data) => {
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/resetpassword`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    }
  );
  if (response.status === general_constant.unauthorized_status) {
    localStorage.clear();
    window.location.assign("/login");
  } else {
    return response.json();
  }
};
