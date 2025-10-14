import { useState } from "react";
import type { IClient } from "../interfaces/iclient";
import { addClient } from "../api/clientsApi";
import { useNavigate, type NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction;

export default function ClientDetail() {
  navigate = useNavigate();
  const [client, setClient] = useState<IClient>({
    id: BigInt(-1),
    fullName: "",
    phoneNumber: "",
    email: null,
    address: null
  });

return (
    <div className="p-2 pt-0 flex justify-center">
        <div className="bg-[#222] text-white rounded-2xl shadow-lg p-4 w-full border border-gray-700">
            <h1 className="text-2xl font-bold mb-8 border-b border-gray-600 pb-3">
                Ügyfél részletes nézet
            </h1>

            <form className="space-y-6">
                {/* Név */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Teljes név</label>
                    <input
                    type="text"
                    onChange={(e) => setClient(() => { 
                        client!.fullName = e.target.value;
                        return client;
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Telefonszám */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Telefonszám</label>
                    <input
                    type="text"
                    onChange={(e) => setClient(() => {
                        client!.phoneNumber = e.target.value;
                        return client;
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">E-mail cím</label>
                    <input
                    type="email"
                    onChange={(e) => setClient(() => {
                        client!.email = e.target.value;
                        return client;
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Lakcím */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Lakcím</label>
                    <input
                    type="text"
                    onChange={(e) => setClient(() => {
                        client!.address = e.target.value;
                        return client;
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Gombok */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                    type="submit"
                    onClick={e => {
                        e.preventDefault();
                        onSavePressed(client!);
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

function onSavePressed(client: IClient)
{
    let message: string = "";

    if (client.fullName == "" || client.fullName == null || client.fullName == undefined) {
        message += "Teljes név megadása kötelező. ";
    }
    if (client.phoneNumber == "" || client.phoneNumber == null || client.phoneNumber == undefined) {
        message += "Telefonszám megadása kötelező. ";
    }

    if (message !== "")
    {
        alert(message);
        return;
    }

    if(client.email   === "") client.email = null;
    if(client.address === "") client.address = null;

    addClient(client)
        .then((id) => {
        if (id) {
            navigate("../client/" + id.toString(16));
        }
        else
            alert("Nem sikerült a mentés!");
        })
        .catch((err) => console.error(err));
}