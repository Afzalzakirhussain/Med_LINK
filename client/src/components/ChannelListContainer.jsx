import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelSearch, TeamChannellist, TeamChannelPreview } from './';
import HospitalIcon from '../assets/hospital.png'
import LogoutIcon from '../assets/logout.png'
import Swal from 'sweetalert2';
const cookies = new Cookies();

const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Med Link</p>
    </div>
)

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}

const ChannelListContent = ({ isCreating, setIsCreating, setcreateType, setisEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    const logoutSwal = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    logout()
                }, 3000);
                Swal.fire(
                    'Logout:',
                    'You have successfully logged out.',
                    'success'
                ).then()
            }
        })
    }

    const SideBar = ({ logout }) => (
        <div className="channel-list__sidebar">
            <div className="channel-list__sidebar__icon1">
                <div className="icon1__inner">
                    <img src={HospitalIcon} alt="Hospital" width="30" />
                </div>
            </div>
            <div className="channel-list__sidebar__icon2">
                <div className="icon1__inner" onClick={logoutSwal}>
                    <img src={LogoutIcon} alt="Logout" width="30" />
                </div>
            </div>
        </div>
    );
    const logout = () => {
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        cookies.remove('firsttimelogin');

        window.location.reload();
    }

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <SideBar logout={logout} />
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer} />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter} //display list of Team messages
                    List={(listProps) => (
                        <TeamChannellist
                            {...listProps}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setcreateType={setcreateType}
                            setisEditing={setisEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setisEditing={setisEditing}
                            setToggleContainer={setToggleContainer}
                            type="team"
                        />
                    )}
                />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter} //display list of direct messages
                    List={(listProps) => (
                        <TeamChannellist
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setcreateType={setcreateType}
                            setisEditing={setisEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setisEditing={setisEditing}
                            setToggleContainer={setToggleContainer}
                            type="messaging"
                        />
                    )}
                />
            </div>
        </>
    );
}

const ChannelListContainer = ({ setcreateType, setIsCreating, setisEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            {/* Desktop */}
            <div className="channel-list__container">
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setcreateType={setcreateType}
                    setisEditing={setisEditing}
                />
            </div>
            {/*  mobile devices */}
            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff" }}
            >
                <div className="channerl-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setcreateType={setcreateType}
                    setisEditing={setisEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    )
}

export default ChannelListContainer;