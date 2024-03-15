import { openDB } from "idb";

export class IndexedDBService {
    constructor() {
        this.connectToDB();
    }

    async connectToDB() {
        this.db = await openDB("chit-chat", 1, {
            upgrade(db) {
                db.createObjectStore('chats', { keyPath: "_id" });
                db.createObjectStore('friends', { keyPath: "_id" });
                db.createObjectStore('messages', { keyPath: "_id" });
            }
        })
    }

    addChatsData(chats) {
        var tx = this.db.transaction("chats", "readwrite");
        var chatData = tx.objectStore("chats");
        chats.forEach((item) => chatData.put(item));
        return tx.done;
    }

    addFriendsData(friends) {
        var tx = this.db.transaction("friends", "readwrite");
        var friendData = tx.objectStore("friends");
        friends.forEach((item) => friendData.put(item));
        return tx.done;
    }

    addMessagesData(messages) {
        var tx = this.db.transaction("messages", "readwrite");
        var messageData = tx.objectStore("messages");
        messages.forEach((item) => messageData.put(item));
        return tx.done;
    }
}