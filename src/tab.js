import AFRAME from 'aframe';
import keyboard from 'aframe-keyboard';

console.log("Creating tab");

const senderIDToCanvas = new Map();
const senderIDToScreen = new Map();
const screenToSenderID = new Map();
const screenToCanvas = new Map();

function onError(error) {
  console.error(`Error: ${error}`);
}

AFRAME.registerComponent('send-mouse-events', {
    init: function () {
        this.el.addEventListener('raycaster-intersected', function (evt) {
            let {x, y} = evt.detail.intersection.uv;
            
            const senderID = screenToSenderID.get(evt.detail.target);
            const canvas = screenToCanvas.get(evt.detail.target);
            
            x *= canvas.width;
            y = canvas.height * (1.0 - y);
            
            browser.tabs.sendMessage(senderID, { event: "mouseover", x, y }).catch(onError);
        });
        
        this.el.addEventListener('click', function (evt) {
            console.log("CLICK!");
            let {x, y} = evt.detail.intersection.uv;
            
            const senderID = screenToSenderID.get(evt.detail.target);
            const canvas = screenToCanvas.get(evt.detail.target);
            
            x *= canvas.width;
            y = canvas.height * (1.0 - y);
            
            browser.tabs.sendMessage(senderID, { event: "click", x, y }).catch(onError);
        });
        
    }
});

document.addEventListener("DOMContentLoaded", function(event) {
    const canvasHeader = document.getElementById('preview');
    const canvasContainer = document.getElementById('previewCanvases');
    canvasHeader.addEventListener('mouseenter', function () {
        canvasContainer.style.display = 'block';
    });
    canvasHeader.addEventListener('mouseleave', function () {
        canvasContainer.style.display = 'none';
    });

    const screens = document.getElementById('screens');

    function addNewScreen(id, newCanvas) {
        
        const numScreens = senderIDToCanvas.size;
    
        var newScreen = document.createElement('a-image');
        
        screenToSenderID.set(newScreen, id);
        screenToCanvas.set(newScreen, newCanvas);
        senderIDToScreen.set(id, newScreen);
                
        newScreen.className = "screen";
        newScreen.setAttribute("position", "0 1 -2");
        newScreen.setAttribute("width", "2");
        newScreen.setAttribute("height", "3");
        newScreen.setAttribute("src", "./sample.jpg");
        newScreen.setAttribute("send-mouse-events", "");
        
        screens.appendChild(newScreen);
        
        positionScreens();    
    }
    
    function positionScreens() {
        const screens = Array.from(senderIDToScreen.values());
        
        // for now, position them equally spaced on a circle
        const theta = ((Math.PI*2) / screens.length);        
        screens.forEach((scr, idx) => {
            const radius = 2;
            const angle = theta * idx;
            const angleDeg = 360.0 - (theta * idx * (180.0 / Math.PI));
            
            const x = radius * Math.sin(angle);
            const y = 1;            
            const z = -radius * Math.cos(angle);
            
            const position = `${x} ${y} ${z}`;
            scr.setAttribute("position", position);
            
            const rotation = `0 ${angleDeg} 0`;
            scr.setAttribute("rotation", rotation);
        });
    }


    function handleMessage(request, sender, sendResponse) {
        try {
            const id = sender.tab.id;

            if (!senderIDToCanvas.has(id)) {
                const newCanvas = document.createElement('canvas');
                newCanvas.classList.add('tab');
                canvasContainer.appendChild(newCanvas);
                senderIDToCanvas.set(id, newCanvas);
                addNewScreen(id, newCanvas);
            }
        
            const canvas = senderIDToCanvas.get(id);
            const ctx = canvas.getContext("2d");

            const imageData = new ImageData(request.data, request.width, request.height);

            canvas.width = request.width;
            canvas.height = request.height;

            ctx.putImageData(imageData, 0, 0);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
        
            // flip the texture
            //texture.wrapS = THREE.RepeatWrapping;
            //texture.repeat.x = - 1;        
        
            const threeScreen = senderIDToScreen.get(id).object3D.children[0];
            threeScreen.material.map = texture;
        
            // this is required if we want to use non-power-of-two textures
            threeScreen.material.map.minFilter = THREE.LinearFilter;
        
            sendResponse({ response: "from tab", sender: sender});            
        } catch (ex) {
            console.error("Exception: ", ex);
        }
    }    

    browser.runtime.onMessage.addListener(handleMessage);
});
