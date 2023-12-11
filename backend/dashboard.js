let currentUserLoginID = 0;
let currSessionID = 0;
let currMonthIncome = 0;
let currMonthExpense = 0;
let lastMonthIncome = 0;
let lastMonthExpense = 0;
let totalIncome = 0;
let totalExpense = 0;


let recordsObject = {};

async function budgetSubmit() {
    var amount = document.getElementById("amount").value;
    var from = document.getElementById("from").value;
    var date = document.getElementById("date").value;
    var category = document.getElementById("category").value;
    var userID = currentUserLoginID;
    console.log("dd",userID)

    // Create an object with the form data
    const formData = {
        userID,
        amount,
        from,
        date,
        category
    };

    try {
        // Send a POST request to the server
        const response = await fetch('/submitBudget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Check if the request was successful
        if (response.ok) {
            console.log('Form data submitted successfully');
            // You can perform additional actions here, e.g., show a success message
        } else {
            console.error('Failed to submit form data');
            // Handle error - show an error message, etc.
        }
    } catch (error) {
        console.error('Error submitting form data:', error.message);
    }
}

async function getTotalBudget(userId) {
  try {
    // Send a GET request to the server to get total income and total expense
    const response = await fetch(`/getTotalBudget/${userId}`);
    
    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
      console.log('Total Income:', data.totalIncome);
      console.log('Total Expense:', data.totalExpense);
      totalIncome = data.totalIncome
      totalExpense = data.totalExpense
      document.getElementById("totalincome").innerHTML = "$ "+totalIncome;
      document.getElementById("totalexpense").innerHTML = "$ "+totalExpense;
      // You can perform additional actions here, e.g., update the UI with the totals
    } else {
      console.error('Failed to get total budget');
      
      // Handle error - show an error message, etc.
    }
  } catch (error) {
    console.error('Error getting total budget:', error.message);
  }
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
            getTotalBudget(currentUserLoginID);
            
            getMonthlyIncomeAndExpenses(currentUserLoginID);
            fetchBudgetTranshistory(currentUserLoginID)

            document.getElementById("myiget").addEventListener("click", function(){
        const imonth = document.getElementById("imonth").value;
         const iyear = document.getElementById("iyear").value;
          getMonthlyYearlyIncomeAndExpenses(currentUserLoginID,imonth,iyear)
         
      })

          document.getElementById("myeget").addEventListener("click", function(){
        const emonth = document.getElementById("emonth").value;
         const eyear = document.getElementById("eyear").value;
          getMonthlyYearlyIncomeAndExpenses(currentUserLoginID,emonth,eyear)
         
      })


            

        } else {
            console.error('Error fetching data:', data.error || 'Server error');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message || 'Network error');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getCurrentUserLoginID();
    
    document.getElementById("btrackbut").addEventListener("click", function(){
        budgetSubmit();

    })
    

});

async function getMonthlyIncomeAndExpenses(userId) {
  try {
    // Send a GET request to the server to get total income and expenses for the present month and last month
    const response = await fetch(`/getMonthlyIncomeAndExpenses/${userId}`);
    
    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
        currMonthIncome = data.totalCurrentMonthIncome;
        currMonthExpense = data.totalCurrentMonthExpenses;
        lastMonthIncome  = data.totalLastMonthIncome;
        lastMonthExpense = data.totalLastMonthExpenses;
        document.getElementById("thislastmonthincome").innerHTML = "$ "+currMonthIncome + " /this month" + "$ "+lastMonthIncome + " /last month";


        document.getElementById("thislastmonthexpense").innerHTML = "$ "+currMonthExpense + " /this month"+ "$ "+lastMonthExpense + " /last month";

        console.log("currMonthIncome,currMonthExpense,lastMonthIncome,lastMonthExpense")
        console.log(currMonthIncome,currMonthExpense,lastMonthIncome,lastMonthExpense)
      // You can perform additional actions here, e.g., update the UI with the totals
    } else {
      console.error('Failed to get monthly income and expenses');
      // Handle error - show an error message, etc.
    }
  } catch (error) {
    console.error('Error getting monthly income and expenses:', error.message);
  }
}

