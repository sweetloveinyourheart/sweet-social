import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./pages/App";
import Auth from "./pages/Auth";
import SignUp from "./features/Auth/components/SignUp";
import SignIn from "./features/Auth/components/SignIn";
import NewAccount from "./features/Auth/components/NewAccount";
import VerifyAccount from "./features/Auth/components/VerifyAccount";
import Home from "./pages/Home";
import User from "./features/User/components/User";
import EditProfile from "./features/User/components/EditProfile";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<Home />}>
                <Route path="profile" element={<User />} />
                <Route path="accounts/edit" element={<EditProfile />}/>
            </Route>

            <Route path="auth" element={<Auth />}>
                <Route path="" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="new-account" element={<NewAccount />} />
                <Route path="verify" element={<VerifyAccount />} />
            </Route>
        </Route>
    )
);

export default router