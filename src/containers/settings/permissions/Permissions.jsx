import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../actions";
import {
  useTheme,
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
import { HighlightOff, FindInPageOutlined } from "@material-ui/icons";
import Table from "../../../components/Table";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import axios from "../../../api";
import Backdrop from "../../../components/Backdrop";

function Permissions(props) {
  const { userId, page, rowsPerPage, setBreadcrumps, permission, token } =
    props;
  const history = useHistory();
  const theme = useTheme();
  const [permissions, setPermissions] = useState([]);
  const [actions, setActions] = useState([]);
  const [actionsFiltered, setActionsFiltered] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getPermissions();
      getActions();
      setBreadcrumps([{ name: "Configuración" }, { name: "Permisos" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getPermissions = async () => {
    const { data } = await axios.post(
      `/permission/getPermissionsByUserGroup`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setPermissions(data.permissions);
    setFiltro(data.permissions);
  };

  const getActions = async () => {
    const { data } = await axios.post(
      `/permission/getPermissions`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setActions(data.permissions);
    setActionsFiltered(data.permissions);
  };

  const handleClick = (
    e,
    id_grupos_usuarios,
    action,
    id_modulos,
    id_permisos
  ) => {
    switch (action) {
      case "delete":
        modalDelete(id_grupos_usuarios, id_modulos, id_permisos);
        break;
      case "view":
        setActionsFiltered(
          actions.filter(
            (item) =>
              item.id_grupos_usuarios === id_grupos_usuarios &&
              item.modulosAcciones.id_modulos === id_modulos
          )
        );
        setOpenDialog(true);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id_grupos_usuarios, id_modulos, id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este permiso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendDelete(id_grupos_usuarios, id_modulos, id);
      }
    });
  };

  const sendDelete = async (id_grupos_usuarios, id_modulos, id) => {
    setLoading(true);
    const { data } = await axios.delete(`/permission/${id_grupos_usuarios}`, {
      data: { id_modulos: id_modulos, id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data) {
      setFiltro(filtro.filter((item) => item.id !== id));
      setPermissions(permissions.filter((item) => item.id !== id));
      setLoading(false);
      Swal.fire({
        text: "Eliminado exitosamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const delete_permission = (id_grupos_usuarios, id_modulos, id) => {
    if (permission.includes(4)) {
      return (
        <Tooltip title="Eliminar">
          <IconButton
            aria-label="delete"
            onClick={(e) =>
              handleClick(e, id_grupos_usuarios, "delete", id_modulos, id)
            }
          >
            <HighlightOff />
          </IconButton>
        </Tooltip>
      );
    }
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        "Grupo de usuarios": item.grupoUsuarios?.nombre,
        Módulo: item.modulosAcciones?.modulos?.nombre,
        Acciones: item.count_acciones,
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
          dataToExcel={{ csvData: dataExcel, fileName: "Permisos" }}
          buttonText={"Gestionar"}
          buttonRoute={"/permissions/create"}
          tableName={"permissions"}
          items={permissions}
          setItems={setFiltro}
        />
        <Table columns={columns} rows={filtro}>
          <TableBody>
            {filtro?.length > 0 ? (
              <>
                {filtro
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={`row${index}`}>
                      <TableCell align="center">
                        {row.grupoUsuarios?.nombre}
                      </TableCell>
                      <TableCell align="center">
                        {row.modulosAcciones?.modulos?.nombre}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver acciones">
                          <IconButton
                            aria-label="actions"
                            onClick={(e) =>
                              handleClick(
                                e,
                                row.id_grupos_usuarios,
                                "view",
                                row.modulosAcciones.id_modulos
                              )
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
                        {delete_permission(
                          row.id_grupos_usuarios,
                          row.modulosAcciones?.id_modulos,
                          row.id
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
        <Backdrop loading={loading} />
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
                <b>Acciones</b>
              </ListItemText>
            </ListItem>
            <Divider />
            {actionsFiltered
              .sort((a, b) =>
                a.modulosAcciones?.acciones?.nombre <
                b.modulosAcciones?.acciones?.nombre
                  ? -1
                  : 1
              )
              .map((item, index) => (
                <ListItem>
                  <ListItemIcon>{index + 1}</ListItemIcon>
                  <ListItemText>
                    {item.modulosAcciones?.acciones?.nombre}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

const columns = [
  { id: "group", label: "Grupo de usuarios", align: "center" },
  { id: "moduls", label: "Módulo", align: "center" },
  { id: "actions", label: "Acciones", align: "center" },
  { id: "acciones", label: "", align: "center", minWidth: 10, colSpan: 1 },
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: [1, 2, 3, 4, 5],
    /* permission: (state.permission || [])
      .filter((data) => data.accionesModulos?.id_modulos === 5)
      .map((item) => item.accionesModulos?.id_acciones), */
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
