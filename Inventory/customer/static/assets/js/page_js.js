
// settings register js

$(".register_check").click(function () {

    var val = $(this).attr("data-type")

    $.ajax({
        url: "update-settings-option",
        method: 'GET',
        data: {
            'data': val,
        },
        dataType: 'json',
        success: function (response) {

        }
    });
})


// language settings js

$(document).on('click', '.save-language', function (event) {
    var formValid = true;
    $('.language-form').find(':input[required]').each(function () {
            if ($.trim($(this).val()) === '') {
                formValid = false;
                $(".l_name1").addClass('non-valid');
                $(".l_name").addClass('nonvalid-alert');
                $(".l_name").html("Please Enter Language Name" )
            } else {
                $(".l_name1").removeClass('non-valid');
                $(".l_name").removeClass('nonvalid-alert');
                $(".l_name").html("")
            }
    })

    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.language-form')[0]);
        var url = 'language_add_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "lang_exist") {
                    $(".l_name1").addClass('non-valid');
                    $(".l_name").addClass('nonvalid-alert');
                    $(".l_name").html("Language Already Exist" )
                }  else if (data['message'] == "error") {
                    $('#new-language').modal('hide');
                    // alert("something went wrong")
                    // $(".error_msg_alert").show()
                    // $(".error-txt").text(data['alert_msg'])
                } else if (data['message'] == "success") {

                    $('#new-language').modal('hide');
                    $('#language-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])

                    $.ajax({
                        url: 'append_language_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_language_list").empty().append(response)
                        }
                    })
                }
            },
            // complete: function () {
            //     setTimeout(function () {
            //         $('.success_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 3000);
            //     setTimeout(function () {
            //         $('.error_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 2000);
            // },
            // error: function (xhr, textStatus, errorThrown) {
            // }
        });

    }
})




// language edit js


$(document).on('click', '.lang_edit', function (event) {
    var id = $(this).attr("data-id")
    var url = "lang_edit_modal";
    $.ajax({
        url: url,
        data: {
            'id': id,
            
        },
        success: function (data) {
            $("#lang_edit_div").html(data);
            $('#lang_edit_Modal').modal('show');
        }
    });
})




    $(document).on('change', '.update_check', function(event) { 
    form_updated_status = 0
    const formFields = document.querySelectorAll(".update_check");
      // Add event listeners to the form fields
      formFields.forEach(field => {
    if (field.tagName === 'SELECT') {
      // Use the appropriate event for the select2 library (e.g., select2:select)
      $(field).on('select2:select select2:unselect', fieldUpdated);
    } 
    else if (field.tagName === 'TEXTAREA') {
      field.addEventListener("input", fieldUpdated);
    }
    else {
      field.addEventListener("change", fieldUpdated);
    }
  });
      function fieldUpdated(event) {
        const field = event.target;
        if (field.value) {
          form_updated_status = 1
           status_nav = "true"
           $("#status_nav").val("True")
        } else {
          form_updated_status = 0
          status_nav = "false"
        }
      }
    })
    
    
    $(document).on('click', '.update_check', function(event) { 
    form_updated_status = 0
    const formFields = document.querySelectorAll(".update_check");
      formFields.forEach(field => {
      field.addEventListener("change", fieldUpdated);
      });
      function fieldUpdated(event) {
        const field = event.target;
        if (field.value) {
           
          form_updated_status = 1
           status_nav = "true"
           $("#status_nav").val("True")
          console.log(`${field.name} field has been updated`);
        } else {
          form_updated_status = 0
          status_nav = "false"
          console.log(`${field.name} field has been cleared`);
        }
      }
    })
    




$(document).on('click', '.update-language', function (event) {
   
    var formValid = true;
    $('.language-edit-form').find(':input[required]').each(function () {
            if ($.trim($(this).val()) === '') {
                formValid = false;
                $(".l_namee1").addClass('non-valid');
                $(".l_namee").addClass('nonvalid-alert');
                $(".l_namee").html("Please Enter Language Name" )
            } else {
                $(".l_namee1").removeClass('non-valid');
                $(".l_namee").removeClass('nonvalid-alert');
                $(".l_namee").html("")
            }
    })

    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.language-edit-form')[0]);
        var url = 'language_edit_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "lang_exist") {
                    $(".l_namee1").addClass('non-valid');
                    $(".l_namee").addClass('nonvalid-alert');
                    $(".l_namee").html("Language Already Exist" )
                }  else if (data['message'] == "error") {
                    $('#lang_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Something Went Wrong'
                    });
                } 
                else if(data['message']=="no_updates"){

                    $('#lang_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'No Updates'
                    });
                        
                }
                
                else if (data['message'] == "success") {

                    $('#lang_edit_Modal').modal('hide');
                    $('#language-edit-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });

                    $.ajax({
                        url: 'append_language_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_language_list").empty().append(response)
                        }
                    })
                }
            },

        });

    }
})

