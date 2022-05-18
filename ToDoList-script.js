/* 1- Dom Variables*/
const currentDayTxt = document.querySelector('#currentDayTxt');
const currentDateTxt = document.querySelector('#currentDateTxt');
const currentTimeClockTxt = document.querySelector('#currentTimeClockTxt');
const button = document.querySelector("#enter");
const userInput = document.querySelector("#userInput");
const ul = document.querySelector("ul");
const dateValue = document.querySelector(".dateValue");
const dateInput = document.querySelector(".dateInput");
const item = document.querySelector(".item");

/* 2- Current Date and Time: */
const startTime = () => {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const addZero = num => {
  if (num < 10) {num = `0${num}`};
  return num;
  }

  let currentSecond = addZero(today.getSeconds());
  let currentMinute = addZero(today.getMinutes());
  let currentHour = addZero(today.getHours());
  let currentDayName = days[today.getDay()];
  let currentDayNumber = addZero(today.getDate());
  let currentMonth = addZero(today.getMonth() +1);
  let currentYear = today.getFullYear();

  currentDayTxt.innerHTML = `${currentDayName}`;
  currentDateTxt.innerHTML = `${currentDayNumber} / ${currentMonth} / ${currentYear}`;
  currentTimeClockTxt.innerHTML = `${currentHour} : ${currentMinute} : ${currentSecond}`;
  setInterval(startTime, 1000);
}

/* 3-Storing Data in Local Storage */
let storedTodosObjs = JSON.parse(localStorage.getItem('storedTodosObjs'))
let itemList;
if(storedTodosObjs) {
  itemList = storedTodosObjs;
} else {
  itemList = [];
};

/* 4- Creation's function: */
const inputLength = () => userInput.value.length;

const createListItem = () => {
  while (ul.firstChild) {
    ul.firstChild.remove();
  };
  let i = 0;
  const nextItem = () => {
    let div = document.createElement("div");
    if(itemList[i].itemDone === false) {
      div.classList.add("item");
      div.classList.add("itemShow")
    } else {
      div.classList.add("item");
      div.classList.add("itemShow")
      div.classList.add("doneItem");
    }
    ul.appendChild(div);
  
    div.innerHTML = `
      <button class="doneBtn"><i class="fas fa-check"></i></button>
      <button class="delBtn"><i class="fas fa-trash-alt"></i></button>
      <li class="itemTXT">${itemList[i].text}</li>
      <div id="date">
        <span class="dateValue">${itemList[i].date}</span>
        <input type="datetime-local" class="dateInput">	
      </div>
      `

    if(itemList[i].textDone === true) {
      div.children[2].classList.add("doneText");
    }
    if(itemList[i].dateDone === true) {
      div.children[3].children[0].classList.add("doneText");
    }
    if (i<itemList.length-1) {
      i++;
      setTimeout(nextItem, 500)
    }
  }
  nextItem()

  userInput.value = "";

  localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
}

if(itemList.length !== 0) {
  createListItem();
}

const createNewItem = () => {
    let div = document.createElement("div");
    div.classList.add("item");
    div.classList.add("itemShow");
    ul.appendChild(div);
  
    div.innerHTML = `
      <button class="doneBtn"><i class="fas fa-check"></i></button>
      <button class="delBtn"><i class="fas fa-trash-alt"></i></button>
      <li class="itemTXT">${userInput.value}</li>
      <div id="date">
        <span class="dateValue"></span>
        <input type="datetime-local" class="dateInput">	
      </div>
      `
    userInput.value = "";

  localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
}

/* 5- Creation Events: */
const addNewItem = () => {
    let newItemObj = {
      text: userInput.value,
      date: '',
      textDone: false,
      dateDone: false,
      itemDone: false
    }
    itemList.push(newItemObj);
    createNewItem();
}

button.addEventListener("click", () => {
  if(inputLength() > 0) {
    addNewItem();
  }
});

userInput.addEventListener("keypress", () => {
  if(inputLength() > 0 && event.keyCode === 13) {
    addNewItem();
  }
});

/* 6- Done & Delete Events: */
const DoneItem = icon => {
  if(icon.target.className.includes('fa-check')) {
    const parentUl = Array.from(icon.target.parentElement.parentElement.parentElement.children);
    const itemDiv = icon.target.parentElement.parentElement;
    const indexDoneItem = parentUl.indexOf(itemDiv);

    const itemText = icon.target.parentElement.parentElement.children[2];
    const dateText = icon.target.parentElement.parentElement.children[3].children[0];

    itemText.classList.toggle("doneText");
    dateText.classList.toggle("doneText");
    itemDiv.classList.toggle("doneItem");

    if(itemText.className.includes('doneText') && itemDiv.className.includes('doneItem')) {
      itemList.unshift(itemList.splice(indexDoneItem, 1)[0]);

      itemList[0].textDone = true;
      itemList[0].dateDone = true;
      itemList[0].itemDone = true;
 
      location.reload();
    } else {
      itemList[indexDoneItem].textDone = false;
      itemList[indexDoneItem].dateDone = false;
      itemList[indexDoneItem].itemDone = false;
    }
  
    localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
  

  }
}
ul.addEventListener("click", DoneItem);



const DeleteItem = icon => {
  const parentUl = Array.from(icon.target.parentElement.parentElement.parentElement.children);
  const itemDiv = icon.target.parentElement.parentElement;
  const indexDeletedItem = parentUl.indexOf(itemDiv);

  if (icon.target.className.includes('fa-trash-alt')) {
    itemList.splice(indexDeletedItem, 1);

    localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
    
    itemDiv.remove();
  };
}

ul.addEventListener("click", DeleteItem);

/* 7- addDate Event: */
//Changing the format and the order of the date and the time to become like this:
// hh:mm dd/mm/yyyy
const addDate = calendar => {
  const parentUl = Array.from(calendar.target.parentElement.parentElement.parentElement.children);
  const itemDiv = calendar.target.parentElement.parentElement;
  const indexTargetItem = parentUl.indexOf(itemDiv);
  const itemDateText = calendar.target.parentElement.children[0];
  
  if(calendar.target.className === "dateInput" && calendar.target.value === '') {
    itemDateText.innerText = '';

    itemList[indexTargetItem].date = itemDateText.innerText;

    localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
  } else if(calendar.target.className === "dateInput" && calendar.target.value !== "") {
    const dateInputValue = calendar.target.value;

    const day = dateInputValue.slice(8, 10);
    const month = dateInputValue.slice(5, 7);
    const year = dateInputValue.slice(0, 4);

    const time = dateInputValue.slice(11, 16);
    const fullDate = `${day}/${month}/${year}`;
    
    itemDateText.innerText = (`AT ${time} OF ${fullDate} `);

    itemList[indexTargetItem].date = itemDateText.innerText;

    localStorage.setItem('storedTodosObjs', JSON.stringify(itemList));
  }
}
ul.addEventListener("input", addDate);