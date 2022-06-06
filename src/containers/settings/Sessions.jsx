import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
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
import axios from "../../api";
import moment from "moment";
import FindInPageOutlinedIcon from "@material-ui/icons/FindInPageOutlined";
import Swal from "sweetalert2";

function Sessions(props) {
  const { page, rowsPerPage, setBreadcrumps, permission, token } = props;
  const history = useHistory();
  const [sessions, setSessions] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);

  useEffect(() => {
    if (permission.includes(1)) {
      getSessions();
      setBreadcrumps([{ name: "Configuración" }, { name: "Sesiones" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getSessions = async () => {
    const { data } = await axios.post(
      `/session/getSessions`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setSessions(data.sessions);
    setFiltro(data.sessions);
  };

  const handleDialog = (token) => {
    Swal.fire({
      title: "Token de la sesión",
      text: token,
      showConfirmButton: false,
    });
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        Fecha: moment(item.fecha_sesion).format("DD/MM/YYYY HH:mm:ss"),
        "Sesión Id": item.sesion_id,
        Token: item.token_sesion,
        Usuario: `${item.usuarios?.nombres} ${item.usuarios?.apellidos}`,
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        button={false}
        exportButton={permission.includes(5) ? true : false}
        dataToExcel={{ csvData: dataExcel, fileName: "Sesiones" }}
        tableName={"sessions"}
        items={sessions}
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
                      {moment(row.fecha_sesion).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align="center">{row.sesion_id}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver token">
                        <IconButton
                          aria-label="token"
                          onClick={() => handleDialog(row.token_sesion)}
                        >
                          <FindInPageOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{`${row.usuarios?.nombres} ${row.usuarios?.apellidos}`}</TableCell>
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
  );
}

const columns = [
  { id: "date", label: "Fecha", align: "center" },
  { id: "id", label: "Sesión Id", align: "center" },
  { id: "token", label: "Token", align: "center" },
  { id: "user", label: "Usuario", align: "center" },
];

const mapStateToProps = (state) => {
  return {
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 7)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);
