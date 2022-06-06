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
import { HighlightOff } from "@material-ui/icons";
import Table from "../../../components/Table";
import Header from "../../../components/Header";
import axios from "../../../api";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";

function UserGroups(props) {
  const { userId, page, rowsPerPage, setBreadcrumps, permission, token } =
    props;
  const history = useHistory();
  const theme = useTheme();
  const [groups, setGroups] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getGroups();
      setBreadcrumps([
        { name: "Configuración" },
        { name: "Grupos de usuarios" },
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

  const getGroups = async () => {
    const { data } = await axios.post(
      `/userGroup/getGroups`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setGroups(data?.groups);
    setFiltro(data?.groups);
    dataToExcel(data?.groups);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/userGroups/edit/${encrypt(id)}`);
        break;
      case "create":
        history.push(`/userGroups/create`);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este grupo?",
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
    const { data } = await axios.delete(`/userGroup/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data.groupDeleted?.success) {
      setGroups(groups.filter((item) => item.id !== id));
      setFiltro(filtro.filter((item) => item.id !== id));
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
        text: data.groupDeleted?.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const groupExcel = data?.map((item) => {
      if (item.nombre) return { Nombre: item.nombre };
    });
    setDataExcel(groupExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        search={true}
        button={permission.includes(2) ? true : false}
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{
          csvData: dataExcel,
          fileName: "GruposUsuarios",
        }}
        buttonText={"Crear"}
        buttonRoute={"/userGroups/create"}
        tableName={"userGroup"}
        items={groups}
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
                    <TableCell align="center">{row.nombre}</TableCell>
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
            <TableCell align="center" colSpan="3">
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
  { id: "nombre", label: "Nombre", align: "center" },
  { id: "acciones", label: "", align: "center", minWidth: 10, colSpan: 2 },
];

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 1)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGroups);
