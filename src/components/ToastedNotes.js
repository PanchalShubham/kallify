import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faCheck, faExclamation, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ToastedNotes.scss';
// stores the ref to the returned component
let elementRef = null;
// faInfoCircle
class ToastedNotesContainer extends React.Component{
    // states for the toasts
    state = {
        toasts: []
    };
    // delets the toasts with given id
    deleteToast = (id) => {
        // get the old toasts
        let oldToasts = [...this.state.toasts];
        // find the toast with given index
        let index = oldToasts.findIndex(toast => toast.id === id);
        // check if such a toast exist
        if (index === -1)   return;
        // delete this toast
        oldToasts.splice(index, 1);
        // update the toasts
        this.setState({toasts: oldToasts});
    };
    // delete all toasts
    deleteAllToasts = () => this.setState({toasts: []});
    // static method to add toasts
    addToast = (body, options) => {
        let {appearance, autoDismiss, timeOut, toastId} = options;
        let oldToasts = [...this.state.toasts];
        let icon = null;
        if      (appearance === `info`)     icon = faInfoCircle;
        else if (appearance === `error`)    icon = faBug;
        else if (appearance === `success`)  icon = faCheck;
        else if (appearance === `warning`)  icon = faExclamation;
        let id = toastId || uuidv4();
        oldToasts.push({appearance, body, icon, id});
        this.setState({toasts: oldToasts});
        if (autoDismiss) {
            // timeout in millis
            let timeToDismiss = timeOut || 2000;
            // setTimeout]
            setTimeout(this.deleteToast, timeToDismiss, id);
        }
        // return the id of the toast
        return id;
    };
    // render method
    render = () => {
        return (
            <div id="toasted-notes">
                {this.state.toasts.map(toast => (
                    <div className="toast" key={toast.id}>
                        {(toast.appearance && toast.appearance !== 'none') &&
                        <div className={`toast-icon toast-${toast.appearance}`}>
                            <FontAwesomeIcon icon={toast.icon} />
                        </div>
                        }
                        <div className="toast-body">
                            {toast.body}
                        </div>
                        {(toast.appearance && toast.appearance !== 'none') &&
                        <div className="toast-close">
                            <button onClick={() => this.deleteToast(toast.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        }
                    </div>
                ))}
            </div>
        );    
    };
};

// wrapper over toasted
class ToastedNotes extends React.Component{
    render = () => {
        return <ToastedNotesContainer ref={el => elementRef = el} />
    };
};
export default ToastedNotes;

// adds a toast
export const addToast = (message, options) => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    return elementRef.addToast(message, options);
}

// removes a toast
export const removeToast = (id) => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    elementRef.deleteToast(id);
};

// removes all the toasts
export const removeAllToasts = () => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    elementRef.deleteAllToasts();
}