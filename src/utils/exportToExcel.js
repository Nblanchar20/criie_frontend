const exportToExcel = (columns, rows, filename) => {
  if (rows.length > 0) {
    var tab_text =
      "<meta charset='UTF-8'><table border='2px' style='font-size: 15px'>";
    tab_text += `<tr style='text-align: center; font-size: 15px'>`;

    columns.map((item) => (tab_text += `<th>${item}</th>`));
    tab_text += "</tr>";

    // eslint-disable-next-line array-callback-return
    rows.map((item) => {
      tab_text += "<tr>";
      item.map((data) => (tab_text += `<td>${data}</td>`));
      tab_text += "</tr>";
    });

    tab_text += "</table>";

    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");
    tab_text = tab_text.replace(/<img[^>]*>/gi, "");
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, "");

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var sa;
    var txtArea1;
    // eslint-disable-next-line
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      // eslint-disable-next-line
      sa = txtArea1.document.execCommand(
        "SaveAs",
        true,
        "Say Thanks to Sumit.xls"
      );
    }

    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href =
      "data:application/vnd.ms-Excel, " + encodeURIComponent(tab_text);
    downloadLink.download = `${filename}.xls`;
    downloadLink.click();
  }
};

export default exportToExcel;
