window.addEventListener('load', (event) => {
  console.log("3456");
  const storedColour = localStorage.getItem("selectedColour")
  console.log(storedColour);

if (storedColour)
    document.body.style.backgroundColor = storedColour
else    
    document.body.style.backgroundColor = 'purple'

});

window.addEventListener('load', (event) => {
  console.log("435");
  const selectedStoredColour = localStorage.getItem('selectedContentColour');
  console.log(selectedStoredColour);
  if (selectedStoredColour) {
    document.querySelectorAll('.content').forEach(content => {
      content.style.backgroundColor = selectedStoredColour;
    });
  } else {
    document.querySelectorAll('.content').forEach(content => {
      content.style.backgroundColor = 'yellow';
    });
  }

});

window.addEventListener('load', (event) => {
  let selectedColorTwo = localStorage.getItem('contentColor') ? localStorage.getItem('contentColor') : '#ffffff';
  document.querySelectorAll('.content').forEach(el => el.style.backgroundColor = selectedColorTwo);

});

window.addEventListener('load', (event) => {
  let brandText = localStorage.getItem('brand') ? localStorage.getItem('brand') : "";
  document.getElementById('nameBrand').innerHTML = brandText;
});

window.addEventListener('load', (event) => {
  let brandText = localStorage.getItem('brandm') ? localStorage.getItem('brandm') : "";
  document.getElementById('brandMessage').innerHTML = brandText;
});

const input = document.getElementById('thumbnail');

window.addEventListener('load', (event) => {
  let logo = localStorage.getItem('thumbnail') ? localStorage.getItem('thumbnail') : "";
  const previewImage = document.getElementById('preview');
  previewImage.setAttribute('src', logo);
});
