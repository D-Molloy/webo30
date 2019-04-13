const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error("OH NO. Here is what broke", err);
      alert(
        "This page won't function unless your allow access to your webcam."
      );
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log({ width, height });
  // canvas needs to be the same size as the video
  canvas.width = width;
  canvas.height = height;

  // take a snapshot from the webcam and paint it on the canvas starting at the corner
  // return the interval so we have access to it outside the function
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // pixels is a huge array of pixels [red, green, blue, alpha] repeated over and over
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with pixels
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.globalAlpha = 0.1;
    // put the mutated pixels back in
    ctx.putImageData(pixels, 0, 0);
  }, 10);
}
var count = 1;
function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();
  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", `handsome-${count}`);
  link.innerHTML = `<img src="${data}" alt="Your image"/>`;
  // JS equivalent of jQuery prepend
  strip.insertBefore(link, strip.firstChild);
  count++;
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // pixels[i]  //red
    // pixels[i+1]//green
    // pixels[i+2]//blue
    pixels.data[i + 0] = pixels.data[i + 0] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // pixels[i]  //red
    // pixels[i+1]//green
    // pixels[i+2]//blue
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 400] = pixels.data[i + 1];
    pixels.data[i - 400] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
