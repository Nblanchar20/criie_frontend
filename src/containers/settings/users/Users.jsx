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
      getUsers();
      setBreadcrumps([{ name: "Configuración" }, { name: "Usuarios" }]);
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
      {},
      {
        headers: { "access-token": token },
      }
    );
    if (groupId === 1) {
      setUsers(data?.users);
      setFiltro(data?.users);
      dataToExcel(data?.users);
    } else {
      const usersFiltered = data.users.filter(
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
        history.push(`/users/create`);
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
        search={true}
        button={permission.includes(2) ? true : false}
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{ csvData: dataExcel, fileName: "Usuarios" }}
        buttonText={"Crear"}
        buttonRoute={"/users/create"}
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
                    <TableCell align="center">{row.documento}</TableCell>
                    <TableCell align="center">{row.nombres}</TableCell>
                    <TableCell align="center">{row.apellidos}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                    <TableCell align="center">
                      {row.grupoUsuarios?.nombre}
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
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
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
  {
    id: "group",
    label: "Grupo de usuario",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "",
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
      .filter((data) => data.modulosAcciones?.id_modulos === 2)
      .map((item) => item.modulosAcciones?.id_acciones),
    groupId: state.user.id_grupos_usuarios,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
