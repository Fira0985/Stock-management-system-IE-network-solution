const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

function exportToCSV(data, filename) {
  const parser = new Parser();
  const csv = parser.parse(data);
  const filePath = path.join(__dirname, '../uploads', filename);
  fs.writeFileSync(filePath, csv);
  return filePath;
}

function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const filePath = path.join(__dirname, '../uploads', filename);
  XLSX.writeFile(wb, filePath);
  return filePath;
}

module.exports = { exportToCSV, exportToExcel };
