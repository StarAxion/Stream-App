// Get access to nav buttons
const webcamButton = document.getElementById('webcam-button');
const screenshareButton = document.getElementById('screenshare-button');

// Get access to page sections
const webcamSection = document.querySelector('.webcam-section');
const screenshareSection = document.querySelector('.screenshare-section');

// Change page section
webcamButton.addEventListener('click', () => {
  webcamButton.disabled = true;
  screenshareButton.disabled = false;
  webcamSection.style.display = 'block';
  screenshareSection.style.display = 'none';
  clearError();
});

screenshareButton.addEventListener('click', () => {
  webcamButton.disabled = false;
  screenshareButton.disabled = true;
  webcamSection.style.display = 'none';
  screenshareSection.style.display = 'block';
  clearError();
});

// Get access to error paragraph
const errorMessage = document.querySelector('.error-message');

// Handle error
const setError = (error) => {
  errorMessage.innerText = 'Oops! Something went wrong.';
  console.error(error);
};

const clearError = () => errorMessage.innerText = '';
