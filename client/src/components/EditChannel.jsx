import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();

        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

const EditChannel = ({ setisEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const updateChannel = async (event) => {
        event.preventDefault();
        try {
            const nameChanged = channelName !== (channel.data.name || channel.data.id);
            // if we changed the channel name
            if (nameChanged) {
                await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` })
            }

            //if we added new users
            if (selectedUsers.length) {
                await channel.addMembers(selectedUsers, { text: `${selectedUsers} joined the channel.` });
            }
        } catch (error) {
            const notAllowedToUpdateChannelInfoHTML = `
            <div class="str-chat__list-notifications-no-access-to-update-channel">
              <p>Not allowed to perform action <b>UpdateChannel</b></p>
            </div>
          `;
            setTimeout(() => {
                const notificationsElement = document.querySelector('.str-chat__list-notifications');
                if (notificationsElement) {
                    notificationsElement.innerHTML = ''; // Remove any existing content
                    notificationsElement.insertAdjacentHTML('beforeend', notAllowedToUpdateChannelInfoHTML);
                    notificationsElement.classList.add('fade-in');
                    setTimeout(() => {
                        notificationsElement.classList.add('fade-out');
                        setTimeout(() => {
                            notificationsElement.innerHTML = '';
                        }, 1000);
                    }, 2500);
                }
            }, 1000);
            // // if (error.includes("is not allowed to perform action UpdateChannel in scope 'team'")) {
            // // Perform your desired action or error handling here
            // console.log("User is not allowed to perform action UpdateChannel in scope 'team'");
            // // } else {
            // // Handle other errors or perform alternative actions
            // console.log("Oops something went wrong");
            // // }
        }

        setChannelName(null);
        setisEditing(false);
        setSelectedUsers([]);
    }

    return (
        <>
            <div className="edit-channel__container">
                <div className="edit-channel__header">
                    <p>Edit Chanel</p>
                    <CloseCreateChannel setisEditing={setisEditing} />
                </div>
                <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
                <UserList setSelectedUsers={setSelectedUsers} />
                <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                    <p>Save Changes</p>
                </div>
            </div>
        </>
    )
}

export default EditChannel