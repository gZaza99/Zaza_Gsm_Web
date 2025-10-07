import type { Client } from "../interfaces/client";

const API_BASE_URL = "https://localhost:7105";

export async function getClients(): Promise<Client[]> {
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

export async function getClientById(p_id: bigint): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/Client/${p_id}`);
  const data = await response.json();
  
  const client = {
    id: BigInt(data.id),  // <- ha itt nincs átkasztolva, akkor number-ként, azaz lebegőpontos értékként kezeli
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    address: data.address
  } as Client;
  return client;
}

export async function addClient(client: Omit<Client, "id">): Promise<number> {
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

export async function deleteClient(id: bigint): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/Client?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
  return response.json();
}
