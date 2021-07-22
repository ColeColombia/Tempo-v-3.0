$(document).ready(function(){

  //time and date
  let clock = setInterval(()=>{
  let date = new Date()
  let days = date.getDay()
  $("#time").html(`${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`)
  $("#myDate").html(`${date.toDateString()}`)
}, 1000)

$("#view").click(()=>{
  $("#mySidenav").css("width", "250px")
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

$("#showCourses").click(()=>{
  $("#courseList").css("width", "50%")
  namesOfCourses()
})

$(".closeCourseList").click(()=>{
  $("#courseList").css("width", "0")
  $(".course_select").html("")
  window.api.remove("fromMain")
})

function namesOfCourses(){
  window.api.receive("fromMain", (id, data) => {
    $(".course_select").append(`<option value="${data}">${data}</option>`)
})
window.api.send("toMain", "some data")
}

$(".chosen_course").click(()=>{
 let option = $(".course_select").val()
 $(".course-details").css("width", "100%")
 $("#main").css("margin-left", "250px")
 $(".setCourseName").html(`${option}`)
})

$(".close_details").click(()=>{
  $("#course_details").css("width", "0")
})

})
