import general_constant from "../helpers/general_constant.json";
import routes from "../helpers/routes.json";
require("dotenv").config();

const refreshToken = async () => {
  console.log("refresh");
  const now = new Date();
  const token = localStorage.getItem("accessToken");
  const jwtPayload = JSON.parse(window.atob(token.split(".")[1]));
  const exp = jwtPayload.exp * 1000;
  const min = exp - now;

  if (min < -10760000) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else {
    await fetch(process.env.REACT_APP_API + "/v1/auth/refresh-token", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        "signature-key": localStorage.getItem("signatureKey"),
        "request-by": localStorage.getItem("username"),
      },
    })
      .then((response) => response.json())
      .then((value) => {
        localStorage.setItem("accessToken", value.response.accessToken);
      });
  }
};

export const getMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
  });

  const parse = response.json();
  let item = null;
  await parse.then((value) => (item = value));
  if (
    item.status.responseCode === general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await getMethod(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else {
    return item;
  }
};

export const postMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
    body: JSON.stringify(data.body),
  });
  const parse = response.json();
  let item = null;
  await parse.then((value) => (item = value));
  if (
    response.status.responseCode ===
    general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await postMethod(data);
  } else if (
    response.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else {
    return item;
  }
};

export const postMethodWithFile = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "POST",
    mode: "cors",
    headers: {
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
    body: data.body,
  });

  const parse = response.json();
  let item = null;
  await parse.then((value) => (item = value));
  if (
    item.status.responseCode === general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await postMethodWithFile(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else {
    return item;
  }
};

export const putMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
    body: JSON.stringify(data.body),
  });

  const parse = response.json();
  let item = null;
  await parse.then((value) => (item = value));
  if (
    item.status.responseCode === general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await putMethod(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else {
    return item;
  }
};

export const deleteMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.delete_url, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
  });
  const responseGet = await fetch(process.env.REACT_APP_API + data.read_url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("accessToken"),
      "signature-key": localStorage.getItem("signatureKey"),
      "request-by": localStorage.getItem("username"),
    },
  });

  const parse = response.json();
  const parseResponseGet = responseGet.json();
  let item = null;
  let itemGet = null;
  await parse.then((value) => (item = value));
  await parseResponseGet.then((value) => (itemGet = value));
  if (
    item.status.responseCode === general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await deleteMethod(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    localStorage.clear();
    window.location.assign(routes.login);
  } else if (item.status.responseCode === general_constant.success_message) {
    return item;
  } else {
    return itemGet;
  }
};
