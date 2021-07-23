$(document).ready(function(){

$(".setReminderButton").click(()=>{
  let task = $(".course_name").val()
  let date = $(".date_picker").val()
  let hours = $(".hours").val()
  let minutes = $(".minutes").val()
  let seconds = $(".seconds").val()
  let valid = validate(task, date, hours, minutes, seconds)

  if(valid){
    let dateString = `${date} ${hours}:${minutes}:${seconds}`
    window.courseName.receiveCourseName("chosenCourse", (name) => {
    window.insertData.insert("data", name, task, dateString)
    $(".valid").css("color", "#76BA1B")
    $(".valid").html("task added")
  })
}

window.courseName.sendCourse("sentCourse")

})

function validate(task, date, hours, minutes, seconds){

  let currentDate  = new Date().getTime()
  let reminderDate = new Date(`${date} ${hours}:${minutes}:${seconds}`).getTime()
  let difference   = reminderDate - currentDate

  if(task.length == 0){
    $(".valid").css("color", "#B32134")
    $(".valid").html("enter name")
    $(".course_name").css("border", "1px solid #AC1F43")
    return false
  }else{
    $(".course_name").css("border", "1px solid #76BA1B")
  }

  if(date.length == 0){
    $(".valid").css("color", "#B32134")
    $(".valid").html("enter date")
    $(".date_picker").css("border", "1px solid #AC1F43")
    return false;
  }else{
    $(".date_picker").css("border", "1px solid #76BA1B")
  }

  if(hours.length == 0){
    $(".valid").css("color", "#B32134")
    $(".valid").html("enter full time")
    $(".hours").css("border",   "0.1px solid #AC1F43")
    return false;
  }
  else{
    $(".hours").css("border", "0.1px solid #76BA1B")
  }

  if(minutes.length == 0){
    $(".valid").css("color", "#B32134")
    $(".valid").html("enter full time")
    $(".minutes").css("border", "0.1px solid #AC1F43")
    return false;
  }else{
    $(".minutes").css("border", "0.1px solid #76BA1B")
  }

  if(seconds.length == 0){
    $(".valid").css("color", "#B32134")
    $(".valid").html("enter full time")
    $(".seconds").css("border", "0.1px solid #AC1F43")
    return false;
  }else{
    $(".seconds").css("border", "0.1px solid #76BA1B")
  }

  if(difference < 0 ){
    $(".valid").css("color", "#B32134")
    $(".valid").html("chosen date is behind")
    $(".date_picker").css("border", "1px solid #AC1F43")
    return false;
  }else {
    $(".date_picker").css("border", "1px solid #76BA1B")
  }

return true;
}

})
