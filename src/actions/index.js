export const loginRequest = (payload) => ({
  type: "LOGIN_REQUEST",
  payload,
});

export const logoutRequest = (payload) => ({
  type: "LOGOUT_REQUEST",
  payload,
});

export const loginSesion = (payload) => ({
  type: "LOGIN_SESION",
  payload,
});

export const logoutSesion = (payload) => ({
  type: "LOGOUT_SESION",
  payload,
});

export const setPage = (payload) => ({
  type: "PAGE",
  payload,
});

export const setRowsPerPage = (payload) => ({
  type: "ROWS_PER_PAGE",
  payload,
});

export const setBreadcrumps = (payload) => ({
  type: "BREADCRUMP",
  payload,
});

export const setPermissions = (payload) => ({
  type: "PERMISSION",
  payload,
});

export const setToken = (payload) => ({
  type: "TOKEN",
  payload,
});

export const setDrawer = (payload) => ({
  type: "DRAWER",
  payload,
});

export const setExpanded = (payload) => ({
  type: "DEFAULT_EXPANDED",
  payload,
});

export const setSelected = (payload) => ({
  type: "DEFAULT_SELECTED",
  payload,
});

export const setSession = (payload) => ({
  type: "SESSION",
  payload,
});
