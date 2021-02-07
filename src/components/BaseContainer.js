import React, {useState, useEffect, useRef, useCallback} from 'react';
import '../styles/BaseContainer.scss';
import {io} from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import CONFIG from '../DataAccessObject/Constants';
import Homepage from './Homepage';
import ChatContainer from './ChatContainer';
import Overlay from './Overlay';
import RectangularLoader from './RectangularLoader';
import ChatContext from '../context/ChatContext';
import ToastedNotes, {addToast, removeToast} from './ToastedNotes';
import PendingRequest from './PendingRequest';
import Webcam from "react-webcam";

// functional component to be rendered
export default function BaseContainer(props){
    // states for this component
    const [loadingMessage, setLoadingMessage] = useState('');
    const [room, setRoom] = useState(null);
    const [socket, setSocket] = useState(null);
    const [connectionErrorCount, setConnectionErrorCount] = useState(0);
    const [messageList, setMessageList] = useState([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    // states for homepage component
    const [meetingId, setMeetingId] = useState('');
    const [username, setUsername] = useState('shubham-panchal');    
    // states for chat-container component
    const [isAudio, setIsAudio] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const webcamRef = useRef(null);
    const [videoInterval, setVideoInterval] = useState(null);


    // UTILITY FUNCTIONS
    // flags the error message
    const flagError = (message) => addToast(message, {appearance: 'error'});
    // flags the information message
    const flagInfo = (message, autoDismiss = false) => addToast(message, {appearance: 'info', autoDismiss});
    // updates the details of the room 
    const updateRoomDetails = useCallback((newRoom, errorMessage, infoMessage, autoDismiss = false) => {
            // update the room details if changes
            if (newRoom !== room)   setRoom(newRoom);
            // clear the loading message
            setLoadingMessage('');
            // if there is any error message then inform the user
            if (errorMessage)   flagError(errorMessage);
            // if there is any info message then inform the user
            if (infoMessage)    flagInfo(infoMessage, autoDismiss);
            // if the room is left then so all requests
            if (newRoom === null) {
                // clear the meetingId
                setMeetingId('');
                // clear the message list
                setMessageList([]);
                // clear the unready message count
                setUnreadMessageCount(0);
                // clear the video
                setImgSrc(null);
                setIsVideo(false);
            } else {
                // update the meetingId
                setMeetingId(newRoom.roomId);
                // update the participants of the meeting!
            }
    }, [room]);

    // manages the request
    const onHandlePendingRequest = useCallback((socketId, toastId, username, accept) => {
        // check if socket is connected
        if (!socket.connected)  return;
        // remove this toast
        removeToast(toastId);
        // get the type of decision
        let decision = (accept ? CONFIG.APPROVE_REQUEST : CONFIG.REJECT_REQUEST);
        // accept the request
        socket.emit(decision, socketId, username);
    }, [socket]);

    // used to capture the video frames
    useEffect(() => {   
        setVideoInterval(null);
        if (!isVideo)   return;
        let interval = setInterval(() => {
            if (webcamRef.current) {
                let {width, height} = window.screen;
                const img = webcamRef.current.getScreenshot({width, height});
                if (socket && socket.connected)
                    socket.emit(CONFIG.VIDEO_FRAME, meetingId, socket.id, img);
            }
        }, 10);
        setVideoInterval(interval);
    }, [socket, isVideo, meetingId, webcamRef]);
    
    // used to fetch the client ip-address
    useEffect(function(){
        console.log('fetching ip....');
        // fetch the client-ip
        fetch('https://api.ipify.org?format=json').then(response => response.json()
        ).then(response => {
            console.log('done!');
            let ip = response.ip;
            ip = new Date();
            console.log(ip);
            // create socket
            let mySocket = io(CONFIG.SERVER_URL, {
                autoConnect: true,
                forceNew: true,
                reconnection: true,
                reconnectionAttempts: CONFIG.MAX_RECONNECTION_ATTEMPTS,
                query: {clientIp: ip}
            });
            // update my socket
            setSocket(mySocket);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    // add listeners to socket
    useEffect(function(){
        // check if socket instance is initialized
        if (socket === null)    return;
        // SERIOUSLY IMPORTANT!
        socket.off();
        // on a successful connection update the error count
        socket.on(CONFIG.CONNECT, () => {
            // reset the connection error count
            setConnectionErrorCount(0);
            // connectionErrorCount = 0;
        });
        // on disconnection inform the user
        socket.on(CONFIG.DISCONNECT, () => {
            console.log('you are disconnected!');
            // // exit the room
            // updateRoomDetails(null);
            // // nullify the socket and room
            // setSocketAndRoom(null, null);
        });
        // on connection error - try to reconnect till
        // a max. limit is reached
        socket.on(CONFIG.CONNECT_ERROR, () => {
            // update the loading message
            setLoadingMessage(`Hold on! I'm trying to get you in!`);
            // update the connection error count
            // connectionErrorCount++;
            setConnectionErrorCount(connectionErrorCount + 1);
            console.log(connectionErrorCount);
            // now check the number of connection-failures
            if (connectionErrorCount === CONFIG.MAX_RECONNECTION_ATTEMPTS + 1) {
                // exit from room
                updateRoomDetails(null);
                // notify user
                flagError(`Failed to connect`);
            }
        });
        // for ip-error we reject the connection
        socket.on(CONFIG.IP_ERROR, flagError);
        // meeting terminated because of timeout
        socket.on(CONFIG.TIME_OUT, (message) => updateRoomDetails(null, null, message));




        // on successful creation update the room details
        socket.on(CONFIG.CREATE_ROOM_SUCCESS, updateRoomDetails);
        // on failure - clear the room and notify user
        socket.on(CONFIG.CREATE_ROOM_ERROR, (error) => updateRoomDetails(null, error));
        // on successful join resolve the promise
        socket.on(CONFIG.JOIN_ROOM_SUCCESS, updateRoomDetails);
        // on failure - reject the promise
        socket.on(CONFIG.JOIN_ROOM_ERROR, (error) => updateRoomDetails(null, error));
        // join request
        socket.on(CONFIG.JOIN_ROOM_REQUEST, (socketId, username) => {
            // generate a toastId
            let toastId = uuidv4();
            let item = <PendingRequest 
                            socketId={socketId} 
                            username={username}
                            toastId={toastId}          
                            onHandlePendingRequest={onHandlePendingRequest}
                        />
            // add toast and get te id
            addToast(item, {appearance: 'none', toastId});
        });
        // waiting event
        socket.on(CONFIG.WAIT_FOR_APPROVAL, (message) => setLoadingMessage(message));
        // request to join approved
        socket.on(CONFIG.REQUEST_APPROVED, updateRoomDetails);
        // request to join rejected
        socket.on(CONFIG.REQUEST_REJECTED, (error) => updateRoomDetails(null, error));
        // inform user about other's joining
        socket.on(CONFIG.JOINED, (room, message) => updateRoomDetails(room, null, message, true));
        // inform the user about other's leaving
        socket.on(CONFIG.LEFT_ROOM, (room, message) => updateRoomDetails(room, null, message, true));
        // for room-termination
        socket.on(CONFIG.TERMINATE_ROOM, (message) => updateRoomDetails(null, null, message));
        // add mesage to the client
        socket.on(CONFIG.MESSAGE, message => {
            // add message to list of messages
            setMessageList([...messageList, message]);
            if (!showChat)  setUnreadMessageCount(unreadMessageCount + 1);
            let div = document.getElementById(`messages`);
            if (!div)   return;
            div.scrollTop = div.scrollHeight;
        });
        // update video frame of client
        socket.on(CONFIG.VIDEO_FRAME, (socketId, img) => {
            setImgSrc(img);
        });
    }, [socket, updateRoomDetails,
        connectionErrorCount, messageList,
        onHandlePendingRequest, showChat,
        unreadMessageCount,
    ]);


    //let's user attend the meeting
    const attendMeeting = () => {
        // validate the username
        if (username.trim() === '') {
            // add a error toast
            flagError(`Please provide a username`);
            // do not continue further
            return;
        }
        // if ip is not available then return
        if (!socket) {
            // add an info toast
            flagInfo(`Please try again in few seconds!`);
            // do not continue further
            return;
        }
        // bring the loader
        setLoadingMessage(`Please wait! I'm processing your request!`);
        // depending on the context emit event
        if (meetingId)  socket.emit(CONFIG.JOIN_ROOM, meetingId, username);
        else            socket.emit(CONFIG.CREATE_ROOM, username);
    };


    // let's user disable the audio
    const toggleAudio = () => {
        setIsAudio(!isAudio);
    };

    // let's user disable the video
    const toggleVideo = () => {
        // get the new video status
        let newVideoStatus = !isVideo;
        // update the status
        setIsVideo(newVideoStatus);
        // clear the interval
        if (!newVideoStatus) {
            // clear the interval
            clearInterval(videoInterval);
            // clear the client image
            setImgSrc(null);
        }
    };

    // let's user exit from call
    const leaveMeeting = () => {
        // check if socket is connected
        if (!socket.connected)  return;
        // send the the message to everyone
        socket.emit(CONFIG.LEAVE_ROOM, meetingId, username);
        // clear the details of the room
        updateRoomDetails(null);
    };

    // sends message 
    const sendMessage = (text) => {
        // check if socket is connected
        if (!socket.connected)  return;
        // trim the text
        text = String(text).trim();
        // send message only if it is non-empty
        if (text === '') return;
        // send the the message to everyone
        socket.emit(CONFIG.MESSAGE_ALL, meetingId, {text, username, socketId: socket.id});
    };



    // set the title of the application
    document.title = "Callify | Connect instantly with your friends, family and community!";
    let socketId = (socket !== null ? socket.id : null);
    let people = (room !== null ? room.people : []);
    return (
        <div id="base-container">
            {loadingMessage && 
            <Overlay>
                <div className="overlay-body">
                    <RectangularLoader />
                    {loadingMessage}
                </div>
            </Overlay>}
            <ChatContext.Provider value={{
                // context used for homepage
                meetingId, setMeetingId,
                username, setUsername,
                attendMeeting,

                // context used for chat container
                isAudio, toggleAudio,
                isVideo, toggleVideo,
                messageList, setMessageList,
                showChat, setShowChat,
                unreadMessageCount, setUnreadMessageCount,
                socketId, people,
                sendMessage, leaveMeeting,
                imgSrc,
            }}>
                {room == null ? 
                <Homepage /> : 
                <div><ChatContainer /></div>}
            </ChatContext.Provider>
            {isVideo && 
            <Webcam 
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />}
            <ToastedNotes />
        </div>
    );
};