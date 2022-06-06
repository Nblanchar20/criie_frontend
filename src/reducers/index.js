const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT_REQUEST":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGIN_SESION":
      return {
        ...state,
        sesion: action.payload,
      };
    case "LOGOUT_SESION":
      return {
        ...state,
        sesion: action.payload,
      };
    case "PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "ROWS_PER_PAGE":
      return {
        ...state,
        rowsPerPage: action.payload,
      };
    case "BREADCRUMP":
      return {
        ...state,
        crump: action.payload,
      };
    case "PERMISSION":
      return {
        ...state,
        permission: action.payload,
      };
    case "TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "DRAWER":
      return {
        ...state,
        drawer: action.payload,
      };
    case "DEFAULT_EXPANDED":
      return {
        ...state,
        expanded: action.payload,
      };
    case "DEFAULT_SELECTED":
      return {
        ...state,
        selected: action.payload,
      };
    case "SESSION":
      return {
        ...state,
        session: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