// next
// category settings js

    $(document).on('click', '.save-category', function (event) {

        var formValid = true;
        $('.category-form').find(':input[required]').each(function () {
            if ($.trim($(this).val()) === '') {
                formValid = false;
                $(".c_name1").addClass('non-valid');
                $(".c_name").addClass('nonvalid-alert');
                $(".c_name").html("Please Enter Category Name")
            } else {
                $(".c_name1").removeClass('non-valid');
                $(".c_name").removeClass('nonvalid-alert');
                $(".c_name").html("")
            }
        })

    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.category-form')[0]);
        var url = 'category_add_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "cat_exist") {
                    $(".c_name1").addClass('non-valid');
                    $(".c_name").addClass('nonvalid-alert');
                    $(".c_name").html("Category Already Exist" )
                }  else if (data['message'] == "error") {
                    $('#new-category').modal('hide');
                    // alert("something went wrong")
                    // $(".error_msg_alert").show()
                    // $(".error-txt").text(data['alert_msg'])
                } else if (data['message'] == "success") {

                    $('#new-category').modal('hide');
                    $('#category-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])

                    $.ajax({
                        url: 'append_category_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_category_list").empty().append(response)
                        }
                    })
                }
            },
            // complete: function () {
            //     setTimeout(function () {
            //         $('.success_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 3000);
            //     setTimeout(function () {
            //         $('.error_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 2000);
            // },
            // error: function (xhr, textStatus, errorThrown) {
            // }
        });

    }
})

// category edit js
$(document).on('click', '.cat_edit', function (event) {
    var id = $(this).attr("data-id")
    var url = "cat_edit_modal";
    $.ajax({
        url: url,
        data: {
            'id': id,
            
        },
        success: function (data) {
            $("#cat_edit_div").html(data);
            $('#cat_edit_Modal').modal('show');
        }
    });
})

$(document).on('click', '.update-category', function (event) {
    var formValid = true;
    $('.category-edit-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".c_namee1").addClass('non-valid');
            $(".c_namee").addClass('nonvalid-alert');
            $(".c_namee").html("Please Enter Category Name")
        } else {
            $(".c_namee1").removeClass('non-valid');
            $(".c_namee").removeClass('nonvalid-alert');
            $(".c_namee").html("")
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.category-edit-form')[0]);
        var url = 'category_edit_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "cat_exist") {
                    $(".c_namee1").addClass('non-valid');
                    $(".c_namee").addClass('nonvalid-alert');
                    $(".c_namee").html("Category Already Exist")
                } 
                 else if (data['message'] == "error") {
                    $('#cat_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: data['alert_msg']
                    });
                } else if (data['message'] == "success") {

                    $('#cat_edit_Modal').modal('hide');
                    $('#category-edit-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    $.ajax({
                        url: 'append_category_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_category_list").empty().append(response)
                        }
                    })
                }
            },
        });
    }
})


// next
// sponsor settings js

$(document).on('click', '.save-sponsor', function (event) {
    var formValid = true;
    $('.sponsor-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".s_name1").addClass('non-valid');
            $(".s_name").addClass('nonvalid-alert');
            $(".s_name").html("Please Enter sponsor Name")
        } else {
            $(".s_name1").removeClass('non-valid');
            $(".s_name").removeClass('nonvalid-alert');
            $(".s_name").html("")
            
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.sponsor-form')[0]);
        var url = 'sponsor_add_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data['message'] == "spon_exist") {
                    $(".s_name1").addClass('non-valid');
                    $(".s_name").addClass('nonvalid-alert');
                    $(".s_name").html("sponsor Already Exist")
                } else if (data['message'] == "error") {
                    $('#new-sponsor').modal('hide');
                    // alert("something went wrong")
                    // $(".error_msg_alert").show()
                    // $(".error-txt").text(data['alert_msg'])
                } else if (data['message'] == "success") {

                    $('#new-sponsor').modal('hide');
                    $('#sponsor-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])

                    $.ajax({
                        url: 'append_sponsor_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_sponsor_list").empty().append(response)
                        }
                    })
                }
            },
            // complete: function () {
            //     setTimeout(function () {
            //         $('.success_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 3000);
            //     setTimeout(function () {
            //         $('.error_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 2000);
            // },
            // error: function (xhr, textStatus, errorThrown) {
            // }
        });
    }
})

// sponsor edit js
$(document).on('click', '.spon_edit', function (event) {
    var id = $(this).attr("data-id")
    var url = "spon_edit_modal";
    $.ajax({
        url: url,
        data: {
            'id': id,
            'page_type': 'list'
        },
        success: function (data) {
            $("#spon_edit_div").html(data);
            $('#spon_edit_Modal').modal('show');
        }
    });
})

$(document).on('click', '.update-sponsor', function (event) {
    var formValid = true;
    $('sponsor-edit-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".s_namee1").addClass('non-valid');
            $(".s_namee").addClass('nonvalid-alert');
            $(".s_namee").html("Please Enter sponsor Name")
        } else {
            $(".s_namee1").removeClass('non-valid');
            $(".s_namee").removeClass('nonvalid-alert');
            $(".s_namee").html("")
            
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.sponsor-edit-form')[0]);
        var url = 'sponsor_edit_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "spon_exist") {
                    $(".s_namee1").addClass('non-valid');
                    $(".s_namee").addClass('nonvalid-alert');
                    $(".s_namee").html("sponsor Already Exist")
                } else if (data['message'] == "error") {
                    $('#spon_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: data['alert_msg']
                    });
                } else if (data['message'] == "success") {
                    $('#spon_edit_Modal').modal('hide');
                    $('#sponsor-edit-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])
                    $.ajax({
                        url: 'append_sponsor_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_sponsor_list").empty().append(response)
                        }
                    })
                }
            },
        });
    }
})






