import simulant from 'simulant';

console.log("loading vr-webextension content");

function handleResponse(message) {
  //console.log(`Message from the background script:  ${message.response}`, message);
  window.lastMessage = message;
}

function handleError(error) {
  //console.log(`Error: ${error}`);
}

function captureScreen() {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;

    //console.log(`captureScreen(${width}px x ${height}px)`);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    try {
        ctx.drawWindow(window, 0, 0, width, height, "red");
    } catch (e) {
        console.log(e);
    }
    
    const imageData = ctx.getImageData(0, 0, width, height);
    
    port.postMessage({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
    }).then(handleResponse, handleError);
}

var port = browser.runtime.connect();

setInterval(function () {
    captureScreen();
},500);

browser.runtime.onMessage.addListener( ({x, y, event }) => {
    x -= pageXOffset;
    y -= pageYOffset;
    
    
    if (x < 0 || y < 0) {
        console.warn("No mouse events, its outside the window");
        return;
    } else {
        console.log(x, y);
    }
    
    const el = document.elementFromPoint(x, y);
    simulant.fire(el, event, {});    
});