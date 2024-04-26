import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../Supabase/connection";

import type { ReactNode } from 'react';
import type { SupabaseClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// Formato para el objeto user
export interface User {
  email: string | undefined;
  id: string;
}

// Props que se usarán en los componenetes
interface SessionContextProps {
  selectedTranscription: string | null;
  setSelectedTranscription: React.Dispatch<React.SetStateAction<string | null>>;
  showMenu: boolean;
  toggleShowMenu: () => void;
  setShowMenu: (show: boolean) => void;
  showTranscription: boolean;
  setShowTranscription: (show: boolean) => void;
  showSelectedTranscription: (selectedTranscription: string) => void;
  closeSelectedTranscription: () => void;
  showTranscriptionsList: boolean;
  toggleTranscriptionsList: () => void;
  showFileDropzone: boolean;
  setShowFileDropzone: (show: boolean) => void;
  toggleShowFileDropzone: () => void;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  closeFilePreview: () => void;
  user: User;
  signOutRef: React.RefObject<HTMLDivElement>;
  showSignOutOption: boolean;
  supabaseClient: SupabaseClient<any, "public", any>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  handleClickOutside: (event: MouseEvent) => void;
  userSignOut: () => void;
  toggleSignOutOptions: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe ser usado dentro de un SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode; // Especificamos que children es de tipo ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [showTranscriptionsList, setShowTranscriptionsList] = useState(true); // Estado para mostrar y ocultar la lista de transcripciones
  const [showTranscription, setShowTranscription] = useState(false); // Estado para mostrar y ocultar una transcripciones
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar y ocultar el menú desplegable
  const [showFileDropzone, setShowFileDropzone] = useState(true); // Estado para mostrar y ocultar la zona para subir archivos
  const [showSignOutOption, setShowSignOutOption] = useState(false); // Estado para mostrar y ocultar la opción de cerrar sesión
  const signOutRef = useRef<HTMLDivElement>(null); // Referencia para el click fuera de la opción de cerrar sesión
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para la selección y previsualización de archivos
  const [selectedTranscription, setSelectedTranscription] = useState<string | null>(null);
  const navigate = useNavigate();
  const supabaseClient = supabase; // Acceso a supabase
  // Inicializar el usuario
  const [user, setUser] = useState<User>({
    email: '',
    id: '',
  });

  // Cerrar sesión
  const userSignOut = async () => {
    try {
      let session = await supabaseClient.auth.getUser();
      if (session.data.user?.role === 'authenticated') {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }
      }
      navigate('/SignIn');
    } catch (error) {
      console.error('Ocurrió un error al cerrar sesión:', error);
    }
  };

  // Manejar la visibilidad de la opción para cerrar sesión
  const toggleSignOutOptions = () => {
    setShowSignOutOption(!showSignOutOption);
  };

  // Función para cerrar el menú cuando se hace clic fuera de él
  const handleClickOutside = (event: MouseEvent) => {
    if (signOutRef.current && !signOutRef.current.contains(event.target as Node)) {
      setShowSignOutOption(false);
    }
  };

  // Manejar el cambio de estado para mostrar y ocultar la zona para subir archivos teniendo en cuenta el archivo subido
  const closeFilePreview = () => {
    setShowFileDropzone(true);
    setSelectedFile(null);
  };

  // Mostrar la transcripción seleccionada
  const showSelectedTranscription = (transcription: string) => {
    setShowTranscription(true);
    setSelectedFile(null);
    setShowFileDropzone(false);
    setSelectedTranscription(transcription);
  };

  // Ocultar la transcripción seleccionada
  const closeSelectedTranscription = () => {
    setShowTranscription(false);
    setSelectedTranscription(null);
  };

  // Manejar el cambio de estado para mostrar y ocultar la lista de transcripciones
  const toggleTranscriptionsList = () => {
    setShowTranscriptionsList(!showTranscriptionsList);
  };

  // Manejar el cambio de estado para mostrar y ocultar el menú desplegable
  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  // Manejar el cambio de estado para mostrar y ocultar la zona para subir archivos
  const toggleShowFileDropzone = () => {
    setShowFileDropzone(!showFileDropzone);
  };

  const value: SessionContextProps = {
    selectedTranscription,
    setSelectedTranscription,
    showMenu,
    toggleShowMenu,
    setShowMenu,
    showTranscription,
    setShowTranscription,
    showSelectedTranscription,
    closeSelectedTranscription,
    showTranscriptionsList,
    toggleTranscriptionsList,
    showFileDropzone,
    setShowFileDropzone,
    toggleShowFileDropzone,
    selectedFile,
    setSelectedFile,
    closeFilePreview,
    user,
    signOutRef,
    showSignOutOption,
    supabaseClient,
    setUser,
    handleClickOutside,
    userSignOut,
    toggleSignOutOptions,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};