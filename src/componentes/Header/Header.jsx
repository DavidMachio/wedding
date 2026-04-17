import { useState } from "react";
import "./Header.css";
import { links } from "../../data/navegador";
import { Fade as Hamburger } from 'hamburger-react'
import { NavLink } from "react-router-dom";


const Header = () => {

  const logo = "https://images.vexels.com/media/users/3/129716/isolated/preview/fac546f594872b2ec3959892f2067dc9-insignia-de-camping-2.png"
  const logoalt = "icono de la app"


const [isOpen, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const toggleMenu = () => {
    setMenu(!menu)
    setOpen(!isOpen)
  }
  const toggleBurguer = () => {
    setOpen(!isOpen)
  }

  return (
    <header>
      

      <nav className={`header-nav ${menu ? `Active` : ''}`}>

        <ul className="header-ul">
          {links.map((link) => <li key={link.name}>
            <NavLink to={link.link} onClick={toggleMenu}>{link.name}</NavLink>
          </li>)}
        </ul>
      </nav>
      <div className="buttons">
        <div onClick={toggleMenu} className="burguer"><Hamburger toggled={isOpen} toggle={setOpen} size={20} direction="left" duration={0.4}  distance="md" easing="ease-in-out" rounded label="Show menu" hideOutline={true}/></div>
        
        
      </div>
    </header>
  );
};
export default Header;