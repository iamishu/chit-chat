import { getSender } from "./ChatHelper";

export const searchChats = (query, chats, loggedUser, setFilteredChats) => {
    const lowercasedQuery = query.toLowerCase().trim();
    const filteredChats = chats.filter(item => {
        return Object.keys(item).some(key => {
            const sender = getSender(loggedUser, item?.users);
            sender.toString().toLowerCase().includes(lowercasedQuery);
        })
    });
    setFilteredChats(filteredChats);
};