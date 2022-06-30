import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import {
    makeStyles,
    TextField,
    Button,
    Grid,
    Paper,
    Divider,
    Typography,     
  TableBody,
  TableCell,
  TableRow,
  } from "@material-ui/core";
  import { encrypt } from "../../utils/crypt";
  import Header from "../../components/Header";
  import Swal from "sweetalert2";
  import Backdrop from "../../components/Backdrop";
  import axios from "../../api";  
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Table from "../../components/Table";

const Create = ({
    id,
    token,
    metodo = null
}) => {

    
  const history = useHistory();
  const [project, setProject] = useState([]);  
  const [objetives, setObjectives] = useState({});
  const [indicators, setIndicators] = useState({});
  const [deliverables, setDeliverables] = useState({});
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [form, setForm] = useState({
    nombre: "",
    descripcion:"",
    id_proyectos:id,
  });

    useEffect(() => {
          getProjects();
          getObjectives();
          getDeliverables();
          getIndicators();
      }, []);

      const getProjects = async () => {
        try {
          const { data } = await axios.get(
            `/project/${id}`,
            {},
            {
              headers: { "access-token": token },
            }
          );
          setProject(data?.project);
        } catch (error) {
          history.push("/objectives");
          window.location.reload();
        }
      };

      const getObjectives = async () => {
        try {
          const { data } = await axios.post(
            `/objective/getObjectives`,
            {"id_proyectos":id},
            {
              headers: { "access-token": token },
            }
          );
            setObjectives(data.objectives);
            } catch (error) {
            history.push(`/projects`);
            window.location.reload();
            }
        };
    
        const getIndicators = async () => {
            try {
                const { data } = await axios.post(
                  `/indicator/getIndicators`,
                  {"id_proyectos":id},
                  {
                    headers: { "access-token": token },
                  }
                );
                  setIndicators(data.indicators);
              } catch (error) {
                history.push(`/projects`);
                window.location.reload();
              }
            };
    
        const getDeliverables = async () => {
            try {
                const { data } = await axios.post(
                  `/deliverable/getDeliverables`,
                  {"id_proyectos":id},
                  {
                    headers: { "access-token": token },
                  }
                );
                  setDeliverables(data.deliverables);
              } catch (error) {
                history.push(`/projects`);
                window.location.reload();
              }
            };
      
	return (
		<>
            <Typography component="h1" variant="h5">
            {project.nombre}
            </Typography>
            <Divider />
            <br/>
            <Grid container spacing={2}>
            <Grid item xs={8} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                disabled={true}
                fullWidth
                label="Fecha Inicio"
                inputFormat="dd/MM/yyyy"
                value={project.fecha_inicio}
                renderInput={(params) => <TextField {...params} />}
              /> 
              </LocalizationProvider>              
            </Grid>
            <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    required
                    disabled={true}
                    fullWidth
                    label="Fecha Finalizacion"
                    inputFormat="dd/MM/yyyy"
                    value={project.fecha_fin}
                    renderInput={(params) => <TextField {...params} />}
                /> 
                </LocalizationProvider>              
              </Grid>              
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    disabled={true}
                    required
                    fullWidth
                    label="Inicio Esperado"
                    inputFormat="dd/MM/yyyy"
                    value={project.fecha_inicio_esperado}
                    renderInput={(params) => <TextField {...params} />}
                /> 
                </LocalizationProvider>              
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    required
                    fullWidth
                    label="Finalizacion Esperada"
                    inputFormat="dd/MM/yyyy"
                    value={project.fecha_fin_esperado}
                    renderInput={(params) => <TextField {...params} />}
                    disabled={true}
                /> 
                </LocalizationProvider>              
              </Grid>
              <Grid item xs={12} sm={12}>
              <TextField
                  required
                  fullWidth
                  disabled={true}
                  label="Presupuesto"
                  name="presupuesto"
                  value={project.presupuesto}
                  variant="outlined"
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />                
                </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  disabled={true}
                  fullWidth
                  label="Alcance"
                  name="alcance"
                  multiline
                  value={project.alcance}
                  rows ={6}
                  variant="outlined"
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
      <Table columns={columnsObjectives} rows={objetives}>
        <TableBody>
          {objetives?.length > 0 ? (
            <>
              {objetives
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
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
              </Grid>
              <Grid item xs={12} sm={4}>
      <Table columns={columnsDeliverables} rows={deliverables}>
        <TableBody>
          {deliverables?.length > 0 ? (
            <>
              {deliverables
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
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
              </Grid>
              <Grid item xs={12} sm={4}>
      <Table columns={columnsIndicators} rows={indicators}>
        <TableBody>
          {indicators?.length > 0 ? (
            <>
              {indicators
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
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
              </Grid>

            </Grid>
		</>
	);
}
 
export default Create;

const columnsDeliverables = [
    {
      id: "name",
      label: "Entregables",
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
  const columnsIndicators = [
    {
      id: "name",
      label: "Indicadores",
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
  const columnsObjectives = [
    {
      id: "name",
      label: "Objetivos",
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

const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "1em",
    },
    paper: {
      margin: theme.spacing(2, 2),
      paddingBottom: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    container: {
      width: "80%",
    },
    containerButton: {
      marginTop: "1em",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      [theme.breakpoints.up("sm")]: {
        display: "block",
        marginTop: "1em",
        marginBottom: "1em",
      },
    },
    button: {
      margin: "0.5em",
      padding: ".5em 3em",
      borderRadius: "10px",
    },
    container__input_root: {
      borderRadius: "10px",
    },
  }));

const Overlay = styled.div`
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	background:rgba(0,0,0,0.5);
	padding: 40px;
	display: flex;
	align-items: ${props => props.posicionModal ? props.posicionModal : 'center'};
	justify-content: center;
`;

const ContenedorModal = styled.div`
	width: 500px;
	min-height: 200px;
	background: #fff;
	position: relative;
	border-radius: 5px;
	box-shadow: rgba(100,100,111, 0.2) 0px 7px 29px 0px;
	padding: ${props => props.padding ? props.padding : '20px'};
`;

const EncabezadoModal = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid #E8E8E8;
	h3 {
		font-weight: 500;
		font-size: 16px;
		color: #1766DC;
	}
`;

const BotonCerrar = styled.button`
	position: absolute;
	top: 15px;
	right: 20px;
	width: 30px;
	height: 30px;
	border: none;
	background: none;
	cursor: pointer;
	transition: .3s ease all;
	border-radius: 5px;
	color: #1766DC;
	&:hover {
		background: #f2f2f2;
	}
	svg {
		width: 100%;
		height: 100%;
	}
`;
