import 'aframe';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class VRScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>
        <Entity light={{type: 'point'}}/>
        <Entity text={{value: 'Hello, WebVR!'}}/>
      </Scene>
    );
  }
}

console.log(document.querySelector('#sceneContainer'));

ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));