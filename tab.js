console.log("Creating tab");

var senderIDToCanvas = new Map();

document.addEventListener("DOMContentLoaded", function(event) {
    //const canvas = document.getElementById("previewCanvas");

    function handleMessage(request, sender, sendResponse) {
        const id = sender.tab.id;

        if (!senderIDToCanvas.has(id)) {
            const newCanvas = document.createElement('canvas');
            document.body.appendChild(newCanvas);
            senderIDToCanvas.set(id, newCanvas);
        }

        const canvas = senderIDToCanvas.get(id);
        const ctx = canvas.getContext("2d");

        const imageData = new ImageData(request.data, request.width, request.height);

        canvas.width = request.width;
        canvas.height = request.height;

        ctx.putImageData(imageData, 0, 0);

        sendResponse({ response: "from tab", sender: sender});
    }

    browser.runtime.onMessage.addListener(handleMessage);
});
