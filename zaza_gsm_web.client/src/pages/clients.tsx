import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Client } from "../interfaces/client";

export default function Clients() {
  // Mock adatok — később API-ból jönnek majd
  const [clients, setClients] = useState<Client[]>([
    { id: 10, full_name: "Kiss Péter", email: "peter.kiss@example.com", phone: "+36 30 123 4567", address: null },
    { id: 11, full_name: "Nagy Anna", email: "anna.nagy@example.com", phone: "+36 20 987 6543", address: null },
    { id: 12, full_name: "Szabó László", email: null, phone: "+36 70 111 2222", address: "7200 Dombóvár, Jókai Mór utca 2" },
  ]);

  const navigate = useNavigate();

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Ügyfelek</h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-700 bg-[#222] text-white">
          <thead className="bg-[#333] text-gray-200">
            <tr>
              <th className="py-3 px-4 text-left border-b border-gray-600">Név</th>
              <th className="py-3 px-4 text-left border-b border-gray-600">Telefonszám</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-[#444] transition-colors"
                  onClick={() => navigate(`/client/${client.id.toString(16)}`)}>
                <td className="py-3 px-4 border-b border-gray-700">{client.full_name}</td>
                <td className="py-3 px-4 border-b border-gray-700">{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}