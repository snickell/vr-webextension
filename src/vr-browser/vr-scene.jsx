import {Entity, Scene} from 'aframe-react';
import React from 'react';

import TabScreens from './tab-screens.jsx';

export default class VRScene extends React.Component {
  render () {
    return (
      <Scene>
        <div style={{position: "absolute", right: "0px", top: "0px", zIndex: 10, color: "white", padding: "3px"}}>GIT: {__GIT_REVISION__}</div>
        <a-camera>
          <a-cursor raycaster="objects: .tab-screen; showLine: true"></a-cursor>
        </a-camera>

        <Entity>
          <Entity laser-controls={{hand: "left"}} raycaster={{objects: ".tab-screen", showLine: true}}/>
          <Entity laser-controls={{hand: "right"}} raycaster={{objects: ".tab-screen", showLine: true}}/>
        </Entity>
    
        <TabScreens/>

        <a-sky color="#334921"/>
      </Scene>
    );
  }
}