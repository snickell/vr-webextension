import {Entity, Scene} from 'aframe-react';
import React from 'react';

import TabScreens from './tab-screens.jsx';

class Camera extends React.Component {
  render() { return <Entity { ...this.props } primitive="a-camera" />; }
};
class Cursor extends React.Component {
  render() { return <Entity { ...this.props } primitive="a-cursor" />; }
};
class Sky extends React.Component {
  render() { return <Entity { ...this.props } primitive="a-sky" />; }
};



export default class VRScene extends React.Component {
  render () {
    return (
      <Scene>
        <a-assets>
          <img id="floor" src="floor.jpg" crossOrigin="anonymous"/>
        </a-assets>
        <div style={{position: "absolute", right: "0px", top: "0px", zIndex: 10, color: "white", padding: "3px"}}>GIT: {__GIT_REVISION__}</div>
        <Camera>
          <Cursor raycaster={{objects: ".tab-screen", showLine: true}}></Cursor>
        </Camera>

        <Entity>
          <Entity laser-controls={{hand: "left"}} raycaster={{objects: ".tab-screen", showLine: true}}/>
          <Entity laser-controls={{hand: "right"}} raycaster={{objects: ".tab-screen", showLine: true}}/>
        </Entity>
    
        <TabScreens/>

        <Sky color="#334921"/>
        
        <Entity id="ground"
          geometry="primitive: box; width: 12; height: 0.01; depth: 12"
          material="shader: flat; src: #floor">
        </Entity>
      </Scene>
    );
  }
}
