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
} from "@material-ui/core";
import { setBreadcrumps } from "../../actions";
import Table from "../../components/Table";
import Header from "../../components/Header";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import { Check } from "@material-ui/icons";
import axios from "../../api";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";

function ApproveList(props) {
  const {
    userId,
    page,
    rowsPerPage,
    setBreadcrumps,
    permission,
    token,
  } = props;
  const history = useHistory();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getUsers();
      setBreadcrumps([{ name: "Aprobación de usuarios" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getUsers = async () => {
    const { data } = await axios.post(
      `/user/getUsers`,
      {
        id_grupos_usuarios: 4,
      },
      {
        headers: { "access-token": token },
      }
    );
    setUsers(data?.users);
    setFiltro(data?.users);
    dataToExcel(data?.users);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "approve":
        modalApprove(id);
        break;
      case "cancel":
        modalCancel(id);
        break;
      default:
        break;
    }
  };

  const modalApprove = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea aprobar a este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendApprove(id);
      }
    });
  };

  const sendApprove = async (id) => {
    setLoading(true);
    const { data } = await axios.put(
      `/user/${id}`,
      {
        id_grupos_usuarios: 3,
        id_usuario_aprueba: userId,
        estado: 1,
      },
      { headers: { "access-token": token } }
    );
    if (data.userUpdated?.success) {
      setFiltro(users.filter((item) => item.id !== id));
      setLoading(false);
      Swal.fire({
        text: "Aprobado exitosamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      setLoading(false);
      Swal.fire({
        text: data.userUpdated?.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const modalCancel = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar a este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendCancel(id);
      }
    });
  };

  const sendCancel = async (id) => {
    setLoading(true);
    const { data } = await axios.put(
      `/user/${id}`,
      {
        id_usuario_aprueba: userId,
        estado: -1,
      },
      {
        headers: { "access-token": token },
      }
    );
    if (data.userUpdated?.success) {
      setFiltro(users.filter((item) => item.id !== id));
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
        text: data.userUpdated?.message,
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
        Documento: item.documento || "",
        Nombres: item.nombres,
        Apellidos: item.apellidos,
        "Correo electrónico": item.email,
        Teléfono: item.telefono || "",
        "Grupo de usuario": item.grupoUsuarios?.nombre,
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{
          csvData: dataExcel,
          fileName: "Usuarios pendientes por aprobación",
        }}
        items={users}
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
                      {permission.includes(3) && (
                        <Tooltip title="Aprobar">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleClick(e, row.id, "approve")}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {permission.includes(4) && (
                        <Tooltip title="Cancelar solicitud">
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => handleClick(e, row.id, "cancel")}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">{row.documento}</TableCell>
                    <TableCell align="center">{row.nombres}</TableCell>
                    <TableCell align="center">{row.apellidos}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                  </TableRow>
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
    id: "actions",
    label: "Acción",
    minWidth: 10,
    align: "center",
    colSpan: 2,
  },
  {
    id: "document",
    label: "Documento",
    minWidth: 100,
    align: "center",
  },

  {
    id: "name",
    label: "Nombres",
    minWidth: 100,
    align: "center",
  },
  {
    id: "lastname",
    label: "Apellidos",
    minWidth: 100,
    align: "center",
  },
  {
    id: "email",
    label: "Correo electrónico",
    minWidth: 100,
    align: "center",
  },
  {
    id: "tel",
    label: "Teléfono",
    minWidth: 100,
    align: "center",
    super: true,
  },
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 8)
      .map((item) => item.modulosAcciones?.id_acciones),
    groupId: state.user.id_grupos_usuarios,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveList);
