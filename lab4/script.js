const button = document.getElementById('actionButton');



function task1() {
    let fruits = ["яблуко", "банан", "груша", "апельсин"];

    fruits.pop();
    console.log("1.1:", fruits);

    fruits.unshift("ананас");

    fruits.sort().reverse();
    console.log("1.3:", fruits);

    let index = fruits.indexOf("яблуко");
    console.log("1.4 Індекс 'яблуко':", index);
}

function task2() {
    let colors = ["червоний", "синій", "зелений", "світло синій", "жовтий"];

    let longest = colors.reduce((a, b) => a.length > b.length ? a : b);
    let shortest = colors.reduce((a, b) => a.length < b.length ? a : b);
    console.log("2.2 Найдовший:", longest, "Найкоротший:", shortest);

    let blueColors = colors.filter(color => color.includes("синій"));

    let result = blueColors.join(", ");

    console.log("2.5:", result);
}

function task3() {
    let employees = [
        { name: "Іван", age: 25, position: "розробник" },
        { name: "Олена", age: 30, position: "дизайнер" },
        { name: "Петро", age: 28, position: "розробник" }
    ];

    employees.sort((a, b) => a.name.localeCompare(b.name));

    let developers = employees.filter(emp => emp.position === "розробник");
    console.log("3.3:", developers);

    employees = employees.filter(emp => emp.age <= 28);

    employees.push({ name: "Марія", age: 22, position: "тестувальник" });

    console.log("3.5:", employees);
}

function task4() {
    let students = [
        { name: "Олексій", age: 20, course: 2 },
        { name: "Ірина", age: 22, course: 3 },
        { name: "Максим", age: 19, course: 1 }
    ];

    students = students.filter(st => st.name !== "Олексій");

    students.push({ name: "Анна", age: 21, course: 2 });

    students.sort((a, b) => b.age - a.age);

    let thirdCourse = students.find(st => st.course === 3);

    console.log("4.5:", thirdCourse);
}

function task5() {
    let numbers = [1, 2, 3, 4, 5];

    let squares = numbers.map(n => n * n);
    console.log("5.1:", squares);

    let evens = numbers.filter(n => n % 2 === 0);
    console.log("5.2:", evens);

    let sum = numbers.reduce((acc, n) => acc + n, 0);
    console.log("5.3:", sum);

    let extra = [6, 7, 8, 9, 10];
    numbers = numbers.concat(extra);

    numbers.splice(0, 3);
    console.log("5.5:", numbers);
}

function libraryManagement() {
    let books = [
        { title: "Кобзар", author: "Шевченко", genre: "поезія", pages: 200, isAvailable: true },
        { title: "1984", author: "Орвелл", genre: "антиутопія", pages: 328, isAvailable: true }
    ];

    function addBook(title, author, genre, pages) {
        books.push({ title, author, genre, pages, isAvailable: true });
    }

    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }

    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        books.forEach(book => {
            if (book.title === title) {
                book.isAvailable = !isBorrowed;
            }
        });
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        let total = books.length;
        let available = books.filter(b => b.isAvailable).length;
        let borrowed = total - available;
        let avgPages = books.reduce((sum, b) => sum + b.pages, 0) / total;

        return { total, available, borrowed, avgPages };
    }

    addBook("Гаррі Поттер", "Роулінг", "фентезі", 400);
    removeBook("1984");
    toggleBookAvailability("Кобзар", true);
    sortBooksByPages();

    console.log("6. Книги:", books);
    console.log("6. Пошук:", findBooksByAuthor("Шевченко"));
    console.log("6. Статистика:", getBooksStatistics());
}

function task7() {
    let student = {
        name: "Іван",
        age: 20,
        course: 2
    };

    student.subjects = ["математика", "програмування"];

    delete student.age;

    console.log("7:", student);
}



button.addEventListener('click', buttonClick);

function buttonClick() {
    task1();
    task2();
    task3();
    task4();
    task5();
    libraryManagement();
    task7();
}