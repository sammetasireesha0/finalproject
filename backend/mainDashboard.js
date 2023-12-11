let currentUserLoginID = 0;
let currSessionID = 0;



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
    
});


