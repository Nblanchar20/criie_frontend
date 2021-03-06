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
import { faEdit,faListAlt } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/Table";
import Header from "../../components/Header";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import axios from "../../api";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";
import {FindInPageOutlined } from "@material-ui/icons";

function Roles(props) {
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
  const [roles, setRoles] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
      getRoles();
      setBreadcrumps([{ name: "Lista de Roles" }]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getRoles = async () => {
    const { data } = await axios.post(
      `/role/getRoles`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    console.log(data)
    if (groupId === 1) {
      setRoles(data?.roles);
      setFiltro(data?.roles);
      dataToExcel(data?.roles);
      
      
    } else {
      const rolesFiltered = data.roles.filter(
        (item) => item.id_grupos_usuarios !== 1
      );
      setRoles(rolesFiltered);
      setFiltro(rolesFiltered);
      dataToExcel(rolesFiltered);
    }
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        modalDelete(id);
        break;
      case "edit":
        history.push(`/roles/edit/${encrypt(id)}`);
        break;
      case "create":
        history.push(`/roles/create`);
        break;
        case "view":
          history.push(`/roles/information/${encrypt(id)}`);
          break;
      default:
        break;
    }
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "??Est?? seguro que desea eliminar este Proyecto?",
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
    const { data } = await axios.delete(`/project/${id}`, {      
      headers: { "access-token": token },
    });
    console.log(data)
    if (data.projectId) {
      setFiltro(roles.filter((item) => item.id !== id));
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
        "Correo electr??nico": item.email,
        Tel??fono: item.telefono || "",
        "Grupo de usuario": item.grupoUsuarios?.nombre,
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        search={true}
        button={true}
        exportButton={true}
        dataToExcel={{ csvData: dataExcel, fileName: "Proyectos" }}
        buttonText={"Crear"}
        buttonRoute={"/roles/create"}
        tableName={"roles"}
        items={roles}
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
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Ver mas">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleClick(e, row.id, "view")}
                          >
                            <FindInPageOutlined />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleClick(e, row.id, "edit")}
                          >
                            <FontAwesomeIcon icon={faEdit} size={"xs"} />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                        <Tooltip title="Eliminar">
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => handleClick(e, row.id, "delete")}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
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
    id: "name",
    label: "Nombre",
    minWidth: 100,
    align: "center",
  },
  {
    id: "info",
    label: "Informaci??n",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "Accciones",
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

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
