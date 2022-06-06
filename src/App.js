import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import Routes from "./routes/index";
//import Theme from "./assets/styles/theme";
import "./App.css";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={'es'}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
