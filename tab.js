console.log("Creating tab");

var senderIDToCanvas = new Map();
	function generateTexture() {
				var canvas = document.createElement( 'canvas' );
				canvas.width = 256;
				canvas.height = 256;
				var context = canvas.getContext( '2d' );
				var image = context.getImageData( 0, 0, 256, 256 );
				var x = 0, y = 0;
				for ( var i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {
					x = j % 256;
					y = x == 0 ? y + 1 : y;
					image.data[ i ] = 255;
					image.data[ i + 1 ] = 255;
					image.data[ i + 2 ] = 255;
					image.data[ i + 3 ] = Math.floor( x ^ y );
				}
				context.putImageData( image, 0, 0 );
				return canvas;
			}
document.addEventListener("DOMContentLoaded", function(event) {
    const canvasHeader = document.getElementById('preview');

    const canvasContainer = document.getElementById('previewCanvases');
    canvasHeader.addEventListener('mouseenter', function () {
        canvasContainer.style.display = 'block';
    });
    canvasHeader.addEventListener('mouseleave', function () {
        canvasContainer.style.display = 'none';
    });

    const screen = document.getElementById('screen').object3D.children[0];
    window.scr = screen;

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
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = - 1;        
        
        scr.material.map = texture;

        
        sendResponse({ response: "from tab", sender: sender});
    }

    browser.runtime.onMessage.addListener(handleMessage);
});
