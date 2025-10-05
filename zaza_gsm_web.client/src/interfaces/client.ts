export interface Client {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
}