import MenuIcon from '../assets/list.svg';
import './NavBar.css'

export default function NavBar() {
    return (
        <nav className="block bg-[#333] text-white p-2">
            <div className="block">
                <a className="float-left">Zaza-GSM</a>
                <button className="float-right" type="button" onClick={OnNavButtonPressed}>
                    <img src={MenuIcon} className="w-10"/>
                </button>
            </div>
            <ul className="nav-links hiding text-right clear-both">
                <li className="nav-item">Ügyfelek</li>
                <li className="nav-item">Ügyfélkészülékek</li>
                <li className="nav-item">Készülékmodelek</li>
            </ul>
        </nav>
    )
}

function OnNavButtonPressed() {
    const NavLinks = document.getElementsByClassName("nav-links")[0] as HTMLElement;
    const NavItemList = document.getElementsByClassName("nav-item") as HTMLCollectionOf<HTMLElement>;

    if (NavLinks.classList.contains("hiding"))
    {
        // open
        NavLinks.style.height = (NavItemList.length * 32).toString() + "px";
        NavLinks.classList.remove("hiding");

        setTimeout(() => {
            for (let index = 0; index < NavItemList.length; index++) {
                NavItemList[index].style.opacity = "100%";
            }
        }, 300);
    } else {
        // close
        for (let index = 0; index < NavItemList.length; index++) {
            NavItemList[index].style.opacity = "0%";
        }

        setTimeout(() => {
            NavLinks.style.height = 0 + "px";
            NavLinks.classList.add("hiding");
        }, 250)
    }
}