let url, idToEdit;

$(document).ready(function(){
  let fullName = sessionStorage.getItem('userFName') + " " + sessionStorage.getItem('userLName');
  // check log in and hide and show everything
  $('#navLoggedIn').hide();
  $('#registerForm').hide();
  $('#editProfileForm').hide();
  $('#addProjectForm').hide();
  $('#editProjectForm').hide();
  $('#changeImgDiv').hide();

  if (sessionStorage['userEmail']) {
    $('#navLoggedIn').show();
    $('#navLoggedOut').hide();
    document.getElementById("firstNameGreeting").innerHTML = sessionStorage.getItem('userFName');
  } else {
    $('#navLoggedIn').hide();
    $('#navLoggedOut').show();
  }

  // go home
  $('.navbar-brand').click(function(){
    $('#account').hide();
    $('#editProjectForm').hide();
    $('#card-output').show();
    showAllProjects()
  });

  //get url and port from config.json
  $.ajax({
    url :'config.json',
    type :'GET',
    dataType :'json',
    success : function(data){
      url = `${data.SERVER_URL}:${data.SERVER_PORT}`;
      showAllProjects();
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax

  function showAllProjects(){
    $.ajax({
      url :`${url}/projects`,
      type :'GET',
      dataType :'json',
      success : function(data){
        console.log(data);
        document.getElementById('card-output').innerHTML = "";
        for(let i=0; i<data.length; i++){
          if(sessionStorage['userEmail'] && data[i].userId == sessionStorage.getItem('userID')){
            document.getElementById('card-output').innerHTML +=
            `<div class="card col-3">
            <img class="img-thumbnail" src="${data[i].imageUrl}" alt="Image">
            <div class="card-body">
            <h3 class="card-title"> ${data[i].name}</h3>
            <h4 class="card-text">${data[i].author}</h4>
            <button type="button" class="btn btn-primary">Edit</button>
            <button type="button" class="btn btn-primary">Delete</button>
            </div>
            </div>`;    
          }
          else{
            document.getElementById('card-output').innerHTML +=
            `<div class="card col-3">
            <img class="img-thumbnail" src="${data[i].imageUrl}" alt="Image">
            <div class="card-body">
            <h3 class="card-title"> ${data[i].name}</h3>
            <h4 class="card-text">${data[i].author}</h4>
            </div>
            </div>`;        
          }
        }
      },
      error:function(){
        console.log('error: cannot call api');
        console.log(url)
      }
    });//ajax
  }

  // show register
  $('#registerButton').click(function(){
    $('#registerForm').show();
    $('#card-output').hide();
  });

  // register
  $('#registerUser').click(function(){
    let fname = $('#registerFirstName').val();
    let lname = $('#registerLastName').val();
    let email = $('#registerEmail').val();
    let password = $('#registerPassword').val();
    console.log(fname,lname,email, password);

    if (fname == '' || lname == '' || email == '' || password == ''){
      alert('Please enter all details');
    } 
    else {
      $.ajax({
        url :`${url}/register`,
        type :'POST',
        data:{
          firstName : fname,
          lastName : lname,
          email : email,
          password : password
        },
        success : function(user){
          console.log(user);
          if (user === "This email is already taken. Please try another one"){
            alert('There is account with this email. Please login or try again');
          }
          else{
            $('#navLoggedIn').show();
            $('#navLoggedOut').hide();
            $('#registerForm').hide();
            sessionStorage.setItem('userID', user['_id']);
            sessionStorage.setItem('userFName',user['firstName']);
            sessionStorage.setItem('userLName',user['lastName']);
            sessionStorage.setItem('userEmail',user['email']);
            fullName = sessionStorage.getItem('userFName') + " " + sessionStorage.getItem('userLName');
            document.getElementById("firstNameGreeting").innerHTML = sessionStorage.getItem('userFName');
            $('#card-output').show();
            showAllProjects();
          }
        },
        error:function(){
          console.log('error: cannot call api');
        }
      });//ajax
    }
  });//register form

  //login
  $('#loginButton').click(function(){
    let email = $('#loginEmail').val();
    let password = $('#loginPassword').val();
    console.log(email, password);

    if (email == '' || password == ''){
      alert('Please enter all details');
    } 
    else {
      $.ajax({
        url :`${url}/login`,
        type :'POST',
        data:{
          email : email,
          password : password
        },
        success : function(user){
          console.log(user);
          if (user == 'User not found'){
            alert('There is no account for this email. Please try again or register');

          } else if (user == 'Not authorised. Incorrect password'){
            alert('Password incorrect. Please try again');
            $('#loginPassword').val('');
            $('#loginPassword').focus();
          } else{
            $('#navLoggedIn').show();
            $('#navLoggedOut').hide();
            sessionStorage.setItem('userID', user['_id']);
            sessionStorage.setItem('userFName',user['firstName']);
            sessionStorage.setItem('userLName',user['lastName']);
            sessionStorage.setItem('userEmail',user['email']);
            fullName = sessionStorage.getItem('userFName') + " " + sessionStorage.getItem('userLName');
            document.getElementById("firstNameGreeting").innerHTML = sessionStorage.getItem('userFName');
            console.log(sessionStorage);
            showAllProjects();
          }
        },
        error:function(){
          console.log('error: cannot call api');
        }
      });//ajax
    }
  });//login form

  // logout button
  $('#logoutButton').click(function(){
    sessionStorage.clear();
    $('#navLoggedIn').hide();
    $('#navLoggedOut').show();
    $('#card-output').show();
    $('#account').hide();
    $('#loginEmail').val("");
    $('#loginPassword').val("");
    showAllProjects();
  });

  // add project
  $('#addProject').click(function(){
    let name = $('#addProjectName').val();
    let author = $('#addAuthorName').val();
    let projectUrl = $('#addProjectUrl').val();
    let image = $('#addProjectImage').val();

    if (name == '' || author == '' || projectUrl == '' || image == ''){
      alert('Please enter all details');
    } 
    else {
      $.ajax({
        url :`${url}/addProject`,
        type :'POST',
        data:{
          name : name,
          author : author,
          imageUrl : image,
          url : projectUrl,
          userId : sessionStorage.getItem('userID')
        },
        success : function(data){
          console.log(data);
          if(data === "project added already"){
            alert("You already have a project with this name. Please rename it")
          }
          else{
            Swal.fire({
              icon: 'success',
              title: 'Your project was added',
              showConfirmButton: false,
              timer: 1500
            });
            showMyProjects();
            $('#addProjectForm').hide();
          }
        },
        error:function(){
          console.log('error: cannot call api');
        }
      });//ajax
    }
  });//add project form

  $('#myAccountButton').click(function(){
    $('#card-output').hide();
    showMyProjects();
  });

  // show my projects
  function showMyProjects(){
    $('#account').show();
    document.getElementById('profile').innerHTML = 
    `<div class="card mx-auto border-0" style="width: 18rem;">
    <img src="images/avatar-icon.png" class="card-img-top" alt="Avatar">
    <div class="card-body"><h5 class="card-title">${fullName}</h5>
    <h5 class="card-title">${sessionStorage.getItem('userEmail')}</h5>
    <button type="button" class="btn btn-primary" id="addProjectBtn">Add project</button>
    </div>
    </div>`
    // show add project
    $('#addProjectBtn').click(function(){
      document.getElementById("addAuthorName").value = sessionStorage.getItem('userFName') + " " + sessionStorage.getItem('userLName');
      $('#addProjectName').val("");
      $('#addProjectUrl').val("");
      $('#addProjectImage').val("");
      $('#addProjectForm').show();
    });
    $.ajax({
      url :`${url}/projects`,
      type :'GET',
      dataType :'json',
      success : function(data){
        console.log(data);
        document.getElementById('myProjects').innerHTML = "";
        for(let i=0; i<data.length; i++){
          if(sessionStorage['userEmail'] && data[i].userId == sessionStorage.getItem('userID')){
            document.getElementById('myProjects').innerHTML +=
            `<div class="card col-3">
            <img class="img-thumbnail" src="${data[i].imageUrl}" alt="Image">
            <div class="card-body">
            <h3 class="card-title"> ${data[i].name}</h3>
            <h4 class="card-text lead">${data[i].author}</h4>
            <button type="button" class="btn btn-primary editProjectBtn" data-id="${data[i]["_id"]}" data-index="${i}">Edit</button>
            <button type="button" class="btn btn-primary deleteProjectBtn" data-id="${data[i]["_id"]}" data-index="${i}">Delete</button>
            </div>
            </div>`;
          }    

          $('.editProjectBtn').click(function(){
            let index = $(this).attr("data-index");
            idToEdit = $(this).attr("data-id");
            $('#editProjectName').val(data[index].name);
            $('#editAuthorName').val(data[index].author);
            $('#editProjectUrl').val(data[index].url);
            $('#editProjectImg').val(data[index].imageUrl);
            $('#editProjectForm').slideDown();
          });

          $('.deleteProjectBtn').click(function(){
            let index = $(this).attr("data-index");
            idToEdit = $(this).attr("data-id");
            Swal.fire({
              title: `Are you sure you want to delete ${data[index].name}?`,
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.value) {
                Swal.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                  )
                deleteProject();
              }
            })
          })
        }
      },
      error:function(){
        console.log('error: cannot call api');
        console.log(url)
      }
    });//ajax
  }; // show projects

  // update project
  $('#saveProjectButton').click(function(){
    let name = $('#editProjectName').val();
    let author = $('#editAuthorName').val();
    let projUrl = $('#editProjectUrl').val();
    let image = $('#editProjectImg').val();

    if (name == '' || author == '' || url == '' || image == ''){
      alert('Please enter all details');
    } 
    else {
      $.ajax({
        url :`${url}/updateProject/p=${idToEdit}`,
        type :'PATCH',
        data:{
          name : name,
          author : author,
          imageUrl : image,
          url : projUrl
        },
        success : function(data){
          console.log(data);
          if (data == 'project added already'){
            alert('There is already a project with this name. Please rename it');
          } else{
            $('#editProjectForm').slideUp();
            Swal.fire({
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            showMyProjects();
          }
        },
        error:function(err){
          console.log('error: cannot call api');
          console.log(idToEdit)
        }
      });//ajax
    }
  });//update project

  // delete project
  function deleteProject(){
    $.ajax({
      url :`${url}/deleteProject/p=${idToEdit}`,
      type :'DELETE',
      data:{
        name : name
      },
      success : function(data){
        console.log(data);
        showMyProjects();
        $('#editProjectForm').hide();
      },
      error:function(err){
        console.log('error: cannot call api');
        console.log(idToEdit)
      }
      });//ajax
  };//delete project


// https://drive.google.com/uc?id=1kL-B07FJ0CoFWcEJNn1thV7bGy50rJcd


});