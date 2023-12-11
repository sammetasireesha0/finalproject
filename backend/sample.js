let currentUserLoginIDlog = 0;

function startIdleTimer() {
  let idleTimer;
  let countdownTimer;
  const idleTime = 61000; 
  const idleText = document.getElementById('idleText');
  const timerDisplay = document.getElementById('timer');

  // Function to display the idle text
  function showIdleText() {
    idleText.style.display = 'block';
    // You can call a logout function here
    // logout();
  }

  // Function to update the countdown timer
  function updateTimer(seconds) {
    timerDisplay.innerHTML = seconds;
  }

  // Function to reset the timer and hide the idle text
  function resetTimer() {
    clearTimeout(idleTimer);
    clearInterval(countdownTimer);
    idleText.style.display = 'block'; // hide idle text
    startTimer();
  }

function logout() {
  getCurrentUserLoginID();
  
}

async function getCurrentUserLoginID() {
  try {
    const response = await fetch('http://localhost:3000/api/currentUserLoginID');
    const data = await response.json();

    if (response.ok) {
      currentUserLoginIDlog = data.currentUserLoginID;
      console.log("CurrentUserLoginID: in cart", currentUserLoginIDlog);
       removeSession(currentUserLoginIDlog);
      if (parent && parent.location) {
        parent.location.href = "../frontend/userLogin.html";
      } else {
        // If there is no parent window, fallback to changing the current window's location
        window.location.href = "../frontend/userLogin.html";
      }
     
    } else {
      console.error('Error fetching data:', data.error || 'Server error');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message || 'Network error');
  }
}

function removeSession(userId) {
  fetch('http://localhost:3000/remove-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.success ? 'Success:' : 'Error:', data.message);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

  // Function to start the timer
  function startTimer() {
    let remainingTime = 60; // start from 60 seconds

    idleTimer = setTimeout(showIdleText, idleTime);
    countdownTimer = setInterval(() => {
      remainingTime -= 1;
      const seconds = Math.ceil(remainingTime);
      updateTimer(seconds);

      if (remainingTime <= -1) {
        clearInterval(countdownTimer);
        logout();
      }
    }, 1000);
  }

  // Event listeners for user interactions
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keydown', resetTimer);
  document.addEventListener('mousedown', resetTimer);
  document.addEventListener('touchstart', resetTimer);

  // Initial timer start


  startTimer();
}



startIdleTimer();
