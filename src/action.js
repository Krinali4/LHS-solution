export const callApi = (
  method = "GET",
  endpoint,
  auth = {},
  data = {},
  file = false
) => {
  method = method ? method : "GET";
  let fullUrl = process.env.REACT_APP_LHS_URL + endpoint;
  let options = {
    headers: {
      "Content-Type": "application/json",
      "X-My-Custom-Header": "value-v",
      Authorization: auth ? auth : "",
    },
    crossDomain: true,
    method: method,
  };
  if (["POST", "PUT", "PATCH"].indexOf(method) > -1)
    options.body = JSON.stringify(data);

  if (file) {
    const formData = new FormData();
    formData.append("media", data.file, data.file.name);
    options = {
      method: "POST",
      body: formData,
    };
  }
  console.log(options);

  return fetch(fullUrl, options)
    .then((response) => {
      if (!response.ok) {
        const error = Object.assign({}, response, {
          response,
          response,
          status: response.status,
          statusText: response.statusText,
        });
        return Promise.reject(error);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") > -1) {
        return response
          .json()
          .then((json) => {
            if ([200, 403].indexOf(response.status) === -1)
              throw new Error(response.status);
            if ([304, 403].indexOf(response.status) > -1)
              throw new Error(response.status);
            if (Array.isArray(json)) return [...json];
            else return { ...json };
          })
          .catch(() => {
            throw new Error(response.status);
          });
      } else {
        return {};
      }
    })
    .catch((error) => {
      if (error.status === 401) {
        removeSession();
        // window.location.href = '/login';
      }
      console.log(error);
      return error;
    });
};

export const setSession = (token, _id, userType, data) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("_id", _id);
  localStorage.setItem("type", userType);

  if (data) {
    localStorage.setItem("adminDetails", JSON.stringify(data));
  }
};

export const removeSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("_id");
  localStorage.removeItem("type");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("company_email_address");
  localStorage.removeItem("phone_number");
  localStorage.removeItem("password");
  localStorage.removeItem("repassword");
  localStorage.removeItem("role_id");
  localStorage.removeItem("ein");
  localStorage.removeItem("institution_name");
  localStorage.removeItem("institution_size");
  localStorage.removeItem("institution_website");
  localStorage.removeItem("zip_code");
  localStorage.removeItem("hoscity");
  localStorage.removeItem("hosstate");
  localStorage.removeItem("hosstreet_address");
};
