import TranscriptionsList from "./TranscriptionsList";
import CloseIcon from "../icons/CloseIcon";
import { useSession } from "../../services/Context/SessionContext";
import type { User } from "../../services/Context/SessionContext";

interface AsideContentProps {
    user: User;
    refreshTranscriptionsList: boolean;
}

export default function AsideContent({ user, refreshTranscriptionsList }: AsideContentProps) {
    const { toggleTranscriptionsList, showTranscriptionsList, showSelectedTranscription, toggleShowMenu, showMenu } = useSession();
    return (
        <>
            {showTranscriptionsList ? (
                <aside className="[grid-area:aside] transcriptions-list flex flex-col mt-6 mr-6 overflow-y-auto animate-fade-in-down">
                    {/* Cerrar historial de transcripciones */}
                    <header className="flex flex-row justify-between items-center p-2 text-slate-200">
                        <h3 className="text-sm">Historial de transcripciones</h3>
                        <button onClick={toggleTranscriptionsList} className="hover:bg-[#171717] rounded-lg p-1" title="Cerrar historial de transcripciones">
                            <span className="sr-only">Ocultar lista de transcripciones</span>
                            <CloseIcon width={20} height={20} />
                        </button>
                    </header>
                    {/* Lista de transcripciones */}
                    <section className="bg-[#171717] rounded-lg w-full h-3/4">
                        <TranscriptionsList
                            user={user}
                            showSelectedTranscription={showSelectedTranscription}
                            toggleShowMenu={toggleShowMenu}
                            showMenu={showMenu}
                            refreshTranscriptionsList={refreshTranscriptionsList}
                        />
                    </section>
                </aside>
            ) : (<></>)}
        </>
    );
};