import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import client from 'socket.io-client';

export const SocketConnection = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const SOCKET_URI: string = 'ws://localhost:5000';
        const socket_conn: Socket = client(SOCKET_URI);
        setSocket(socket_conn);
    }, []);

    return socket;
}