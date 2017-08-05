
console.log("vr.js", browser);


function handleResponse(message) {
  console.log(`Message from the background script:  ${message}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function captureScreen() {
    console.log("captureScreen()");
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;

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
    
    console.log("Sending", imageData);
    browser.runtime.sendMessage({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
        message: "hello"
    }).then(handleResponse, handleError);
    console.log("Sent");
}

setInterval(function () {
    captureScreen();
},5000);

