import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';

import { ChannelListContainer, ChannelContainer, Auth } from './components'

import 'stream-chat-react/dist/css/index.css'
import './App.css';

const cookies = new Cookies();

const API_KEY = 'jwdbahpgmdbp';

// authToken is available only if we logged in 
const authToken = cookies.get('token', {
    timeout: 6000,
});

const client = StreamChat.getInstance(API_KEY);

// if we have a token we need to connect the user
// also if the user has't created yet it will create it
if (authToken) {
    client.connectUser(
        {
            id: cookies.get('userId'),
            name: cookies.get('userName'),
            fullName: cookies.get('fullName'),
            image: cookies.get('avatharURL'),
            hashedPassword: cookies.get('hashedPassword'),
            phoneNumber: cookies.get('phoneNumber'),
        }, authToken
    )
}

const App = () => {

    const [createType, setcreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setisEditing] = useState(false);

    if (!authToken) {
        return <Auth />
    }
    // if fisrt time login 
    if (!cookies.get('firsttimelogin')) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'logged in Successfully',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            cookies.set('firsttimelogin', true);
        })
    }
    return (
        <>
            <div className='app__wrapper'>
                <Chat client={client} theme='team light'>
                    <ChannelListContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setcreateType={setcreateType}
                        setisEditing={setisEditing}
                    />
                    <ChannelContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        isEditing={isEditing}
                        setisEditing={setisEditing}
                        createType={createType}
                    />
                </Chat>
            </div>
        </>
    )
}

export default App


// streamchat user dashboard url
// https://dashboard.getstream.io/app/1249113/chat/explorer?path=users,user~1efd77e24b23bc4a648e11b8f843f3bb        