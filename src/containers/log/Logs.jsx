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
import { encrypt } from "../../utils/crypt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/Table";
import Header from "../../components/Header";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import axios from "../../api";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";

function Users(props) {
  const {
    userId,
    page,
    rowsPerPage,
    setBreadcrumps,
    permission,
    groupId,
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
      logUsers();
      setBreadcrumps([{ name: "Log" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const logUsers = async () => {
    const { data } = await axios.post(
      `/log/getLog`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    if (groupId === 1) {
      setUsers(data?.log);
      setFiltro(data?.log);
      dataToExcel(data?.log);
    } else {
      const usersFiltered = data.log.filter(
        (item) => item.id_grupos_usuarios !== 1
      );
      setUsers(usersFiltered);
      setFiltro(usersFiltered);
      dataToExcel(usersFiltered);
    }
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/users/edit/${encrypt(id)}`);
        break;
      case "create":
        history.push(`Log`);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este usuario?",
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
    const { data } = await axios.delete(`/user/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data.userId?.success) {
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
        text: data.userId?.message,
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
        Registro: item.registro || "",
        Usuario: item.usuario?.email,
        Modulo: item.modulo?.nombre,
        IP: item.ip,
        Fecha: item.fecha || "",
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        search={true}
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{ csvData: dataExcel, fileName: "Log" }}
        tableName={"users"}
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
                    <TableCell align="center">{row.registro}</TableCell>
                    <TableCell align="center">{row.usuario?.email}</TableCell>
                    <TableCell align="center">{row.modulo?.nombre}</TableCell>
                    <TableCell align="center">{row.ip}</TableCell>
                    <TableCell align="center">{row.fecha}</TableCell>
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
    id: "registro",
    label: "Registro",
    minWidth: 100,
    align: "center",
  },

  {
    id: "usuario",
    label: "Usuario",
    minWidth: 100,
    align: "center",
  },
  {
    id: "modulo",
    label: "Modulo",
    minWidth: 100,
    align: "center",
  },
  {
    id: "ip",
    label: "IP",
    minWidth: 100,
    align: "center",
  },
  {
    id: "fecha",
    label: "Fecha",
    minWidth: 100,
    align: "center",
    super: true,
  }
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 2)
      .map((item) => item.modulosAcciones?.id_acciones),
    groupId: state.user.id_grupos_usuarios,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
