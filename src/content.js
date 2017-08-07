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
    
    const boo = port;

    port.postMessage({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
    }).then(handleResponse, handleError);
}

let port = null;

function tryToConnect() {
    // using setTimeout here is a hack
    port = browser.runtime.connect({ name: "tab-frames"});

    if (port) {
        port.onMessage.addListener( ({x, y, event }) => {
            console.log(event);
            if (event.name === "click") { console.log("click!"); }
            x -= pageXOffset;
            y -= pageYOffset;
            
            
            if (x < 0 || y < 0) {
                console.warn("No mouse events, its outside the window");
                return;
            }
            
            const el = document.elementFromPoint(x, y);

            try {
                if (el) simulant.fire(el, event, {});
            } catch (e) {
                console.error("Error using simulant to create event: ", e);
            }
            
        });


        setInterval(function () {
            captureScreen();
        },2000);

        console.log("Connected!");
    } else {
        setTimeout(tryToConnect, 5000);
    }
}

setTimeout(tryToConnect, 0);
