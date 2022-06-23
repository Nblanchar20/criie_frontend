import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { setBreadcrumps } from "../../../actions";
import { HighlightOff, FindInPageOutlined } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { encrypt } from "../../../utils/crypt";
import Table from "../../../components/Table";
import Header from "../../../components/Header";
import axios from "../../../api";
import Backdrop from "../../../components/Backdrop";
import Swal from "sweetalert2";

function Modules(props) {
  const { page, rowsPerPage, setBreadcrumps, permission, token } = props;
  const history = useHistory();
  const [modules, setModules] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [actions, setActions] = useState([]);
  const [actionsFiltered, setActionsFiltered] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      getModules();
      getActions();
      setBreadcrumps([{ name: "Configuración" }, { name: "Módulos" }]);
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getModules = async () => {
    const { data } = await axios.post(
      `/moduleAction/getActionsModulesByModules`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setModules(data?.actions);
    setFiltro(data?.actions);
    dataToExcel(data?.actions);
  };

  const getActions = async () => {
    const { data } = await axios.post(
      `/moduleAction/getActionsModules`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setActions(data.actions);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "view":
        setActionsFiltered(actions.filter((item) => item.id_modulos === id));
        setOpenDialog(true);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar esta relación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
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
    const { data } = await axios.delete(`/moduleAction/${id}`, {
      headers: { "access-token": token },
    });
    if (data) {
      setFiltro(filtro.filter((item) => item.id_modulos !== id));
      setModules(modules.filter((item) => item.id_modulos !== id));
      setLoading(false);
      Swal.fire({
        text: "Eliminado exitosamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        Nombre: item.modulos?.nombre || "",
        Acciones: item.count_acciones,
      };
    });
    setDataExcel(arrayExcel);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Paper elevation={0}>
        <Header
          button={true}
          exportButton={true}
          dataToExcel={{ csvData: dataExcel, fileName: "Módulos" }}
          buttonRoute={"/modules/create"}
          tableName={"modules"}
          items={modules}
          setItems={setFiltro}
        />
        <Divider />
        <Table columns={columns} rows={filtro}>
          <TableBody>
            {filtro.length > 0 ? (
              <>
                {filtro
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {row.modulos?.nombre}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver acciones">
                          <IconButton
                            aria-label="actions"
                            onClick={(e) =>
                              handleClick(e, row.id_modulos, "view")
                            }
                          >
                            <Typography style={{ color: "#3C3C3C" }}>
                              {row.count_acciones}
                            </Typography>
                            <FindInPageOutlined />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton
                              aria-label="edit"
                              onClick={() =>
                                history.push(
                                  `/modules/edit/${encrypt(row.id_modulos)}`
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} size={"xs"} />
                            </IconButton>
                          </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                          <Tooltip title="Eliminar">
                            <IconButton
                              aria-label="delete"
                              onClick={(e) =>
                                handleClick(e, row.id_modulos, "delete")
                              }
                            >
                              <HighlightOff />
                            </IconButton>
                          </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableCell align="center" colSpan="3">
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
                <b>Acción</b>
              </ListItemText>
            </ListItem>
            <Divider />
            {actionsFiltered
              .sort((a, b) =>
                a.acciones?.nombre < b.acciones?.nombre ? -1 : 1
              )
              .map((item, index) => (
                <ListItem>
                  <ListItemIcon>{index + 1}</ListItemIcon>
                  <ListItemText>{item.acciones?.nombre}</ListItemText>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
      <Backdrop loading={loading} />
    </>
  );
}

const columns = [
  { id: "module", label: "Módulo", align: "center" },
  { id: "actions", label: "Acciones", align: "center" },
  { id: "actions", label: "", align: "center", minWidth: 10, colSpan: 2 },
];

const mapStateToProps = (state) => {
  return {
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 3)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Modules);
