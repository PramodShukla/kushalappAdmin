/* =========================================
   Auth Utilities (global use)
========================================= */

export const setAuth = (data) => {
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("admin", JSON.stringify(data.admin));
};

export const getAuth = () => {
  return JSON.parse(localStorage.getItem("admin"));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("admin");

  window.location.href = "/login"; // force redirect
};
