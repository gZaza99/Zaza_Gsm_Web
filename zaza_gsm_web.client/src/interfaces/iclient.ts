export interface IClient {
  id: bigint;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
}
