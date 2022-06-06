import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  useTheme,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Collapse,
  Box,
  Typography,
  TableHead,
  Table as MuiTable,
  Button,
} from "@material-ui/core";
import { setBreadcrumps } from "../../../actions";
import { encrypt } from "../../../utils/crypt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Table from "../../../components/Table";
import Header from "../../../components/Header";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import axios from "../../../api";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

function Row(props) {
  const { row, index, permission, handleClick } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow key={`row${index}`}>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <img
            style={{ maxWidth: "15em" }}
            src={`${axios.defaults.baseURL}${row.url_imagen}`}
            alt="foto_recurso_ludico"
          />
        </TableCell>
        <TableCell align="center">{row.nombre}</TableCell>
        <TableCell align="center">{row.descripcion}</TableCell>
        <TableCell align="center">{row?.espacio?.nombre}</TableCell>
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
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} style={{ maxWidth: "100%" }}>
              <Typography variant="h6" gutterBottom component="div">
                Existencias
              </Typography>
              <Button
                color="primary"
                variant="contained"
                onClick={(e) => {
                  handleClick(e, row.id, "createResource", index);
                }}
              >
                Añadir
              </Button>
              <MuiTable size="small" aria-label="existences">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Código de barras</TableCell>
                    <TableCell colSpan="2" align="center">
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.existencias?.length > 0 ? (
                    row?.existencias?.map((existenceRow) => (
                      <TableRow key={existenceRow.id}>
                        <TableCell align="center" component="th" scope="row">
                          {existenceRow.codigo_barras}
                        </TableCell>
                        <TableCell align="center">
                          {permission.includes(3) && (
                            <Tooltip title="Editar">
                              <IconButton
                                aria-label="edit"
                                onClick={(e) =>
                                  handleClick(
                                    e,
                                    existenceRow.id,
                                    "editExistence",
                                    row
                                  )
                                }
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
                                onClick={(e) =>
                                  handleClick(
                                    e,
                                    existenceRow.id,
                                    "deleteExistence",
                                    index
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableCell colSpan="7" align="center">
                      No existe ninguna existencia para este recurso lúdico
                    </TableCell>
                  )}
                </TableBody>
              </MuiTable>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
function LudicResourcesManageList(props) {
  const { userId, page, rowsPerPage, setBreadcrumps, permission, token } =
    props;
  const history = useHistory();
  const theme = useTheme();
  const [ludic, setLudic] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([
        { name: "Recursos lúdicos" },
        { name: "Gestión de recursos lúdicos" },
      ]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getSpots = async () => {
    const { data } = await axios.post(
      `/ludicResources/getLudicResources`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setLudic(data?.ludicResources);
    setFiltro(data?.ludicResources);
    dataToExcel(data?.ludicResources);
  };

  const createResource = (id, index) => {
    Swal.fire({
      text: "Digite el código de barras a crear, por favor",
      input: "text",
      icon: "info",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.post(
          `/ludicResources/existence`,
          { codigo_barras: result.value, id_recursos_ludicos: id },
          {
            headers: { "access-token": token },
          }
        );
        if (data.created.success) {
          Swal.fire({
            text: "Existencia de recurso creada correctamente",
            icon: "success",
            timer: 3000,
          });
          let _resources = [...ludic];
          _resources[index].existencias.push(data.created.id);
          setLudic([..._resources]);
        } else {
          Swal.fire({
            text: data.created.message,
            icon: "error",
            timer: 3000,
          });
        }
      }
    });
  };

  const handleClick = (e, id, action, index = null) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/ludic/edit/${encrypt(id)}`);
        break;
      case "create":
        history.push(`/ludic/create`);
        break;
      case "createResource":
        createResource(id, index);
        break;
      case "editExistence":
        history.push(`/ludic/existence/${encrypt(id)}`);
        break;
      case "deleteExistence":
        modalDeleteExistence(id, index);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este recurso lúdico?",
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

  const modalDeleteExistence = (id, index) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar esta existencia de recurso lúdico?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendDeleteExistence(id, index);
      }
    });
  };

  const sendDeleteExistence = async (id, index) => {
    setLoading(true);
    const { data } = await axios.delete(`/ludicResources/existence/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data?.deleted) {
      setLoading(false);
      Swal.fire({
        text: "Eliminada exitosamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });
      let _resources = [...ludic];
      _resources[index].existencias = _resources[index].existencias.filter(
        (e) => e.id !== id
      );

      setLudic([..._resources]);
    } else {
      setLoading(false);
      Swal.fire({
        text: "Hubo un error borrando la existencia del recurso lúdico",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const sendDelete = async (id) => {
    setLoading(true);
    const { data } = await axios.delete(`/ludicResources/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data?.deleted) {
      setFiltro(ludic.filter((item) => item.id !== id));
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
        text: "Hubo un error borrando el recurso lúdico",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        "url imagen": `${axios.defaults.baseURL}/${item.url_imagen}` || "",
        descripcion: item.descripcion,
        nombre: item.nombre,
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        search={false}
        button={permission.includes(2) ? true : false}
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{ csvData: dataExcel, fileName: "Recursos lúdicos" }}
        buttonText={"Crear"}
        buttonRoute={"/ludic/create"}
        tableName={"ludic"}
        items={ludic}
        setItems={setFiltro}
      />
      <Table columns={columns} rows={filtro}>
        <TableBody>
          {filtro?.length > 0 ? (
            <>
              {filtro
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <Row
                    key={row.id}
                    index={index}
                    row={row}
                    permission={permission}
                    handleClick={handleClick}
                  />
                ))}
            </>
          ) : (
            <TableCell align="center" colSpan="8">
              No hay datos registrados
            </TableCell>
          )}
        </TableBody>
      </Table>
      <Backdrop loading={loading} />
    </Paper>
  );
}

const columns = [
  {
    id: "dropdown",
    label: "",
    minWidth: 10,
    align: "center",
    colSpan: 1,
  },
  {
    id: "photo",
    label: "Foto",
    minWidth: 100,
    align: "center",
  },
  {
    id: "name",
    label: "Nombre",
    minWidth: 100,
    align: "center",
  },
  {
    id: "description",
    label: "Descripción",
    minWidth: 100,
    align: "center",
  },
  {
    id: "spot",
    label: "Espacio al que pertenece",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "Acciones",
    minWidth: 10,
    align: "center",
    colSpan: 2,
  },
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 9)
      .map((item) => item.modulosAcciones?.id_acciones),
    groupId: state.user.id_grupos_usuarios,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LudicResourcesManageList);
