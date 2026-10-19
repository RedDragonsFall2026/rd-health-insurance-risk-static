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
        bmiCategory = await response.text();
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