import React from 'react';
import { Channel, MessageSimple,MessageTeam } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setisEditing, createType }) => {
    if(isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }

    if(isEditing) {
        return (
            <div className="channel__container">
                <EditChannel setisEditing={setisEditing} />
            </div> 
        )
    }

    const EmptyState = () => 
       {
        return( 
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
        </div>
    )}

    return (
        <div className="channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
            >
                 <ChannelInner setisEditing={setisEditing} />
            </Channel>
        </div>
    );
}

export default ChannelContainer;