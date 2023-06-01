import { createContext, useCallback, useContext, useState } from "react";
import CreationBox from "../components/CreationBox";

interface Creation {
    openCreationBox: () => void
    closeCreationBox: () => void
}

const CreationContext = createContext({} as Creation)

export function useCreation() {
    return useContext(CreationContext)
}

export default function CreationWrapper({ children }: { children: any }) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openCreationBox = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeCreationBox = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <CreationContext.Provider value={{ openCreationBox, closeCreationBox }}>
            {children}
            {isOpen ? <CreationBox isOpen={isOpen} handleCancel={closeCreationBox} /> : null}
        </CreationContext.Provider>
    )
}