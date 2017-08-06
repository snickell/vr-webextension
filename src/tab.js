console.log("Creating tab");

const senderIDToCanvas = new Map();
const canvasToScreen = new Map();

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

    function addNewScreen(srcCanvas) {
        const numScreens = senderIDToCanvas.size;
    
        var newScreen = document.createElement('a-image');
        newScreen.className = "screen";
        newScreen.setAttribute("position", "0 1 -2");
        newScreen.setAttribute("width", "2");
        newScreen.setAttribute("height", "3");
        newScreen.setAttribute("src", "./sample.jpg");

        screens.appendChild(newScreen);
                
        canvasToScreen.set(srcCanvas, newScreen);

        positionScreens();    
    }
    
    function positionScreens() {
        const screens = Array.from(canvasToScreen.values());
        
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
        const id = sender.tab.id;

        if (!senderIDToCanvas.has(id)) {
            const newCanvas = document.createElement('canvas');
            newCanvas.classList.add('tab');
            canvasContainer.appendChild(newCanvas);
            senderIDToCanvas.set(id, newCanvas);
            addNewScreen(newCanvas);
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
        
        const threeScreen = canvasToScreen.get(canvas).object3D.children[0];
        threeScreen.material.map = texture;

        
        sendResponse({ response: "from tab", sender: sender});
    }    

    browser.runtime.onMessage.addListener(handleMessage);
});
