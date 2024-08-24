let totalMoney;
let things = JSON.parse(localStorage.getItem("things")) || [];
let costs = JSON.parse(localStorage.getItem("costs")) || [];

// Prompt for the user's total money or retrieve from local storage
window.onload = function () {
  totalMoney =
    Number(localStorage.getItem("totalMoney")) ||
    Number(prompt("Enter your total money:"));

  if (isNaN(totalMoney) || totalMoney <= 0) {
    alert("Please enter a valid amount of money.");
    totalMoney = 0; // Default to 0 if the input is invalid
  }

  // Save the total money to local storage
  localStorage.setItem("totalMoney", totalMoney);

  // Display the user's money and the previously added things
  updateMoneyDisplay();
  displaySavedThings();

  // Create the charts with saved data
  createBarChart();
  createDoughnutChart();
};

// Function to update the money display
function updateMoneyDisplay() {
  let moneyDiv = document.querySelector(".money p");
  moneyDiv.textContent = `Your money: $${totalMoney}`;
}

// Function to create a new thing element and deduct its cost
function createThing() {
  let name = prompt("Enter the name of the thing:");
  let cost = Number(prompt("How much does this thing cost?"));

  if (name && !isNaN(cost) && cost > 0) {
    if (totalMoney >= cost) {
      totalMoney -= cost;
      updateMoneyDisplay();
      localStorage.setItem("totalMoney", totalMoney);

      let newThing = document.createElement("div");
      newThing.textContent = `Name: ${name}, Cost: $${cost}`;
      newThing.style.border = "1px solid black";
      newThing.style.margin = "5px";
      newThing.style.padding = "10px";
      newThing.style.backgroundColor = "#f0f0f0";

      let thingsDiv = document.querySelector(".things");
      thingsDiv.appendChild(newThing);

      things.push(name);
      costs.push(cost);

      // Save updated arrays to local storage
      localStorage.setItem("things", JSON.stringify(things));
      localStorage.setItem("costs", JSON.stringify(costs));

      updateCharts();
    } else {
      alert("You don't have enough money for this thing.");
    }
  } else {
    alert("Please provide a valid name and cost.");
  }
}

// Display saved things from local storage
function displaySavedThings() {
  let thingsDiv = document.querySelector(".things");
  things.forEach((thing, index) => {
    let savedThing = document.createElement("div");
    savedThing.textContent = `Name: ${thing}, Cost: $${costs[index]}`;
    savedThing.style.border = "1px solid black";
    savedThing.style.margin = "5px";
    savedThing.style.padding = "10px";
    savedThing.style.backgroundColor = "#f0f0f0";
    thingsDiv.appendChild(savedThing);
  });
}

// Add event listener to the Add button
document.querySelector(".add").addEventListener("click", createThing);

// Rest of the chart code (createBarChart, createDoughnutChart, updateCharts) remains unchanged
// Chart.js instances
let barChart, doughnutChart;

// Function to create the bar chart
function createBarChart() {
  const barCtx = document.getElementById("barChart").getContext("2d");

  barChart = new Chart(barCtx, {
    type: "bar", // Bar chart type
    data: {
      labels: things,
      datasets: [
        {
          label: "Cost of Things",
          data: costs,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Function to create the doughnut chart
function createDoughnutChart() {
  const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");

  doughnutChart = new Chart(doughnutCtx, {
    type: "doughnut", // Doughnut chart type
    data: {
      labels: things,
      datasets: [
        {
          label: "Cost of Things",
          data: costs,
          backgroundColor: generateRandomColors(costs.length),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Function to update both charts with new data
function updateCharts() {
  // Update bar chart
  barChart.data.labels = things;
  barChart.data.datasets[0].data = costs;
  barChart.update();

  // Update doughnut chart
  doughnutChart.data.labels = things;
  doughnutChart.data.datasets[0].data = costs;
  doughnutChart.data.datasets[0].backgroundColor = generateRandomColors(
    costs.length
  );
  doughnutChart.update();
}

// Function to generate random colors for the doughnut chart
function generateRandomColors(numColors) {
  let colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(`hsl(${Math.random() * 360}, 100%, 75%)`); // Random pastel colors
  }
  return colors;
}
