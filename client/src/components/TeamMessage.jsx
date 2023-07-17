import { MessageTeam, useMessageContext } from 'stream-chat-react';

const TeamMessage = () => {
    const { handleOpenThread, message } = useMessageContext();

    return (
        <MessageTeam
            message={{ ...message, user: {} }}
        // handleOpenThread={}
        />
    )
}

export default TeamMessage

// import React from 'react'

// const TeamMessage = () => {
//     return (
//         <div>TeamMessage</div>
//     )
// }

// export default TeamMessage