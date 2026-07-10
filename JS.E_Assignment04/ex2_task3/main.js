const names = ['Chris', 'Li Kang', 'Anne', 'Francesca', 'Mustafa', 'Tina', 'Bert', 'Jada'];
const para = document.getElementById('para');

// Task 3 Refactoring
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function chooseName(array) {
    const randomIndex = random(0, array.length);
    return array[randomIndex];
}

para.textContent = chooseName(names);
