import React, { createContext, useState } from 'react';
import io from 'socket.io-client';

export const AppContext = createContext();

export default ({ children }) => {
    const [unreadMsgsCount, setUnreadMsgsCount] = useState(0);
    let defaultSocket = null;
    const loggedInUser = localStorage.getItem('userId');

    if (loggedInUser) {
        defaultSocket = io(process.env.REACT_APP_SOCKET_ENDPOINT, { query: { userId: loggedInUser } });

        defaultSocket.emit('getRecipientsList', (recipients) => { // fetch current User's recipient list
            const count = recipients.reduce((unreadMsgs, recipient) => unreadMsgs += recipient.unread, 0);
            setUnreadMsgsCount(count);
        });
    }

    const [socket, setSocket] = useState(defaultSocket);

    return (
        <AppContext.Provider value={{ socket, setSocket, unreadMsgsCount, setUnreadMsgsCount }}>
            {children}
        </AppContext.Provider>
    )
}