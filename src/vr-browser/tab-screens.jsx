import {Entity, Scene} from 'aframe-react';
import React from 'react';

import aframe from 'aframe';

function onError(error) {
  console.error(`Error: ${error}`);
}

class Image extends React.Component {
  render() { return <Entity { ...this.props } primitive="a-image" />; }
};


export default class TabScreens extends React.Component {
  constructor() {
    super();

    this.state = { senderIDs: [] };

    this.senderIDToCanvas = new Map();
    this.senderIDToScreen = new Map();
    this.screenToSenderID = new Map();
    this.senderIDToPort = new Map();

    const onRaycasterIntersectedScreen = evt => this.relayRaycastMessage("mouseover", evt);
    const onClickScreen = evt => this.relayRaycastMessage("click", evt);
    aframe.registerComponent('send-mouse-events', {
        init: function () {
            this.el.addEventListener('raycaster-intersected', onRaycasterIntersectedScreen);
            this.el.addEventListener('click', onClickScreen);
        }
    });

    // receive new frame events from other tabs
    //browser.runtime.onMessage.addListener(this.onNewFrameFromOtherTab.bind(this));
    browser.runtime.onConnect.addListener(port => {
      const senderID = port.sender.tab.id;      
      this.senderIDToPort.set(senderID, port);

      port.onMessage.addListener(this.onNewFrameFromOtherTab.bind(this));      

      this.setState({ senderIDs: this.state.senderIDs.concat([senderID]) });   
    });
  }

  relayRaycastMessage(eventName, raycastEvt) {
    let {x, y} = raycastEvt.detail.intersection.uv;
    
    const senderID = this.screenToSenderID.get(raycastEvt.detail.target);
    const canvas = this.senderIDToCanvas.get(senderID);
    
    x *= canvas.width;
    y = canvas.height * (1.0 - y);

    const port = this.senderIDToPort.get(senderID);
    port.postMessage({ event: eventName, x, y });
  }

  onNewFrameFromOtherTab(request, port) {
    const senderID = port.sender.tab.id;

    const canvas = this.senderIDToCanvas.get(senderID);

    if (!canvas) return; // react must not have updated the DOM yet

    const ctx = canvas.getContext("2d");

    const imageData = new ImageData(request.data, request.width, request.height);

    canvas.width = request.width;
    canvas.height = request.height;

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // flip the texture
    //texture.wrapS = THREE.RepeatWrapping;
    //texture.repeat.x = - 1;        

    const screen = this.senderIDToScreen.get(senderID);
    screen.setAttribute('width', canvas.width / 500);
    screen.setAttribute('height', canvas.height / 500);
    const threeScreen = screen.object3D.children[0];


    threeScreen.material.map = texture;

    // this is required if we want to use non-power-of-two textures
    threeScreen.material.map.minFilter = THREE.LinearFilter;
  }

  renderTabScreen(senderID, x, y, z, rotationY) {
    return (
      <Image
        class="tab-screen" key={senderID}
        send-mouse-events       
        position={{x, y, z}}
        rotation={{ x: 0, y: rotationY, z: 0}}
        width={2} height={3}
        src="./sample.jpg"
        _ref={tabScreen => {
          this.senderIDToScreen.set(senderID, tabScreen);
          this.screenToSenderID.set(tabScreen, senderID);
        }}
      >
        <canvas className="offscreen-buffer" ref={canvas => this.senderIDToCanvas.set(senderID, canvas) } />
      </Image>
    );
  }

  render () {
    // for now, position them equally spaced on a circle
    const theta = ((Math.PI*2) / this.state.senderIDs.length);        
    var tabScreens = this.state.senderIDs.map((senderID, idx) => {
      const radius = 2;
      const angle = theta * idx;
            
      const x = radius * Math.sin(angle);
      const y = 1;            
      const z = -radius * Math.cos(angle);
      
      const rotationY = 360.0 - (theta * idx * (180.0 / Math.PI));
      console.log("senderID: ", senderID, idx, this.state.senderIDs.length);
      return this.renderTabScreen(senderID, x, y, z, rotationY);
    });

    return (
      <Entity id="tab-screens" position={{x: 0, y: 0, z: 0}}>
        {tabScreens}
      </Entity>
    );    
  }  
}