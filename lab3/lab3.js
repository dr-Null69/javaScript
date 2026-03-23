const button = document.getElementById('actionButton');


function sumFirstTenFibonacci() {
    let count = 0;
    let a = 0; 
    let b = 1;
    let sum = 0;

    while (count < 10) {
        sum += a;
        let next = a + b;
        a = b;
        b = next;
        count++;
    }
    return sum;
}


function sumPrimesTo1000() {
    let totalSum = 0;
    for (let num = 2; num <= 1000; num++) {
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) totalSum += num;
    }
    return totalSum;
}


function getDayName(dayNumber) {
    switch (dayNumber) {
        case 1: return "Понеділок";
        case 2: return "Вівторок";
        case 3: return "Середа";
        case 4: return "Четвер";
        case 5: return "П'ятниця";
        case 6: return "Субота";
        case 7: return "Неділя";
        default: return "Помилка: введіть число від 1 до 7";
    }
}


function getStringsWithOddLength(arr) {
    return arr.filter(str => str.length % 2 !== 0);
}


const incrementArrayElements = (arr) => arr.map(num => num + 1);


function isTenByOperation(a, b) {
    return (a + b === 10) || Math.abs(a - b) === 10;
}

function buttonClick() {
    console.log("tsk 1:", sumFirstTenFibonacci());
    console.log("tsk 2:", sumPrimesTo1000());
    console.log("tsk 3:", getDayName(4));
    console.log("tsk 4:", getStringsWithOddLength(["apple", "js", "code", "sky"]));
    console.log("tsk 5:", incrementArrayElements([1, 2, 3]));
    console.log("tsk 6:", isTenByOperation(15, 5));
}



button.addEventListener('click', buttonClick);