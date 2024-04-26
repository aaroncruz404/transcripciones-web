import CloseIcon from "../icons/CloseIcon";
import UploadIcon from "../icons/UploadIcon";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "../../services/Context/SessionContext";
import type { Transcription } from "../pages/_App";
import { useState } from "react";

interface PlayerProps {
    sendMessageToAI: (transcription: Transcription) => void;
    closeFilePreview: () => void;
    setRefreshTranscriptionsList: (show: boolean) => void;
    selectedFile: File | null;
    supabaseClient: SupabaseClient<any, "public", any>;
    user: User;
}

export default function Player({ closeFilePreview, selectedFile, supabaseClient, user, setRefreshTranscriptionsList, sendMessageToAI }: PlayerProps) {
    const [isLoading, setIsLoading] = useState(false);
    // Subir archivo a supabase para ser transcrito
    const uploadFile = async () => {
        setIsLoading(true);
        try {
            if (selectedFile) {
                const nombreArchivoConExtension = selectedFile.name;
                const ultimoPuntoIndex = nombreArchivoConExtension.lastIndexOf('.');
                const nombreArchivoSinExtension = ultimoPuntoIndex !== -1 ? nombreArchivoConExtension.substring(0, ultimoPuntoIndex) : nombreArchivoConExtension;

                const { data, error } = await supabaseClient.storage
                    .from('bucketsazo')
                    .upload(user.id + '/' + nombreArchivoSinExtension + '/' + selectedFile.name, selectedFile);

                if (error) {
                    throw error;
                }
                const transcription = { id: user.id, filename: selectedFile.name }
                setIsLoading(false);
                setRefreshTranscriptionsList(true);
                sendMessageToAI(transcription);
                closeFilePreview();
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            closeFilePreview();

        }
    };

    if (!selectedFile) {
        return null;
    }

    const { name, type } = selectedFile;

    return (
        <div className='flex w-full h-full items-center justify-center sm:w-1/2'>
            {isLoading ? (
                <div className="flex flex-col gap-4 justify-center items-center">
                    <div className='flex flex-col text-center justify-center py-2 gap-2'>
                        <h2 className="text-4xl font-bold">Subiendo audio</h2>
                        <p className="text-xl font-thin">
                            Por favor, espere mientras tenemos su transcripción lista
                        </p>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#fefefe] animate-pulse animate-delay-100"></div>
                        <div className="w-6 h-6 rounded-full bg-[#fefefe] animate-pulse animate-delay-300"></div>
                        <div className="w-6 h-6 rounded-full bg-[#fefefe] animate-pulse animate-delay-400"></div>
                    </div>
                </div>
            ) : (
                <section className="w-4/5 h-3/5 flex flex-col justify-center gap-y-7 animate-fade-in-left">
                    <h2 className="text-center text-3xl font-bold mb-6">Previsualización de archivo</h2>
                    <header className="flex flex-col">
                        <button
                            className="text-[#fafafa] rounded-lg ml-2 p-1 hover:bg-[#3b3b3b] self-end"
                            type="button" title="Cancelar selección de archivo" onClick={closeFilePreview}>
                            <span className="sr-only">Cancelar selección de archivo</span>
                            <CloseIcon width={18} height={18} />
                        </button>
                    </header>
                    <h3 className="truncate text-center" title={name}>{name}</h3>
                    <div className="flex justify-center items-center overflow-hidden">
                        <audio controls title={name}>
                            <source src={URL.createObjectURL(selectedFile)} type={type} />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                    <footer className="flex items-center justify-center w-full">
                        <button onClick={uploadFile} className="flex items-center justify-center font-semibold text-lg text-[#222] px-4 py-2 rounded-full bg-[#fefefe] hover:bg-black hover:text-[#fefefe] transition duration-300">
                            <UploadIcon />Subir
                        </button>
                    </footer>
                </section>
            )}
        </div>
    );
};
