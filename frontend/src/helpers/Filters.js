export const searchChats = (query, chats) => {
  const lowercasedQuery = query.toLowerCase().trim();
  const filteredChats = chats.filter((item) => {
    return Object.keys(item).some((key) =>
      item.chatName.toString().toLowerCase().includes(lowercasedQuery)
    );
  });
  return filteredChats;
};
