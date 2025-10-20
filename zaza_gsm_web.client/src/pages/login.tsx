import { runChecksAndShowErrors } from "../components/common";
import type { IUser } from "../interfaces/iuser";
import { useState } from "react";

export default function Login() {
    const [usrname, setUsrName] = useState<string>("");
    const [passwd, setPasswd] = useState<string>("");
    const user: IUser = {
        id: null,
        username: null,
        email: "",
        password: ""
    };
    return (
        <div className="p-2 pt-0 flex justify-center">
        <div className="bg-[#222] text-white rounded-2xl shadow-lg p-4 w-full border border-gray-700">
            <h1 className="text-2xl font-bold mb-8 border-b border-gray-600 pb-3">
                Bejelentkezés
            </h1>

            <form className="space-y-6">
                {/* Username */}
                <div id="usernameSection">
                    <label className="block text-sm text-gray-400 mb-1">Felhasználónév / email cím *</label>
                    <input
                    type="text"
                    onChange={e => {
                        setUsrName(e.target.value);
                        user.username = e.target.value;
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Jelszó */}
                <div id="passwordSection">
                    <label className="block text-sm text-gray-400 mb-1">Jelszó *</label>
                    <input
                    type="password"
                    onChange={e => {
                        setPasswd(e.target.value);
                        user.password = e.target.value;
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Bejelentkezés gomb */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                    type="submit"
                    onClick={e => {
                        e.preventDefault();
                        runChecksAndShowErrors(
                            () => checkUsername(usrname),
                            () => checkPassword(passwd)
                        );
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg grow"
                    >
                    Bejelentkezem
                    </button>
                </div>
                <p className="text-gray-300">Nincs még felhasználói fiókja?
                    <a href="/register" className="text-blue-400 underline">
                    Regisztráljon
                    </a>!
                </p>
            </form>
        </div>
    </div>
    );
}

function checkUsername(usrName: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement {
    let section = document.getElementById("usernameSection") as HTMLDivElement;
    if (usrName == "")
        return [section, "Felhasználónév kitöltése kötelező"];
    else
        return section;
}

function checkPassword(password: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement {
    let section = document.getElementById("passwordSection") as HTMLDivElement;
    if (password == "")
        return [section, "Jelszó kitöltése kötelező"];
    else
        return section;
}