import general_constant from "../helpers/general_constant.json";
require("dotenv").config();

const refreshToken = async () => {
  await fetch(process.env.REACT_APP_API + "/v1/auth/refresh-token", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
    },
  })
    .then((response) => response.json())
    .then((value) => {
      sessionStorage.setItem("accessToken", value.response.accessToken);
    });
};

export const getMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
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
    sessionStorage.clear();
    window.location.assign("/login");
  } else {
    return parse;
  }
};

export const postMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
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
    return await postMethod(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    sessionStorage.clear();
    window.location.assign("/login");
  } else {
    return parse;
  }
};

export const postMethodWithFile = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "POST",
    mode: "cors",
    headers: {
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
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
    sessionStorage.clear();
    window.location.assign("/login");
  } else {
    return parse;
  }
};

export const putMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
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
    sessionStorage.clear();
    window.location.assign("/login");
  } else {
    return parse;
  }
};

export const deleteMethod = async (data) => {
  const response = await fetch(process.env.REACT_APP_API + data.delete_url, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
    },
  });
  const responseGet = await fetch(process.env.REACT_APP_API + data.read_url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("accessToken"),
      "signature-key": sessionStorage.getItem("signatureKey"),
      "request-by": sessionStorage.getItem("username"),
    },
  });

  const parse = response.json();
  let item = null;
  await parse.then((value) => (item = value));
  if (
    item.status.responseCode === general_constant.expired_token_response_code
  ) {
    await refreshToken();
    return await deleteMethod(data);
  } else if (
    item.status.httpStatusCode === general_constant.unauthorized_status
  ) {
    sessionStorage.clear();
    window.location.assign("/login");
  } else if (item.status.responseCode === general_constant.success_message) {
    return parse;
  } else {
    return responseGet.json();
  }
};
