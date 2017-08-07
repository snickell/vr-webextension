const senderIDToCanvas = new Map();
const senderIDToScreen = new Map();
const screenToSenderID = new Map();
const screenToCanvas = new Map();

const registeredCallbacks = [];


function handleMessage(request, sender, sendResponse) {
    try {
        const id = sender.tab.id;

        if (!senderIDToCanvas.has(id)) {
            const newCanvas = document.createElement('canvas');
            newCanvas.classList.add('tab');
            canvasContainer.appendChild(newCanvas);
            senderIDToCanvas.set(id, newCanvas);

            screenToSenderID.set(newScreen, id);
            screenToCanvas.set(newScreen, newCanvas);
            senderIDToScreen.set(id, newScreen);
        }
    
        const canvas = senderIDToCanvas.get(id);
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
    
        sendResponse({ response: "from tab", sender: sender});

        const screens = Array.from(senderIDToCanvas.entries())
            .map(entry => ({ 
                texture: entry[0], 
                senderID: entry[1]
            }));
        registeredCallbacks.forEach(cb => cb(canvases));
    } catch (ex) {
        console.error("Exception: ", ex);
    }
}  

document.addEventListener("DOMContentLoaded", function(event) {
    browser.runtime.onMessage.addListener(handleMessage);
});

export default function registerCallback(cb) {
    registeredCallbacks.push(cb);
};