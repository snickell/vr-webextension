import 'aframe';
import {Entity, Scene, Camera, Cursor, Sky} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import registerTabTextureListener from 'listen-for-tab-textures';

/* orphan code, need to use

        const threeScreen = senderIDToScreen.get(id).object3D.children[0];
        threeScreen.material.map = texture;
    
        // this is required if we want to use non-power-of-two textures
        threeScreen.material.map.minFilter = THREE.LinearFilter;

        */

class VRScene extends React.Component {
  constructor() {
    super();
    this.state = { screens: [] };
    registerTabTextureListener(textures => {
      console.log("Got screens? ", textures);
      this.setState({ textures });
    });
  }
  renderScreen (x, y, z, rotationY) {
      return (
          <Entity
            class="screen"
            position={{x, y, z}}
            rotation={{x: 0, y: rotationY, z: 0}} 
            width={2} height={3} 
            src="./sample.jpg" 
            send-mouse-events>
          </Entity>
      );
  }

  renderScreens () {
    // for now, position them equally spaced on a circle
    const theta = ((Math.PI*2) / this.state.screens.length);        
    var screenEntities = this.state.screens.map((scrn, idx) => {
      const radius = 2;
      const angle = theta * idx;
      const angleDeg = 360.0 - (theta * idx * (180.0 / Math.PI));
      
      const x = radius * Math.sin(angle);
      const y = 1;            
      const z = -radius * Math.cos(angle);
      
      return renderScreen(x, y, z, rotationY);
    });

    return (
      <Entity id="screens" position={{x: 0, y: 0, z: 0}}>
        {screenEntities}
      </Entity>
    );    
  }

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
    
        {renderScreens(screens)}

        <a-sky color="#334921"/>
      </Scene>
    );
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
});