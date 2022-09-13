import { hashParams } from "./helpers/hashParams.js";

const {
  first_name,
  last_name
} = hashParams();

console.log('hash: ', hashParams())
const successDiv = document.getElementById('success');
successDiv.innerHTML = `<h1>Thank you, ${first_name} ${last_name} for your order!</h1>`