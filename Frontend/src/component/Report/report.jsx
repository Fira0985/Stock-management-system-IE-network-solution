import React, { useState } from "react";
import "./Report.css";

const Report = ({ isSidebarOpen }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExport = () => {
    alert("Export to CSV triggered");
  };

  const handlePrint = () => {
    window.print();
  };

  const reports = [
    { id: 1, item: "Product A", quantity: 10, total: 500 },
    { id: 2, item: "Product B", quantity: 5, total: 200 },
    { id: 3, item: "Product C", quantity: 8, total: 320 },
  ];

  const totalAmount = reports.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div
      className={`report-page ${isSidebarOpen ? "with-sidebar" : "full-width"}`}
    >
      <h2>📊 Report Page</h2>

      <div className="filters">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleExport}>Export CSV</button>
        <button onClick={handlePrint}>Print</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report.id}>
              <td>{index + 1}</td>
              <td>{report.item}</td>
              <td>{report.quantity}</td>
              <td>${report.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <strong>Total Sales:</strong> ${totalAmount}
      </div>
    </div>
  );
};

export default Report;
