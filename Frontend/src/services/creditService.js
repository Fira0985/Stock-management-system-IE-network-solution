import api from "./api"; // your axios instance

export async function getCustomers() {
  const res = await api.get("/customers"); // adjust endpoint
  return res.data;
}

export async function getProducts() {
  const res = await api.get("/products"); // adjust endpoint
  return res.data;
}

export async function submitCreditSale(data) {
  const res = await api.post("/credit-sales", data); // adjust endpoint
  return res.data;
}
