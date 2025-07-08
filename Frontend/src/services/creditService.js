import api from "./api"; // your axios instance

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function getCustomers() {
  const res = await api.get("/customers", {
    headers: getAuthHeaders()
  });
  return res.data;
}

export async function getProducts() {
  const res = await api.get("/products", {
    headers: getAuthHeaders()
  });
  return res.data;
}

export async function submitCreditSale(data) {
  const res = await api.post("/credit-sales", data, {
    headers: getAuthHeaders()
  });
  return res.data;
}

//  GET /api/credits
export async function getAllCredits() {
  const res = await api.get("/credits", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

//  GET /api/paid
export async function getPaidCredits() {
  const res = await api.get("/paid", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

//  GET /api/unpaid
export async function getUnpaidCredits() {
  const res = await api.get("/unpaid", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

//  GET /api/partial
export async function getPartialCredits() {
  const res = await api.get("/partial", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// POST /api/makePayment
export async function makePayment({ sale_id, amount }) {
  const res = await api.post("/makePayment", { sale_id, amount }, {
    headers: getAuthHeaders(),
  });
  return res.data;
}
