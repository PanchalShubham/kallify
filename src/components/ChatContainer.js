import React, { useContext, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash, faMicrophone, faMicrophoneSlash,
            faVideo, faVideoSlash, faCommentAlt, faUserFriends} from '@fortawesome/free-solid-svg-icons';
import ChatInput from './ChatInput';
import '../styles/ChatContainer.scss';
import ChatContext from '../context/ChatContext';
export default function ChatContainer(props){
    const [showPeople, setShowPeople] = useState(false);
    const chatContext = useContext(ChatContext);
    const {
        isAudio, toggleAudio,
        isVideo, toggleVideo,
        showChat, setShowChat,
        unreadMessageCount, setUnreadMessageCount,
        messageList, people,
        meetingId, socketId,
        leaveMeeting,
        sendMessage,
        imgSrc,
    } = chatContext;
    let clientImage = `https://assets.hongkiat.com/uploads/40-cool-abstract-and-background-photoshop-tutorials/aurora-abstract-background.jpg`;
    let unreadMessageBadge = null;
    if (unreadMessageCount > 100)       unreadMessageBadge = '99+';
    else if (unreadMessageCount > 0)    unreadMessageBadge = unreadMessageCount;
    return (
        <div id="chat-container">
            <div className="video-frame">
                <div className="meeting-info">
                    <div className="meetingId">
                        MeetingId: {meetingId}
                    </div>
                    <div className="meetingId">
                       YourId: {socketId}
                    </div>
                </div>
                <img src={imgSrc || clientImage} alt="Please wait, we're trying to get you back" />
                <div className="video-controls">
                    <div>
                        <button 
                            className={"button " + (isAudio ? '' : 'clicked')} 
                            onClick={toggleAudio}>
                            <FontAwesomeIcon icon={isAudio ? faMicrophone : faMicrophoneSlash} />
                        </button>
                        <button className="button end-call" onClick={leaveMeeting}>
                            <FontAwesomeIcon icon={faPhoneSlash} />
                        </button>
                        <button 
                            className={"button " + (isVideo ? '' : 'clicked')} 
                            onClick={toggleVideo}>
                            <FontAwesomeIcon icon={isVideo ? faVideo : faVideoSlash} />
                        </button>
                        <button className="button success"
                            onClick={() => {
                                let newStatus = !showChat;
                                setShowChat(newStatus);
                                if (newStatus)  setUnreadMessageCount(0);
                            }}>
                            <FontAwesomeIcon icon={faCommentAlt} />
                            {unreadMessageBadge && 
                            <div className="unread-message-count">
                                {unreadMessageBadge}
                            </div>}
                        </button>
                    </div>
                </div>
            </div>
            {showChat &&
            <div className="chat-frame">
                <div className="people-chat">
                    <button className={showPeople ? 'active' : ''}
                        onClick={() => setShowPeople(!showPeople)}>
                        <FontAwesomeIcon icon={faUserFriends} /> People
                    </button>
                    <button className={showPeople ? '' : 'active'}
                        onClick={() => setShowPeople(!showPeople)}>
                        <FontAwesomeIcon icon={faCommentAlt} /> Chat
                    </button>
                </div>
                <div className="messages" id="messages">
                    {showPeople && 
                    people.map(item => (
                        <div key={item.id} className="member">
                            <div className="username">
                                {item.username}
                            </div>
                            {item.id}
                        </div>
                    ))}
                    {!showPeople && messageList.map(message => (
                        <div key={message.id} className={`message`}>
                            <div className={`arrow-container ${message.socketId === socketId ? 'right-align' : 'left-align'}`}> 
                                {message.socketId === socketId ? 
                                    <div className="arrow right-arrow"></div>:
                                    <div className="arrow left-arrow"></div>
                                }
                            </div>
                            <div className={`message-body ${message.socketId === socketId ? 'self' : 'other'}`}>
                                <div className="author">
                                    {message.username}
                                    <span>{message.timeStamp}</span>
                                </div>
                                {message.text}
                            </div>
                        </div>
                    ))}

                </div>
                <ChatInput sendMessage={sendMessage}/>
            </div>}
        </div>
    );
};