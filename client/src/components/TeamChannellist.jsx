// import React from 'react'
// import { AddChannel } from '../assets'

// const TeamChannellist = ({ children, error = false, loading, type }) => {
//     if (error) {
//         return type === 'team' ? (
//             <div className='team-channel-list'>
//                 <p className='team-channel-list__message'>Connection error, Please wait a moment and try again</p>
//             </div>
//         ) : null;
//     }

//     if (loading) {
//         return (
//             <div className='team-channel-list'>
//                 <p className='team-channel-list__message loading'>
//                     {type === 'team' ? 'Channels' : 'Messages'} loading...
//                 </p>
//             </div>
//         )
//     }
//     return (
//         <>
//             <div className='team-channel-list'>
//                 <div className='team-channel-list__header'>
//                     <p className='team-channel-list__header__title'>
//                         {type === 'team' ? 'Channels' : 'Direct Messages'}
//                     </p>
//                     {/* buttons to ADD channels */}
//                 </div>
//                 {children}
//             </div>
//         </>
//     )
// }

// export default TeamChannellist


import React from 'react';

import { AddChannel } from '../assets/AddChannel';

const TeamChannelList = ({ children, error = false, loading, type, isCreating, setIsCreating, setcreateType, setisEditing, setToggleContainer }) => {
    if (error) {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Connection error, please wait a moment and try again.
                </p>
            </div>
        ) : null
    }

    if (loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading">
                    {type === 'team' ? 'Channels' : 'Messages'} loading...
                </p>
            </div>
        )
    }

    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {type === 'team' ? 'Channels' : 'Direct Messages'}
                </p>
                <AddChannel
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setcreateType={setcreateType}
                    setisEditing={setisEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            {children}
        </div>
    )
}

export default TeamChannelList