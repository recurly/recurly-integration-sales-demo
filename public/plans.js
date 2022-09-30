const { plans, publicKey } = window.recurlyConfig;

const radioPlans = document.querySelector('.js-plan-select');

const planOptions = plans.reduce((options, plan) => {
  options += `
  <div class="recurly-plan feature col border border-primary border-4 rounded">
    <div
      class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
      <svg class="bi" width="1em" height="1em">
        <use xlink:href="#collection"></use>
      </svg>
    </div>
    <input type="radio" class="plans" id="${plan.code}" name="plan_code" value="${plan.code}" >
    <h3 class="fs-2" id="${plan.code}">${plan.name}</h3>
    <h4 id="$${plan.unit_amount}">$${plan.unit_amount}</h4>
    <p>${plan.interval_unit}</p>
  </div>`;
  return options;
}, "");

radioPlans.innerHTML = planOptions;






