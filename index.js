// Function used to get the age of the patient
function getAge()
{
    return document.getElementById('age-id').value
}

// Function used to get the height of the patient (feet)
function getHeightFeet()
{
    return document.getElementById('height-feet-id').value
}

// Function used to get the height of the patient (inches)
function getHeightInches()
{
    return document.getElementById('height-inches-id').value
}

// Function used to get the weight of the patient (lbs)
function getWeight()
{
    return document.getElementById('weight-id').value
}

/*
Function used to get the systolic bp of the patient

5 possible return values:
lt-120 : Less than 120
120-129 : Between 120 and 129
130-139 : Between 130 and 139
gt-140 : Higher than 140
gt-180 : Higher than 180
*/
function getSystolic()
{
    return document.getElementById('systolic-id').value
}

/*
Function used to get the diastolic bp of hte patient

4 possible return values:
lt-80 : Less than 80
80-89 : Between 80 and 89
gt-90 : Greater than 90
gt-120 : Greater than 120
*/
function getDiastolic()
{
    return document.getElementById('diastolic-id').value
}

/*
Function used to get patient family disease history

Returns an array of form
[diabetes, cancer, alzheimers]
where each value is either true or false
*/
function getDiseases()
{
    let diabetes = false   // Diabetes flag
    let cancer = false     // Cancer flag
    let alzheimers = false // Alzheimers flag

    // Check diabetes
    if(document.getElementById('diabetes').checked)
        diabetes = true

    // Check cancer
    if(document.getElementById('cancer').checked)
        cancer = true

    // Check alzheimers
    if(document.getElementById('alzheimers').checked)
        alzheimers = true
    
    return [diabetes, cancer, alzheimers]
}