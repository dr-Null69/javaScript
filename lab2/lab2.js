function findMinMax(arr) {
    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return {
        min: min,
        max: max
    };
}

let numbers = [5, 3, 9, 1, 7];
console.log(findMinMax(numbers));

//====================================task1.2

function compareObjects(obj1, obj2) {
    if (obj1.name === obj2.name && obj1.age === obj2.age) {
        return "Об'єкти однакові";
    } else {
        return "Об'єкти різні";
    }
}

let person1 = { name: "Іван", age: 20 };
let person2 = { name: "Іван", age: 20 };

console.log(compareObjects(person1, person2));

//====================================task2

function inRange(number, min, max) {
    if !(number >= min && number <= max) {
        return false;
    } else {
        return true;
    }
}

console.log(inRange(5, 1, 10));

//====================================task3.1

function studentGrade2(score) {
    return score >= 90 ? "Відмінно" :
           score >= 75 ? "Добре" :
           score >= 60 ? "Задовільно" :
           "Незадовільно";
}

console.log(studentGrade2(82));

//====================================task3.2

function getSeason(month) {

    if (month >= 3 && month <= 5) {
        return "Весна";
    } else if (month >= 6 && month <= 8) {
        return "Літо";
    } else if (month >= 9 && month <= 11) {
        return "Осінь";
    } else if (month === 12 || month === 1 || month === 2) {
        return "Зима";
    } else {
        return "Невірний місяць";
    }

}

console.log(getSeason(4));
