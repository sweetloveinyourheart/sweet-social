import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./pages/App";
import Auth from "./pages/Auth";
import SignUp from "./features/Auth/components/SignUp";
import SignIn from "./features/Auth/components/SignIn";
import NewAccount from "./features/Auth/components/NewAccount";
import VerifyAccount from "./features/Auth/components/VerifyAccount";
import Main from "./pages/Main";
import User from "./features/User/components/User";
import EditProfile from "./features/User/components/EditProfile";
import Home from "./pages/Home";
import Explore from "./features/Post/components/Explore/components/Explore";
import Messages from "./features/Messages/components/Messages";
import Chat from "./features/Messages/components/Chat";
import Profile from "./features/User/components/Profile";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<Main />}>
                <Route path="" element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="u/:username" element={<User />} />
                <Route path="explore" element={<Explore />} />
                <Route path="accounts/edit" element={<EditProfile />} />

                <Route path="messages" element={<Messages />}>
                    <Route path=":chatboxId" element={<Chat />} />
                </Route>
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