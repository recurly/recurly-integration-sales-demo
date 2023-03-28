const { currencies, plans, publicKey } = window.recurlyConfig;

// console.log(currencies);
// console.log("-----")
// console.log(plans)

const radioPlans = document.querySelector('.js-plan-select');
const currencySelect = document.querySelector('.js-currency-select');

// console.log(radioPlans);

function populatePlans(currency) {
  const planOptions = plans.filter(plan => plan.currency === currency).map(plan => `
  <div class="recurly-plan feature col border border-primary border-4 rounded">
    <div
      class=" feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
      <svg class="bi" width="1em" height="1em">
        <use xlink:href="#collection"></use>
      </svg>
    </div>
    <input type="radio" class="plans" id="${plan.code}" name="plan_code" value="${plan.code}" >
    <h3 class="fs-2" id="${plan.code}">${plan.name}</h3>
    <h4 id="$${plan.unit_amount}">${plan.unit_amount} ${plan.currency}</h4>
   
  </div>
  `).join("");

  radioPlans.innerHTML = planOptions;
}

currencies.forEach(currency => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  currencySelect.appendChild(option);
});

populatePlans(currencies[0]);

currencySelect.addEventListener('change', () => {
  populatePlans(currencySelect.value);
});
