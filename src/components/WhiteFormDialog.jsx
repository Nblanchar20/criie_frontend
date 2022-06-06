import React, { useState, useEffect, useRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Clear, Save } from "@material-ui/icons";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import axios from "../api";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Swal from "sweetalert2";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const WhiteFormDialog = (props) => {
  const {
    open = false,
    setOpen,
    form,
    setForm,
    token,
    setLoading,
    setFiltro,
    filtro,
  } = props;
  const classes = useStyles();
  const inputRefDepartment = useRef();
  const inputRefTown = useRef();
  const [error, setError] = useState({});
  const [parametersPuesto, setParametersPuesto] = useState([]);
  const [parametersIdentidad, setParametersIdentidad] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [towns, setTowns] = useState([]);
  const [yellow, setYellow] = useState([]);
  const [blue, setBlue] = useState([]);
  const [red, setRed] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentValue, setDepartmentValue] = useState("");
  const [townId, setTownId] = useState(null);
  const [townValue, setTownValue] = useState("");

  useEffect(() => {
    getParametersPuesto();
    getParametersIdentidad();
    getDepartments(form?.departamento);
    setDepartmentValue(form?.departamento);
    setTownValue(form?.municipio);
    getYellow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const deptValue =
      departmentValue !== "" ? departmentValue : form?.departamento;
    let dep = [];
    if (deptValue) {
      dep = departments.filter(
        (data) => data.nombre_departamento === deptValue
      );
    }
    getTowns(dep.length === 0 ? departmentId?.id : dep[0]?.id, dep[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, departmentValue]);

  useEffect(() => {
    if (
      form?.vp_novedad_puesto === "5" ||
      form?.vp_novedad_puesto === "6" ||
      form?.vp_novedad_puesto === "7" ||
      form?.vp_novedad_puesto === "11"
    ) {
      setDepartmentId(null);
      setTownId(null);
      setDepartmentValue("");
      setTownValue("");
      setForm({
        ...form,
        puesto_votacion: "",
        direccion_puesto: "",
        mesa_puesto: "",
      });
    } else {
      if (form?.vp_novedad_puesto === "3" || form?.vp_novedad_puesto === 3) {
        setDepartmentId({ id: 4, nombre_departamento: "ATLANTICO", estado: 1 });
        setTownId(null);
        setDepartmentValue("ATLANTICO");
        setTownValue("");
        setForm({
          ...form,
          puesto_votacion: form?.puesto_votacion,
          direccion_puesto: form?.direccion_puesto,
          mesa_puesto: form?.mesa_puesto,
        });
        inputRefTown?.current?.focus();
      } else if (form?.vp_novedad_puesto === "4") {
        setDepartmentId(null);
        setTownId(null);
        setDepartmentValue("");
        setTownValue("");
        setForm({
          ...form,
          puesto_votacion: form?.puesto_votacion,
          direccion_puesto: form?.direccion_puesto,
          mesa_puesto: form?.mesa_puesto,
        });
        inputRefDepartment.current.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.vp_novedad_puesto]);

  useEffect(() => {
    getBlue(form.id_amarillos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.id_amarillos]);

  useEffect(() => {
    getRed(form.id_azules);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.id_azules]);

  const getParametersPuesto = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      { id: 2 },
      {
        headers: { "access-token": token },
      }
    );
    setParametersPuesto(
      data?.parameters[0]?.valoresParametros?.sort((a, b) =>
        a.orden < b.orden ? -1 : 1
      )
    );
  };

  const getParametersIdentidad = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      { id: 3 },
      {
        headers: { "access-token": token },
      }
    );
    setParametersIdentidad(
      data?.parameters[0]?.valoresParametros?.sort((a, b) =>
        a.orden < b.orden ? -1 : 1
      )
    );
  };

  const getDepartments = async (department) => {
    const { data } = await axios.post(
      `/department/getDepartments`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setDepartments(data?.departments);

    let dep = [];
    if (department) {
      dep = data?.departments.filter(
        (data) => data.nombre_departamento === department
      );
    }
    setDepartmentId(dep.length > 0 ? dep[0] : null);
    setTownValue(form?.municipio ? form?.municipio : "");
  };

  const getTowns = async (id_departamentos, department) => {
    const { data } = await axios.post(
      `/town/getTowns`,
      { id_departamentos },
      {
        headers: { "access-token": token },
      }
    );
    setTowns(data?.towns || []);
    department && setDepartmentId(department);
  };

  const getYellow = async () => {
    const { data } = await axios.post(
      `/yellow/getYellows`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setYellow(
      data.yellow.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const getBlue = async (id_amarillos) => {
    const { data } = await axios.post(
      `/blue/getBlues`,
      { id_amarillos },
      {
        headers: { "access-token": token },
      }
    );
    setBlue(
      data.blue.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const getRed = async (id_azules) => {
    const { data } = await axios.post(
      `/red/getReds`,
      { id_azules },
      {
        headers: { "access-token": token },
      }
    );
    setRed(
      data.red.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const closeDialog = () => {
    setOpen(false);
    setForm({});
  };

  const handleInput = (event) => {
    const letters = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    const document = /^([0-9]{6,10})+$/;
    const numbers = /^([0-9]{7,10})+$/;
    const num = /^([0-9])+$/;

    if (event.target.name === "nombres" || "apellidos") {
      if (letters.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "documento") {
      if (document.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "telefono") {
      if (numbers.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "mesa_puesto") {
      if (num.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    setForm({
      ...form,
      [event.target.name]: event.target.value.toString().toUpperCase(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (form.vp_novedad_puesto === "3" ||
        form.vp_novedad_puesto === 3 ||
        form.vp_novedad_puesto === "4" ||
        form.vp_novedad_puesto === 4) &&
      departmentId === null &&
      departmentValue === ""
    ) {
      Swal.fire({
        icon: "warning",
        text: "Ingrese un departamento.",
        showConfirmButton: false,
        timer: 3000,
      });
      inputRefDepartment.current.focus();
    } else if (
      (form.vp_novedad_puesto === "3" ||
        form.vp_novedad_puesto === 3 ||
        form.vp_novedad_puesto === "4" ||
        form.vp_novedad_puesto === 4) &&
      townId === null &&
      townValue === ""
    ) {
      Swal.fire({
        icon: "warning",
        text: "Ingrese un municipio.",
        showConfirmButton: false,
        timer: 3000,
      });
      inputRefTown.current.focus();
    } else {
      const town = towns.filter((data) => data.nombre_municipio === townValue);
      const department = departments.filter(
        (data) => data.nombre_departamento === departmentValue
      );

      if (
        (form.vp_novedad_puesto === "3" ||
          form.vp_novedad_puesto === 3 ||
          form.vp_novedad_puesto === "4" ||
          form.vp_novedad_puesto === 4) &&
        town.length === 0
      ) {
        Swal.fire({
          icon: "warning",
          text: "Ingrese un municipio válido.",
          showConfirmButton: false,
          timer: 3000,
        });
        inputRefTown.current.focus();
      } else if (
        (form.vp_novedad_puesto === "3" ||
          form.vp_novedad_puesto === 3 ||
          form.vp_novedad_puesto === "4" ||
          form.vp_novedad_puesto === 4) &&
        department.length === 0
      ) {
        Swal.fire({
          icon: "warning",
          text: "Ingrese un departamento válido.",
          showConfirmButton: false,
          timer: 3000,
        });
        inputRefDepartment.current.focus();
      } else {
        setLoading(true);
        try {
          axios
            .put(
              `/white/${form?.id}`,
              {
                ...form,
                id_departamentos: departmentId
                  ? departmentId?.id
                  : department.length > 0
                  ? department[0].id
                  : null,
                id_municipios: townId
                  ? townId?.id
                  : town.length > 0
                  ? town[0].id
                  : null,
              },
              {
                headers: { "access-token": token },
              }
            )
            .then((res) => {
              if (res.data.updated.success) {
                setOpen(false);
                const whiteUpdated = filtro.filter(
                  (item) => item.id !== parseInt(res.data.updated.whiteId)
                );
                setFiltro(
                  [...whiteUpdated, res.data.updated.white].sort((a, b) =>
                    a.fecha_digitacion > b.fecha_digitacion ? -1 : 1
                  )
                );
                Swal.fire({
                  icon: "success",
                  text: res.data.updated.message
                    ? res.data.updated.message
                    : "Actualizado exitosamente.",
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  text: res.data.updated.message,
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              setLoading(false);
            });
        } catch (e) {
          Swal.fire({
            icon: "error",
            text: "Ha ocurrido un error.",
            showConfirmButton: false,
            timer: 3000,
          });
          setLoading(false);
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth={true} maxWidth={"md"}>
      <DialogTitle align="center" onClose={closeDialog}>
        Editar blanco:
      </DialogTitle>
      <DialogContent>
        <div className={classes.paper}>
          <div className={classes.container}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="yellowLabel">Amarillo</InputLabel>
                    <Select
                      labelId="yellowLabel"
                      label="Amarillo"
                      value={form?.id_amarillos}
                      onChange={handleInput}
                      name="id_amarillos"
                      className={classes.container__input_root}
                      align="left"
                    >
                      <MenuItem value={null} disabled>
                        <em>Seleccione una opción</em>
                      </MenuItem>
                      {yellow.map((data) => {
                        return (
                          <MenuItem key={data.id} value={data.id}>
                            {`${data.nombres} ${data.apellidos}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="blueLabel">Azul</InputLabel>
                    <Select
                      labelId="blueLabel"
                      label="Azul"
                      value={form?.id_azules}
                      onChange={handleInput}
                      name="id_azules"
                      className={classes.container__input_root}
                      align="left"
                    >
                      <MenuItem value={null} disabled>
                        <em>Seleccione una opción</em>
                      </MenuItem>
                      {blue.map((data) => {
                        return (
                          <MenuItem key={data.id} value={data.id}>
                            {`${data.nombres} ${data.apellidos}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="redLabel">Rojo</InputLabel>
                    <Select
                      labelId="redLabel"
                      label="Rojo"
                      value={form?.id_rojos}
                      onChange={handleInput}
                      name="id_rojos"
                      className={classes.container__input_root}
                      align="left"
                    >
                      <MenuItem value={null} disabled>
                        <em>Seleccione una opción</em>
                      </MenuItem>
                      {red.map((data) => {
                        return (
                          <MenuItem key={data.id} value={data.id}>
                            {`${data.nombres} ${data.apellidos}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    disabled
                    fullWidth
                    label="Documento"
                    name="documento"
                    value={form?.documento}
                    variant="outlined"
                    onChange={handleInput}
                    size="small"
                    error={error?.documento}
                    helperText={
                      error?.documento &&
                      "Solo se permite números entre 6 y 10 dígitos."
                    }
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    required
                    fullWidth
                    label="Nombres"
                    name="nombres"
                    size="small"
                    value={form?.nombres}
                    variant="outlined"
                    onChange={handleInput}
                    error={error?.nombres}
                    helperText={error?.nombres && "Solo se permite letras."}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Apellidos"
                    name="apellidos"
                    size="small"
                    value={form?.apellidos}
                    variant="outlined"
                    onChange={handleInput}
                    error={error?.apellidos}
                    helperText={error?.apellidos && "Solo se permite letras."}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    size="small"
                    value={form?.telefono}
                    variant="outlined"
                    onChange={handleInput}
                    error={error.telefono}
                    helperText={
                      error.telefono &&
                      "Solo se permite números de hasta 10 dígitos."
                    }
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    size="small"
                    value={form?.direccion}
                    variant="outlined"
                    onChange={handleInput}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Barrio"
                    name="barrio"
                    size="small"
                    value={form?.barrio}
                    variant="outlined"
                    onChange={handleInput}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="prodecendiaLabel">
                      Novedad identidad
                    </InputLabel>
                    <Select
                      labelId="prodecendiaLabel"
                      label="Novedad identidad"
                      value={form?.vp_novedad_identidad}
                      onChange={handleInput}
                      name="vp_novedad_identidad"
                      className={classes.container__input_root}
                      align="left"
                    >
                      <MenuItem value={null} disabled>
                        <em>Seleccione una opción</em>
                      </MenuItem>
                      {parametersIdentidad.map((data) => {
                        return (
                          <MenuItem key={data.id} value={data.id}>
                            {data.valor_parametro}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="prodecendiaLabel">
                      Novedad puesto
                    </InputLabel>
                    <Select
                      labelId="prodecendiaLabel"
                      label="Novedad puesto"
                      value={form?.vp_novedad_puesto}
                      onChange={handleInput}
                      name="vp_novedad_puesto"
                      className={classes.container__input_root}
                      align="left"
                    >
                      <MenuItem value={null} disabled>
                        <em>Seleccione una opción</em>
                      </MenuItem>
                      {parametersPuesto.map((data) => {
                        return (
                          <MenuItem key={data.id} value={data.id}>
                            {data.valor_parametro}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required={
                      form?.vp_novedad_puesto === "3" ||
                      form?.vp_novedad_puesto === 3 ||
                      form?.vp_novedad_puesto === "4" ||
                      form?.vp_novedad_puesto === 4
                    }
                  >
                    <Autocomplete
                      freeSolo
                      disabled={
                        form?.vp_novedad_puesto === "3" ||
                        form?.vp_novedad_puesto === 3 ||
                        form?.vp_novedad_puesto === "5" ||
                        form?.vp_novedad_puesto === 5 ||
                        form?.vp_novedad_puesto === "6" ||
                        form?.vp_novedad_puesto === 6 ||
                        form?.vp_novedad_puesto === "7" ||
                        form?.vp_novedad_puesto === 7 ||
                        form?.vp_novedad_puesto === "11" ||
                        form?.vp_novedad_puesto === 11
                      }
                      value={
                        departmentId
                          ? departmentId
                          : form?.departamento
                          ? form?.departamento
                          : null
                      }
                      onChange={(e, newValue) => {
                        setDepartmentId(newValue);
                      }}
                      inputValue={departmentValue ? departmentValue : ""}
                      onInputChange={(e, newInputValue) => {
                        setDepartmentValue(newInputValue.toUpperCase());
                      }}
                      options={departments}
                      getOptionLabel={(option) => option.nombre_departamento}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required={
                            form?.vp_novedad_puesto === "3" ||
                            form?.vp_novedad_puesto === 3 ||
                            form?.vp_novedad_puesto === "4" ||
                            form?.vp_novedad_puesto === 4
                          }
                          inputRef={inputRefDepartment}
                          label="Departamento"
                          margin="normal"
                          variant="outlined"
                          size="small"
                          style={{
                            backgroundColor:
                              (form?.vp_novedad_puesto === 3 ||
                                form?.vp_novedad_puesto === "3" ||
                                form?.vp_novedad_puesto === 5 ||
                                form?.vp_novedad_puesto === "5" ||
                                form?.vp_novedad_puesto === 6 ||
                                form?.vp_novedad_puesto === "6" ||
                                form?.vp_novedad_puesto === 7 ||
                                form?.vp_novedad_puesto === "7" ||
                                form?.vp_novedad_puesto === "11" ||
                                form?.vp_novedad_puesto === 11) &&
                              "#F5F5F5",
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required={
                      form?.vp_novedad_puesto === "3" ||
                      form?.vp_novedad_puesto === 3 ||
                      form?.vp_novedad_puesto === "4" ||
                      form?.vp_novedad_puesto === 4
                    }
                  >
                    <Autocomplete
                      freeSolo
                      disabled={
                        form?.vp_novedad_puesto === "5" ||
                        form?.vp_novedad_puesto === 5 ||
                        form?.vp_novedad_puesto === "6" ||
                        form?.vp_novedad_puesto === 6 ||
                        form?.vp_novedad_puesto === "7" ||
                        form?.vp_novedad_puesto === 7 ||
                        form?.vp_novedad_puesto === "11" ||
                        form?.vp_novedad_puesto === 11
                      }
                      value={
                        townId
                          ? townId
                          : form?.municipio
                          ? form?.municipio
                          : null
                      }
                      onChange={(e, newValue) => {
                        setTownId(newValue);
                      }}
                      inputValue={townValue ? townValue : ""}
                      onInputChange={(e, newInputValue) => {
                        setTownValue(newInputValue.toUpperCase());
                      }}
                      options={towns}
                      getOptionLabel={(option) => option.nombre_municipio}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={inputRefTown}
                          label="Municipio"
                          margin="normal"
                          variant="outlined"
                          size="small"
                          required={
                            form?.vp_novedad_puesto === "3" ||
                            form?.vp_novedad_puesto === 3 ||
                            form?.vp_novedad_puesto === "4" ||
                            form?.vp_novedad_puesto === 4
                          }
                          style={{
                            backgroundColor:
                              (form?.vp_novedad_puesto === "5" ||
                                form?.vp_novedad_puesto === 5 ||
                                form?.vp_novedad_puesto === "6" ||
                                form?.vp_novedad_puesto === 6 ||
                                form?.vp_novedad_puesto === "7" ||
                                form?.vp_novedad_puesto === 7 ||
                                form?.vp_novedad_puesto === "11" ||
                                form?.vp_novedad_puesto === 11) &&
                              "#F5F5F5",
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={
                      form?.vp_novedad_puesto === "5" ||
                      form?.vp_novedad_puesto === 5 ||
                      form?.vp_novedad_puesto === "6" ||
                      form?.vp_novedad_puesto === 6 ||
                      form?.vp_novedad_puesto === "7" ||
                      form?.vp_novedad_puesto === 7 ||
                      form?.vp_novedad_puesto === "11" ||
                      form?.vp_novedad_puesto === 11
                    }
                    required={
                      form?.vp_novedad_puesto === "3" ||
                      form?.vp_novedad_puesto === 3 ||
                      form?.vp_novedad_puesto === "4" ||
                      form?.vp_novedad_puesto === 4
                    }
                    fullWidth
                    label="Puesto"
                    name="puesto_votacion"
                    size="small"
                    value={form?.puesto_votacion}
                    variant="outlined"
                    onChange={handleInput}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled={
                      form?.vp_novedad_puesto === "5" ||
                      form?.vp_novedad_puesto === 5 ||
                      form?.vp_novedad_puesto === "6" ||
                      form?.vp_novedad_puesto === 6 ||
                      form?.vp_novedad_puesto === "7" ||
                      form?.vp_novedad_puesto === 7 ||
                      form?.vp_novedad_puesto === "11" ||
                      form?.vp_novedad_puesto === 11
                    }
                    required={
                      form?.vp_novedad_puesto === "3" ||
                      form?.vp_novedad_puesto === 3 ||
                      form?.vp_novedad_puesto === "4" ||
                      form?.vp_novedad_puesto === 4
                    }
                    fullWidth
                    label="Dirección puesto"
                    name="direccion_puesto"
                    size="small"
                    value={form?.direccion_puesto}
                    variant="outlined"
                    onChange={handleInput}
                    InputProps={{
                      classes: {
                        root: classes.container__input_root,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled={
                      form?.vp_novedad_puesto === "5" ||
                      form?.vp_novedad_puesto === 5 ||
                      form?.vp_novedad_puesto === "6" ||
                      form?.vp_novedad_puesto === 6 ||
                      form?.vp_novedad_puesto === "7" ||
                      form?.vp_novedad_puesto === 7 ||
                      form?.vp_novedad_puesto === "11" ||
                      form?.vp_novedad_puesto === 11
                    }
                    required={
                      form?.vp_novedad_puesto === "3" ||
                      form?.vp_novedad_puesto === 3 ||
                      form?.vp_novedad_puesto === "4" ||
                      form?.vp_novedad_puesto === 4
                    }
                    fullWidth
                    label="Mesa puesto"
                    name="mesa_puesto"
                    size="small"
                    value={form?.mesa_puesto}
                    variant="outlined"
                    onChange={handleInput}
                    error={error.mesa_puesto}
                    helperText={error.mesa_puesto && "Solo se permite números."}
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
                  disabled={
                    error.nombres ||
                    error.apellidos ||
                    error.documento ||
                    error.telefono ||
                    error.mesa_puesto
                  }
                  color="primary"
                  variant="contained"
                  startIcon={<Save />}
                  className={classes.button}
                  type="submit"
                >
                  Guardar
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Clear />}
                  className={classes.button}
                  onClick={closeDialog}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
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
    },
  },
  button: {
    margin: "0.5em",
    padding: ".5em 3em",
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
    "&.Mui-disabled": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

export default WhiteFormDialog;
