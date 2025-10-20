import { useState } from "react";
import type { IUser } from "../interfaces/iuser";
import {
    runChecksAndShowErrors
} from "../components/common"

export default function Register() {
    const newUsr: IUser = {
        id: null,
        username: null,
        email: "",
        password: ""
    };
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confPassword, setConfPassword] = useState<string>("");
    return (
        <div className="p-2 pt-0 flex justify-center">
            <div className="bg-[#222] text-white rounded-2xl shadow-lg p-4 w-full border border-gray-700">
                <h1 className="text-2xl font-bold mb-8 border-b border-gray-600 pb-3">
                    Regisztráció
                </h1>

                <form className="space-y-6">
                    {/* Username */}
                    <div id="userNameSection" className="transition-[height] duration-500 h-[66px]">
                        {/*<p key={1} className="errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500"></p>*/}
                        <label className="block text-sm text-gray-400 mb-1">Felhasználónév</label>
                        <input
                        type="text"
                        onChange={e => {
                            setUserName(e.target.value);
                            newUsr.username = e.target.value;
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div id="emailSection" className="transition-[height] duration-500 h-[66px]">
                        {/*<p className="errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500"></p>*/}
                        <label className="block text-sm text-gray-400 mb-1">Email cím *</label>
                        <input
                        type="text"
                        onChange={e => {
                            setEmail(e.target.value);
                            newUsr.email = e.target.value.trim();
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div id="passwordSection" className="transition-[height] duration-500 h-[66px]">
                        {/*<p className="errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500"></p>*/}
                        <label className="block text-sm text-gray-400 mb-1">Jelszó *</label>
                        <input
                        type="password"
                        onChange={e => {
                            setPassword(e.target.value);
                            newUsr.password = e.target.value;
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Password again */}
                    <div id="confPasswordSection" className="transition-[height] duration-500 h-[66px]">
                        {/*<p className="errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500"></p>*/}
                        <label className="block text-sm text-gray-400 mb-1">Jelszó megerősítése *</label>
                        <input
                        type="password"
                        onChange={e => {
                            setConfPassword(e.target.value);
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Regisztration button */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                        type="submit"
                        onClick={e => {
                            e.preventDefault();
                            runChecksAndShowErrors(
                                () => checkUsername(userName),
                                () => checkEmail(email),
                                () => checkPassword(password),
                                () => checkConfPassword(password, confPassword)
                            );
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg grow"
                        >
                        Regisztrálok
                        </button>
                    </div>
                    <p className="text-gray-300">Van már felhasználói fiókja?
                        <a href="/" className="text-blue-400 underline">
                        Jelentkezzen be
                        </a>!
                    </p>
                </form>
            </div>
        </div>
    );
}

function checkUsername(userName: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement
{
    // Check username is free.
    let userNameSection = document.getElementById("userNameSection") as HTMLDivElement;
    if (userName === "MrZalan")
        return [userNameSection, "Foglalt a felhasználónév."];
    else
        return userNameSection;
}

function checkEmail(email: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement
{
    let emailMessage: string[] = [];
    let emailSection = document.getElementById("emailSection") as HTMLDivElement;
    // Check if eamil is empty
    if (email === "")
        return [emailSection, "Email címmel kitöltése kötelező."];
    
    // Check email is free.
    if (email === "zalan.gal.99@gmail.com")
        emailMessage.push("Ezzel az email címmel már regisztráltak.");
    
    // Check email requirement.
    let pattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!pattern.test(email))
        emailMessage.push("Nem felel meg az email követelményének.");

    if (emailMessage.length == 0)
        return emailSection;
    else if (emailMessage.length == 1)
        return [emailSection, emailMessage[0]];
    else
        return [emailSection, emailMessage];
}

function checkPassword(password: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement {
    let passwordMessages: string[] = [];
    let passwordSection = document.getElementById("passwordSection") as HTMLDivElement;
    // Check if password is empty
    if (password == "")
        return [passwordSection, "Jelszó kitöltése kötelező!"];
    
    // Check password requirement.
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{5,}$/;
    if (!pattern.test(password))
    {
        let msg: string[] = [
            "Nem felel meg a jelszó követelményének.",
            "Az alábbiaknak kell teljesülnia:",
            " - Legalább 1 kis latin betű (a-z)",
            " - Legalább 1 nagy latin betű (A-Z)",
            " - Legalább 1 szám",
            " - Legalább 5 karakter"
        ];
        return [passwordSection, msg.reverse()];
    }
    
    if (passwordMessages.length == 0)
        return passwordSection;
    else if (passwordMessages.length == 1)
        return [passwordSection, passwordMessages[0]];
    else
        return [passwordSection, passwordMessages];
}

function checkConfPassword(password: string, confPassword: string): [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement {
    let confPassMessages: string[] = [];
    let confPasswordSection = document.getElementById("confPasswordSection") as HTMLDivElement;
    // Check if confirmation password is empty.
    if (confPassword == "")
        return [confPasswordSection, "Megerősítő jelszó kitöltése kötelező."];

    // Check confirmation password.
    if (password !== confPassword)
        confPassMessages.push("Nem egyezik meg a 2 jelszó.");
    
    if (confPassMessages.length == 0)
        return confPasswordSection;
    else if (confPassMessages.length == 1)
        return [confPasswordSection, confPassMessages[0]];
    else
        return [confPasswordSection, confPassMessages];
}