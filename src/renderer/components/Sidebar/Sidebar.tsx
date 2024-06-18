import logo from "../../../../assets/icon.png";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHouse, faStopwatch, faLaptop } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useLocation } from "react-router-dom";


type Route = {
    title: string,
    path: string,
    icon: IconDefinition
};

const routes : Route[] = [
    {
        title: "Home",
        path: "/",
        icon: faHouse
    },
    {
        title: "Quick Pom",
        path: "/quick-pom",
        icon: faStopwatch
    },
    {
        title: "Projects",
        path: "/projects",
        icon: faLaptop
    }
]


export default function Sidebar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const location = useLocation();

    return (
        <aside className={styles.sidebar} onMouseEnter={e => setIsOpen(true)} onMouseLeave={e => setIsOpen(false)} data-closed={!isOpen}>
            <Link to={"/"} className={styles.logoContainer}>
                <img src={logo} className={styles.logo} alt="Pompom logo."/>
                <div>POMPOM</div>
            </Link>
            <nav>
                {
                    routes.map((item) => 
                        <Link to={item.path} key={item.path} className={item.path === location.pathname ? styles.currentPath : ""}>
                            <FontAwesomeIcon icon={item.icon} width={"20px"}/>
                            <div>{item.title}</div>
                        </Link>
                    )
                }
            </nav>
        </aside>
    )
}