export const searchChats = (query, chats) => {
  const lowercasedQuery = query.toLowerCase().trim();
  const filteredChats = chats.filter((item) => {
    return Object.keys(item).some((key) =>
      item.chatName.toString().toLowerCase().includes(lowercasedQuery)
    );
  });
  return filteredChats;
};

export const filterUsers = (users, chats) => {
  const filteredUsers =
    chats.length > 0
      ? chats.map((c) => {
          const lowercasedName = c?.chatName?.toString().toLowerCase().trim();
          const fUsers = users.filter(
            (item) => item?.name?.toString().toLowerCase() !== lowercasedName
          );
          return fUsers[0];
        })
      : users;
  console.log("filteredUsers :: ", filteredUsers);
  return filteredUsers;
};
