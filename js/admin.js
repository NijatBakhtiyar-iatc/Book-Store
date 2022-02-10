import { db, set, ref, onValue, push, onAuthStateChanged, auth } from "./firebase.js";
const addDate = new Date().toLocaleDateString();
const addDate1 = new Date("2/10/2022").toDateString();
const newDate = new Date(addDate);
const newDate1 = new Date(addDate1);

// ADD SELECT VALUE
$(".dropdown-menu #addTypeBtn").on("click", function () {
  const newCatVal = $(".dropdown-menu #addType").val();
  if (newCatVal.trim() !== "") {
    $("#bookSelectType").append(
      $("<option>", {
        value: newCatVal.toLowerCase(),
        text: newCatVal,
      })
    );
  }
});

// ADD BOOK INFO TO DATABASE
$("#bookForm").on("submit", function (e) {
  e.preventDefault();

  const bookName = $("#bookName").val();
  const authorName = $("#authorName").val();
  const bookImageUrl = $("#bookImageUrl").val();
  const publicationYear = $("#publicationYear").val();
  const isNew = $("#isNew").prop("checked");
  const bookDesc = $("#bookDesc").val();
  const selectVal = $("#bookSelectType").val();
  const addDate = new Date();
  const branch = ref(db, `/book-store/catalog/${selectVal}`);
  const branchAll = ref(db, "/book-store/catalog/all");

  const pushNew = push(branch);
  const pushAll = push(branchAll);

  const bookInfo = {
    name: bookName,
    author: authorName,
    url: bookImageUrl,
    year: publicationYear,
    isNew,
    description: bookDesc,
    addDate: addDate.toLocaleDateString(),
  };

  set(pushNew, bookInfo);
  set(pushAll, bookInfo);
});

// CAROUSEL INSTALLATION START
function CarouselCall(buttonValue) {
  setTimeout(() => {
    $(".spin-animation").css("display", "none")
  },1000)
    $(`.${buttonValue}-page-carousel`).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1000,
      arrows: true,
      prevArrow:
        "<button type='button' class='slick-prev slick-arrow'><img src='./images/icon/carousel-left-arrow.svg'/></button>",
      nextArrow:
        "<button type='button' class='slick-next slick-arrow'><img   src='./images/icon/carousel-right-arrow.svg'/></button>",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
}
// FETCH ALL BOOK INFO FROM DATABASE
AllBook();
function AllBook() {
  $(".spin-animation").css("display", "flex")
  delete window.CarouselCall;
  const buttonValue = $("#all-tab").html().trim().toLowerCase();
  const branch = ref(db, `/book-store/catalog/${buttonValue}`);

  onValue(branch, function (snap) {
    const catalogs = snap.val();
    const catalogPageCarousel = $(`#${buttonValue} .${buttonValue}-page-carousel`);

    for (let {
      addDate,
      author,
      description,
      name,
      url,
      year,
      isNew,
    } of Object.values(catalogs)) {
      console.log(name);
      const card = $("<div class = 'card'>");
      const cardSpan = $("<span class = 'new-book'>").html("New");
      const cardImg = $(`<img src = ${url} alt = ${name}>`);
      const cardBody = $("<div class = 'card-body'>");
      const cardBodyH5 = $("<h5>").html(name);
      const cardBodyH6 = $("<h6>").html(author);
      const cardBodyButton = $("<button class = 'read-more'>").html(
        "Read More"
      );

      if (isNew) {
        card.prepend(cardSpan);
      }

      cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
      card.append(cardImg, cardBody);
      catalogPageCarousel.append(card);
      
    }
    CarouselCall(buttonValue);
    
  });
};

