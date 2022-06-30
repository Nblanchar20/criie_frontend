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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
  } from "@material-ui/core";
  import { encrypt } from "../../../utils/crypt";
  import Header from "../../../components/Header";
  import Swal from "sweetalert2";
  import Backdrop from "../../../components/Backdrop";
  import axios from "../../../api";

const Edit = ({
    id,
    token,
    metodo = null
}) => {

    
  const history = useHistory();
  const [objective, setObjective] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [form, setForm] = useState({
    nombre: "",
    descripcion:"",
    id_proyectos:"",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
        axios
          .put(
            `/objective/${id}`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            console.log(res.data)
            if (res.data.updated) {
                metodo()         
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
          getObjective();
      }, []);

      const getObjective = async () => {
        try {
          const { data } = await axios.get(
            `/objective/${id}`,
            {},
            {
              headers: { "access-token": token },
            }
          );
          setObjective(data.objective);
          setForm({
            nombre:data.objective.nombre,
            descripcion:data.objective.descripcion,
            id_proyectos:data.objective.id_proyectos
          })
        } catch (error) {
          //history.push("/objectives");
          //window.location.reload();
        }
      };

      const handleInput = (event) => {
        setForm({
          ...form,
          [event.target.name]: event.target.value,
        });
      };

      
	return (
		<>
            <Typography component="h1" variant="h5">
            {objective.nombre}
            </Typography>
            <Divider />
            <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  variant="outlined"
                  onChange={handleInput}
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
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={form.descripcion}
                  multiline
                  rows ={3}
                  variant="outlined"
                  onChange={handleInput}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>              
                            
            </Grid>
            <div className={classes.containerButton}>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Editar
              </Button>
            </div>
          </form>
		</>
	);
}
 
export default Edit;

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
