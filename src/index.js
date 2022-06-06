import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index";
import { loadState, saveState } from "./utils/localStorage";
import { createBrowserHistory } from "history";
import { Router } from "react-router";

if (typeof window !== "undefined") {
  const initialState = loadState() || {
    page: 0,
    rowsPerPage: 10,
    drawer: false,
    expanded: true,
    selected: "panel1",
  };

  let composeEnhacers;
  if (process.env.NODE_ENV === "production") composeEnhacers = compose;
  else composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhacers(applyMiddleware(thunk))
  );
  const history = createBrowserHistory();

  store.subscribe(() => {
    saveState(store.getState());
  });

  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
}

reportWebVitals();
