const images = [
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
];
let index = 0;

// Task 1
const imageContainer = document.getElementById('imageContainer');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');

// Task 2
function renderImage() {
    imageContainer.innerHTML = `<img src="${images[index]}" alt="Image Slideshow">`;
}

renderImage();
