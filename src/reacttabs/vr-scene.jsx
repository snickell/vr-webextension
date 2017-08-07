import {Entity, Scene} from 'aframe-react';
import React from 'react';

import TabScreens from './tab-screens.jsx';

export default class VRScene extends React.Component {
  constructor() {
    super();
    this.state = { screens: [] };
    registerTabTextureListener(textures => {
      console.log("Got screens? ", textures);
      this.setState({ textures });
    });
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