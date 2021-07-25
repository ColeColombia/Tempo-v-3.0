$(document).ready(function(){


function validate(courseName){

  if(courseName.length == 0){
    $(".valid").html("<p>Enter course name</p>")
    $(".valid").css("color", "#B32134")
    $(".field").css("border", "1px solid #AC1F43")
    return false
  }

  else if(/[^a-z]/i.test(courseName)){
    $(".valid").html(`<p class="verify">name must contain only letters</p>`)
    $(".valid").css("color", "#B32134")
    return false
  }

  else if(courseName.length > 18){
    $(".valid").html(`<p class="verify">Enter a maximum of 18 characters</p>`)
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
    validate(courseName)
    return false;
    //console.log();
    //window.add.addCourse("addcourses", courseName)
  })

})