// FETCH BOOK INFO FROM DATABASE
$("#myTab .nav-link").on("click", function () {
  $(".spin-animation").css("display", "flex")
  delete window.CarouselCall;
  const buttonValue = $(this).html().trim().toLowerCase();
  const branch = ref(db, `/book-store/catalog/${buttonValue}`);

  onValue(branch, function (snap) {
    const catalogs = snap.val();
    const catalogPageCarousel = $(`#${buttonValue} .${buttonValue}-page-carousel`);

    for (let {
      addDate,
      author,
      description,
      name,
      url,
      year,
      isNew,
    } of Object.values(catalogs)) {
      console.log(name);
      const card = $("<div class = 'card'>");
      const cardSpan = $("<span class = 'new-book'>").html("New");
      const cardImg = $(`<img src = ${url} alt = ${name}>`);
      const cardBody = $("<div class = 'card-body'>");
      const cardBodyH5 = $("<h5>").html(name);
      const cardBodyH6 = $("<h6>").html(author);
      const cardBodyButton = $("<button class = 'read-more'>").html(
        "Read More"
      );

      if (isNew) {
        card.prepend(cardSpan);
      }

      cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
      card.append(cardImg, cardBody);
      catalogPageCarousel.append(card);
      
    }
    CarouselCall(buttonValue);
    
  });
});

$("#addInfo").on("submit", function (e) {
  e.preventDefault();

  const aboutTitle = $("#aboutTitle").val();
  const aboutDesc = $("#aboutDesc").val();
  const aboutImageUrl = $("#aboutImageUrl").val();

  const branch = ref(db, `/book-store/about-store`);

  set(branch, {
    title: aboutTitle,
    description: aboutDesc,
    url: aboutImageUrl,
  });
});

// const localStorageLogin = JSON.parse(localStorage.getItem("admin-login"));
// if (localStorageLogin) {
//   $("#adminPanel").css("display", "flex");
//   $("#admin-login-form").css("display", "none");
// } else {
//   $("#adminPanel").css("display", "none");
//   $("#admin-login-form").css("display", "block");
// }

$("#admin-login-form").on("submit", function (e) {
  e.preventDefault();
  const userName = $("#admin-login-form #userName").val();
  const password = $("#admin-login-form #password").val();
  onValue(ref(db, "/book-store/admin-login"), function (snap) {
    const loginInfo = snap.val();

    if (userName === loginInfo.username && password === loginInfo.password) {
      $("#adminPanel").css("display", "flex");
      // localStorage.setItem("admin-login", JSON.stringify([userName,password ]))
    } else {
      $("#admin-login-form .check-user").css("display", "block");
      setTimeout(() => {
        $("#admin-login-form .check-user").css("display", "none");
      }, 4000);
    }
  });
});

// ADMIN SEARCH BOOK
$(".search-book-section #searchAdminInput").on("change", function (e) {
  const searchVal = e.target.value;
  $("#searchAdminResult").css("display", "block");
  const branch = ref(db, `/book-store/catalog/all`);
  let checkVal = [];
  onValue(branch, function (snap) {
    const databaseVal = snap.val();
    checkVal = [];

    $("#searchAdminResult .context").html("");
    $("#searchAdminResult img").css("display", "block");
    for (let value of Object.values(databaseVal)) {
      if (value.name.includes(searchVal)) {
        checkVal.push(value.name);
      }
    }

    for (let value of checkVal) {
      console.log(value);
      const context = $("<p>").html(value);
      $("#searchAdminResult .context").append(context);
    }

    $("#searchAdminResult img").css("display", "none");
  });

  $(".search-book-section #searchAdminInput").on("keydown", function (e) {
    $("#searchAdminResult").css("display", "none");
  });
});

// JOINED US INFO FROM DATABASE
onValue(ref(db, `/book-store/users`), function (snap) {
  const usersInfo = snap.val();
  let count = 1;

  for (let value of Object.values(usersInfo)) {
    const tr = $("<tr>");
    const th = $("<th>").html(count);
    const tdName = $("<td>").html(value.fullname);
    const tdEmail = $("<td>").html(value.email);

    tr.append(th, tdName, tdEmail);
    $("#joinTable").append(tr);

    count++;
  }
});


// BOOK DESC CHARACTER LENGTH
$("#bookDesc").on("keyup", function (e) {
  $("#bookCounter").html(e.target.value.length)
})

// STORE DESC CHARACTER LENGTH
$("#aboutDesc").on("keyup", function (e) {
  $("#aboutCounter").html(e.target.value.length)
})


//Join Us Part

// onAuthStateChanged(auth, (currentUser) => {
//   console.log(currentUser);
// });