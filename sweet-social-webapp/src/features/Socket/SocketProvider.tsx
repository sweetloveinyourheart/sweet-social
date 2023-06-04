import { createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";
import { BASE_URL } from "../../constants/base-url";
import { useAuth } from "../Auth/contexts/AuthContext";

interface SocketWrapper {
    socket: Socket
}

const SocketContext = createContext({} as SocketWrapper)

export function useSocket() {
    return useContext(SocketContext)
}

export default function SocketProvider({ children }: { children: any }) {
    const { accessToken } = useAuth()
    
    const socket = io(`${BASE_URL}`, { extraHeaders: {
        Authorization: `Bearer ${accessToken}`, 
    } })

    socket.emit('active')

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}