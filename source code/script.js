// Elements
var age = document.getElementById("age");
var height = document.getElementById("height");
var inches = document.getElementById("inches");
var weight = document.getElementById("weight");
var male = document.getElementById("m");
var female = document.getElementById("f");
let resultArea = document.querySelector(".comment");

var modal = document.getElementById("myModal");
var modalText = document.querySelector("#modalText");
var span = document.getElementsByClassName("close")[0];

var heightUnit = document.getElementById("heightUnit");
var weightUnit = document.getElementById("weightUnit");
var heightUnitDisplay = document.querySelector(".height-unit-display");
var weightUnitDisplay = document.querySelector(".weight-unit-display");

// Elements for "ft" and "in" labels
var heightFtLabel = document.getElementById("heightFtLabel");
var heightInLabel = document.getElementById("heightInLabel");

// Export Button
var exportBtn = document.getElementById("exportBtn");

// Event listeners for unit changes
heightUnit.addEventListener("change", updateHeightInput);
weightUnit.addEventListener("change", updateWeightUnit);

// Reset the results and hide the export button
function resetResults() {
  // Hide the export button
  exportBtn.style.display = "none";

  // Reset the BMI result and comment to default values
  document.querySelector("#result").innerHTML = "0.00";
  document.querySelector(".comment").innerHTML = ""; // Clear the comment
  resultArea.style.display = "none"; // Hide the result area
}

// Attach event listeners to all relevant inputs
age.addEventListener("input", resetResults);
height.addEventListener("input", resetResults);
inches.addEventListener("input", resetResults);
weight.addEventListener("input", resetResults);
male.addEventListener("change", resetResults);
female.addEventListener("change", resetResults);
heightUnit.addEventListener("change", resetResults);
weightUnit.addEventListener("change", resetResults);

// Update height input fields based on selected unit
function updateHeightInput() {
  if (heightUnit.value === "cm") {
    height.style.display = "inline-block";
    heightFtLabel.style.display = "none";
    inches.style.display = "none";
    heightInLabel.style.display = "none";
    heightUnitDisplay.textContent = "cm";
  } else {
    height.style.display = "inline-block";
    heightFtLabel.style.display = "inline-block";
    inches.style.display = "inline-block";
    heightInLabel.style.display = "inline-block";
    heightUnitDisplay.textContent = "";
  }
}

// Update weight unit display based on selected unit
function updateWeightUnit() {
  weightUnitDisplay.textContent = weightUnit.value === "kg" ? "kg" : "lbs";
}

updateHeightInput();
updateWeightUnit();

// Function to calculate BMI
function calculate() {
  // Check for empty fields or zero values
  if (
    age.value === "" ||
    height.value === "" ||
    weight.value === "" ||
    (male.checked === false && female.checked === false) ||
    (heightUnit.value === "ft" && inches.value === "")
  ) {
    showModal("All fields are required!");
    return;
  }

  // Check minimum values
  if (
    parseInt(age.value) < 1 ||
    parseFloat(weight.value) < 1 ||
    (heightUnit.value === "cm" && parseFloat(height.value) <= 0) ||
    (heightUnit.value === "ft" && parseFloat(height.value) === 0 && parseFloat(inches.value) === 0)
  ) {
    showModal("Values must be greater than 0!");
    return;
  }

  // Check maximum for inches (should be <= 12)
  if (heightUnit.value === "ft" && parseFloat(inches.value) > 11) {
    showModal("Inches must be less than 12!");
    return;
  }

  // All validations passed, calculate BMI
  countBmi();
}

// Export BMI result to a text file
exportBtn.addEventListener("click", function () {
  var ageValue = age.value;
  var genderValue = male.checked ? "Male" : "Female";
  var heightValue = height.value + (heightUnit.value === "ft" ? "ft " + inches.value + "in" : "cm");
  var weightValue = weight.value + (weightUnit.value === "kg" ? "kg" : "lbs");
  var bmiValue = document.getElementById("result").innerText;
  var bmiCondition = document.querySelector("#comment").innerText;

  var exportText = `Age: ${ageValue}\nGender: ${genderValue}\nHeight: ${heightValue}\nWeight: ${weightValue}\nBMI: ${bmiValue}\nCondition: ${bmiCondition}`;

  var blob = new Blob([exportText], { type: "text/plain" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Add the current date to the file name in dd-mm-yyyy format
  var currentDate = new Date();
  var day = String(currentDate.getDate()).padStart(2, '0');
  var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  var year = currentDate.getFullYear();
  var formattedDate = `${day}-${month}-${year}`;
  link.download = `BMI_Result_${formattedDate}.txt`;

  link.click();
});

// Function to calculate BMI and display results
function countBmi() {
  let heightValue = parseFloat(height.value);
  let weightValue = parseFloat(weight.value);

  if (heightUnit.value === "ft") {
    let inchValue = parseFloat(inches.value) || 0;
    heightValue = (heightValue * 0.3048) + (inchValue * 0.0254);
  } else {
    heightValue = heightValue / 100;
  }

  if (weightUnit.value === "lbs") {
    weightValue = weightValue * 0.453592;
  }

  let bmi = weightValue / (heightValue * heightValue);
  let result = "";
  let color = "";

  if (bmi < 18.5) {
    result = "Underweight";
    color = "linear-gradient(to left, #69a2ff, #c2e9fb)";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    result = "Healthy";
    color = "linear-gradient(to left, #56ab2f, #a8e063)";
  } else if (bmi >= 25 && bmi <= 29.9) {
    result = "Overweight";
    color = "linear-gradient(to left, #ff7e5f, #feb47b)";
  } else if (bmi >= 30 && bmi <= 34.9) {
    result = "Obese";
    color = "linear-gradient(to left, #ff512f, #dd2476)";
  } else if (bmi >= 35) {
    result = "Extremely obese";
    color = "linear-gradient(to left, #8e0e00, #1f1c18)";
  }

  resultArea.style.display = "block";
  document.querySelector(".comment").innerHTML = `You are <span id="comment">${result}</span>`;
  document.querySelector("#result").innerHTML = bmi.toFixed(2);

  document.querySelector("#comment").style.backgroundImage = color;
  document.querySelector("#comment").style.backgroundClip = "text";
  document.querySelector("#comment").style.color = "transparent";

  showExportButton(); // Show export button after BMI result
}

// Show export button when BMI result is available
function showExportButton() {
  exportBtn.style.display = "block"; // Show the export button when result is available
}

// Function to show a modal with a message
function showModal(message) {
  modal.style.display = "block";
  modalText.innerHTML = message;
}

// Close modal when 'x' is clicked
span.onclick = function () {
  modal.style.display = "none";
};

// Close modal when clicking outside the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
