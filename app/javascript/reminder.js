$(document).ready(function(){

  function validate(task, date, hours, minutes, seconds){

    let hour   = parseInt(hours)
    let minute = parseInt(minutes)
    let second = parseInt(seconds)

    if(hour <= 9){
      hours  = `0${hour}`
    }

    if(minute <=9){
      minutes = `0${minute}`
    }

    if(second <=9){
      seconds = `0${second}`
    }

    let currentDate  = new Date().getTime()
    let reminderDate = new Date(`${date} ${hours}:${minutes}:${seconds}`).getTime()
    let difference   = reminderDate - currentDate

    if(task.length == 0){
      $(".valid").css("color", "#B32134")
      $(".valid").html("enter name")
      $(".course_name").css("border", "1px solid #AC1F43")
      return false
    }

    else if(task.length > 26){
      $(".valid").html("Enter a maximum of 26 characters")
      $(".course_name").css("border", "1px solid #AC1F43")
      return false
    }

    else{
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
      $(".valid").html("chosen date and time are behind")
      $(".date_picker").css("border", "1px solid #AC1F43")
      return false;
    }else {
      $(".date_picker").css("border", "1px solid #76BA1B")
    }

  return true;
  }

$(".setReminderButton").click(()=>{
  let task = $(".course_name").val()
  let date = $(".date_picker").val()
  let hours = $(".hours").val()
  let minutes = $(".minutes").val()
  let seconds = $(".seconds").val()
  let valid = validate(task, date, hours, minutes, seconds)

  if(valid){
    let taskName = task.toLowerCase()
    let dateString = `${date} ${hours}:${minutes}:${seconds}`
    window.courseName.receiveCourseName("chosenCourse", (name) => {
      //create method for checking if data exists
    window.insertData.insert("data", name, taskName, dateString)
    window.insertData.status("success", (data, color)=>{
      if(color === "#76BA1B"){
        $(".modal").css("display", "block")
        $(".details").html(`<p class="response">${data}</p>`)
        $(".details").css("color", `${color}`)
      }
      else if(color === "#B32134"){
        $(".modal").css("display", "block")
        $(".details").html(`<p class="response">${data}</p>`)
        $(".details").css("color",`${color}`)
      }

    })
    })

   }

   window.courseName.sendCourse("sentCourse")

})

$(".close").click(()=>{
  $(".modal").css("display", "none")
  location.reload();
})

})
