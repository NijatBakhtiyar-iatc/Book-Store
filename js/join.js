import { db, set, ref, onValue, push } from "./firebase.js";

//Join part
// const fullName = $("#join-fullname");
// const email = $("#join-email");
// const joinBtn = $("#join-btn");
// const alertSuccess = $('.alert-success');
// const alertDanger = $('.alert-danger');

$("#myModal #join-form").on("submit", function (e) {
  e.preventDefault();
  const joinUserName = $("#myModal #join-form #join-fullname").val();
  $("#myModal #join-form #join-fullname").val("");
  const joinEmail = $("#myModal #join-form #join-email").val();
  $("#myModal #join-form #join-email").val("");
  const pushJoinInfo = push(ref(db, "/book-store/users"));
  let emailArr = [];
  let count = 0;

  if(joinUserName.trim()===""){
    $(".check-user").text("You can't use this name");
    $(".check-user").css("display", "block");
    setTimeout(() => {
      $("#join-form .check-user").css("display", "none");
    }, 3000);
  }
  else{
    onValue(ref(db, "/book-store/users"), function (snap) {
      const joinedVal = snap.val();
      if (joinedVal !== null) {
        for (let value of Object.values(joinedVal)) {
          if (value.email === joinEmail) {
            count++;
          }
        }
      } else {
        set(pushJoinInfo, {
          fullname: joinUserName,
          email: joinEmail,
        });
        $("#myModal").attr("class", "modal fade").css("display", "none");
        $(".modal-backdrop").attr("class", "modal-backdrop modal fade");
      }
    });
    if (count == 0) {
      console.log("true");
      set(pushJoinInfo, {
        fullname: joinUserName,
        email: joinEmail,
      });
      $("#myModal").attr("class", "modal fade").css("display", "none");
      $(".modal-backdrop").attr("class", "modal-backdrop modal fade");
    } else {
      $(".check-user").text("You have already joined with that email");
      $("#join-form .check-user").css("display", "block");
      setTimeout(() => {
        $("#join-form .check-user").css("display", "none");
      }, 3000);
    }
  }
  });
 
