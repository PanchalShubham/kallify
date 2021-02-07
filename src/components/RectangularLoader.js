import React from 'react';
import '../styles/RectangularLoader.scss';
export default function RectangularLoader(props) {
    return (
        <div id="rectangular-loader">
            <div className="lds-grid">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};