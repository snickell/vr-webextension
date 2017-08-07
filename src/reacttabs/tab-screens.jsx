import {Entity, Scene} from 'aframe-react';
import React from 'react';

export default class TabScreens extends React.Component {
  constructor() {
    super();

    this.state = { senderIDs: [] };

    this.senderIDToCanvas = new Map();
    this.senderIDToScreen = new Map();
    this.screenToSenderID = new Map();

    // receive new frame events from other tabs
    browser.runtime.onMessage.addListener(this.onNewFrameFromOtherTab);
  }

  onNewFrameFromOtherTab(request, sender, sendResponse) {
    try {
        if (!this.senderIDToCanvas.has(id)) {
          // FIXME: for now we drop the frame if this is a new tab, becuase we can't
          // wait for react to update the DOM and create our new canvas
          // long-term we should cache the first frame, and then draw it as soon as react updates
          this.setState({ senderIDs: this.state.senderIDs.concat([senderID]) });
          return;
        }
    
        const canvas = this.senderIDToCanvas(senderID);
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
    
        const threeScreen = this.senderIDToScreen.get(senderID).object3D.children[0];
        threeScreen.material.map = texture;
    
        // this is required if we want to use non-power-of-two textures
        threeScreen.material.map.minFilter = THREE.LinearFilter;

        sendResponse({ response: "from tab", sender: sender});
    } catch (ex) {
        console.error("Exception: ", ex);
    }
  }

  renderTabScreen (senderID, x, y, z, rotationY) {
      return (
          <Entity
            class="tab-screen"
            position={{x, y, z}}
            rotation={{x: 0, y: rotationY, z: 0}} 
            width={2} height={3} 
            src="./sample.jpg" 
            send-mouse-events
            ref={ tabScreen => {
              this.senderIDToScreen.set(senderID, tabScreen);
              this.screenToSenderID.set(tabScreen, senderID);
            }}
          >
            <canvas class="offscreen-buffer" ref={ canvas => this.senderIDToCanvas.set(senderID, canvas) } />
          </Entity>
      );
  }

  render () {
    // for now, position them equally spaced on a circle
    const theta = ((Math.PI*2) / this.state.senderIDs.length);        
    var tabScreens = this.state.senderIDs.map((senderID, idx) => {
      const radius = 2;
      const angle = theta * idx;
      const angleDeg = 360.0 - (theta * idx * (180.0 / Math.PI));
      
      const x = radius * Math.sin(angle);
      const y = 1;            
      const z = -radius * Math.cos(angle);
      
      return renderTabScreen(senderID, x, y, z, rotationY);
    });

    return (
      <Entity id="tab-screens" position={{x: 0, y: 0, z: 0}}>
        {tabScreens}
      </Entity>
    );    
  }  
}