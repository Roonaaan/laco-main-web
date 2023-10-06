let navbar = document.querySelector(".header .navbar");

//For Side bar menu buttons
document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.add("active");
};

document.querySelector("#close-navbar").onclick = () => {
  navbar.classList.remove("active");
};

//account forms
let accountForm = document.querySelector(".account-form");

document.querySelector("#account-btn").onclick = () => {
  accountForm.classList.add("active");
  loginBtn.classList.add("active");
  document.querySelector(".account-form .login-form").classList.add("active");
  document
    .querySelector(".account-form .register-form")
    .classList.remove("active");
};

document.querySelector("#close-form").onclick = () => {
  accountForm.classList.remove("active");
  registerBtn.classList.remove("active");
  document
    .querySelector(".account-form .login-form")
    .classList.remove("active");
  document
    .querySelector(".account-form .register-form")
    .classList.add("active");
};

//account forms open and close logic
let registerBtn = document.querySelector(".account-form .register-btn");
let loginBtn = document.querySelector(".account-form .login-btn");

registerBtn.onclick = () => {
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
  document
    .querySelector(".account-form .login-form")
    .classList.remove("active");
  document
    .querySelector(".account-form .register-form")
    .classList.add("active");
};

loginBtn.onclick = () => {
  registerBtn.classList.remove("active");
  loginBtn.classList.add("active");
  document.querySelector(".account-form .login-form").classList.add("active");
  document
    .querySelector(".account-form .register-form")
    .classList.remove("active");
};

//Swiper JS
var swiper = new Swiper(".home-slider", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
  grabCursor: true,
});

//Creating calendar for the main page
//Defining classes as queries to use later
const calendar = document.querySelector(".calendars"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventSubmit = document.querySelector(".add-event-btn");


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Default events Array
// const eventsArr = [
//   {
//     day: 23,
//     month: 10,
//     year: 2023,
//     events: [
//       {
//         title: "Event 1: My Girlfriends Birthday",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2: Celebrating the Birthday",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

//we need to set an empty array for events.
let eventsArr = [];

//then we call the get function.
getEvents();

//Function to add days in front end

function initCalendar() {
  //To get previous month days and current month all days and remember next month days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  //This update the top of the callendar
  date.innerHTML = months[month] + " " + year;

  //adding days in document object model
  activeDay = Math.min(activeDay, getDaysInMonth(month, year));

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  //for current month days

  for (let i = 1; i <= lastDate; i++) {
    //This condition is going to check if the event is present on current day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    // if the current day is today add class (.today) in days div
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      // if the condition founds an event it wil automatically add (.event) class in days Div
      //add active on today at startup

      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active ">${i}</div>`;
      }
    }

    //add remaining days as it is
    else {
      if (event) {
        days += `<div class="day event" >${i}</div>`;
      } else {
        days += `<div class="day" >${i}</div>`;
      }
    }
  }

  //upcomming month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  //it will add listener on each day in calendar it will show up as initialized day.
  addListener();
  updateEvents(activeDay);
}

initCalendar();

//Previous month functions so it can still show up the previous month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
  const newActiveDay = activeDay > getDaysInMonth(month, year) ? getDaysInMonth(month, year) : activeDay;
  updateEvents(newActiveDay);
  saveEvents();
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}
//Next month function same as the previous month function this will show up the next month

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
  const newActiveDay = activeDay > getDaysInMonth(month, year) ? getDaysInMonth(month, year) : activeDay;
  updateEvents(newActiveDay);
  saveEvents();
}

//add eventlistenners to prev and next buttons in main calendar

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//now we add the goto button function and goto today
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  //this logic only allows numbers to be entered and it automatically remove non integer values
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  //this condition will automatically add /(slash) after inputing two values
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }

  if (dateInput.value.length > 7) {
    // This condtion will only allow 7 characters inside the input box
    dateInput.value = dateInput.value.slice(0, 7);
  }

  //if backspace is pressed it will automatically remove the first 2 characters
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
  updateEvents();
});

gotoBtn.addEventListener("click", gotoDate);

//First Step: The code looks at a special piece of paper where you've written a date, like "10/2023". It wants to understand this date.
//Second Step: It takes the date you wrote and separates it into two parts using the "/". So, if you wrote "10/2023", it becomes two parts: "10" and "2023".
//Third Step: Now, it checks these two parts. The first part (before the "/") should be a number between 1 and 12 because there are 12 months in a year. The second part (after the "/") should be a 4-digit number because years have 4 digits like 2023.
//Fourth Step: If the first part is a number from 1 to 12, and the second part is a 4-digit number, then the code understands this as a valid date. It remembers the month (but reduces it by 1 because in computer language, January is 0, February is 1, and so on) and the year you provided.
//Fifth Step: After understanding the date, it uses this information to set up a special calendar with the correct month and year you wrote. It's like opening your toy box and organizing your toys according to the date you provided.
//Sixth Step: If the date you wrote is not in the right format (like "5/2023" or "13/2023" or "10/23"), the code shows a message saying "Invalid date." It's like if you tried to put a broken toy in your toy box – it doesn't fit the rules!

