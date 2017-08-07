
import 'aframe';
import ReactDOM from 'react-dom';

import VRScene from './vr-scene.jsx';

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
});