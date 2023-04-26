// background colour 

const colourSelector = document.getElementById("colour-selector")

colourSelector.addEventListener("input",() => {
    let selectedColour = colourSelector.value
    document.body.style.backgroundColor = selectedColour
    localStorage.setItem("selectedColour", selectedColour)
})

const storedColour = localStorage.getItem("selectedColour")

if (storedColour)
    document.body.style.backgroundColor = storedColour
else    
    document.body.style.backgroundColor = 'purple'


// content colour 

const contentColourSelect = document.getElementById("content-color");

contentColourSelect.addEventListener('change', () => {
  const selectedContentColour = contentColourSelect.value;
  document.querySelectorAll('.content').forEach(content => {
    content.style.backgroundColor = selectedContentColour;
  });
  localStorage.setItem('selectedContentColour', selectedContentColour);
});

const selectedStoredColour = localStorage.getItem('selectedContentColour');

if (selectedStoredColour) {
  document.querySelectorAll('.content').forEach(content => {
    content.style.backgroundColor = selectedStoredColour;
  });
} else {
  document.querySelectorAll('.content').forEach(content => {
    content.style.backgroundColor = 'white';
  });
}

// brand name
window.addEventListener('load', (event) => {
    let brandText = localStorage.getItem('brand') ? localStorage.getItem('brand') : "";
    document.getElementById('nameBrand').innerHTML = brandText;
});

document.getElementById('ConfirmBrand').addEventListener('click', () => {
    let text = document.getElementById('company').value;
    document.getElementById('nameBrand').innerHTML = text;
    localStorage.setItem('brand', text);
});

// brand slogan
window.addEventListener('load', (event) => {
    let brandText = localStorage.getItem('brandm') ? localStorage.getItem('brandm') : "";
    document.getElementById('brandMessage').innerHTML = brandText;
});

document.getElementById('ConfirmBrandMessage').addEventListener('click', () => {
    let text = document.getElementById('companyMessage').value;
    document.getElementById('brandMessage').innerHTML = text;
    localStorage.setItem('brandm', text);
});

// brand logo

const input = document.getElementById('thumbnail');
input.addEventListener('change', (event) => {
    const image = event.target.files[0];
    if (image.size > 2 * 1024 * 1024) {
        alert('Please upload an image that is less than 2MB');
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDimension = 100;
            if (width > height) {
                if (width > maxDimension) {
                    height *= maxDimension / width;
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width *= maxDimension / height;
                    height = maxDimension;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, width, height);
            const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
            localStorage.setItem("thumbnail", resizedImage);
        };
    });
});

function upload() {
    location.reload();
}

document.getElementById("uploadBtn").addEventListener("click", upload);

window.addEventListener('load', (event) => {
    let logo = localStorage.getItem('thumbnail') ? localStorage.getItem('thumbnail') : "";
    const previewImage = document.getElementById('preview');
    previewImage.setAttribute('src', logo);
});

function clearLocalStaorageKeys() {
    localStorage.removeItem("selectedColour");
    localStorage.removeItem("selectedContentColour");
    localStorage.removeItem("brand");
    localStorage.removeItem("brandm");
    localStorage.removeItem("thumbnail");
    location.reload()

}

document.getElementById("clearBtn").addEventListener("click", clearLocalStaorageKeys);

function goToPlans() {
    window.location.href = 'plans.html';
}

document.getElementById("plansBtn").addEventListener("click", goToPlans);