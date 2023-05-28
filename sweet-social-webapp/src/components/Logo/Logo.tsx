import { CSSProperties, FunctionComponent } from "react";
import "./Logo.scss"

interface LogoProps {
    style?: CSSProperties
}

const Logo: FunctionComponent<LogoProps> = ({ style }) => {
    return (
        <h1 className="app-logo"  style={style}>Sweetbook</h1>
    );
}

export default Logo;