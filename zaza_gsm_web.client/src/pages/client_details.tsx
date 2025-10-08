import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Client } from "../interfaces/client";
import {
  getClientById, 
  putClient,
  patchClientName,
  patchClientPhoneNumber,
  patchClientEmail,
  patchClientAddress
} from "../api/clients";
import hexToBigInt from "../components/TypeConversion";

let originClient: Client | null;

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // A hex stringet visszaalakíthatod BIGINT-té (ha kell)
  const numericId = hexToBigInt(`0x${id}`);

  useEffect(() => {
    getClientById(numericId)
      .then(c => {
        setClient(c);
        originClient = c;
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [numericId]);

  if (loading) return <p className="text-gray-400 p-4">Betöltés...</p>;
  if (!client) return <p className="text-red-500 p-4">Ügyfél nem található.</p>;

  if (client !== null)
    return (
      <div className="p-2 pt-0 flex justify-center">
        <div className="bg-[#222] text-white rounded-2xl shadow-lg p-4 w-full border border-gray-700">
          <h1 className="text-2xl font-bold mb-8 border-b border-gray-600 pb-3">
            Ügyfél részletes nézet
          </h1>

          <form className="space-y-6">
            {/* Azonosító */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Azonosító</label>
              <input
                type="text"
                value={client.id.toString(16).toUpperCase()}
                readOnly
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
              />
            </div>

            {/* Név */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Teljes név</label>
              <input
                type="text"
                value={client.fullName}
                onChange={(e) => setClient({ ...client, fullName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Telefonszám */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Telefonszám</label>
              <input
                type="text"
                value={client.phoneNumber}
                onChange={(e) => setClient({ ...client, phoneNumber: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail cím</label>
              <input
                type="email"
                value={client.email ?? ""}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Lakcím */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Lakcím</label>
              <input
                type="text"
                value={client.address ?? ""}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Gombok */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                onClick={e => {
                  e.preventDefault();
                  onSavePressed(client);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg grow"
              >
                Mentés
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

function onSavePressed(client: Client)
{
  let changed: string[] = [];

  if(client.email   === "") client.email = null;
  if(client.address === "") client.address = null;

  if(client.fullName    !== originClient?.fullName   ) changed.push("full_name");
  if(client.phoneNumber !== originClient?.phoneNumber) changed.push("phone_number");
  if(client.email       !== originClient?.email      ) changed.push("email");
  if(client.address     !== originClient?.address    ) changed.push("address");

  if (changed.length === 0) return;

  if (changed.length > 2) // 1 PUT request if more than 2
  {
    putClient(client)
      .then((ok) => {
        if (ok) alert("Sikeres mentés!");
        else alert("Nem sikerült a mentés!");
      })
      .catch((err) => console.error(err));
  } else { // A few PATCH requests if not more than 2
const promises: Promise<boolean>[] = [];

    for (const field of changed) {
      switch (field) {
        case "full_name":
          promises.push(patchClientName(client.id, client.fullName));
          break;
        case "phone_number":
          promises.push(patchClientPhoneNumber(client.id, client.phoneNumber));
          break;
        case "email":
          promises.push(patchClientEmail(client.id, client.email));
          break;
        case "address":
          promises.push(patchClientAddress(client.id, client.address));
          break;
      }
    }

    Promise.all(promises)
      .then((results) => {
        if (results.every((success) => success === true)) alert("Sikeres mentés!");
        else alert("Egyes módosításokat nem sikerültek elmenteni!");
      })
      .catch((err) => console.error(err));
  }
}