import React from 'react';
import {Link} from 'react-router-dom';
import LostImage from '../assets/404.gif';
import '../styles/PageNotFound.scss';

const pageNotFound = (props) => {
    document.title = "Page Not Found | Callify";
    return (
        <div id="pageNotfound">
            <img src={LostImage} alt="lostImage" />
            <div>
                <p>
                    Uh oh! The page you are looking for does not exist! <br/>
                </p>
                <Link to="/">Home</Link>
            </div>
        </div>
    );
};
export default pageNotFound;