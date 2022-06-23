import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../actions";
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
import { decrypt } from "../../utils/crypt";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";
import axios from "../../api";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ViewUsers from "../settings/users/Users"
import Modal from "../../components/modal";
import FormObjectives from "../projects/objectives/Form"

function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [userGroup, setUserGroup] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    fecha_inicio_esperado: new Date(),
    fecha_fin_esperado: new Date(),
    alcance: "",
  });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      console.log(props.match.url.substring(0,14))
      getUserGroups();
        getProject();
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Información" },
        ]);
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProject = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/project/${id}`, {
        headers: { "access-token": token },
      });
      setForm({        
        nombre: data.project?.nombre,
        fecha_inicio: data.project?.fecha_inicio,
        fecha_fin: data.project?.fecha_fin,
        fecha_inicio_esperado: data.project?.fecha_inicio_esperado,
        fecha_fin_esperado: data.project?.fecha_fin_esperado,
        alcance: data.project?.alcance,
      });
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const getUserGroups = async () => {
    try {
      const { data } = await axios.post(
        `/userGroup/getGroups`,
        {},
        {
          headers: { "access-token": token },
        }
      );
      if (groupId === 1) {
        setUserGroup(data.groups);
      } else {
        setUserGroup(data.groups.filter((item) => item.id !== 1));
      }
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const handleInput = (event) => {
    
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/projects");
  };

  const handleSubmit = (e) => {
    console.log(form)
    e.preventDefault();
    setLoading(true);
      if (!props.match.params.id) {
        axios
          .post(
            `/project/`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.project) {
              history.push("/projects");
              Swal.fire({
                icon: "success",
                text: "Creado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.userCreated.message,
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
      } else {
        const id = decrypt(props.match.params.id);
        axios
          .post(
            `/project/updateProject/${id}`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.updated) {
              history.push("/projects");
              Swal.fire({
                icon: "success",
                text: "Editado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.userUpdated.message,
                showConfirmButton: false,
                timer: 3000,
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire({
              icon: "error",
              text: "No se ha podido editar.",
              showConfirmButton: false,
              timer: 3000,
            });
          });
      }
    
  };

  
  const handleChangeInit = (newValue) => {
    setForm({
      ...form,
      fecha_inicio: newValue
    });
  };
  const handleChangeEnd = (newValue) => {
    setForm({
      ...form,
      fecha_fin: newValue
    });
  };
  const handleChangeExpectedInit = (newValue) => {
    setForm({
      ...form,
      fecha_inicio_esperado: newValue
    });
  };
  const handleChangeExpectedEnd = (newValue) => {
    setForm({
      ...form,
      fecha_fin_esperado: newValue
    });
  };

  return (
    <Modal
    mostrarHeader={true}
    >
      Hello World continuanos mañana
    </Modal>
     
  );
}

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

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    groupId: state.user.id_grupoUsuarios,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 2)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormUser);