// next
// speaker settings js

$(document).on('click', '.save-speaker', function (event) {
    var formValid = true;
    $('.speaker-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".sp_name1").addClass('non-valid');
            $(".sp_name").addClass('nonvalid-alert');
            $(".sp_name").html("Please Enter speaker Name")
        } else {
            $(".sp_name1").removeClass('non-valid');
            $(".sp_name").removeClass('nonvalid-alert');
            $(".sp_name").html("")
            
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.speaker-form')[0]);
        var url = 'speaker_add_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data['message'] == "speak_exist") {
                    $(".sp_name1").addClass('non-valid');
                    $(".sp_name").addClass('nonvalid-alert');
                    $(".sp_name").html("speaker Already Exist")
                } else if (data['message'] == "error") {
                    $('#new-speaker').modal('hide');
                    // alert("something went wrong")
                    // $(".error_msg_alert").show()
                    // $(".error-txt").text(data['alert_msg'])
                } else if (data['message'] == "success") {

                    $('#new-speaker').modal('hide');
                    $('#speaker-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])

                    $.ajax({
                        url: 'append_speaker_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_speaker_list").empty().append(response)
                        }
                    })
                }
            },
            // complete: function () {
            //     setTimeout(function () {
            //         $('.success_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 3000);
            //     setTimeout(function () {
            //         $('.error_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 2000);
            // },
            // error: function (xhr, textStatus, errorThrown) {
            // }
        });
    }
})

// speaker edit js
$(document).on('click', '.speak_edit', function (event) {
    var id = $(this).attr("data-id")
    var url = "speak_edit_modal";
    $.ajax({
        url: url,
        data: {
            'id': id,
            'page_type': 'list'
        },
        success: function (data) {
            $("#speak_edit_div").html(data);
            $('#speak_edit_Modal').modal('show');
        }
    });
})

$(document).on('click', '.update-speaker', function (event) {
    var formValid = true;
    $('speaker-edit-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".sp_namee1").addClass('non-valid');
            $(".sp_namee").addClass('nonvalid-alert');
            $(".sp_namee").html("Please Enter speaker Name")
        } else {
            $(".sp_namee1").removeClass('non-valid');
            $(".sp_namee").removeClass('nonvalid-alert');
            $(".sp_namee").html("") 
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.speaker-edit-form')[0]);
        var url = 'speaker_edit_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data['message'] == "speak_exist") {
                    $(".sp_namee1").addClass('non-valid');
                    $(".sp_namee").addClass('nonvalid-alert');
                    $(".sp_namee").html("speaker Already Exist")
                } else if (data['message'] == "error") {
                    $('#speak_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: data['alert_msg']
                    });
                } else if (data['message'] == "success") {
                    $('#speak_edit_Modal').modal('hide');
                    $('#speaker-edit-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                   
                    $.ajax({
                        url: 'append_speaker_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_speaker_list").empty().append(response)
                        }
                    })
                }
            },
        });
    }
})




// role_management


$(document).on('click', '#event_view_all', function(event) {
    var status =  $(this).is(":checked")
    if (status == true){
        document.getElementById("event_read").checked = true;
    }
    else{
        document.getElementById("event_read").checked = false;
    } 
})

    $(document).on('click', '#event_manage_all', function(event) {
    var status =  $(this).is(":checked")
   if(status == true){
    document.getElementById("event_read").checked = true;
    document.getElementById("event_write").checked = true;
    document.getElementById("event_edit").checked = true;
    document.getElementById("event_delete").checked = true;
    document.getElementById("event_view_all").checked = true;
    document.getElementById("event_manage_all").checked = true;

   }
   else{
    document.getElementById("event_read").checked = false;
    document.getElementById("event_write").checked = false;
    document.getElementById("event_edit").checked = false;
    document.getElementById("event_delete").checked = false;
    document.getElementById("event_view_all").checked = false;
    document.getElementById("event_manage_all").checked = false;
   }
})


