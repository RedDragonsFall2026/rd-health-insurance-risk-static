const serverUrl = 'https://rd-health-insurance-risk-server-c4cvcwcrfjbtd2ch.centralus-01.azurewebsites.net'

// Function used to get the age of the patient
function getAge() {
    return document.getElementById('age-id').value
}

function getHeightFeet() {
    return document.getElementById('height-feet-id').value
}

function getHeightInches() {
    return document.getElementById('height-inches-id').value
}

function getWeight() {
    return document.getElementById('weight-id').value
}

function getSystolic() {
    let val = document.getElementById('systolic-id').value;
    // Map dropdown options to numerical values for the server
    if (val === 'lt-120') return 110;
    if (val === '120-129') return 125;
    if (val === '130-139') return 135;
    if (val === 'gt-140') return 145;
    if (val === 'gt-180') return 185;
    return 110;
}

function getDiastolic() {
    let val = document.getElementById('diastolic-id').value;
    // Map dropdown options to numerical values for the server
    if (val === 'lt-80') return 75;
    if (val === '80-89') return 85;
    if (val === 'gt-90') return 95;
    if (val === 'gt-120') return 125;
    return 75;
}

function getDiseases() {
    let diabetes = document.getElementById('diabetes').checked
    let cancer = document.getElementById('cancer').checked
    let alzheimers = document.getElementById('alzheimers').checked
    return [diabetes, cancer, alzheimers]
}

// Function to show summary of inputs before submitting
function showSummary() {
     let age = getAge();
    let feet = getHeightFeet();
    let inches = getHeightInches();
    let pounds = getWeight();
    let systolic = getSystolic();
    let diastolic = getDiastolic();
    let diseases = getDiseases();

    document.getElementById('summary-output').innerHTML = `
        Age: ${age}<br>
        Height: ${feet} ft ${inches} in<br>
        Weight: ${pounds} lbs<br>
        Systolic Blood Pressure: ${systolic}<br>
        Diastolic Blood Pressure: ${diastolic}<br>
        Diabetes in Family: ${diseases[0] ? 'Yes' : 'No'}<br>
        Cancer in Family: ${diseases[1] ? 'Yes' : 'No'}<br>
        Alzheimer's in Family: ${diseases[2] ? 'Yes' : 'No'}<br>
    `;
    
    document.getElementById('input-summary').hidden = false;
}

// Main function triggered on submit button click
async function calculateRisk() {
    let age = getAge();
    let feet = getHeightFeet();
    let inches = getHeightInches();
    let pounds = getWeight();
    let systolic = getSystolic();
    let diastolic = getDiastolic();
    let diseases = getDiseases();

    let bmiCategory;

    try
    {
        let response = await fetch(serverUrl + `/bmi/${feet}/${inches}/${pounds}`)
        console.log(`API response status received: ${response.status}`);

        bmiCategory = await response.text();
        console.log(`API response text: ${bmiCategory}`)
    }
    catch (error)
    {
        console.error('Error connecting to the risk server:', error)
        document.getElementById('result-output').innerText = 'Error connecting to server. Make sure the Node.js server is running.'
    }

    // Construct server URL (update domain if hosted live on Azure)
    const riskAPI = serverUrl + `/risk-category/${age}/${bmiCategory}/${systolic}/${diastolic}/${diseases[0]}/${diseases[1]}/${diseases[2]}`;

    console.log(`Calling API: ${riskAPI}`);

    try {
        let response = await fetch(riskAPI);
        console.log(`API response status received: ${response.status}`);

        let data = await response.json();
        console.log('API response data:', data);

        // Display results on the webpage UI
        document.getElementById('result-output').innerHTML = `
            <strong>Total Score:</strong> ${data.totalScore} <br>
            <strong>Risk Category:</strong> ${data.riskCategory} <br>
            <small>Breakdown - Age: ${data.breakdown.agePoints}pts, BMI: ${data.breakdown.bmiPoints}pts, BP: ${data.breakdown.bpPoints}pts, Family: ${data.breakdown.familyPoints}pts</small>
        `;
    } catch (error) {
        console.error('Error connecting to the risk server:', error);
        document.getElementById('result-output').innerText = 'Error connecting to server. Make sure the Node.js server is running.';
    }
}

// Wake-up ping
window.addEventListener('load', () => {
    console.log('Pinging server to wake it up...')
    fetch(serverUrl + '/ping')
        .then(response => response.text())
        .then(message => console.log('Ping response:', message))
        .catch(error => console.warn('Ping failed (server may still be starting):', error))
})