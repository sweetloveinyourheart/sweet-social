import { Outlet } from "react-router-dom";
import UserProvider from "../features/User/contexts/UserContext";

function App() {
    return (  
        <UserProvider>
            <Outlet />
        </UserProvider>
    );
}

export default App;