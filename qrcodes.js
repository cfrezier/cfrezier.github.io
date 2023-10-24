const qrCode = new QRCodeStyling({
    width: 500,
    height: 500,
    type: "canvas",
    data: "https://github.com/cfrezier/save-the-world-octonauts",
    image: "/images/octonauts-logo.webp",
    dotsOptions: {
        color: "#ef9d64",
        type: "rounded"
    },
    backgroundOptions: {
        color: "transparent",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
});
const canvas = document.getElementById('canvas-qr-repo');
qrCode.append(canvas);

setTimeout(() => {
    const dataUrl = canvas.childNodes[0].toDataURL();

    const qrs = document.getElementsByClassName('qrcode-repo');
    for (let idx = 0; idx < qrs.length; idx++) {
        const copy = document.createElement('img');
        copy.src = dataUrl;
        copy.style.background = 'none';
        qrs[idx].appendChild(copy);
    }
}, 2000);

const qrCodeOfb = new QRCodeStyling({
    width: 500,
    height: 500,
    type: "canvas",
    data: "https://openfeedback.io/bdxio2023/2023-11-10/601",
    image: "/images/logo-openfeedback.png",
    dotsOptions: {
        color: "rgb(249 83 46)",
        type: "rounded"
    },
    backgroundOptions: {
        color: "black",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
});
const canvasOfb = document.getElementById('canvas-qr-ofb');
qrCodeOfb.append(canvasOfb);

setTimeout(() => {
    const dataUrl = canvasOfb.childNodes[0].toDataURL();

    const qrs = document.getElementsByClassName('qrcode-ofb');
    for (let idx = 0; idx < qrs.length; idx++) {
        const copy = document.createElement('img');
        copy.src = dataUrl;
        copy.style.background = 'none';
        qrs[idx].appendChild(copy);
    }
}, 2000);