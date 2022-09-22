const { plans, publicKey } = window.recurlyConfig;

const radioPlans = document.querySelector('.js-plan-select');

const planOptions2 = plans.reduce((options, plan) => {
	options += `<div> <input type="radio" id="${plan.code}" name="plan" value=${plan.code}>
  <label for="${plan.code}">${plan.name} - $${plan.unit_amount}</label>
  </div>`;
	return options;
}, "");

radioPlans.innerHTML = planOptions2;
