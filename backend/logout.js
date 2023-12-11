let currentUserLoginID = 0;
let currSessionID = 0;


function logout(){
    removeSession(currentUserLoginID)
}


 function removeSession(userId) {
    fetch('http://localhost:3000/remove-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.success ? 'Success:' : 'Error:', data.message);
if (parent && parent.location) {
        parent.location.href = "../frontend/userLogin.html";
      } else {
        // If there is no parent window, fallback to changing the current window's location
        window.location.href = "../frontend/userLogin.html";
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }



async function getCurrentUserLoginID() {
    try {
        const response = await fetch('http://localhost:3000/api/currentUserLoginID');

        // Log the entire response
        console.log(response);

        const data = await response.json();
        
        if (response.ok) {
            currentUserLoginID = data.currentUserLoginID;
            currSessionID = data.SessionID;


            console.log("CurrentUserLoginID: in cart", currentUserLoginID);
            console.log("CurrSessionID: in cart", currSessionID);
            

        } else {
            console.error('Error fetching data:', data.error || 'Server error');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message || 'Network error');
    }
}



document.addEventListener("DOMContentLoaded", function () {
    getCurrentUserLoginID();
    document.getElementById("logout").addEventListener("click", function(){

        logout()
    })
});
