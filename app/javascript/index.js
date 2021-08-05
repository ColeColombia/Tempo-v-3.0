
$(document).ready(function(){
   $(".se-pre-con").fadeOut("slow")
  let clock = setInterval(()=>{
  let date = new Date()
  let days = date.getDay()
  $("#time").html(`${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`)
  $("#myDate").html(`${date.toDateString()}`)
}, 1000)

$("#view").click(()=>{
  $(".due_task").css("height", "0%")
  $("#mySidenav").css("width", "248px")
  $("#main").css("margin-left", "250px")
  $("#nav-bar").css("margin-top", "220px")
})

$(".closebtn").click(()=>{
  $("#mySidenav").css("width", "0")
  $("#main").css("margin-left", "0")
  $("#nav-bar").css("margin-top", "175px")
})

$(".addcourse").click(()=>{
  $("#mySidenav").css("width", "0")
  $("#main").css("margin-left", "0")
  $("#nav-bar").css("margin-top", "175px")
  $(".openingWindow").css("display", "block")
  $("#view").prop("disabled", true)
  $(".milestone").prop("disabled", true)

setTimeout(()=>{
  $(".text").css("display", "block")
}, 2000)

  setTimeout(()=>{
    window.add.open("openAddcourseMenu")
  }, 3000)

  setTimeout(()=>{
    $("#view").prop("disabled", false)
    $(".milestone").prop("disabled", false)
    $(".openingWindow").css("display", "none")
  }, 8000)

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

$(".exitParent").click(()=>{
  window.closeParent.send("close")
})

$(".minimize").click(()=>{
  window.closeParent.minimizeWin("minimizeWin")
})

$("#showCourses").click(()=>{
  $(".due_task").css("height", "0%")
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

  let days = Math.floor(distance / (1000 * 60 * 60 * 24))
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((distance % (1000 * 60)) / 1000)
  let timeRemain = `${days} days : ${hours} hrs : ${minutes} min : ${seconds} sec`

  return timeRemain
}

function uploadReminders(distance, timeRemain, task, date){
  const taskInfo = []
  let setDate = new Date(`${date}`)

  const courses =
  {
    task:task,
    setDate:setDate.toDateString(),
    timeRemain:timeRemain,
    distance:distance,
    time:`${setDate.getHours()}:${setDate.getMinutes()}`
  }

  taskInfo.push(courses)
  showReminders(taskInfo)
}

let option//selected course kept global

function showReminders(taskInfo){

  setTimeout(()=>{
    taskInfo.forEach((task) => {
      if(task.distance < 0)
      {
        task.timeRemain = `task overdue`
        $(".select_remove").prepend(`<option>${task.task}</option>`)
        $(".course-content").prepend(`<div class="wrap_reminder data-id="${task.task}">
        <div class="task_name" data-id="${task.task}">${task.task}</div>
        <div class="task_date" data-id="${task.setDate}">${task.setDate} ${task.time}</div>
        <div class="course_overdue">${task.timeRemain}</div></div>`)
        return
      }

      else
      {
        $(".select_remove").append(`<option>${task.task}</option>`)
        $(".course-content").append(`<div id="wrap" class="wrap_reminder" data-id="${task.task}">
        <div class="task_name" data-id="${task.task}">${task.task}</div>
        <div class="task_date" data-id="${task.date}">${task.setDate} ${task.time}</div>
        <div class="count_down">${task.timeRemain}</div>
        </div>`)
      }

    })
  }, 1000)

}//end of show reminders

function fetchingRem(){
  return new Promise((resolve, reject)=>{
    window.loadReminders.checkReminders("checkReminder", option)
    resolve()
  })
}

async function load_reminders(){

  let loadedReminders = await fetchingRem()

  return new Promise((resolve, reject)=>{
    window.loadReminders.getReminders("courseReminders", (task, date)=>{
     if(task === "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a"){
     $(".course-content").html(`<div class="no-task">No tasks set yet for ${option}</div>`)
     return;
     }

     else{
     let distance   = calcDistance(date)
     let timeRemain = calcTimeRem(distance)
     uploadReminders(distance, timeRemain, task, date)
    }
    resolve()
   })
  })
}

async function openChosenCourse(){
  let courseReminders = await load_reminders()
}

$(".chosen_course").click(()=>{

  option = $(".course_select").val()
  openChosenCourse()
  $(".course-details").css("width", "100%")
  $("#main").css("margin-left", "250px")
  $(".setCourseName").html(`${option}`)
})

$(".close_details").click(()=>{
  $(".select_remove").html("")
  $("#course_details").css("width", "0")
  $(".course-content").html("")
  window.loadReminders.remove("courseReminders")
})

$(".set_reminder").click(()=>{
  $(".select_remove").prop("disabled", true)
  $(".close_details").css("display", "none")
  $(".refresh").css("display", "none")
  $(".openingWindow").css("display", "block")
  $(".set_reminder").prop("disabled", true)
  $(".delete_reminder").prop("disabled", true)
  $(".refresh").prop("disabled", true)
  $(".close_details").prop("disabled", true)

  setTimeout(()=>{
  $(".text").css("display", "block")
}, 2000)

  setTimeout(()=>{
  window.reminder.openReminder("openReminder", option);
}, 3000)

setTimeout(()=>{
    $(".select_remove").prop("disabled", false)
$(".refresh").css("display", "block")
$(".close_details").css("display", "block")
$(".openingWindow").css("display", "none")
$(".set_reminder").prop("disabled", false)
$(".delete_reminder").prop("disabled", false)
$(".refresh").prop("disabled", false)
$(".close_details").prop("disabled", false)
}, 8000)

})

$(".delete_reminder").click(()=>{
  window.loadReminders.remove("courseReminders")
  let selectedCourse = $(".select_remove").val()
  if(selectedCourse.length == 0){
    return
  }else {
    window.removeReminder.send("remove_reminder", option, selectedCourse)
    window.removeReminder.receive("removed", (confirm)=>{
      $(".modal").css("display", "block")
      $(".details").html(`<p class="response">${confirm}</p>`)
    })
  }

})

$(".refresh").click(()=>{
  window.loadReminders.remove("courseReminders")
  refreshReminder()
  window.removeReminder.removeListener("removed")
})

function refreshReminder(){
  $(".select_remove").html("")
  $(".course-content").html("")
  openChosenCourse()
}

$(".close").click(()=>{
  let selectedCourse = $(".select_remove").val()
  if(selectedCourse === null){
  $(".delete_reminder").prop("disabled", true)
  }else{
   $(".delete_reminder").prop("disabled", false)
}

  $(".modal").css("display", "none")
  $(".details").html(``)
  refreshReminder()
  window.removeReminder.removeListener("removed")
})

function fecthAllCourses(){
  return new Promise((resolve, reject)=>{
      window.requestCourses.send("loadCourses")
      resolve()
  })
}

async function fetchCourses(){
  let fetchedCourse = await fecthAllCourses()
  return new Promise((resolve, reject)=>{
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
    resolve()
  })

}

async function allCourses(){
  let allCourses = await fetchCourses()
}

$(".close-RemoveCourse").click(()=>{
  $(".removecourse").css("width", "248px")
  $("#main").css("margin-left", "250px")
  allCourses()
})

$(".close_course").click(()=>{
  $(".removecourse").css("width", "0")
  $("#main").css("margin-left", "245px")
  window.requestCourses.remove("receiveCourses")
  $(".selected_Course").html("")
})

function refreshCourse(){
  $(".selected_Course").html("")
  allCourses()
}

$(".removed_Course").click(()=>{
  let course = $(".selected_Course").val()
  if(course.length == 0)
  {
    return
  }else{
    window.deleteCourse.send("deleteCourse", course)
    window.deleteCourse.receive("courseIsRemoved", (data)=>{
      $(".removedModal").css("display", "block")
      $(".confirmation_data").append(`<p class="data-feedback">${data}</>`)
    })
  }

})

$(".courseRemoved").click(()=>{
  $(".removedModal").css("display", "none")
  refreshCourse()
  window.deleteCourse.remove("courseIsRemoved")
  window.requestCourses.remove("receiveCourses")
  $(".confirmation_data").html("")
})

function uploadAllReminders(timeRemain, distance, courseName, task, date){
  const taskInfo = []
  let setDate = new Date(`${date}`)
  const courses =
  {
    timeRemain:timeRemain,
    distance:distance,
    task:task,
    setDate:setDate.toDateString(),
    course:courseName,
    time:`${setDate.getHours()}:${setDate.getMinutes()}`
  }

  taskInfo.push(courses)
  showAllReminders(taskInfo)
}//end of uploadReminders

function showAllReminders(taskInfo){

  taskInfo.sort((taskA, taskB)=>{
    return taskA.distance - taskB.distance
  })

  setTimeout(()=>{
    taskInfo.forEach((task) => {
      if(task.distance < 0)
      {
        $(".courseContent").prepend(`<div class="wrap_reminder data-id="${task.course}">
        <div class="task_name" data-id="${task.courseName}">${task.course}</div>
        <div class="task_date" data-id="${task.task}">${task.task}</div>
        <div class="course_overdue">${task.setDate} ${task.time}</div></div>`)
      }
      else
      {
        $(".courseContent").append(`<div id="wrap" class="wrap_reminder" data-id="${task.course}">
        <div class="task_name" data-id="${task.course}">${task.course}</div>
        <div class="task_date" data-id="${task.task}">${task.task}</div>
        <div class="count_down">${task.setDate} ${task.time}</div>
        </div>`)
      }
    })
  }, 1000);

}//end of show reminders

function fetchAlltasks(){
  return new Promise((resolve, reject)=>{
    window.loadAll.fecthAll("fetch")
    resolve()
  })
}

async function fetchTasks(){
  let tasks = await fetchAlltasks()
  return new Promise((resolve, reject)=>{
    window.loadAll.fetchTasks("all_tasks", (courseName, task, date)=>{

      if(task === "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a"){
      $(".course-content").html(`<div class="no-task">No tasks found</div>`)
      return
      }

      else{
      let distance   = calcDistance(date)
      let timeRemain = calcTimeRem(distance)
      uploadAllReminders(timeRemain, distance, courseName, task, date)
     }
     resolve()
    })
  });
}

async function fetchedTasks(){
  let fetchedTasks = await fetchTasks()
}

$(".milestone").click(()=>{
  $(".due_task").css("height", "100%")
  $(".removecourse").css("width", "0")
  $(".course_select").html("")
  $(".courseExist").html("")
  $("#courseList").css("width", "0px")
  $("#mySidenav").css("width", "0")
  $("#main").css("margin-left", "0")
  window.requestCourses.remove("receiveCourses")
  fetchedTasks()
})

$(".closeDue").click(()=>{
  $(".due_task").css("height", "0%")
  $(".courseContent").html("")
  $("#nav-bar").css("margin-top", "175px")
  window.loadAll.remove("all_tasks")
})

})
