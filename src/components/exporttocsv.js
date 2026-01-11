import { saveAs } from 'file-saver';
import Papa from "papaparse";

export const ExportToCsv = (data, filename = "my-data") => {
  const csvContent = Papa.unparse(data, { header: true });
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
};