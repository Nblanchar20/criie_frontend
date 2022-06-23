import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Paper } from "@material-ui/core";
import { setBreadcrumps } from "../../actions";
import Table from "../../components/Table";
import Header from "../../components/Header";
import axios from "../../api";

function Actions(props) {
  const { page, rowsPerPage, setBreadcrumps, permission, token } = props;
  const history = useHistory();
  const [actions, setActions] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);

  useEffect(() => {
      getActions();
      setBreadcrumps([{ name: "Configuración" }, { name: "Acciones" }]);
  }, []);

  useEffect(() => {
    dataToExcel(filtro);
  }, [filtro]);

  const getActions = async () => {
    const { data } = await axios.post(
      `/action/getActions`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setActions(data?.actions);
    setFiltro(data?.actions);
    dataToExcel(data?.actions);
  };

  const dataToExcel = (data) => {
    // eslint-disable-next-line array-callback-return
    const arrayExcel = data?.map((item) => {
      return {
        Nombre: item.nombre || "",
      };
    });
    setDataExcel(arrayExcel);
  };

  return (
    <Paper elevation={3}>
      <Header
        button={false}
        exportButton={true}
        dataToExcel={{ csvData: dataExcel, fileName: "Acciones" }}
        tableName={"actions"}
        items={actions}
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
                  </TableRow>
                ))}
            </>
          ) : (
            <TableCell align="center" colSpan="1">
              No hay datos registrados
            </TableCell>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

const columns = [{ id: "nombre", label: "Nombre", align: "center" }];

const mapStateToProps = (state) => {
  return {
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 4)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