function gotoDate() {
  const dateArr = dateInput.value.split("/");

  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }

  alert("Invalid date");
}

//functions to add buttons
const addEventBtn = document.querySelector(".add-event"),
  addEventContainer = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
  //This job of this condition is when ever you click outside of the Addevent container it will automatically close the Addevent container
  if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
    addEventContainer.classList.remove("active");
  }
});

//validation: it only allows 50 characters inside the title of the input.

addEventTitle.addEventListener("input", () => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});

//We format the time same us the input button that we use :))

addEventFrom.addEventListener("input", (e) => {
  //this condition is same as the first condition on finding your specific date. it only accepts numbers as input
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    //Just like on the first inputs in the left  side of the calendar instead of using (/(backslash)) it uses (:(semicolon)) as the stoper of the value then it will proceed on the next validation which is the next condition
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length === 5) {
    //In this one it automatically terminate you from typing more than five values.
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

//Same condition on setting the first time.
addEventTo.addEventListener("input", (e) => {
  //this condition is same as the first condition on finding your specific date. it only accepts numbers as input
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    //Just like on the first inputs in the left  side of the calendar instead of using (/(backslash)) it uses (:(semicolon)) as the stoper of the value then it will proceed on the next validation which is the next condition
    addEventTo.value += ":";
  }
  if (addEventTo.value.length === 5) {
    //In this one it automatically terminate you from typing more than five values.
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//the job of this function is to render the event that you added inside a day.

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      //this code will set the current day as active day it will add (.active) class inside the div
      activeDay = Number(e.target.innerHTML);

      //31:42
      //Call active day after clicking the day
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));

      //This automatically remove the .active class from already active days.
      days.forEach((day) => {
        day.classList.remove("active");
      });

      //if the previous month  day is clicked it will automatically go to the previous month and add active class

      if (e.target.classList.contains("prev-date")) {
        prevMonth();

        setTimeout(() => {
          //it will select all of the days from previous month
          const days = document.querySelectorAll(".day");

          //after going to previous month add active class to clicked
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();

        setTimeout(() => {
          //it will select all of the days from previous month
          const days = document.querySelectorAll(".day");

          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

//this function will show active day events and the event date at the top.
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML =  dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//The job of this function is to show events
function updateEvents(date){
  let events = "";

  eventsArr.forEach((event) => {

    if(
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ){
      event.events.forEach((event) => {
        events += `
        <div class ="event">
            <div class="title">
              <i class='bx bxs-circle'></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>
        `;
      });
    }
  });

  //and for this condition if theres no events are found it will add no events H3
  if(events === ""){
    events = `<div class ="no-event">
            <h3>No Events</h3>
        </div>`;
  }

  eventsContainer.innerHTML = events;
  //we need to save events when update event is called.
  saveEvents();
}

//Lets create function to add actuall add events :))

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;


  //basic validations in inputs

  if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo ===""){
    alert("Please fill all the fields");

    return;
  }

  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");

  //This condition will check if you added the correct time format.
  if(
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ){
    alert("invalid time Format")
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };

  let eventAdded = false;

  if(eventsArr.length > 0){
    eventsArr.forEach((item) => {
      if(
        item.day === activeDay && 
        item.month === month + 1 &&
        item.year === year
      ){
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  //if event array empty or current day has no event we create new event
  if(!eventAdded){
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  //remove (.active) class from add event form.
  addEventContainer.classList.remove('active');
  
  //we also need to clear the input fields after we add event
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  //Now we need to show the current event

  updateEvents(activeDay);


  //we beed to add event class to newly added day if not already

  const activeDayElem = document.querySelector(".day-active");
  if (!activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }

});

function convertTime(time){
  let timeArr = time.split(':');
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + ":" + timeFormat;
  return time;
}

//lets create a function to remove events on click

eventsContainer.addEventListener("click", (e) =>{
  if(e.target.classList.contains("event")){
    const eventTitle = e.target.children[0].children[1].innerHTML;
    //get the title of event then for each events in array by title and delete it.

    eventsArr.forEach((event) =>{
      if(
        event.day === activeDay && 
        event.month === month + 1 && 
        event.year === year
      ){
        event.events.forEach((item, index) =>{
          if(item.title === eventTitle){
            event.events.splice(index, 1);
          }
        });

        //if no event remaining on that day remove complete day class
        if(event.events.length === 0){
          eventsArr.splice(eventsArr.indexOf(event), 1);
          //after removing complete day class we are also removing active classes of that day

          const activeDayElem = document.querySelector(".day.active");
          if(activeDayElem.classList.contains("event")){
            activeDayElem.classList.remove("event");
          }
        }
      }
    });
    //after removing events from array now we update the event.
    updateEvents(activeDay);
  }
});

// no we need to store events in local storage.




function saveEvents(){
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents(){
  if(localStorage.getItem("events" !== null)){
    return;
  }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")))
}