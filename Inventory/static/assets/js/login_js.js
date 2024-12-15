





// signup register action

$('.signup_save').on('click', function(event) {
    var formValid = true;
    var email = $("#email").val()

    $('.register-form').find(':input[required]').each(function () {
        if ($(this).val().trim() === '') {
            formValid = false;
            var inputName = $(this).attr('data-name');           
            $("."+inputName+"1").addClass('non-valid');
            $("."+inputName).addClass('nonvalid-alert');
            $("."+inputName).html("Please Enter "+inputName )
           
        }

        else {
            var inputName = $(this).attr('data-name'); 

            $("."+inputName+"1").removeClass('non-valid');
            $("."+inputName).removeClass('nonvalid-alert');
            $("."+inputName).html("")
            
            $("."+inputName+"1").addClass('valid');

            formValid = true;
        }
    });



if (formValid == true){
   
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var status = regex.test(email);
    if(status == false){
        $(".Email1").removeClass('valid');

        $(".Email1").addClass('non-valid');
        $(".Email").addClass('nonvalid-alert');
        $(".Email").html("Invalid Email" );

        $("#email").focus();
        formValid = false;
        return false;
    }
    if(status == true){
       
        $(".Email1").removeClass('non-valid');
        $(".Email").removeClass('nonvalid-alert');
        $(".Email").html("")
        formValid = true;
    }
}

if(formValid == true){
    
    if($('#remember-check').is(':checked')){
        formValid = true;
    } 
    else{
        $(".Password").addClass('nonvalid-alert');
        $(".Password").html("Please agree terms and conditions" );
        formValid = false;
        return false;
    }
}
if (formValid == true) {
    event.preventDefault(); 
    var form_data = new FormData($('.register-form')[0]); 
 
    var loader = document.getElementById("loader1");
        loader.style.display = "block"; 
        var loader1 = document.getElementById("loader-container1");
        loader1.style.display = "block";

    url = 'signup_action'
    $.ajax({
      type: 'POST',
      url: url,
      data: form_data,
      processData: false,
      contentType: false,
      success: function(data) {
       
        if(data['message']=="success"){
            window.location.href = "login";
            $('.register-form')[0].reset();
        }
        else if(data['message'] == "username_error"){
            $(".Username1").removeClass('valid');
            $(".Username1").addClass('non-valid');
            $(".Username").addClass('nonvalid-alert');
            $(".Username").html(' An account with the given username already exists')
        }

        else if(data['message'] == "username_capital"){
            $(".Username1").removeClass('valid');
            $(".Username1").addClass('non-valid');
            $(".Username").addClass('nonvalid-alert');
            $(".Username").html('Username doesnot contain capital letters')
        }
        
        else if(data['message'] == "email_error"){
            $(".Email1").removeClass('valid');
            $(".Email1").addClass('non-valid');
            $(".Email").addClass('nonvalid-alert');
            $(".Email").html(' An account with the given email id already exists')
        }
       
       
    },
    complete: function () {

    var loader = document.getElementById("loader1");
    loader.style.display = "none"; // Hide the loader when the page is loaded
    var loader1 = document.getElementById("loader-container1");
    loader1.style.display = "none";
    },
})
}
})



window.addEventListener("load", function () {
    const loader = document.getElementById("loader1");
    loader.style.display = "none"; // Hide the loader when the page is loaded
    const loader1 = document.getElementById("loader-container1");
    loader1.style.display = "none";

});







// Login page action




$('#login-btn').on('click', function(event) {
    var formValid = true;
    $('#LoginData').find(':input[required]').each(function () {
        if ($(this).val().trim() === '') {
        formValid = false;
        var inputName = $(this).attr('data-name');           
        $("."+inputName+"1").addClass('non-valid');
        $("."+inputName).addClass('nonvalid-alert');
        $("."+inputName).html("Please Enter "+inputName )
    }
    else {

        var inputName = $(this).attr('data-name'); 
        $("."+inputName+"1").removeClass('non-valid');
        $("."+inputName).removeClass('nonvalid-alert');
        $("."+inputName).html("")
        // $("."+inputName+"1").addClass('valid');
      }
});

   
    if (formValid == true) {
    event.preventDefault(); 
    var form_data = new FormData($('#LoginData')[0]); 

    url = 'LoginAction'
    $.ajax({
      type: 'POST',
      url: url,
      data: form_data,
      processData: false,
      contentType: false,
      success: function(data) {
  
        if(data['status'] == "Passwordwrong"){
            $(".Password1").removeClass('valid');
            $(".Password1").addClass('non-valid');
            $(".Password").addClass('nonvalid-alert');
            $(".Password").html('Incorrect Password')
        }
        if(data['status'] == "bothwrong"){

            $(".Username1").removeClass('valid');
            $(".Username1").addClass('non-valid');
            $(".Username").addClass('nonvalid-alert');
            $(".Username").html('Incorrect Username')

            $(".Password1").removeClass('valid');
            $(".Password1").addClass('non-valid');
            $(".Password").addClass('nonvalid-alert');
            $(".Password").html('Incorrect Password')

        }
        if(data['status'] == "invalid"){
            $(".Password1").removeClass('valid');
            $(".Password1").addClass('non-valid');
            $(".Password").addClass('nonvalid-alert');
            $(".Password").html('Not a company admin')

        }
        if(data['status'] == "success"){
            window.location.href = "event-home";

        }
       
        }
})
    }
})