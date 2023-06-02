import { CSSProperties, FunctionComponent } from "react";
import "./Logo.scss"

interface LogoProps {
    style?: CSSProperties
    small?: boolean
}

const Logo: FunctionComponent<LogoProps> = ({ style, small }) => {
    return (
        <h1 className="app-logo" style={{ ...style, textAlign: small ? "center" : "left" }}>
            {small ? "S" : "Sweetbook"}
        </h1>
    );
}

export default Logo;