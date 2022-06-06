import React, { useEffect, useState } from "react";
import { makeStyles, TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";
import axios from "../api";

const SearchBar = (props) => {
  const { placeholder = "Buscar", tableName, items, setItems, token } = props;
  const classes = useStyles();
  const [filtro, setFiltro] = useState("");
  const [parameters, setParameters] = useState([]);

  const handleChange = (e) => {
    setFiltro(e.target.value);
  };

  useEffect(() => {
    getParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getParameters = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      { id: 1 },
      {
        headers: { "access-token": token },
      }
    );
    setParameters(
      data?.parameters[0]?.valoresParametros?.sort((a, b) =>
        a.orden < b.orden ? -1 : 1
      )
    );
  };

  const getOrigin = (vp_procedencia) => {
    let vp = "";
    parameters.map(
      (item) => item.id === vp_procedencia && (vp = item.valor_parametro)
    );
    return vp;
  };

  useEffect(() => {
    if (items) {
      switch (tableName) {
        case "userGroup":
          setItems(
            items.filter((data) =>
              data.nombre.toLowerCase().includes(filtro.toLowerCase())
            )
          );
          break;
        case "modules":
          setItems(
            items.filter((data) =>
              data.nombre.toLowerCase().includes(filtro.toLowerCase())
            )
          );
          break;
        case "actions":
          setItems(
            items.filter((data) =>
              data.nombre.toLowerCase().includes(filtro.toLowerCase())
            )
          );
          break;
        case "permissions":
          setItems(
            items.filter(
              (data) =>
                data.grupoUsuarios?.nombre
                  .toLowerCase()
                  .includes(filtro.toLowerCase()) ||
                data.modulosAcciones?.modulos?.nombre
                  .toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        case "parameters":
          setItems(
            items.filter((data) =>
              data.nombre_parametro.toLowerCase().includes(filtro.toLowerCase())
            )
          );
          break;
        case "sessions":
          setItems(
            items.filter(
              (data) =>
                moment(data.fecha_sesion)
                  .format("DD/MM/YYYY")
                  .includes(filtro.toLowerCase()) ||
                data.sesion_id.toLowerCase().includes(filtro.toLowerCase()) ||
                `${data.usuarios?.primer_nombre} ${data.usuarios?.primer_apellido}`
                  .toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        case "users":
          setItems(
            items.filter(
              (data) =>
                data.nombres?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.apellidos?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.documento?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.email?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.telefono?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.grupoUsuarios?.nombre
                  .toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        case "yellow":
          setItems(
            items.filter(
              (data) =>
                data.nombres?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.apellidos?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.documento?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.telefono?.toLowerCase().includes(filtro.toLowerCase()) ||
                getOrigin(data.vp_procedencia)
                  .toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        case "blue":
          setItems(
            items.filter(
              (data) =>
                data.nombres?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.apellidos?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.documento?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.telefono?.toLowerCase().includes(filtro.toLowerCase()) ||
                `${data.amarillos?.nombres} ${data.amarillos?.apellidos}`
                  .toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        case "red":
          setItems(
            items.filter(
              (data) =>
                data.nombres?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.apellidos?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.documento?.toLowerCase().includes(filtro.toLowerCase()) ||
                data.telefono?.toLowerCase().includes(filtro.toLowerCase()) ||
                `${data.azules?.nombres} ${data.azules?.apellidos}`
                  .toLowerCase()
                  .includes(filtro.toLowerCase()) ||
                `${data.azules?.amarillos?.nombres} ${data.azules?.amarillos?.apellidos}`
                  .toLowerCase()
                  .includes(filtro.toLowerCase()) ||
                data.localidades?.valor_parametro
                  ?.toLowerCase()
                  .includes(filtro.toLowerCase())
            )
          );
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  return (
    <TextField
      fullWidth
      id="search-input"
      name="filtro"
      type="search"
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={filtro}
      onChange={handleChange}
      className={classes.textField}
      InputProps={{
        classes: {
          root: classes.container__input_root,
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className={classes.icon} />
          </InputAdornment>
        ),
      }}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    marginRight: ".5em",
  },
  icon: {
    color: "#9B9B9B",
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

export default SearchBar;
