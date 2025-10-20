import { useState } from "react";
import type { IUser } from "../interfaces/iuser";

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
                            checkRequirementsAndShowErrors(userName, email, password, confPassword);
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

function checkRequirementsAndShowErrors(userName: string, email: string, password: string, passwordConf: string) {
    // Todo: Replace "burned in" comparison values ("MrZalan", "zalan.gal.99@gmail.com") to API requests

    // Check username is free.
    let userNameSection = document.getElementById("userNameSection") as HTMLDivElement;
    if (userName === "MrZalan")
        handleErrorMessageIn(userNameSection, "Foglalt a felhasználónév.");
    else
        handleErrorMessageIn(userNameSection);

    let emailMessage: string[] = [];
    // Check if eamil is empty
    if (email === "")
        emailMessage.push("Email címmel kitöltése kötelező.");
    
    // Check email is free.
    if (email === "zalan.gal.99@gmail.com")
        emailMessage.push("Ezzel az email címmel már regisztráltak.");
    
    // Check email requirement.
    let pattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!pattern.test(email))
        emailMessage.push("Nem felel meg az email követelményének.");
    
    let emailSection = document.getElementById("emailSection") as HTMLDivElement;
    if (emailMessage.length != 0) {
        handleErrorMessagesIn(emailSection, emailMessage);
    } else {
        handleErrorMessageIn(emailSection);
    }

    let passwordMessages: string[] = [];
    // Check if password is empty
    if (password == "")
        passwordMessages.push("Jelszó kitöltése kötelező!");
    
    // Check password requirement.
    pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!pattern.test(password))
        passwordMessages.push("Nem felel meg a jelszó követelményének.");
    
    let passwordSection = document.getElementById("passwordSection") as HTMLDivElement;
    if (passwordMessages.length != 0)
        handleErrorMessagesIn(passwordSection, passwordMessages);
    else
        handleErrorMessageIn(passwordSection);

    let confPassMessages: string[] = [];
    // Check if confirmation password is empty.
    if (passwordConf == "")
        confPassMessages.push("Megerősítő jelszó kitöltése kötelező.");

    // Check confirmation password.
    if (password !== passwordConf)
        confPassMessages.push("Nem egyezik meg a 2 jelszó.");
    
    let confPasswordSection = document.getElementById("confPasswordSection") as HTMLDivElement;
    if (confPassMessages.length != 0)
        handleErrorMessagesIn(confPasswordSection, confPassMessages);
    else
        handleErrorMessageIn(confPasswordSection);
}

function handleErrorMessageIn(section: HTMLDivElement, ... message: string[]) {
    handleErrorMessagesIn(section, message);
}
function handleErrorMessagesIn(section: HTMLDivElement, message: string[]): void {
    // Hide and destroy old messages
    const messages = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    messages.forEach(msg => {
        hideErrorMessage(msg);
        setTimeout(() => {
            section.removeChild(msg);
        }, 500);
    });

    // Create and show new messages
    let delay = (messages.length == 0) ? 0 : 500;
    setTimeout(() => {
        message.forEach(msg => {
            const newP = document.createElement("p");
            newP.className = "errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500";
            newP.textContent = msg;
            section.insertBefore(newP, section.firstChild);
            showErrorMessage(newP);
        });
    }, delay);
}

function showErrorMessage(messageElement: HTMLParagraphElement): void {
    const section = messageElement.parentElement as HTMLDivElement;
    if (section === null)
    {
        console.debug(`section is null in showErrorMessage(${messageElement})`);
        return;
    }
    // originalMessageElements already contains the argument messageElement.
    const originalMessageElements = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    const originalHeight = 66 + (originalMessageElements.length - 1) * 20;
    const nextHeight = originalHeight + 20;
    
    messageElement.classList.remove("hidden");
    void messageElement.offsetHeight; // Force reflow
    requestAnimationFrame(() => {
        section.classList.replace(`h-[${originalHeight}px]`, `h-[${nextHeight}px]`);
        messageElement.classList.replace("h-0", "h-[20px]");
        messageElement.classList.replace("opacity-0", "opacity-100");
    });
}

function hideErrorMessage(messageElement: HTMLParagraphElement): void {
    const section = messageElement.parentElement as HTMLDivElement;
    
    if (section === null)
    {
        console.debug(`section is null in hideErrorMessage(${messageElement})`);
        return;
    }
    const originalMessageElements = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    const originalHeight = 66 + originalMessageElements.length * 20;
    const nextHeight = originalHeight - 20;

    messageElement.classList.replace(`h-[20px]`, `h-0`);
    messageElement.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => {
        section.classList.replace(`h-[${originalHeight}px]`, `h-[${nextHeight}px]`);
        messageElement.classList.add("hidden");
    }, 500);
}