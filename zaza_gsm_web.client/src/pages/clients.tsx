import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Client } from "../interfaces/client";
import { getClients } from "../api/clients";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
              <tr key={client.id.toString()} className="hover:bg-[#444] transition-colors"
                  onClick={() => navigate(`/client/${client.id.toString(16)}`)}>
                <td className="py-3 px-4 border-b border-gray-700">{client.fullName}</td>
                <td className="py-3 px-4 border-b border-gray-700">{client.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}