$(document).on('click', '#user_view_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#user_read').prop('checked', true);
    } else {
      $('#user_read').prop('checked', false);
    }
  });
  
  $(document).on('click', '#user_manage_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#user_read').prop('checked', true);
      $('#user_write').prop('checked', true);
      $('#user_edit').prop('checked', true);
      $('#user_delete').prop('checked', true);
      $('#user_view_all').prop('checked', true);
      $('#user_manage_all').prop('checked', true);
    } else {
      $('#user_read').prop('checked', false);
      $('#user_write').prop('checked', false);
      $('#user_edit').prop('checked', false);
      $('#user_delete').prop('checked', false);
      $('#user_view_all').prop('checked', false);
      $('#user_manage_all').prop('checked', false);
    }
  });
  $(document).on('click', '#role_view_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#role_read').prop('checked', true);
    } else {
      $('#role_read').prop('checked', false);
    }
  });
  
  $(document).on('click', '#role_manage_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#role_read').prop('checked', true);
      $('#role_write').prop('checked', true);
      $('#role_edit').prop('checked', true);
      $('#role_delete').prop('checked', true);
      $('#role_view_all').prop('checked', true);
      $('#role_manage_all').prop('checked', true);
    } else {
      $('#role_read').prop('checked', false);
      $('#role_write').prop('checked', false);
      $('#role_edit').prop('checked', false);
      $('#role_delete').prop('checked', false);
      $('#role_view_all').prop('checked', false);
      $('#role_manage_all').prop('checked', false);
    }
  });

  $(document).on('click', '#confi_view_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#confi_read').prop('checked', true);
    } else {
      $('#confi_read').prop('checked', false);
    }
  });
  
  $(document).on('click', '#confi_manage_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#confi_read').prop('checked', true);
      $('#confi_write').prop('checked', true);
      $('#confi_edit').prop('checked', true);
      $('#confi_delete').prop('checked', true);
      $('#confi_view_all').prop('checked', true);
      $('#confi_manage_all').prop('checked', true);
    } else {
      $('#confi_read').prop('checked', false);
      $('#confi_write').prop('checked', false);
      $('#confi_edit').prop('checked', false);
      $('#confi_delete').prop('checked', false);
      $('#confi_view_all').prop('checked', false);
      $('#confi_manage_all').prop('checked', false);
    }
  });
  $(document).on('click', '#reg_view_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#reg_read').prop('checked', true);
    } else {
      $('#reg_read').prop('checked', false);
    }
  });
  
  $(document).on('click', '#reg_manage_all', function(event) {
    var status = $(this).is(":checked");
    if (status === true) {
      $('#reg_read').prop('checked', true);
      $('#reg_write').prop('checked', true);
      $('#reg_edit').prop('checked', true);
      $('#reg_delete').prop('checked', true);
      $('#reg_view_all').prop('checked', true);
      $('#reg_manage_all').prop('checked', true);
    } else {
      $('#reg_read').prop('checked', false);
      $('#reg_write').prop('checked', false);
      $('#reg_edit').prop('checked', false);
      $('#reg_delete').prop('checked', false);
      $('#reg_view_all').prop('checked', false);
      $('#reg_manage_all').prop('checked', false);
    }
  });




// next

// role settings js

$(document).on('click', '.save-role', function (event) {
    var formValid = true;
    $('.role-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".r_name1").addClass('non-valid');
            $(".r_name").addClass('nonvalid-alert');
            $(".r_name").html("Please Enter Role Name" )
        } else {
            $(".r_name1").removeClass('non-valid');
            $(".r_name").removeClass('nonvalid-alert');
            $(".r_name").html("")
            
        }
    })

    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.role-form')[0]);
        var url = 'role_add_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "role_exist") {
                    $(".r_name1").addClass('non-valid');
                    $(".r_name").addClass('nonvalid-alert');
                    $(".r_name").html("Role Already Exist" )
                }  else if (data['message'] == "error") {
                    $('#new-role').modal('hide');
                    // alert("something went wrong")
                    // $(".error_msg_alert").show()
                    // $(".error-txt").text(data['alert_msg'])
                } else if (data['message'] == "success") {

                    $('#new-role').modal('hide');
                    $('#role-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    // alert("Success")
                    // $(".success_msg_alert").show()
                    // $(".success-txt").text(data['alert_msg'])

                    $.ajax({
                        url: 'append_role_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_role_list").empty().append(response)
                        }
                    })
                }
            },
            // complete: function () {
            //     setTimeout(function () {
            //         $('.success_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 3000);
            //     setTimeout(function () {
            //         $('.error_msg_alert').attr("style",
            //             "display: none!important");
            //     }, 2000);
            // },
            // error: function (xhr, textStatus, errorThrown) {
            // }
        });

    }
})

// category edit js
$(document).on('click', '.role_edit', function (event) {
    var id = $(this).attr("data-id")
    var url = "role_edit_modal";
    $.ajax({
        url: url,
        data: {
            'id': id,
            
        },
        success: function (data) {
            $("#role_edit_div").html(data);
            $('#role_edit_Modal').modal('show');
        }
    });
})

