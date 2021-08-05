$(document).ready(function(){

function validate(courseName){

  if(courseName.length == 0){
    $(".valid").html("<p>Enter course name</p>")
    $(".valid").css("color", "#B32134")
    $(".field").css("border", "1px solid #AC1F43")
    return false
  }

  else if(!/^[a-zA-Z\s]*$/.test(courseName)){
    $(".valid").html(`<p class="verify">name must contain only letters</p>`)
    $(".valid").css("color", "#B32134")
    return false
  }

  else if(courseName.length > 26){
    $(".valid").html(`<p class="verify">Enter a maximum of 26 characters</p>`)
    $(".valid").css("color", "#B32134")
    return false
  }

  else if(courseName.length < 5){
    $(".valid").html(`<p class="verify">Enter a minimum of 5 characters</p>`)
    $(".valid").css("color", "#B32134")
    return false
  }

    else{
    $(".field").css("border", "1px solid #76BA1B")
    $(".valid").html("")
    return true
  }

}

  $(".submit").click((e)=>{
    let courseName = $(".field").val()

    if(validate(courseName)){
      window.add.addCourse("addcourses", courseName)
      window.add.feedback("added", (data, color)=>{
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
    }
  })

  $(".close").click(()=>{
    $(".modal").css("display", "none")
    location.reload();
  })

})
