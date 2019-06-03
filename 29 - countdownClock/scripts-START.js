let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");
function timer(seconds) {
  // issues with setInterval - ios - don't run on scroll - ?? - don't run when tabbed away
  // setInterval(function(){
  //   seconds--
  // },1000)
  clearInterval(countdown);
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // should the timer stop?
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display updated time
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  timerDisplay.textContent = display;
  document.title = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}
function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener("click", startTimer));

// elements with a name attribute appear on the document object
document.customForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  // reset the form
  this.reset();
});

// Date.now()
// 1559522908887
// const date = new Date(1559522908887)
// undefined
// date.getDate()
// 2
// date.getDay()
// 0
// date.getMonth()
// 5
// date.getHours()
// 17
// date.getMinutes()
// 48
