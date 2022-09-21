const { plans, publicKey } = window.recurlyConfig;

const planSelect = document.querySelector('.js-plan-select');

const planOptions = plans.reduce((options, plan) => {
	options += `<option value="${plan.code}" name="${plan.code}">${plan.name}</option>`;
	return options;
}, '<option value="">None</option>');

planSelect.innerHTML = planOptions;

debugger

const checkoutBtn = document.getElementById('checkout');
