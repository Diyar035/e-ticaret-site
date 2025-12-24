/** * @HOCAYA_NOT : Proje genelinde tip tutarlılığını sağlamak için
 * dashboard verilerini merkezi bir arayüzde topladık.
 */

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

export interface SalesItem {
  month: string;
  gelir: number;
  [key: string]: string | number; // Recharts'ın dinamik veri okuması için şart knk
}

export interface CategoryItem {
  name: string;
  value: number;
  [key: string]: string | number; // 'Index signature missing' hatasını bu satır çözer
}

export interface DashboardData {
  revenue: number;
  pendingCount: number;
  deliveredCount: number;
  cancelledCount: number;
  ordersCount: number;
  usersCount: number;
  productsSoldCount: number;
  salesData: SalesItem[];
  categoryData: CategoryItem[];
  recentOrders: Order[];
  availableYears: number[];
}
