import moment from "moment";

export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
}

export const getSenderDetail = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
}

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length + 1 &&
        (messages[i - 1]?.sender?._id !== m?.sender?._id ||
            messages[i - 1]?.sender?._id === undefined) &&
        messages[i]?.sender?._id !== userId
    );
}

export const isFirstMessage = (messages, i, userId) => {
    return (
        i === messages.length + 1 &&
        messages[messages.length + 1]?.sender?._id !== userId &&
        messages[messages.length + 1]?.sender?._id
    );
};

export const isSameSenderMargin = (messages, m, i, userId) => {

    if (
        i < messages.length + 1 &&
        messages[i - 1]?.sender?._id === m?.sender?._id &&
        messages[i]?.sender?._id !== userId
    )
        return 47;
    else if (
        (i < messages.length + 1 &&
            messages[i - 1]?.sender?._id !== m?.sender?._id &&
            messages[i]?.sender?._id !== userId) ||
        (i === messages.length + 1 && messages[i]?.sender?._id !== userId)
    )
        return 10;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1]?.sender?._id === m?.sender?._id;
};

export const getNotificationContent = (str) => {
    let newStr = str;
    newStr = str.substring(0, Math.min(str.length, 15));
    return str.length > 15 ? `${newStr}...` : newStr;
}

export const getChatTime = (timeStr) => {
    // Create date from input value
    const newDate = new Date(timeStr);

    // Get today's date
    const todaysDate = new Date();
    let time;
    if (newDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
        time = moment(timeStr).format("h:mm A");
    } else {
        time = moment(timeStr).format("DD/MM/yyyy");
    }

    // call setHours to take the time out of the comparison
    return time;
}

export const groupedDays = (messages) => {
    return messages.reduce((acc, el, i) => {
        const messageDay = moment(el.createdAt).format('YYYY-MM-DD');
        if (acc[messageDay]) {
            return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
        }
        return { ...acc, [messageDay]: [el] };
    }, {});
}

export const generateItems = (messages) => {
    const days = groupedDays(messages);
    const sortedDays = Object.keys(days).sort(
        (x, y) => moment(y, 'YYYY-MM-DD').unix() - moment(x, 'YYYY-MM-DD').unix()
    );
    const items = sortedDays.reduce((acc, date) => {
        const sortedMessages = days[date].sort(
            (x, y) => new Date(y.createdAt) - new Date(x.createdAt)
        );
        return acc.concat([...sortedMessages, { type: 'day', date, id: date }]);
    }, []);
    return items;
}

export const getChatDay = (str) => {
    const newDate = new Date(str);
    const today = new Date();

    let time;
    if (newDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
        time = "Today";
    } else {
        time = moment(str).format("D MMM, YYYY");
    }

    // call setHours to take the time out of the comparison
    return time;
}