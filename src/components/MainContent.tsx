import { useEffect, useState } from "react";
import { SessionProvider } from "../../services/Context/SessionContext";
import { useSession } from "../../services/Context/SessionContext";
import FileDropZone from "./FileDropzone";
import UploadIcon from "../icons/UploadIcon";
import type { User } from "../../services/Context/SessionContext";
import type { Transcription } from "../pages/_App";

interface MainContentProps {
    user: User;
    sendMessageToAI: (transcription: Transcription) => void;
    setRefreshTranscriptionsList: (show: boolean) => void;
}

export default function MainContent({ user, setRefreshTranscriptionsList, sendMessageToAI }: MainContentProps) {
    const { showTranscription, selectedTranscription, supabaseClient, closeSelectedTranscription, showFileDropzone, setShowFileDropzone, closeFilePreview } = useSession();
    const [transcriptionURL, setTranscriptionURL] = useState<string | null>(null);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Obtener el texto de la transcripción
    const getTranscriptionText = async () => {
        try {
            const data = await supabaseClient.storage.from('bucketsazo').list(user.id + '/' + selectedTranscription);
            if (data.data && data.data[1]) {
                const fileName = data.data[1].name; // Usar el primer archivo en la lista
                if (fileName) {
                    const filePath = '/' + user.id + '/' + selectedTranscription + '/' + fileName;

                    const { data, error } = await supabaseClient
                        .storage
                        .from('bucketsazo')
                        .download(filePath)
                    if (data) {
                        const text = await data.text();
                        setTranscriptionText(text);
                    }
                } else {
                    console.log('El nombre del archivo no está definido.');
                }
            } else {
                setTranscriptionText('');
            }
        } catch (error) {
            console.log('', error);
        }
    };

    // Generar la url de supabase para la previsualización del audio
    const createTranscriptionAudioURL = async () => {
        try {
            const data = await supabaseClient.storage.from('bucketsazo').list(user.id + '/' + selectedTranscription);
            if (data.data && data.data.length > 0) {
                const fileName = data.data[0].name;
                if (fileName) {
                    const finalURL = await getAudioURL(fileName); // Obtener la url completa
                    if (finalURL) {
                        setTranscriptionURL(finalURL);
                        setIsLoading(false);
                    } else {
                        console.error('No se pudo obtener la URL.');
                    }
                } else {
                    console.error('El nombre del archivo no está definido.');
                }
            } else {
                console.error('No se encontraron datos en la lista.');
            }
        } catch (error) {
            console.error('Error al obtener la URL de transcripción:', error);
        }
    };

    // Concatenar el path para obtener la url final.
    const getAudioURL = async (fileName: string) => {
        try {
            const filePath = '/' + user.id + '/' + selectedTranscription + '/' + fileName;
            //console.log('Ruta: ' + filePath);
            const { data, error } = await supabaseClient.storage.from('bucketsazo').createSignedUrl(filePath, 900);
            if (data) {
                return data.signedUrl; // URL para la previsualización del audio.
            } else {
                console.error('Error al obtener la URL:', error);
                return null;
            }
        } catch (error) {
            console.error('Error al obtener la URL:', error);
            return null;
        }
    };

    // Actualizar texto de la transcripción
    const updateTranscriptionText = async () => {
        try {
            const filePath = '/' + user.id + '/' + selectedTranscription + '/' + selectedTranscription + '.txt';

            // Actualizar el contenido del archivo de texto
            const { error } = await supabaseClient.storage
                .from('bucketsazo')
                .update(filePath, transcriptionText)

            if (!error) {
                console.log('Archivo de texto actualizado exitosamente.');
                closeSelectedTranscription();
                // Realizar cualquier acción adicional necesaria después de la actualización
            } else {
                console.error('Error al actualizar el archivo de texto:', error);
            }
        } catch (error) {
            console.error('Error al actualizar el archivo de texto:', error);
        }
    };


    useEffect(() => {
        if (showTranscription) {
            createTranscriptionAudioURL();
            getTranscriptionText();
        }
        setIsLoading(true);
    }, [selectedTranscription]);

    return (
        <main className="[grid-area:main] dark:bg-[#212121] overflow-hidden">
            <div className="flex justify-center items-center h-full w-full">
                {(showTranscription) ? (
                    <>
                        {(transcriptionURL && !isLoading) ? (
                            <section className="flex flex-col gap-6 justify-center items-center w-full h-4/5 animate-slide-in-right">
                                <h3>{selectedTranscription}</h3>
                                <audio controls src={transcriptionURL} />
                                {transcriptionText !== '' ? (
                                    <div className="flex flex-col gap-4 w-4/6 justify-center items-center h-3/5 animate-fade-in">
                                        <textarea className="w-full bg-transparent resize-none p-4 border border-zinc-700 rounded-md h-full" value={transcriptionText} onChange={(e) => setTranscriptionText(e.target.value)}></textarea>
                                        <button onClick={updateTranscriptionText} className="flex w-40 self-end items-center justify-center font-semibold text-lg text-[#222] px-4 py-1 rounded-full bg-[#fefefe] hover:bg-black hover:text-[#fefefe] transition duration-300">
                                            <UploadIcon />Actualizar
                                        </button>
                                    </div>) : (
                                    <div className='flex flex-col text-center justify-center py-2 gap-2'>
                                        <h2 className="text-xl font-bold">Transcripción en proceso</h2>
                                        <p className="text-md font-thin">
                                            Por favor, espere mientras tenemos su transcripción lista
                                        </p>
                                    </div>
                                )}
                            </section>
                        ) : (
                            <div className="flex flex-row gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#fefefe] animate-pulse animate-delay-0"></div>
                                <div className="w-4 h-4 rounded-full bg-[#fefefe] animate-pulse animate-delay-100"></div>
                                <div className="w-4 h-4 rounded-full bg-[#fefefe] animate-pulse animate-delay-150"></div>
                            </div>
                        )}
                    </>
                ) : (
                    <SessionProvider>
                        <FileDropZone
                            user={user}
                            setShowFileDropzone={setShowFileDropzone}
                            showFileDropzone={showFileDropzone}
                            closeFilePreview={closeFilePreview}
                            setRefreshTranscriptionsList={setRefreshTranscriptionsList}
                            sendMessageToAI={sendMessageToAI}
                        />
                    </SessionProvider>
                )}
            </div>
        </main>
    );

};