let timer = document.getElementById("timer");
let start_el = document.getElementById("start");
let stop_el = document.getElementById("stop");
let reset_el = document.getElementById("reset"); 

start_el.onclick = () => {start()};
stop_el.onclick = () => {stop()};
reset_el.onclick = () => {reset()};


let prev_time = 0;
let start_time = 0;
let is_stoper_running = false;
let intervalID;

let start = () =>{
    if(is_stoper_running) return;
    is_stoper_running = true;

    start_time = Date.now();
    intervalID = setInterval(timer_count, 100);
}

let stop = () => {
    if(!is_stoper_running) return;
    prev_time += Date.now() - start_time;
    is_stoper_running = false;
    clearInterval(intervalID)
}

let reset = () => {
    is_stoper_running = false;
    clearInterval(intervalID);
    prev_time = 0;
    display(0);
}

let timer_count = ()=>{
    let t = Date.now() - start_time + prev_time;
    display(t);
}

let display = (t) => {
    t = Math.floor(t / 1000);
    let minutes = Math.floor(t / 60);
    let seconds = t % 60;
    if(minutes != 0){
        timer.innerText =  minutes + "min " + seconds + "s";
    }else{
        timer.innerText = seconds + "s";
    }
}

let minTxt = document.getElementById("min");
let maxTxt = document.getElementById("max");
let big_numsTxt = document.getElementById("big_nums");
let specialTxt = document.getElementById("special");
let sub = document.getElementById("submit");
sub.onclick = ()=>{
    let min = Number.parseInt(minTxt.value);
    let max = Number.parseInt(maxTxt.value);
    let big_nums = big_numsTxt.checked;
    let special = specialTxt.checked;
    generatePassword(min, max, big_nums, special);
}


const LowerCase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const UpperCase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const Character =  ["!", "\"", "#", "$", "%", "&", "\'", "(", ")", "*", "+", ",",
    "-", ".", "/", "\\", ":", ";", "<", ">", "=", "?", "@", "[", "]", "^", "_", "`", "{", "}", "|", "~"]


const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}


const generatePassword = (min, max, capital, special) => {
    if (min > max) {
        alert("minimum nie może być większe od maksimum");
    }

    let shuffle = LowerCase + Numbers;
    let off = 0;
    if(capital) {shuffle += capital; off++};
    if(special) {shuffle += special; off++};

    let len = getRandomInt(min, max);
    let str = "";
    
    for(let i = 0; i < len - off; i++)
    {
        str += shuffle[getRandomInt(0, shuffle.length-1)];
    }

    if (capital){
        let where = getRandomInt(0,len-1);
        str = str.slice(0, where) + UpperCase[getRandomInt(0,UpperCase.length-1)] + str.slice(where);
    }

    if (special){
        let where = getRandomInt(0,len-1);
        str = str.slice(0, where) + Character[getRandomInt(0,Character.length-1)] + str.slice(where);
    }

    alert(str);
}

let table = document.getElementById("table");


let data;
let d;
window.onload = () =>{
    fetch("https://dummyjson.com/products").then(result => result.json()).then(result => {
        displayData(result.products);
        data = result.products;
        d = data;
    })
}

let f = (obj, text)=>{
    return obj.title.toLowerCase().includes(text);
}

let filter = document.getElementById("filter");
filter.oninput = () =>{
    let text = filter.value.toLowerCase();
    let d = data.filter( (obj) => f(obj, text));
    displayData(d);
}

let sorts = document.getElementById("sorts");
sorts.oninput = ()=>{
    let type = sorts.value;
    t = d;
    if(type === "asc"){
        t = d.sort((e, p)=>{return e.title >= p.title});
        displayData(t);
    }else if(type === "desc"){
        t = d.sort((e, p)=>{return e.title <= p.title});
        displayData(t);
    }else{
        
    }
}
let displayData = (products) =>{
    table.innerHTML = "";
    products.forEach(row => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let img = document.createElement("img");
        img.src = row.thumbnail;
        td1.appendChild(img);
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerText = row.title;
        tr.appendChild(td2);
        let td3 = document.createElement("td");
        td3.innerText = row.description;
        tr.appendChild(td3);
        table.appendChild(tr);
    });
}