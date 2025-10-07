export interface Client {
  id: bigint;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
}
