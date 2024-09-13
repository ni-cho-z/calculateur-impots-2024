document.getElementById('tax-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const grossSalary = parseFloat(document.getElementById('gross-salary').value);
    const parts = parseFloat(document.getElementById('parts').value);
    const status = document.getElementById('status').value;

    // Validation des entrées
    if (isNaN(grossSalary) || isNaN(parts) || parts <= 0) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    // Définir le taux de cotisations sociales en fonction du statut
    const cotisationRate = (status === 'cadre') ? 0.19 : 0.23; // 19% pour les cadres, 23% pour les non-cadres

    // Calcul du salaire net avant impôt
    const netBeforeTax = calculateNetBeforeTax(grossSalary, cotisationRate);
    console.log(`Salaire Net Avant Impôt: ${netBeforeTax.toFixed(2)} €`);

    // Calcul du revenu imposable
    const taxableIncome = calculateTaxableIncome(netBeforeTax);
    console.log(`Revenu Imposable: ${taxableIncome.toFixed(2)} €`);

    // Calcul du quotient familial
    const quotientFamilial = taxableIncome / parts;
    console.log(`Quotient Familial: ${quotientFamilial.toFixed(2)} €`);

    // Calcul de l'impôt sur le revenu
    const tax = calculateTax(quotientFamilial);
    const totalTax = tax * parts;
    console.log(`Impôt Total: ${totalTax.toFixed(2)} €`);

    // Afficher les détails du calcul
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <p><strong>Salaire Brut :</strong> ${grossSalary.toFixed(2)} €</p>
        <p><strong>Statut :</strong> ${status === 'cadre' ? 'Cadre' : 'Non-Cadre'}</p>
        <p><strong>Salaire Net Avant Impôt :</strong> ${netBeforeTax.toFixed(2)} €</p>
        <p><strong>Revenu Imposable :</strong> ${taxableIncome.toFixed(2)} €</p>
        <p><strong>Quotient Familial :</strong> ${quotientFamilial.toFixed(2)} €</p>
        <p><strong>Impôt Estimé :</strong> ${totalTax.toFixed(2)} €</p>
    `;
});

/**
 * Calcule le salaire net avant impôt en déduisant les cotisations sociales.
 * @param {number} grossSalary - Salaire brut en euros.
 * @param {number} cotisationRate - Taux de cotisations sociales (0.19 pour cadres, 0.23 pour non-cadres).
 * @returns {number} - Salaire net avant impôt.
 */
function calculateNetBeforeTax(grossSalary, cotisationRate) {
    const cotisations = grossSalary * cotisationRate;
    return grossSalary - cotisations;
}

/**
 * Calcule le revenu imposable en appliquant un abattement forfaitaire de 10%.
 * @param {number} netBeforeTax - Salaire net avant impôt.
 * @returns {number} - Revenu imposable.
 */
function calculateTaxableIncome(netBeforeTax) {
    const abattement = netBeforeTax * 0.10;
    return netBeforeTax - abattement;
}

/**
 * Calcule l'impôt sur le revenu en fonction du quotient familial.
 * @param {number} quotientFamilial - Revenu imposable par part fiscale.
 * @returns {number} - Impôt dû par part fiscale.
 */
function calculateTax(quotientFamilial) {
    let tax = 0;

    // Tranches d'imposition pour 2024 (à vérifier et ajuster selon les taux officiels)
    const brackets = [
        { limit: 10777, rate: 0 },
        { limit: 27478, rate: 11 },
        { limit: 78570, rate: 30 },
        { limit: 168994, rate: 41 },
        { limit: Infinity, rate: 45 }
    ];

    let previousLimit = 0;

    for (let bracket of brackets) {
        if (quotientFamilial > bracket.limit) {
            tax += (bracket.limit - previousLimit) * (bracket.rate / 100);
            previousLimit = bracket.limit;
        } else {
            tax += (quotientFamilial - previousLimit) * (bracket.rate / 100);
            break;
        }
    }

    return tax;
}
