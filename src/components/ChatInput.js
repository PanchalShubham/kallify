import React, { useState } from 'react';
import Picker, { SKIN_TONE_LIGHT} from "emoji-picker-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSmile, faTimes} from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatInput.scss';
export default function ChatInput(props){
    const {sendMessage} = props;
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji);
    };
    const focusInput = () => {
        document.getElementById('chat-input').focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    };
    const inputHandler = (event) => {
        event.preventDefault();
        setText(event.target.innerText);
        focusInput();
    };
    const dispatchMessage = () => {
        let userText = text;
        if (userText.trim() === '') return;
        setShowEmojiPicker(false);
        setText('');
        sendMessage(userText);
    };
    const keyDownHandler = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatchMessage();
        }
    };
    return (
        <div className="chat-input">
            {showEmojiPicker && 
            <div className="emoji-container">
                <Picker 
                    onEmojiClick={onEmojiClick}
                    skinTone={SKIN_TONE_LIGHT}
                    disableAutoFocus={true}
                    native={true}
                />
            </div>}
            <div className="fields">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <FontAwesomeIcon icon={showEmojiPicker ? faTimes : faSmile} />
                </button>
                <div 
                    contentEditable 
                    id="chat-input"
                    dangerouslySetInnerHTML={{__html: text}}
                    onInput={inputHandler}
                    onPaste={event => event.preventDefault()}
                    onKeyDown={keyDownHandler}
                ></div>
                <button onClick={dispatchMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
};