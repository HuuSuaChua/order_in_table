export type TableStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "inactive";

export interface RestaurantTable {
  id: string;
  table_code: string;
  table_name: string;
  qr_token: string;
  status: TableStatus;
  created_at: string;
  updated_at: string;
}