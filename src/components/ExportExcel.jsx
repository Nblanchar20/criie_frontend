import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportExcel = ({ jsonData, fileName }) => {
  const classes = useStyles();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = (jsonData, fileName) => {
    if (jsonData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(jsonData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  };

  return (
    <Button
      color="primary"
      variant="contained"
      className={classes.button}
      onClick={(e) => exportToExcel(jsonData, fileName)}
    >
      Exportar
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.background.main,
    marginRight: theme.spacing(0.8),
    padding: ".5em 3em",
    borderRadius: "10px",
  },
}));

export default ExportExcel;
