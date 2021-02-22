let recordedBlobs;
let mediaRecorder;

// Get access to video nodes
const screenVideo = document.getElementById('screen-video');
const recordedVideo = document.getElementById('screen-recorded-video');

// Get access to button nodes
const startButton = document.getElementById('screen-start-button');
const recordButton = document.getElementById('screen-record-button');
const playButton = document.getElementById('screen-play-button');
const downloadButton = document.getElementById('screen-download-button');

// Get access to record block node
const recordBlock = document.getElementById('screen-record-block');

// Stream data
const handleSuccess = (stream) => {
  screenVideo.srcObject = stream;
  window.stream = stream;
  clearError();

  // Actions after stopping the screen sharing via browser UI
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    stopCamera();
  });
};

const handleError = (error) => {
  stopCamera();
  setError(error);
};

const stopCamera = () => {
  startButton.disabled = false;
  webcamButton.disabled = false;
  screenVideo.style.display = 'none';
  recordButton.style.display = 'none';
  recordButton.textContent = 'Record';
  recordBlock.style.display = 'none';
  window.stream = null;
  screenVideo.srcObject = null;
  recordedVideo.src = '';
  clearError();
};

const init = (constraints) => {
  navigator.mediaDevices.getDisplayMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
};

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  webcamButton.disabled = true;
  screenVideo.style.display = 'block';
  recordButton.style.display = 'inline-block';
  clearError();

  const constraints = {
    audio: true,
    video: {
      width: 854,
      height: 480
    }
  };

  init(constraints);
});

// Record video
const handleDataAvailable = (event) => {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
};

const startRecording = () => {
  recordBlock.style.display = 'none';
  downloadButton.style.display = 'none';
  recordedVideo.src = '';
  recordedVideo.controls = false;
  recordedBlobs = [];
  const options = {
    mimeType: 'video/webm;codecs=vp9,opus'
  };

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (error) {
    recordButton.textContent = 'Record';
    setError(error);
  }

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

const stopRecording = () => {
  recordBlock.style.display = 'block';
  playButton.textContent = 'Play';
  mediaRecorder.stop();
};

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    recordButton.textContent = 'Stop recording';
    startRecording();
  } else {
    recordButton.textContent = 'Record';
    stopRecording();
  }
});

// Play recorded video
playButton.addEventListener('click', () => {
  const buffer = new Blob(recordedBlobs, { type: 'video/webm' });
  recordedVideo.src = window.URL.createObjectURL(buffer);

  if (playButton.textContent === 'Play') {
    playButton.textContent = 'Stop';
    recordedVideo.controls = true;
    recordedVideo.play();
  } else {
    playButton.textContent = 'Play';
    recordedVideo.controls = false;
  }

  // Download recorded video
  downloadButton.style.display = 'inline-block';
  downloadButton.href = recordedVideo.src;
  downloadButton.download = 'Screenshare video';
});
