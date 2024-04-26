import NewTranscipt from "../icons/NewTranscript";
import History from "../icons/History";
import MenuIcon from "../icons/MenuIcon";
import { useEffect } from "react";
import { useSession } from "../../services/Context/SessionContext";
import type { User } from "../../services/Context/SessionContext";

interface HeaderContentProps {
    user: User;
}

export default function HeaderContent({ user }: HeaderContentProps) {
    const {
        handleClickOutside,
        showSignOutOption,
        signOutRef,
        userSignOut,
        toggleSignOutOptions,
        toggleTranscriptionsList,
        showTranscriptionsList,
        toggleShowMenu,
        showMenu,
        closeFilePreview,
        closeSelectedTranscription,
    } = useSession();

    // Agregar el listener para cerrar el menú cuando se hace clic fuera de él
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Ajustar el layout dependiendo de la lista de transcripciones
    useEffect(() => {
        const appContainer = document.querySelector('.app-container') as HTMLElement;
        if (appContainer) {
            if (!showTranscriptionsList) {
                appContainer.style.gridTemplateAreas = `"header header" "main main"`;
            } else {
                appContainer.style.gridTemplateAreas = `"header header" "main aside"`;
            }
        }
    }, [showTranscriptionsList]);

    return (
        <header className="[grid-area:header] bg-[#171717]">
            <div className="h-full flex justify-between items-center px-4">
                {/* Nueva transcripción */}
                <section>
                    <button type="button" onClick={() => { closeFilePreview(); closeSelectedTranscription(); }} className="flex items-center gap-4 hover:bg-[#333] rounded-lg px-2 py-1">
                        <span className="sr-only">Generar nueva transcripción</span>
                        <span>Nueva transcripción</span><NewTranscipt />
                    </button>
                </section>
                {/* Inicio de sesion y lista de transcripcioens) */}
                <section>
                    <section className="header-menu flex items-center gap-4">
                        {!showTranscriptionsList && (
                            <button onClick={toggleTranscriptionsList} type="button" className="flex items-center gap-4 hover:bg-[#333] rounded-lg px-2 py-1">
                                <span className="sr-only">Mostrar lista de transcripciones</span>
                                <span>Transcripciones</span><History width={15} height={15} />
                            </button>
                        )}
                        {showSignOutOption && (
                            <div ref={signOutRef} className="absolute right-10 top-10 mt-2 w-40 bg-[#333] rounded-lg p-2 flex flex-col gap-y-1 shadow-lg shadow-black z-10">
                                <button onClick={userSignOut} className="flex items-center gap-4 hover:bg-[#444] rounded-lg px-2 py-1">
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        )}
                        <button onClick={toggleSignOutOptions} type="button" className="hover:bg-[#333] rounded-lg px-2 py-1">{user.email}</button>
                    </section>
                    {!showMenu && (
                        <button onClick={toggleShowMenu} className="animate-blink menu-icon-button hidden hover:bg-[#333] rounded-lg p-2" title="Menú desplegable">
                            <span className="sr-only">Abrir menú desplegable</span>
                            <MenuIcon />
                        </button>
                    )}
                </section>
            </div>
        </header>
    );
};