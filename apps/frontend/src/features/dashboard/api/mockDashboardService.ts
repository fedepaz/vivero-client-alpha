//src/features/dashboard/api/mockDashboardService.ts

import {
  DashboardKpiInterface,
  AlertInterface,
  RecentActivityInterface,
} from "../types";

const generateKpi = (): DashboardKpiInterface => {
  return {
    totalPlants: 1500,
    activePlants: 500,
    totalClients: 200,
    activeClients: 200,
    openInvoices: 100,
    monthlyRevenue: 100000,
    pendingOrders: 50,
    activeUsers: 25,
  };
};

const generateAlert = (count: number): AlertInterface[] => {
  const types: AlertInterface["type"][] = ["critical", "warning", "info"];
  const messages = [
    "Stock limitado",
    "Nueva orden recibida",
    "Nuevo cliente registrado",
    "Factura recibida",
    "Sistema en mantenimiento",
    "Usuario eliminado",
  ];

  const locations = [
    // Provinces of Argentina
    "Sucursal Buenos Aires",
    "Sucursal Catamarca",
    "Sucursal Chaco",
    "Sucursal Chubut",
    "Sucursal Corrientes",
    "Sucursal Entre Rios",
    "Sucursal Formosa",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    messageKey: messages[Math.floor(Math.random() * messages.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(),
  }));
};

const generateRecentActivity = (count: number): RecentActivityInterface[] => {
  const actions = [
    "Planta #123 está agotada",
    "Pedido #456 ha sido realizado",
    "Nuevo cliente registrado",
    "Nueva factura recibida",
  ];

  const users = [
    "Juan Fernando Quintero",
    "Gabriela Sabatini",
    "Luciana Aymar",
    "Rodrigo Mora",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i + 1}`,
    action: actions[i % actions.length],
    user: users[i % users.length],
    timestamp: new Date(),
  }));
};
// Replace with your actual API call
// For example, you could fetch data from an API endpoint
// for now we'll just return mock data

const dashboardData = generateKpi();
const alertsData = generateAlert(3);
const recentActivityData = generateRecentActivity(4);

export const mockDashboardService = {
  async fetchKPIs(): Promise<DashboardKpiInterface> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000)); // Replace API response with KPIs
    // Simulate receiving KPIs from the API
    return dashboardData;
  },

  async fetchAlerts(): Promise<AlertInterface[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000)); // Replace API response with alerts
    // Simulate receiving alerts from the API
    return alertsData;
  },

  async fetchRecentActivity(): Promise<RecentActivityInterface[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000)); // Replace API response with recent activity
    // Simulate receiving recent activity from the API
    return recentActivityData;
  },
};
