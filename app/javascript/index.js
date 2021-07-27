$(document).ready(function(){

  //time and date
  let clock = setInterval(()=>{
  let date = new Date()
  let days = date.getDay()
  $("#time").html(`${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`)
  $("#myDate").html(`${date.toDateString()}`)
}, 1000)

$("#view").click(()=>{
  $("#mySidenav").css("width", "248px")
  $("#main").css("margin-left", "250px")
})

$(".closebtn").click(()=>{
  $("#mySidenav").css("width", "0")
  $("#main").css("margin-left", "0")
})

$(".addcourse").click(()=>{
  window.add.open("openAddcourseMenu")
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
  $("#courseList").css("width", "248px")
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
    $(".select_remove").append(`<option>${task}</option>`)
    $(".course-content").append(`<div class="wrap_reminder data-id="${task}">
    <div class="task_name" data-id="${task}">${task}</div>
    <div class="task_date" data-id="${date}">${setDate.toDateString()}</div>
    <div class="course_overdue">${timeRemain}</div></div>`)
  }

  else
  {
    $(".select_remove").append(`<option>${task}</option>`)
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
  $(".select_remove").html("")
  $("#course_details").css("width", "0")
  $(".course-content").html("")
  window.loadReminders.remove("courseReminders")
})

$(".set_reminder").click(()=>{
  window.reminder.openReminder("openReminder", option);
})

$(".delete_reminder").click(()=>{
  let selectedCourse = $(".select_remove").val()
  window.removeReminder.send("remove_reminder", option, selectedCourse)
  window.removeReminder.receive("removed", (confirm)=>{
    $(".modal").css("display", "block")
    $(".details").html(`<p class="response">${confirm}</p>`)
  })
})

$(".close").click(()=>{
  let selectedCourse = $(".select_remove").val()
  if(selectedCourse === null){
  $(".delete_reminder").prop("disabled", true)
  }else{
   $(".delete_reminder").prop("disabled", false)
  }

  $(".modal").css("display", "none")
  $(".details").html(``)
  window.removeReminder.removeListener("removed")
})

$(".exitParent").click(()=>{
  window.closeParent.send("close")
})

$(".close-RemoveCourse").click(()=>{
  $(".removecourse").css("width", "248px")
  $("#main").css("margin-left", "250px")
  window.requestCourses.receive("receiveCourses", (data) => {
    if(data === "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a")
    {
      $(".removed_Course").prop("disabled", true)
      $(".selected_Course").html("")
    }
    else
    {
      $(".selected_Course").append(`<option value="${data}">${data}</option>`)
      $(".removed_Course").prop("disabled", false)
    }
  })
  window.requestCourses.send("loadCourses")
})

$(".close_course").click(()=>{
  $(".removecourse").css("width", "0")
  $("#main").css("margin-left", "245px")
  window.requestCourses.remove("receiveCourses")
  $(".selected_Course").html("")
})

$(".removed_Course").click(()=>{
  let course = $(".selected_Course").val()
  window.deleteCourse.send("deleteCourse", course)
})

})
