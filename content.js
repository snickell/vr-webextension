
console.log("loading vr-webextension");


function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`, message);
  window.lastMessage = message;
}

function handleError(error) {
  //console.log(`Error: ${error}`);
}

function captureScreen() {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;

    console.log(`captureScreen(${width}px x ${height}px)`);

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
    
    browser.runtime.sendMessage({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
    }).then(handleResponse, handleError);
}

setInterval(function () {
    captureScreen();
},1000);

