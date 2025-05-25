import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth Services
export const authService = {
    login: async (username: string, password: string) => {
        const response = await api.post("/auth/login", { username, password });
        if (response.data.authenticated) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    register: async (userData: { firstName: string; lastName: string; username: string; email: string; password: string }) => {
        const response = await api.post("/auth/register", {
            ...userData,
            createdAt: new Date().toISOString(),
        });
        return response.data;
    },

    forgetPassword: async (username: string, oldPassword: string, newPassword: string) => {
        const response = await api.put("/auth/forget-password", {
            username,
            oldPassword,
            newPassword,
        });
        return response.data;
    },
};

// Transaction Services
export const transactionService = {
    createTransaction: async (transactionData: { userId: string; amount: number; type: string; description: string; email: string }) => {
        const response = await api.post("/transactions", transactionData);
        return response.data;
    },

    getUserTransactions: async (userId: string) => {
        const response = await api.get(`/transactions/${userId}`);
        return response.data;
    },

    getTransactionById: async (transactionId: string) => {
        const response = await api.get(`/transactions/details/${transactionId}`);
        return response.data;
    },
};

// Courier Services
export const courierService = {
    getAllCouriers: async () => {
        const response = await api.get("/couriers");
        return response.data;
    },

    createCourier: async (courierData: { name: string; phoneNumber: string; status: "active" | "inactive"; userId: string }) => {
        const response = await api.post("/couriers", courierData);
        return response.data;
    },

    getCourierById: async (id: string) => {
        const response = await api.get(`/couriers/${id}`);
        return response.data;
    },

    updateCourier: async (id: string, courierData: { name?: string; phoneNumber?: string; status?: "active" | "inactive"; userId: string }) => {
        const response = await api.put(`/couriers/${id}`, courierData);
        return response.data;
    },

    deleteCourier: async (id: string, userId: string) => {
        const response = await api.delete(`/couriers/${id}`, { data: { userId } });
        return response.data;
    },
};

// Refund Services
export const refundService = {
    createRefund: async (refundData: { transactionId: string; amount: number; reason: string }) => {
        const response = await api.post("/refunds", refundData);
        return response.data;
    },

    getAllRefunds: async () => {
        const response = await api.get("/refunds");
        return response.data;
    },

    updateRefundStatus: async (id: string, status: "pending" | "approved" | "rejected") => {
        const response = await api.put(`/refunds/${id}`, { status });
        return response.data;
    },
};

// Audit Log Services
export const auditLogService = {
    getAllAuditLogs: async () => {
        const response = await api.get("/audit-logs");
        return response.data;
    },

    getUserAuditLogs: async (userId: string) => {
        const response = await api.get(`/audit-logs/user/${userId}`);
        return response.data;
    },

    getAuditLogsByAction: async (action: string) => {
        const response = await api.get(`/audit-logs/action/${action}`);
        return response.data;
    },
};

// Settlement Services
export const settlementService = {
    createSettlement: async (settlementData: { courierId: string; periodStart: Date; periodEnd: Date; paymentMethod: "BANK_TRANSFER" | "CASH" | "MOBILE_WALLET"; paymentDetails: object; userId: string }) => {
        const response = await api.post("/settlements", settlementData);
        return response.data;
    },

    getCourierSettlements: async (courierId: string) => {
        const response = await api.get(`/settlements/courier/${courierId}`);
        return response.data;
    },

    getSettlementDetails: async (id: string) => {
        const response = await api.get(`/settlements/${id}`);
        return response.data;
    },

    updateSettlementStatus: async (
        id: string,
        data: {
            status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
            notes?: string;
            userId: string;
        }
    ) => {
        const response = await api.put(`/settlements/${id}/status`, data);
        return response.data;
    },
};

export default api;
