import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@material-ui/core";
import { setBreadcrumps } from "../../../actions";
import { encrypt } from "../../../utils/crypt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { HighlightOff, FindInPageOutlined } from "@material-ui/icons";
import Table from "../../../components/Table";
import Header from "../../../components/Header";
import axios from "../../../api";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";

function Parameters(props) {
  const { userId, page, rowsPerPage, setBreadcrumps, permission, token } =
    props;
  const history = useHistory();
  const theme = useTheme();
  const [parameters, setParameters] = useState([]);
  const [parametersValue, setParametersValue] = useState(parameters);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getParameters();
      setBreadcrumps([{ name: "Configuración" }, { name: "Parámetros" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getParameters = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setParameters(data.parameters);
    setParametersValue(data.parameters);
    setFiltro(data.parameters);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/parameters/edit/${encrypt(id)}`);
        break;
      case "view":
        setParametersValue(parameters.filter((item) => item.id === id));
        setOpenDialog(true);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este parámetro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendDelete(id);
      }
    });
  };

  const sendDelete = async (id) => {
    setLoading(true);
    const { data } = await axios.delete(`/parameter/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data) {
      setFiltro(filtro.filter((item) => item.id !== id));
      setParameters(parameters.filter((item) => item.id !== id));
      setLoading(false);
      Swal.fire({
        text: "Eliminado exitosamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      setLoading(false);
      Swal.fire({
        text: "No se ha podido eliminar.",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        Parámetro: item.nombre_parametro,
        "Valores parámetros": item.valoresParametros
          ?.sort((a, b) => (a.orden < b.orden ? -1 : 1))
          .map((value) => `${value.orden} - ${value.valor_parametro}`)
          .toString(),
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <>
      <Paper elevation={3}>
        <Header
          search={true}
          button={permission.includes(2) ? true : false}
          exportButton={permission.includes(5) ? true : false}
          dataToExcel={{ csvData: dataExcel, fileName: "Parámetros" }}
          buttonText={"Crear"}
          buttonRoute={"/parameters/create"}
          tableName={"parameters"}
          items={parameters}
          setItems={setFiltro}
        />
        <Table columns={columns} rows={filtro}>
          <TableBody>
            {filtro.length > 0 ? (
              <>
                {filtro
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={`row${index}`}>
                      <TableCell align="center">
                        {row.nombre_parametro}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver valores">
                          <IconButton
                            aria-label="parameters"
                            onClick={(e) => handleClick(e, row.id, "view")}
                          >
                            <Typography style={{ color: "#3C3C3C" }}>
                              {row.valoresParametros?.length}
                            </Typography>
                            <FindInPageOutlined />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {permission.includes(3) && (
                          <Tooltip title="Editar">
                            <IconButton
                              aria-label="edit"
                              onClick={(e) => handleClick(e, row.id, "edit")}
                            >
                              <FontAwesomeIcon icon={faEdit} size={"xs"} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {permission.includes(4) && (
                          <Tooltip title="Eliminar">
                            <IconButton
                              aria-label="delete"
                              onClick={(e) => handleClick(e, row.id, "delete")}
                            >
                              <HighlightOff />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableCell align="center" colSpan="4">
                No hay datos registrados
              </TableCell>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth={false}
        scroll={"body"}
        maxWidth={"xs"}
      >
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <b>N°</b>
              </ListItemIcon>
              <ListItemText>
                <b>Valor parámetro</b>
              </ListItemText>
            </ListItem>
            <Divider />
            {parametersValue.length > 0 ? (
              <>
                {parametersValue[0].valoresParametros
                  ?.sort((a, b) => (a.orden < b.orden ? -1 : 1))
                  .map((item) => (
                    <ListItem key={item.id}>
                      <ListItemIcon>{item.orden}</ListItemIcon>
                      <ListItemText>{item.valor_parametro}</ListItemText>
                    </ListItem>
                  ))}
              </>
            ) : (
              ""
            )}
          </List>
        </DialogContent>
      </Dialog>
      <Backdrop loading={loading} />
    </>
  );
}

const columns = [
  { id: "parameter", label: "Parámetro", align: "center" },
  { id: "value", label: "Valores parámetros", align: "center" },
  { id: "actions", label: "", align: "center", minWidth: 10, colSpan: 2 },
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 6)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
