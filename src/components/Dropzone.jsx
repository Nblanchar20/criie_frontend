import { IconButton, Tooltip } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@material-ui/icons/HighlightOff";

const Dropzone = (props) => {
  const {
    accept,
    files,
    setFiles,
    preview = true,
    specificFiles = false,
    multiple = false,
    deletable = true,
  } = props;
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: specificFiles,
    accept: accept,
    multiple,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const handleClick = (e, index, action) => {
    switch (action) {
      case "delete":
        setFiles([...files.filter((e, index2) => index2 !== index)]);
        break;
      default:
        break;
    }
  };
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const thumbs = files.map((file, index) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <li>
          <label>{file.name || file.ruta.split("/")[2]}</label>
          {deletable && (
            <Tooltip title="Eliminar">
              <IconButton
                aria-label="delete"
                onClick={(e) => handleClick(e, index, "delete")}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </li>
      </div>
    </div>
  ));

  const acceptedFileItems = files.map((file) => (
    <li key={file.path}>{file.path || file.ruta.split("/")[2]}</li>
  ));

  return (
    <>
      <section className="container" style={baseStyle}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>
            Arrastre y suelte los archivos aquí, o haga clic para seleccionar
          </p>
          {specificFiles !== false && (
            <em>(Máximo {`${specificFiles}`} archivos)</em>
          )}
        </div>
        {preview && <aside style={thumbsContainer}>{thumbs}</aside>}
      </section>
      {!preview && (
        <aside style={thumbsContainer}>
          <ul>{acceptedFileItems}</ul>
        </aside>
      )}
    </>
  );
};

const thumbsContainer = {
  marginTop: 16,
};

const thumb = {
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const baseStyle = {
  flex: 1,
  padding: "20px",
  borderWidth: 2,
  borderRadius: "10px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "gray",
  outline: "none",
  transition: "border .24s ease-in-out",
};

export default Dropzone;
