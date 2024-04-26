import { useEffect } from "react";
import { useSession } from "../../services/Context/SessionContext";
import CloseIcon from "../icons/CloseIcon";
import TranscriptionsList from "./TranscriptionsList";
import type { User } from "../../services/Context/SessionContext";

interface DropdownMenuProps {
    user: User;
    refreshTranscriptionsList: boolean;
}

export default function DropdownMenu({ user, refreshTranscriptionsList }: DropdownMenuProps) {
    const {
        showSelectedTranscription,
        toggleShowMenu,
        showMenu,
        setShowMenu,
        handleClickOutside,
        showSignOutOption,
        signOutRef,
        userSignOut,
        toggleSignOutOptions,
    } = useSession();

    // Saber el cambio de tamaño de la pantalla
    useEffect(() => {
        // Si la pantalla es mayor a 700px se oculta el menú desplegable
        const handleResize = () => {
            if (window.innerWidth > 800) {
                setShowMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);

        document.addEventListener('mousedown', handleClickOutside);

        // Limpieza del event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {showMenu ? (
                <section className="dropdown-menu fixed top-0 left-0 bottom-0 flex w-full bg-transparent overflow-y-auto z-10">
                    <div onClick={toggleShowMenu} className="flex-grow backdrop-filter backdrop-blur-xs flex flex-col p-3 animate-fade-in-down animate-delay-200">
                        <button onClick={toggleShowMenu} className="hover:bg-[#333] rounded-lg p-1 w-fit self-end" title="Ocultar menú desplegable">
                            <span className="sr-only">Ocultar menú desplegable</span>
                            <CloseIcon width={24} height={24} />
                        </button>
                    </div>
                    <div className="flex flex-col dark:bg-[#171717] h-full w-[290px] p-4 justify-between animate-fade-in-down">
                        <div className="flex justify-center">
                            <h3 className="text-center text-sm text-slate-200 w-4/5 border-b border-[#333] py-2">Historial de transcripciones</h3>
                        </div>
                        <section className="overflow-y-auto h-full">
                            <TranscriptionsList
                                user={user}
                                showSelectedTranscription={showSelectedTranscription}
                                toggleShowMenu={toggleShowMenu}
                                showMenu={showMenu}
                                refreshTranscriptionsList={refreshTranscriptionsList}
                            />
                        </section>
                        <footer className="flex justify-end">
                            {showSignOutOption && (
                                <div ref={signOutRef} className="absolute right-4 bottom-10 mt-2 w-40 bg-[#333] rounded-lg p-2 flex flex-col gap-y-1 shadow-lg shadow-black z-10">
                                    <button onClick={userSignOut} className="flex items-center gap-4 hover:bg-[#444] rounded-lg px-2 py-1">
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            )}
                            <button onClick={toggleSignOutOptions} type="button" className="flex items-center gap-4 hover:bg-[#333] rounded-lg px-2 py-1 mt-2">{user.email}</button>
                        </footer>
                    </div>
                </section>
            ) : (
                <></>
            )}
        </>

    );
};