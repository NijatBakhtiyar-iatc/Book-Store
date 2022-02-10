import { createUserWithEmailAndPassword, auth, onAuthStateChanged } from "./firebase.js";


// $('#joinLink').on('click', function() {
//   $(".modal-backdrop").attr("class", "modal-backdrop modal fade")
// });

async function registerUser() {
  try {
    const joinEmail = $("#join-email").val();
    const joinPassword = $("#join-password").val();


    await createUserWithEmailAndPassword(
      auth,
      joinEmail,
      joinPassword
    );


    
    $('#join-email').val('');
    $('#join-password').val('');

    $('.alert-danger').css({ display: 'none'})

    $("#myModal").attr("class", "modal fade").css("display", "none")
    $(".modal-backdrop").attr("class", "modal-backdrop modal fade")
    
  } catch (error) {
    $('.alert-danger').show();
    $('.alert-danger .error-message').text(error.message);
  }
}

async function loginUser() {
  try {
    const joinEmail = $("#join-email").val();
    const joinPassword = $("#join-password").val();

    const user = await signInWithEmailAndPassword(
      auth,
      joinEmail,
      joinPassword
    );

    // console.log(user);

  } catch (error) {
    console.log(error.message);
  }
}


$("#join-form").on("submit", function(e) {
  e.preventDefault();

  registerUser();
  loginUser();

  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });

});
