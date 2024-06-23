import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
import Tooltip from "../Tooltip/Tooltip";


interface ButtonProps {
    category: "primary" | "secondary" | "tertiary",
    type?: "button" | "submit" | "reset",
    children?: React.ReactNode,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    tooltip?: string
};


export default function Button({category, type, onClick, children, disabled=false, tooltip} : ButtonProps) {
    return (
        <button className={styles[`button-${category}`]} type={type ? type : "button"} onClick={onClick} disabled={disabled}>
            {children}
            {tooltip && <Tooltip text={tooltip} />}
        </button>
    );
}


interface ButtonLinkProps extends Omit<ButtonProps, "type" | "onClick"> {
    to: string
}

export function ButtonLink({category, children, to} : ButtonLinkProps) {
    return (
        <Link to={to} className={`${styles.buttonLink} ${styles[`button-${category}`]}`}>
            {children}
        </Link>
    );
}