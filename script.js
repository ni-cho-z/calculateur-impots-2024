document.getElementById('tax-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const grossSalary = parseFloat(document.getElementById('gross-salary').value);
    const parts = parseFloat(document.getElementById('parts').value);

    if (isNaN(grossSalary) || isNaN(parts) || parts <= 0) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    let tax = calculateTax(grossSalary, parts);
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerText = `Impôt estimé : ${tax.toFixed(2)} €`;
});

function calculateTax(salary, parts) {
    let tax = 0;

    // Tranches d'imposition pour 2024 (à vérifier et ajuster selon les taux officiels)
    const brackets = [
        { limit: 10225, rate: 0 },
        { limit: 26070, rate: 11 },
        { limit: 74545, rate: 30 },
        { limit: 160336, rate: 41 },
        { limit: Infinity, rate: 45 }
    ];

    // Calcul du quotient familial
    const taxableIncome = salary / parts;

    let previousLimit = 0;

    for (let bracket of brackets) {
        if (taxableIncome > bracket.limit) {
            tax += (bracket.limit - previousLimit) * (bracket.rate / 100);
            previousLimit = bracket.limit;
        } else {
            tax += (taxableIncome - previousLimit) * (bracket.rate / 100);
            break;
        }
    }

    // Impôt total
    const totalTax = tax * parts;

    return totalTax;
}