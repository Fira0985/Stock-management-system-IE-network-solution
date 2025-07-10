import * as XLSX from "xlsx";

// Utility to trigger download
function downloadExcel(data, sheetName, fileName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
}

// Export helpers for each module
export function exportCustomers(customers) {
    if (!customers || customers.length === 0) return;
    downloadExcel(customers, "Customers", "customers.xlsx");
}

export function exportSuppliers(suppliers) {
    if (!suppliers || suppliers.length === 0) return;
    downloadExcel(suppliers, "Suppliers", "suppliers.xlsx");
}

export function exportUsers(users) {
    if (!users || users.length === 0) return;
    downloadExcel(users, "Users", "users.xlsx");
}

export function exportProducts(products) {
    if (!products || products.length === 0) return;
    downloadExcel(products, "Products", "products.xlsx");
}

export function exportSales(sales) {
    if (!sales || sales.length === 0) return;
    downloadExcel(sales, "Sales", "sales.xlsx");
}

export function exportPurchases(purchases) {
    if (!purchases || purchases.length === 0) return;
    downloadExcel(purchases, "Purchases", "purchases.xlsx");
}

export function exportReport(data, sheetName = "Report", fileName = "report.xlsx") {
    if (!data || data.length === 0) return;
    downloadExcel(data, sheetName, fileName);
}
