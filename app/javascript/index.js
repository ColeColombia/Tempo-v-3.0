$(document).ready(function(){

  //time and date
  let clock = setInterval(()=>{
  let date = new Date()
  let days = date.getDay()
  $("#time").html(`${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`)
  $("#myDate").html(`${date.toDateString()}`)
}, 1000)

$("#view").click(()=>{
  $("#mySidenav").css("width", "268px")
  $("#main").css("margin-left", "250px")
})

$(".closebtn").click(()=>{
  $("#mySidenav").css("width", "0")
  $("#main").css("margin-left", "0")
})

$("#add").click(()=>{
  $("#addcourseMenu").css("width", "100%")
  $("#main").css("margin-left", "250px")
})

$(".closeLayer").click(()=>{
  $("#addcourseMenu").css("width", "0")
})

$("#submit").click(()=>{
  let courseName = $("#field").val()
  window.addToCourses.addCourse("addcourses", courseName)
})

function validateEmptyCourse(data){
  if(data === "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a"){
    $(".courseExist").append("<p>No courses found, go back and,<br> add a course</p>")
    $(".chosen_course").prop("disabled", true)
  }
  else{
    $(".course_select").append(`<option value="${data}">${data}</option>`)
    $(".chosen_course").prop("disabled", false)
  }
}

$("#showCourses").click(()=>{
  $("#courseList").css("width", "268px")
  window.requestCourses.receive("receiveCourses", (data) => {
  validateEmptyCourse(data)
})

 window.requestCourses.send("loadCourses")

})

$(".closeCourseList").click(()=>{
  $("#courseList").css("width", "0")
  $(".course_select").html("")
  $(".courseExist").html("")
  window.requestCourses.remove("receiveCourses")
})

function calcDistance(date){

  let setDate = new Date(`${date}`)
  let countDown = setDate.getTime()
  let current = new Date().getTime()
  let distance = countDown - current

  return distance
}

function calcTimeRem(distance){

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  let timeRemain = `${days} days : ${hours} hrs : ${minutes} min : ${seconds} sec`

  return timeRemain
}

function showCourseReminders(distance, timeRemain, task, date){

  let setDate = new Date(`${date}`)

  if(distance < 0)
  {
    timeRemain = `task overdue`
    $(".course-content").append(`<div class="wrap_reminder data-id="${task}">
    <div class="task_name" data-id="${task}">${task}</div>
    <div class="task_date" data-id="${date}">${setDate.toDateString()}</div>
    <div class="course_overdue">${timeRemain}</div></div>`)
  }

  else
  {
    $(".course-content").append(`<div id="wrap" class="wrap_reminder" data-id="${task}">
    <div class="task_name" data-id="${task}">${task}</div>
    <div class="task_date" data-id="${date}">${setDate.toDateString()}</div>
    <div class="count_down">${timeRemain}</div>
    </div>`)
  }

}

let option;

$(".chosen_course").click(()=>{

 option = $(".course_select").val()
 $(".course-details").css("width", "100%")
 $("#main").css("margin-left", "250px")
 $(".setCourseName").html(`${option}`)

 window.loadReminders.getReminders("courseReminders", (task, date)=>{

   if(task === "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a"){
   $(".course-content").html(`<div class="no-task">No tasks set yet for ${option}</div>`)
   return;
   }

   else{
   let distance   = calcDistance(date)
   let timeRemain = calcTimeRem(distance)
   showCourseReminders(distance, timeRemain, task, date)
  }

 })
 window.loadReminders.checkReminders("checkReminder", option)

})

$(".close_details").click(()=>{
  $("#course_details").css("width", "0")
  $(".course-content").html("")
  window.loadReminders.remove("courseReminders")
})

$(".set_reminder").click(()=>{
  window.reminder.openReminder("openReminder", option);
})

$(".delete_reminder").click(()=>{
  window.reminder.removeReminder("deleteReminder")
})

})
