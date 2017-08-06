import 'aframe';
import {Entity, Scene, Camera, Cursor, Sky} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

/*

        newScreen.className = "screen";
        newScreen.setAttribute("position", "0 1 -2");
        newScreen.setAttribute("width", "2");
        newScreen.setAttribute("height", "3");
        newScreen.setAttribute("src", "./sample.jpg");
        newScreen.setAttribute("send-mouse-events", "");

*/

class Screen extends React.Component {
    render () {
        return (
            <Entity position={{x: 0, y: 1, z: -2}}></Entity>
        )
    }
}

class VRScene extends React.Component {
  render () {
    return (
      <Scene>
        
        <a-camera>
          <a-cursor raycaster="objects: .screen; showLine: true"></a-cursor>
        </a-camera>

        <Entity>
          <Entity laser-controls={{hand: "left"}} raycaster={{objects: ".screen", showLine: true}}/>
          <Entity laser-controls={{hand: "right"}} raycaster={{objects: ".screen", showLine: true}}/>
        </Entity>
    
        <Entity id="screens" position={{x: 0, y: 0, z: 0}}/>

        <a-sky color="#334921"/>
      </Scene>
    );
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
});