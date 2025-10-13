import type { IClient } from "../interfaces/iclient";

const API_BASE_URL = "https://localhost:5001";

export async function getClients(): Promise<IClient[]> {
  const response = await fetch(`${API_BASE_URL}/Client`);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  const data = await response.json();
  const map = data.map((c: any) => ({
    id: BigInt(c.id),  // <- ha itt nincs átkasztolva, akkor number-ként, azaz lebegőpontos értékként kezeli
    fullName: c.fullName,
    phoneNumber: c.phoneNumber,
    email: c.email ?? null,
    address: c.address ?? null,
  }));
  return map;
}

export async function getClientById(p_id: bigint): Promise<IClient> {
  const response = await fetch(`${API_BASE_URL}/Client/${p_id}`);
  const data = await response.json();
  
  const client = {
    id: BigInt(data.id),  // <- ha itt nincs átkasztolva, akkor number-ként, azaz lebegőpontos értékként kezeli
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    address: data.address
  } as IClient;
  return client;
}

export async function addClient(client: Omit<IClient, "id">): Promise<number> {
  const params = new URLSearchParams({
    fullName: client.fullName,
    phoneNumber: client.phoneNumber,
    email: client.email ?? "",
    address: client.address ?? "",
  });
  const response = await fetch(`${API_BASE_URL}/Client?${params.toString()}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to add client");
  }
  return response.json();
}

export async function putClient(client: IClient): Promise<boolean>{
  const params = new URLSearchParams({
    id: client.id.toString(),
    fullName: client.fullName,
    phoneNumber: client.phoneNumber
  });

  if (client.email) // is not null
    params.append("email", client.email);
  if (client.address) // is not null
    params.append("address", client.address);

  const response = await fetch(`${API_BASE_URL}/Client?${params.toString()}`, {
    method: "PUT"
  });

  if (!response.ok)
    throw new Error("Failed to add client");
    
  return true;
}

// PATCH kérések attribútumonként
export async function patchClientName(id: bigint, fullName: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/Client/full_name?id=${id.toString()}&fullName=${encodeURIComponent(fullName)}`, {
    method: "PATCH",
  });
  return res.ok ? await res.json() : false;
}

export async function patchClientPhoneNumber(id: bigint, phone: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/Client/phone_number?id=${id.toString()}&phoneNumber=${encodeURIComponent(phone)}`, {
    method: "PATCH",
  });
  return res.ok ? await res.json() : false;
}

export async function patchClientEmail(id: bigint, email: string | null): Promise<boolean> {
  const param = email ? encodeURIComponent(email) : "";
  const res = await fetch(`${API_BASE_URL}/Client/email?id=${id.toString()}&email=${param}`, {
    method: "PATCH",
  });
  return res.ok ? await res.json() : false;
}

export async function patchClientAddress(id: bigint, address: string | null): Promise<boolean> {
  const param = address ? encodeURIComponent(address) : "";
  const res = await fetch(`${API_BASE_URL}/Client/address?id=${id.toString()}&address=${param}`, {
    method: "PATCH",
  });
  return res.ok ? await res.json() : false;
}

export async function deleteClient(id: bigint): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/Client?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
  return response.json();
}
