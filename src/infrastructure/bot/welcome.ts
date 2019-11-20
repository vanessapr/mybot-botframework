export const checkMembersAdded = (membersAdded, botMember) => {
    // in web channel only one ConversationUpdate event is generated :/
    let isBotMember = false;

    if (membersAdded && membersAdded.length) {
        membersAdded.forEach((member) => {
            if (member.id === botMember.id) {
                isBotMember = true;
            }
        });
    }

    return isBotMember;
};