$(document).on('click', '.update-role', function (event) {
    var formValid = true;
    $('.role-edit-form').find(':input[required]').each(function () {
        if ($.trim($(this).val()) === '') {
            formValid = false;
            $(".r_namee1").addClass('non-valid');
            $(".r_namee").addClass('nonvalid-alert');
            $(".r_namee").html("Please Enter Role Name")
        } else {
            $(".r_namee1").removeClass('non-valid');
            $(".r_namee").removeClass('nonvalid-alert');
            $(".r_namee").html("")
            
        }
    })
    if (formValid == true) {
        event.preventDefault();
        var form_data = new FormData($('.role-edit-form')[0]);
        var url = 'edit_role_action';
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data['message'] == "role_exist") {
                    $(".c_namee1").addClass('non-valid');
                    $(".c_namee").addClass('nonvalid-alert');
                    $(".c_namee").html("Role Already Exist")
                } else if (data['message'] == "error") {
                    $('#role_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Something went wrong'
                    });
                }  else if(data['message']=="no_updates"){

                    $('#role_edit_Modal').modal('hide');
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'No Updates'
                    });
                        
                }
                else if (data['message'] == "success") {

                    $('#role_edit_Modal').modal('hide');
                    $('#role-edit-form')[0].reset();
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Success'
                    });
                    

                    $.ajax({
                        url: 'append_role_list',
                        type: 'GET',
                        data: {

                        },
                        success: function (response) {
                            $(".append_role_list").empty().append(response)
                        }
                    })
                }
            },
        });
    }
})
    
