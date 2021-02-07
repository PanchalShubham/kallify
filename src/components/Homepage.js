import React, { useContext } from 'react';
import Particles from 'react-particles-js';
import '../styles/Homepage.scss';
import Logo from '../assets/logo.jpg';
import ChatContext from '../context/ChatContext';
let config = {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
};
export default function Homepage(props){
  const chatContext = useContext(ChatContext);
    const {
      meetingId, setMeetingId, 
      username, setUsername,
      attendMeeting
    } = chatContext;
    return (
        <div id="homepage">
            <Particles params={config} className="particles" />
            <div className="content">
                <div className="header">
                    <img src={Logo} alt="brand" className="brand" />
                    Kallify
                </div>
                <p className="subheader">
                    Connect instantly with your friends, family and community!
                </p>
                <div className="input-container">
                    <input type="text" className="input" 
                        placeholder="Meeting Id" 
                        value={meetingId}
                        onChange={event => setMeetingId(event.target.value)}/>
                    <input type="text" className="input" 
                        placeholder="Username" 
                        value={username}
                        onChange={event => setUsername(event.target.value)}/>
                    <button className="button"
                        onClick={attendMeeting}>
                        {meetingId === '' ? 'Create' : 'Join'} Meeting
                    </button>
                </div>
            </div>
        </div>
    );
};