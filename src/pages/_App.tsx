import { SessionProvider, useSession } from "../../services/Context/SessionContext";

// Componentes
import HeaderContent from "../components/HeaderContent";
import AsideContent from "../components/AsideContent";
import DropdownMenu from "../components/DropdownMenu";
import MainContent from "../components/MainContent";
import Notification from "../components/Notification";
import { SocketConnection } from "../../services/Socket/socket-connection";

import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Transcription {
    id: string,
    filename: string,
};

export default function App() {
    const { supabaseClient, user, setUser } = useSession();
    const [refreshTranscriptionsList, setRefreshTranscriptionsList] = useState(false);
    const [transcriptionReady, setTranscriptionReady] = useState(false);
    const [transcriptionName, setTranscriptionName] = useState('');
    const socketChiquito: Socket | null = SocketConnection();
    const navigate = useNavigate();

    function sendMessageToAI(transcription: Transcription) {
        if (socketChiquito) {
            socketChiquito.emit('message', transcription);
            setTranscriptionName(transcription.filename);
        } else {
            console.error('El socket aún no está conectado.');
        }
    };

    const handleResponse = (data: string) => {
        if (data !== '') {
            setTranscriptionReady(true);
        }
    };

    useEffect(() => {
        if (socketChiquito) {
            socketChiquito.on('response', (data: string) => {
                handleResponse(data);
            });
        }
    }, [socketChiquito]);

    useEffect(() => {
        // Verificar si el usuario está autenticado para asignar sus datos
        const getSupabaseUser = async () => {
            let session = await supabaseClient.auth.getSession();
            if (session.data.session === null) { navigate('/SignIn'); }
            try {
                if (session.data.session) {
                    let loggedUser = await supabaseClient.auth.getUser();
                    if (loggedUser.data.user?.role === 'authenticated') {
                        setUser({
                            email: loggedUser.data.user.email,
                            id: loggedUser.data.user.id,
                        });
                    }
                }
            } catch (error) {
                console.error('Error al obtener el usuario de Supabase:', error);
                // Manejar el error de autenticación aquí
            }
        };
        getSupabaseUser();
    }, []);

    return (
        <SessionProvider>
            <div className="app-container text-[#fefefe] animate-fade-in">
                {transcriptionReady && <Notification transcriptionName={transcriptionName} setTranscriptionReady={setTranscriptionReady} />}
                {/* Header */}
                <HeaderContent user={user} />
                {/* Sección relacionada con la lista de transcripciones */}
                <AsideContent user={user} refreshTranscriptionsList={refreshTranscriptionsList} />
                {/* Menú desplegable */}
                <DropdownMenu user={user} refreshTranscriptionsList={refreshTranscriptionsList} />
                {/* Contenido principal */}
                <MainContent user={user} setRefreshTranscriptionsList={setRefreshTranscriptionsList} sendMessageToAI={sendMessageToAI} />
            </div>
        </SessionProvider>
    );
};