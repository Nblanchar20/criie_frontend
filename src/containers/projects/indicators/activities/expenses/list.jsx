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
    Tooltip,
    IconButton,
  } from "@material-ui/core";
  import Swal from "sweetalert2";
  import axios from "../../../../../api";
  import Table from "../../../../../components/Table";

const Create = ({
    id,
    token,
    metodo
}) => {

    
  const history = useHistory();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();  
  const [filtro, setFiltro] = useState([]);
  const [form, setForm] = useState({
    gasto: "",
    descripcion: "",
    fecha: new Date(),
    id_actividades:id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
        axios
          .post(
            `/expense/`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.expense) {
              metodo()
                setForm(
                    {
                      gasto: "",
                      descripcion: "",
                      fecha: new Date(),
                      id_actividades:id,
                      }
                )          
              Swal.fire({
                icon: "success",
                text: "Creado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.message,
                showConfirmButton: false,
                timer: 3000,
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire({
              icon: "error",
              text: "No se ha podido crear.",
              showConfirmButton: false,
              timer: 3000,
            });
          });                    
          
          
    }

    useEffect(() => {
          getActivity();
          getExpenses();
      }, []);

      const getActivity = async () => {
        try {
          const { data } = await axios.get(
            `/activity/${id}`,
            {},
            {
              headers: { "access-token": token },
            }
          );
          setActivity(data?.activity);
        } catch (error) {
          history.push("/objectives");
          window.location.reload();
        }
      };

      const getExpenses = async () => {
        try {
          const { data } = await axios.post(
            `/expense/getExpenses`,
            {"id_actividades":id},
            {
              headers: { "access-token": token },
            }
          );
            setFiltro(data.expenses);
        } catch (error) {
          history.push(`/projects`);
          window.location.reload();
      }
    };

      const handleInput = (event) => {
        setForm({
          ...form,
          [event.target.name]: event.target.value,
        });
      };

      const handleChangeInit = (newValue) => {
        setForm({
          ...form,
          fecha_inicio: newValue
        });
      };

      
	return (
		<>
            <Typography component="h1" variant="h5">
            {activity.nombre}
            </Typography>
            <Divider />
            <Table columns={columns} rows={filtro}>
        <TableBody>
          {filtro?.length > 0 ? (
            <>
              {filtro
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.descripcion}</TableCell>
                    <TableCell align="center">{row.gasto}</TableCell>
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
		</>
	);
}
 
export default Create;


const columns = [
    {
      id: "name",
      label: "Nombre",
      minWidth: 100,
      align: "center",
    },
    {
      id: "lastname",
      label: "descripción",
      minWidth: 100,
      align: "center",
    },
    {
      id: "lastname",
      label: "fecha",
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