$(document).on('click', '.agenda_click', function (event) {
    var event = $(".select1").val();
    if ($(".agenda_click").is(":checked") == true) {

        if (event.length == 0) {
            var toastMixin = Swal.mixin({
                toast: true,
                icon: 'error',
                title: 'General Title',
                animation: false,
                position: 'top-right',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            toastMixin.fire({
                animation: true,
                title: 'please choose access event'
            });
            
            $(".agenda_click").prop("checked", false);
        } else {
            $.ajax({
                url: 'dependent_agenda',
                data: {
                    'event[]': event
                },
                success: function (data) {
                    $(".append_agenda").html(data);
                }
            });
            $(".show_agenda_div").show()
        }

    } else {
        $(".show_agenda_div").hide()
    }

})


$(document).on('click', '.front_desk_click', function (event) {

    if ($(".front_desk_click").is(":checked") == true) {
        $(".front_desk_show").show()
    } else {
        $(".front_desk_show").hide()
    }

})



// user


function password_enable_btn(){
    $(".password_manual_id").show()

}

function password_disable_btn(){
    $(".password_manual_id").hide()

}


    
$(document).on('click', '#change_yes', function (event) {

    $("#password4").show()
})

$(document).on('click', '#change_no', function (event) {
    $("#password4").hide()
})


    $(document).on('change', '.select1', function (event) {
        var event = $(this).val();
        $.ajax({
            url: 'dependent_agenda',
            data: {
                'event': event
            },
            success: function (data) {
                $(".append_agenda").html(data);
            }
        });
    });
  


    
    $(document).on('click', '.user_edit', function (event) {
        var id = $(this).attr("data-id")
        var url = "user_edit_modal";
        $.ajax({
            url: url,
            data: {
                'id': id,
                
            },
            success: function (data) {
                $("#user_edit_div").html(data);
                $('#user_edit_Modal').modal('show');
            }
        });
    })

    
    $(document).on('click', '.user_update', function (event) {    
    var formValid = true;
    var email = $("#email1").val()
    $('.user-edit-form').find(':input[required]').each(function () {
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
            formValid = false;
            return false;
        }
        if(status == true){
            $(".Email1").removeClass('non-valid');
            $(".Email").removeClass('nonvalid-alert');
            $(".Email").html("")
            formValid = true;
        }
        var phone = $(".Phone1").val();
        if (phone.length < 9) {
            $(".Phone1").removeClass('valid');
            $(".Phone1").addClass('non-valid');
            $(".Phone").addClass('nonvalid-alert');
            $(".Phone").html("Phone number should contain at least 9 numbers" );
            formValid = false;
            return false;
        } else {
            $(".Phone1").removeClass('non-valid');
            $(".Phone").removeClass('nonvalid-alert');
            $(".Phone").html("")
            formValid = true;
        }
    }
    
    if (formValid == true) {
        event.preventDefault(); 
        var form_data = new FormData($('.user-edit-form')[0]); 
        url = 'edit_user_action'
        $.ajax({
          type: 'POST',
          url: url,
          data: form_data,
          processData: false,
          contentType: false,
          success: function(data) {
            if(data['message']=="success"){
               
                $('#user_edit_Modal').modal('hide');
                $('.user-edit-form')[0].reset();
                var toastMixin = Swal.mixin({
                    toast: true,
                    icon: 'success',
                    title: 'General Title',
                    animation: false,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                toastMixin.fire({
                    animation: true,
                    title: 'Success'
                });

                $.ajax({
                    url: 'append_user_list',
                    type: 'GET',
                    data: {

                    },
                    success: function (response) {
                        $(".append_user_list").empty().append(response)
                    }
                })
            }
            else if(data['message'] == "username_exist"){
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
                var toastMixin = Swal.mixin({
                    toast: true,
                    icon: 'error',
                    title: 'General Title',
                    animation: false,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                toastMixin.fire({
                    animation: true,
                    title: 'Username doesnot contain capital letters'
                });
            }
            
            else if(data['message'] == "email_error"){
                $(".Email1").removeClass('valid');
                $(".Email1").addClass('non-valid');
                $(".Email").addClass('nonvalid-alert');
                $(".Email").html(' An account with the given email id already exists')
                var toastMixin = Swal.mixin({
                    toast: true,
                    icon: 'error',
                    title: 'General Title',
                    animation: false,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                toastMixin.fire({
                    animation: true,
                    title: 'An account with the given email id already exists'
                });
            }
            else if(data['message']=="no_updates"){
               
                $('#user_edit_Modal').modal('hide');
                $('.user-edit-form')[0].reset();
                var toastMixin = Swal.mixin({
                    toast: true,
                    icon: 'error',
                    title: 'General Title',
                    animation: false,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                toastMixin.fire({
                    animation: true,
                    title: 'No Updates'
                });

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


    $(document).on('click', '.staff_checkin_click', function (event) {
        event.preventDefault();
        var unique_id = $(".unique_id").val();
        var event_id = $(".event_id").val();
        var action = $(".action").val();
        var pages = $(".pages").val();
        $.ajax({
            url: 'update_register_user_details',
            data: {
                'event_id': event_id,
                'unique_id': unique_id,
                "action": action,
                "pages": pages
            },
            success: function (data) {
                if (data['message'] == "success") {

                    $('#alert-msg').modal('hide');
                    $(".unique_id").val('')
                    $(".success_msg_alert").show()
                    if (data['action'] == "checkin") {
                        $(".success-txt").text("Your are successfully checked in.")
                    } else if (data['action'] == "checkout") {
                        $(".success-txt").text("Your are successfully checked out.")
                    }
                }
                if (data['message'] == "already_checkin") {
                    $('#alert-msg').modal('hide');
                    
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Sorry you already checked in'
                    });

                }
                if (data['message'] == "already_checkout") {
                    $('#alert-msg').modal('hide');
                   
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Sorry you already checked out'
                    });
                }
                if (data['message'] == "not_checkin") {
                    $('#alert-msg').modal('hide');
                    
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'You are not checked in'
                    });
                }
                if (data['message'] == "not_badge") {
                    $('#alert-msg').modal('hide');
                    
                    var toastMixin = Swal.mixin({
                        toast: true,
                        icon: 'error',
                        title: 'General Title',
                        animation: false,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    toastMixin.fire({
                        animation: true,
                        title: 'Sorry your badge is not issued'
                    });
                }
                
            },
            complete: function () {
                setTimeout(function () {
                    $('.success_msg_alert').attr("style",
                        "display: none!important");
                }, 3000);
                setTimeout(function () {
                    $('.error_msg_alert').attr("style",
                        "display: none!important");
                }, 2000);
            },
        });
    });




    function print_badge_action(event_id,unique_id,status,fname,cname,qrcode) {
        
        $(".event_id").val(event_id)
        $(".unique_id").val(unique_id)
        $(".status").val(status)
        $(".qrcode").val(qrcode)
        document.getElementById('badge_name').innerText = fname
        $("#badge_companyname").text(cname)
        $("#badge_ticket").text(unique_id)
        var imgs = 'media/'+qrcode
        $("#badge_qrcode img").attr("src", imgs);
        $("#badge-modal").modal("show", {
            backdrop: "static"
          });
        printDiv()
        }

    function check_action_attendee(status,ag_id,reg_user_id,event_id) {
        if (ag_id == "event") {
            $(".pages").val("event")
        } else {
            $(".pages").val(ag_id)
        }
        $(".action").val(status)
        $(".event_id").val(event_id)
        $(".unique_id").val(reg_user_id)
        if (status === 'checkin') {
            $(".text-center").text("Are you sure you want to check In ?");
        } else if (status === 'checkout') {
            $(".text-center").text("Are you sure you want to check Out ?");
        }
        $("#alert-msg").modal("show")
        }


      function check_action(status,ag_id) {
        if (ag_id == "event") {
            $(".pages").val("event")
        } else {
            $(".pages").val(ag_id)
        }
        $(".action").val(status)
        if (status === 'checkin') {
            $(".text-center").text("Are you sure you want to check In ?");
        } else if (status === 'checkout') {
            $(".text-center").text("Are you sure you want to check Out ?");
        }
        $("#scan-modal").modal("hide")
        $("#alert-msg").modal("show")
        }


        $(document).on('click', '.change_password', function (event) {
            event.preventDefault();
            var formValid = true;
            $('.password-form').find(':input[required]').each(function () {
                if ($(this).val().trim() === '') {
                    formValid = false;
                    var inputName = $(this).attr('data-name');
                    $("." + inputName + "1").addClass('non-valid');
                    $("." + inputName).addClass('nonvalid-alert');
                    $("." + inputName).html("Please Enter " + inputName)
                } else {
                    var inputName = $(this).attr('data-name');
                    $("." + inputName + "1").removeClass('non-valid');
                    $("." + inputName).removeClass('nonvalid-alert');
                    $("." + inputName).html("")
                }
            });

            if (formValid == true) {
                var password2 = $("#password3").val();
                var password1 = $("#password2").val();
                if (password1 !== password2) {
                    $('#message_new').html('Not Matching').css('color', 'red');
                    formValid = false;
                } else {
                  
                    $("#message_new").html('');
                }
            }
            if (formValid == true) {
                $("#message_new").html('');
                event.preventDefault();
                var form_data = new FormData($('.password-form')[0]);
                url = 'change_password_action'
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: form_data,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data['message'] == "success") {
                            window.location.href = "login";
                        }
                    }
                })
            }
        })

        function close_attendee(){
            var modal = document.getElementById("add-attandee");
            var form = modal.querySelector(".form-user");
            form.reset();
        }

        const createRegisterUserForm = document.getElementById("createRegisterUserForm")

        $(document).on('click', '.save_attendee', function (event) {
            event.preventDefault();

            const fNameClear = createRegisterUserForm.querySelector('#formCheck1')
            const emailClear = createRegisterUserForm.querySelector('#formCheck2')
            const mobileClear = createRegisterUserForm.querySelector('#formCheck3')
            const companyClear = createRegisterUserForm.querySelector('#formCheck4')
            const departmentClear = createRegisterUserForm.querySelector('#formCheck5')
            const cityClear = createRegisterUserForm.querySelector('#formCheck6')
            const countryClear = createRegisterUserForm.querySelector('#formCheck7')
            var formValid = true;
            var email = $("#email").val()
            var event_id = $("#event_id").val()
            var attendee_page = $("#attendee_page").val()
            $('.form-user').find(':input[required]').each(function () {
                if ($(this).val().trim() === '') {
                    formValid = false;
                    var inputName = $(this).attr('data-name');
                    $("." + inputName + "1").addClass('non-valid');
                    $("." + inputName).addClass('nonvalid-alert');
                    $("." + inputName).html("Please Enter " + inputName)
                } else {
                    var inputName = $(this).attr('data-name');
                    $("." + inputName + "1").removeClass('non-valid');
                    $("." + inputName).removeClass('nonvalid-alert');
                    $("." + inputName).html("")
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
                    formValid = false;
                    return false;
                }
                if(status == true){
                    $(".Email1").removeClass('non-valid');
                    $(".Email").removeClass('nonvalid-alert');
                    $(".Email").html("")
                    formValid = true;
                }

                var phone = $(".Mobile1").val();
                if (phone.length < 8) {
                    $(".Mobile1").removeClass('valid');
                    $(".Mobile1").addClass('non-valid');
                    $(".Mobile").addClass('nonvalid-alert');
                    $(".Mobile").html("Phone number should contain at least 9 numbers" );
                    formValid = false;
                    return false;
                } else {
                    $(".Mobile1").removeClass('non-valid');
                    $(".Mobile").removeClass('nonvalid-alert');
                    $(".Mobile").html("")
                    formValid = true;
                }
                    }

            if (formValid == true) {
                var form_data = new FormData($('.form-user')[0]);
                $.ajax({
                    type: 'POST',
                    url: "register-user-add-action",
                    data: form_data,
                    processData: false,
                    contentType: false,
                    success: function(data)
                    {
                        status = data['status']
                        message = data['message']
                        unique_id = data['unique_id']
                        event_id = data['event_id']
                        fname = data['fname']
                        cname = data['cname']
                        qrcode = data['qrcode']
                        if(status == "success"){
    
                            var toastMixin = Swal.mixin({
                            toast: true,
                            icon: status,
                            title: 'General Title',
                            animation: false,
                            position: 'top-right',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                            });
                            toastMixin.fire({
                            animation: true,
                            title: message
                            });
                            $(".event_id").val(event_id)
                            $(".unique_id").val(unique_id)

                            document.getElementById('badge_name').innerText = fname
                            $("#badge_companyname").text(cname)
                            $("#badge_ticket").text(unique_id)
                            var imgs = 'media/'+qrcode
                            $("#badge_qrcode img").attr("src", imgs);
                            $('#badge-modal2').modal('show');

                            if (!fNameClear.checked) {
                                createRegisterUserForm.querySelector('.Name1').value = ''
                              }
                              if (!emailClear.checked) {
                                createRegisterUserForm.querySelector('.Email1').value = ''
                              }
                           
                              if (!mobileClear.checked) {
                                createRegisterUserForm.querySelector('.Mobile1').value = ''
                              }
                              if (!companyClear.checked) {
                                createRegisterUserForm.querySelector('.Company-name1').value = ''
                              }
                              if (!departmentClear.checked) {
                                createRegisterUserForm.querySelector('.Department1').value = ''
                              }
                              if (!cityClear.checked) {
                                createRegisterUserForm.querySelector('.City1').value = ''
                              }
                              if (!countryClear.checked) {
                                createRegisterUserForm.querySelector('.Country1').value = ''
                              }

                            //   append code
                            if(attendee_page == "card"){
                            url =  'append_attendee_card'
                            }
                            else if(attendee_page == "list"){
                                url = 'append_attendee_list'
                            }
                            $.ajax({
                                url: url,
                                type: 'GET',
                                data: {

                                    "event_id":event_id
                                },
                                success: function (response) {

                                    if(attendee_page == "card"){
                                        $("#append_attendee_card_view1").empty().append(response)
                                    }
                                    else if(attendee_page == "list"){
                                        $(".append_attendee_list_view").empty().append(response)
                                    }
                                }
                            })


                        }
                        else{
                            message = data['message']
                            if(data['field'] == "name"){
                                $(".Name1").removeClass('valid');
                                $(".Name1").addClass('non-valid');
                                $(".Name").addClass('nonvalid-alert');
                                $(".Name").html(message)
                            }
    
                            else if(data['field'] == "email"){
                                $(".Email1").removeClass('valid');
                                $(".Email1").addClass('non-valid');
                                $(".Email").addClass('nonvalid-alert');
                                $(".Email").html(message)
                            }
    
                            else if(data['field'] == "mobile"){
                                $(".Mobile1").removeClass('valid');
                                $(".Mobile1").addClass('non-valid');
                                $(".Mobile").addClass('nonvalid-alert');
                                $(".Mobile").html(message)
                            }
    
    
                            else if(data['field'] == "company"){
                                $(".Company-name1").removeClass('valid');
                                $(".Company-name1").addClass('non-valid');
                                $(".Company-name").addClass('nonvalid-alert');
                                $(".Company-name").html(message)
                            }
                        }
                    },
                })
            }
        })
    

    function update_badge(badge_type) {
        var unique_id = $(".unique_id").val();
        event_id = $(".event_id").val();
        qrcode = $(".qrcode").val();
        $.ajax({
            url: 'update_badge_issue',
            data: {
                'event_id': event_id,
                'unique_id': unique_id,
                "badge_type": badge_type
            },
            success: function (data) {
                cname = data['cname']
                fname = data['fname']
                b_dt = data['b_dt']
              if (data['message'] == "success") {
                $(".append_button"+unique_id).hide()
                $(".print"+unique_id).hide()
                $(".reprint"+unique_id).show()
                // document.getElementById("reprint"+unique_id).style.display = "none";

                $("#badge-modal").modal("hide")
                
                $(".badge-dt").empty().append(` `+b_dt+` `)
                  var toastMixin = Swal.mixin({
                      toast: true,
                      icon: 'success',
                      title: 'General Title',
                      animation: false,
                      position: 'top-right',
                      showConfirmButton: false,
                      timer: 1000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                      }
                  });
                  toastMixin.fire({
                      animation: true,
                      title: 'Badge Issued Successfully'
                  });
              }

              else if (data['message'] == "badge_not_issued") {
                $(".append_button"+unique_id).hide()
                $(".reprint"+unique_id).hide()
                $(".print"+unique_id).show()
                // $(".append_button"+unique_id).empty().append(`
                // <button type="button" style="margin-left: 50px;"   onclick="print_badge_action(${event_id},${unique_id},'print',${fname},${cname},${qrcode})" class="tick-box me-2">Print</button>

                // `)
                $("#badge-modal").modal("hide")
                
                var toastMixin = Swal.mixin({
                  toast: true,
                  icon: 'success',
                  title: 'General Title',
                  animation: false,
                  position: 'top-right',
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              });
              toastMixin.fire({
                  animation: true,
                  title: 'Badge Not Issued '
              });
            }
          }
        })
    }


    function SendEmail() {
        $(this).prop('disabled', true);
        document.getElementById("preloader2").style.display = "block";
        // $(".loader-mask").show();
        var unique_id = $(".unique_id").val();
        event_id = $(".event_id").val();
        $.ajax({
            url: 'send_email_attendee',
            data: {
                'event_id': event_id,
                'unique_id': unique_id,
            },
            success: function (data) {

                if (data['message'] == "success") {
                
                      var toastMixin = Swal.mixin({
                          toast: true,
                          icon: 'success',
                          title: 'General Title',
                          animation: false,
                          position: 'top-right',
                          showConfirmButton: false,
                          timer: 1000,
                          timerProgressBar: true,
                          didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                          }
                      });
                      toastMixin.fire({
                          animation: true,
                          title: 'Email Send Successfully'
                      });
                  }
                  document.getElementById("preloader2").style.display = "none";
                //   $(".loader-mask").hide();
            }
        })
    }

    function update_badge2(badge_type) {
        var unique_id = $(".unique_id").val();
        event_id = $(".event_id").val();
        $.ajax({
            url: 'update_badge_issue',
            data: {
                'event_id': event_id,
                'unique_id': unique_id,
                "badge_type": badge_type
            },
            success: function (data) {
             
              if (data['message'] == "success") {
                
                $("#badge-modal2").modal("hide")
                  var toastMixin = Swal.mixin({
                      toast: true,
                      icon: 'success',
                      title: 'General Title',
                      animation: false,
                      position: 'top-right',
                      showConfirmButton: false,
                      timer: 1000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                      }
                  });
                  toastMixin.fire({
                      animation: true,
                      title: 'Badge Issued Successfully'
                  });
              }

              else if (data['message'] == "badge_not_issued") {
               
                $("#badge-modal2").modal("hide")
                
               
            }
          }
        })

    }




    var number_input = document.querySelector('.numberField');
number_input.addEventListener('input', restrictNumber);
        function restrictNumber (e) {
            var newValue = this.value.replace(new RegExp(/[^\d]/,'ig'), "");
            this.value = newValue;
        }