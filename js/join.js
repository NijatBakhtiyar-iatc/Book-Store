import {  db, set, ref, onValue, push } from "./firebase.js";

//Join part
const fullName = $("#join-fullname");
const email = $("#join-email");
const joinBtn = $("#join-btn");
// const alertSuccess = $('.alert-success');
// const alertDanger = $('.alert-danger');



$("#myModal #join-form").on("submit", function (e) {
  e.preventDefault();
  const joinUserName = $("#myModal #join-form #join-fullname").val();
  const joinEmail = $("#myModal #join-form #join-email").val();
  const pushJoinInfo = push(ref(db, "/book-store/users"))
  set(pushJoinInfo, {
    fullname: joinUserName,
    email: joinEmail
  })
  $("#myModal").attr("class", "modal fade").css("display", "none")
  $(".modal-backdrop").attr("class", "modal-backdrop modal fade")
})