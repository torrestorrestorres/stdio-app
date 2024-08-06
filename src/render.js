
let qrContentInput = document.getElementById("qr-content");



// check if the qrContentInput has https:// or http:// if not add it
qrContentInput.addEventListener("change", function (event) {
  let qrContent = qrContentInput.value;
  if (!qrContent.startsWith("https://") && !qrContent.startsWith("http://")) {
    qrContentInput.value = "https://" + qrContentInput.value;
  }
});

let qrGenerationForm = document.getElementById("qr-generation-form");
let qrCode;

function generateQrCode(qrContent) {
  return new QRCode("qr-code", {
    text: qrContent,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// Event listener for form submit event
qrGenerationForm.addEventListener("submit", function (event) {
  // Prevent form submission
  event.preventDefault();
  let qrContent = qrContentInput.value;
  if (qrCode == null) {
    // Generate code initially
    qrCode = generateQrCode(qrContent);
  } else {
    // If code already generated then make again using same object
    qrCode.makeCode(qrContent);
  }

  // Show the download button
  document.getElementById("qr-download-button").style.display = "block";
});


function downloadQrCode() {
  let qrCodeImage = document.getElementById("qr-code").querySelector("img").src;
  window.electron.ipcRenderer.send("saveQR", qrCodeImage);
}

window.electron.ipcRenderer.on('saveQR-success', (event, message) => {
  alert(message);
});

document.getElementById("qr-download-button").addEventListener("click", downloadQrCode);