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

function SpotsManageList(props) {
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
  const [spots, setSpots] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([{ name: "Espacios" }, { name: "Gestión de espacios" }]);
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
      `/spot/getSpots`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setSpots(data?.spots);
    setFiltro(data?.spots);
    dataToExcel(data?.spots);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/spots/edit/${encrypt(id)}`);
        break;
      case "create":
        history.push(`/spots/create`);
        break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este espacio?",
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
    const { data } = await axios.delete(`/spot/${id}`, {
      data: { id_usuarios: userId },
      headers: { "access-token": token },
    });
    if (data?.deleted) {
      setFiltro(spots.filter((item) => item.id !== id));
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
        text: "Hubo un error borrando el espacio",
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
        dataToExcel={{ csvData: dataExcel, fileName: "Espacios" }}
        buttonText={"Crear"}
        buttonRoute={"/spots/create"}
        tableName={"spots"}
        items={spots}
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
                      <img
                        style={{ maxWidth: "15em" }}
                        src={`${axios.defaults.baseURL}${row.url_imagen}`}
                        alt="foto_espacio"
                      />
                    </TableCell>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpotsManageList);
