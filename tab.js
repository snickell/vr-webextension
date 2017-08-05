const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function handleMessage(request, sender, sendResponse) {
    // console.log("tabs.handleMessage()", request)

    const imageData = new ImageData(request.data, request.width, request.height);

    canvas.width = request.width;
    canvas.height = request.height;

    ctx.putImageData(imageData, 0, 0);
}

browser.runtime.onMessage.addListener(handleMessage);