async function getMonthlyYearlyIncomeAndExpenses(userId, month, year) {
  try {
    // Send a GET request to the server to get total income and expenses for the given month and year
    const response = await fetch(`/getMonthlyIncomeAndExpenses/${userId}/${month}/${year}`);
    
    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
      console.log('Total income by month year:', data.totalIncome);
      console.log('Total expense by month year:', data.totalExpenses);

      document.getElementById("myincome").innerHTML = "$ "+data.totalIncome;
      document.getElementById("myexpense").innerHTML = "$ "+data.totalExpenses;


      // You can perform additional actions here, e.g., update the UI with the totals
    } else {
      console.error('Failed to get monthly income and expenses');
      // Handle error - show an error message, etc.
    }
  } catch (error) {
    console.error('Error getting monthly income and expenses:', error.message);
  }
}


function fetchBudgetTranshistory(userId) {
      // Initialize an object to store the records
      

      // Make a fetch request to the server
      fetch(`/budgetTranshistory/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Store the records in the object
          recordsObject = data;

          // Print the records to the console
          console.log(recordsObject,"ggg");

        
          // Alternatively, you can iterate through the records and print each one

          
           document.getElementById("getpie").addEventListener("click", function(){
            
            const canvas = document.getElementById('incomeChart11');

            // Get the Chart.js instance associated with the canvas
            const chartInstance = Chart.getChart(canvas);

            // Check if the chart instance exists before destroying it
            if (chartInstance) {
                // Destroy the chart instance
                chartInstance.destroy();
            }

            let selectedCategory = document.getElementById("categorypie").value
            displayPie(selectedCategory);



        });

        displayLine();
        displaybar(recordsObject)

const transactionContainer = document.getElementById("maindiv2");

// Iterate through recordsObject in reverse order
// for (let i = recordsObject.length - 1; i >= 0; i--) {
//     const entry = recordsObject[i];

//     // Create a div for each entry
//     let entryDiv = document.createElement("div");
//     entryDiv.classList.add("transaction-entry");

//     // Create title and subtitle elements
//     const titleElement = document.createElement("h2");
//     const status = document.createElement("h4");
//     const subtitleElement = document.createElement("h4");
//     const line = document.createElement("hr")
//     status.innerHTML = `${entry.TransStatus} `;
//     titleElement.innerHTML = `  ${entry.ForWhat}  : ${entry.Amount}` ;
//     subtitleElement.innerHTML = `Date: ${String(entry.TransDate)}`;

//     // Append title and subtitle to the entry div
//     entryDiv.appendChild(status);
//     entryDiv.appendChild(titleElement);
//     entryDiv.appendChild(subtitleElement);
//     // entryDiv.appendChild(line)

//     // Add the entry div to the container
//     transactionContainer.appendChild(entryDiv);
//     transactionContainer.appendChild(line)
// }
for (let i = recordsObject.length - 1; i >= 0; i--) {
    const entry = recordsObject[i];

    // Create a div for each entry
    let entryDiv = document.createElement("div");
    entryDiv.classList.add("transaction-entry");

    // Create status, date, and title elements
    const statusElement = document.createElement("p");
    const dateElement = document.createElement("p");
    const titleElement = document.createElement("h2");
    const line = document.createElement("hr");

    statusElement.classList.add("status");
    statusElement.innerHTML = `Status: ${entry.TransStatus}`;

    dateElement.innerHTML = `Date: ${String(entry.TransDate)}`;

    titleElement.innerHTML = `${entry.ForWhat} : ${entry.Amount}`;

    // Append elements to the entry div
    entryDiv.appendChild(statusElement);
    entryDiv.appendChild(dateElement);
    entryDiv.appendChild(titleElement);

    // Add the entry div to the container
    transactionContainer.appendChild(entryDiv);
    transactionContainer.appendChild(line);
}






        })


        .catch(error => {
          console.error('Error fetching data:', error);
        });
}

function displaybar(data){
  // Extract month-wise income and expense data
const monthlyData = {};
data.forEach(entry => {
    const month = new Date(entry.TransDate).toLocaleString('en-US', { month: 'long' });
    const amount = parseFloat(entry.Amount);

    if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
    }

    if (entry.TransStatus === 'income') {
        monthlyData[month].income += amount;
    } else if (entry.TransStatus === 'expense') {
        monthlyData[month].expense += amount;
    }
});

// Convert data into arrays for Chart.js
const months = Object.keys(monthlyData);
const incomeData = months.map(month => monthlyData[month].income);
const expenseData = months.map(month => monthlyData[month].expense);

// Create a bar graph using Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Expense',
                data: expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

function displayPie(cat){

        // Provided data  
        
        console.log("in display")
        let data = recordsObject;
      

        // Filter data for "income" transactions
        const incomeData = data.filter(entry => entry.TransStatus === cat);

        // Extract unique categories and count occurrences
        const categoryCounts = {};
        incomeData.forEach(entry => {
            const category = entry.ForWhat;
            categoryCounts[category] = (categoryCounts[category] || 0) + parseFloat(entry.Amount);
        });

        // Generate colors for each category
        const colors = generateColors(Object.keys(categoryCounts).length);

        // Prepare data for Chart.js
        const chartData = {
            labels: Object.keys(categoryCounts),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: colors,
            }]
        };

        // Create a pie chart using Chart.js
        const ctx = document.getElementById('incomeChart11').getContext('2d');
        const incomeChart11 = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const label = data.labels[tooltipItem.index];
                            const value = dataset.data[tooltipItem.index];
                            return `${label}: ${value.toFixed(2)} USD`;
                        }
                    }
                }
            }
        });

        // Create legend
        const legendContainer = document.getElementById('legendContainer');
        chartData.labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');

            const legendColor = document.createElement('div');
            legendColor.classList.add('legend-color');
            legendColor.style.backgroundColor = colors[index];

            const legendText = document.createTextNode(`${label}: ${chartData.datasets[0].data[index].toFixed(2)} USD`);

            legendItem.appendChild(legendColor);
            legendItem.appendChild(legendText);
            legendContainer.appendChild(legendItem);
        });

        // Function to generate an array of distinct colors
        function generateColors(count) {
            const hueStep = 360 / count;
            return Array.from({ length: count }, (_, index) => `hsl(${index * hueStep}, 70%, 60%)`);
        }

}

function displayLine(){

        console.log("jjijijijij")
        // Sample data
        let data = recordsObject;
           
        // Separate data for income and expense
        const incomeData = data.filter(entry => entry.TransStatus === 'income');
        const expenseData = data.filter(entry => entry.TransStatus === 'expense');

        // Extract amounts for income and expense
        const incomeAmounts = incomeData.map(entry => parseFloat(entry.Amount));
        const expenseAmounts = expenseData.map(entry => parseFloat(entry.Amount));

        // Prepare data for Chart.js
        const chartData = {
            labels: data.map((entry, index) => index),
            datasets: [
                {
                    label: 'Income',
                    data: incomeAmounts,
                    borderColor: 'green',
                    backgroundColor: 'green',
                    fill: false
                },
                {
                    label: 'Expense',
                    data: expenseAmounts,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    fill: false
                }
            ]
        };

        // Chart configuration
        const config = {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    x: { // Use 'x' for the x-axis
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Record Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount'
                        }
                    }
                }
            }
        };

        // Create a line chart using Chart.js
        const ctx = document.getElementById('lineChart').getContext('2d');
        const lineChart = new Chart(ctx, config);

}

function getRecordDetails() {
  var userID = currentUserLoginID

      var forWhat = document.getElementById("forWhat").value;

      // Replace 'http://localhost:3000' with your actual server URL
      fetch(`http://localhost:3000/api/getRecordDetails?userID=${userID}&forWhat=${forWhat}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("result").innerHTML = data.Amount+" "+data.ForWhat;
          document.getElementById("amount").value = data ? data.Amount : '';
          document.getElementById("recordDetails").style.display = "block";
        })
        .catch(error => console.error('Error:', error));
}

function saveRecord() {

      var userID = currentUserLoginID
      var forWhat = document.getElementById("forWhat").value;
      var amount = document.getElementById("amountnew").value;
        console.log(amount,"hhh")
      // Replace 'http://localhost:3000' with your actual server URL
      fetch('http://localhost:3000/api/saveRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, forWhat, amount }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
        alert(data.message); // Show a message or handle the response as needed
        location.reload()
      })
      .catch(error => console.error('Error:', error));

}

function deleteRecord() {

      var forWhat = document.getElementById("forWhat").value;
      var userID = currentUserLoginID

      // Replace 'http://localhost:3000' with your actual server URL
      fetch(`http://localhost:3000/api/deleteRecord?userID=${userID}&forWhat=${forWhat}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
        alert(data.message); // Show a message or handle the response as needed
         location.reload()
      })
      .catch(error => console.error('Error:', error));
}