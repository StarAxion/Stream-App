let recordedBlobs;
let mediaRecorder;

// Get access to video nodes
const webcamVideo = document.getElementById('webcam-video');
const recordedVideo = document.getElementById('webcam-recorded-video');

// Get access to button nodes
const startButton = document.getElementById('webcam-start-button');
const recordButton = document.getElementById('webcam-record-button');
const playButton = document.getElementById('webcam-play-button');
const downloadButton = document.getElementById('webcam-download-button');
const snapshotButton = document.getElementById('snapshot-button');

// Get access to record block node
const recordBlock = document.getElementById('webcam-record-block');

// Get access to canvas node and snapshot controls
const canvas = document.querySelector('canvas');
const snapshotControls = document.querySelector('.snapshot-controls');
const filterSelect = document.querySelector('select#filter');

// Stream data
const handleSuccess = (stream) => {
  webcamVideo.srcObject = stream;
  window.stream = stream;
  clearError();
};

const handleError = (error) => {
  stopCamera();
  setError(error);
};

const stopCamera = () => {
  startButton.textContent = 'Start camera';
  screenshareButton.disabled = false;
  webcamVideo.style.display = 'none';
  canvas.style.display = 'none';
  recordButton.style.display = 'none';
  recordButton.textContent = 'Record';
  snapshotControls.style.display = 'none';
  recordBlock.style.display = 'none';
  window.stream = null;
  webcamVideo.srcObject = null;
  recordedVideo.src = '';
  clearError();
};

const init = (constraints) => {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
};

startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start camera') {
    startButton.textContent = 'Stop camera';
    screenshareButton.disabled = true;
    webcamVideo.style.display = 'inline-block';
    recordButton.style.display = 'inline-block';
    snapshotControls.style.display = 'flex';
    clearError();

    const constraints = {
      audio: true,
      video: {
        width: 426,
        height: 240
      }
    };

    init(constraints);
  } else {
    stopCamera();
  }
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
  downloadButton.download = 'Webcam video';
});

// Take snapshot
snapshotButton.addEventListener('click', () => {
  canvas.style.display = 'inline-block';
  canvas.className = filterSelect.value;
  canvas.width = 426;
  canvas.height = 240;
  canvas.getContext('2d').drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
});

// Set select icon
filterSelect.addEventListener('click', () => {
  filterSelect.classList.toggle('select-closed');
  filterSelect.classList.toggle('select-opened');
});

filterSelect.addEventListener('blur', () => {
  filterSelect.classList.add('select-closed');
  filterSelect.classList.remove('select-opened');
});
