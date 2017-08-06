console.log("Creating tab");

const senderIDToCanvas = new Map();

document.addEventListener("DOMContentLoaded", function(event) {
    const canvasHeader = document.getElementById('preview');
        console.log("ping");
    const canvasContainer = document.getElementById('previewCanvases');
    canvasHeader.addEventListener('mouseenter', function () {
        canvasContainer.style.display = 'block';
    });
    canvasHeader.addEventListener('mouseleave', function () {
        canvasContainer.style.display = 'none';
    });

    const threeScreen = document.getElementById('screen').object3D.children[0];

    function handleMessage(request, sender, sendResponse) {
        const id = sender.tab.id;

        if (!senderIDToCanvas.has(id)) {
            const newCanvas = document.createElement('canvas');
            newCanvas.classList.add('tab');
            canvasContainer.appendChild(newCanvas);
            senderIDToCanvas.set(id, newCanvas);
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
        
        threeScreen.material.map = texture;

        
        sendResponse({ response: "from tab", sender: sender});
    }

    browser.runtime.onMessage.addListener(handleMessage);
});
