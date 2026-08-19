import api from "./api";


const fetchOrders = async () => {
  try {
    const response = await api.get('/r/bistro-cafe/orders');
    console.log(response.data);
  } catch (error) {
    // If token is expired, setupInterceptors catches 401 automatically
    // and forces a redirect to /login.
    console.error("Error fetching orders:", error);
  }
};