import { db, set, ref, onValue, push, remove } from "./firebase.js";

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
    $(".spin-animation").css("display", "none");
  }, 1000);
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
function AllBook() {
  $(".spin-animation").css("display", "flex");

  const branch = ref(db, `/book-store/catalog/all`);

  onValue(branch, function (snap) {
    const catalogs = snap.val();
    const catalogPageCarousel = $("#all .all-page-carousel");

    for (let {
      addDate,
      author,
      description,
      name,
      url,
      year,
      isNew,
    } of Object.values(catalogs)) {
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
    var buttonValue = "all";
    CarouselCall(buttonValue);
  });
}

// NAV TABS BUTTONS
const branchNav = ref(db, "/book-store/catalog");
onValue(branchNav, function (snap) {
  $("#myTab").html("");
  const navVal = snap.val();
  let navArr = [];

  const liAll = $(`<li class="nav-item" role="presentation">`);
  const buttonAll = $(
    `<button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" type="button" role="tab" aria-controls="all" aria-selected="true">`
  ).html("All");
  liAll.append(buttonAll);

  for (let value of Object.entries(navVal)) {
    navArr.push(value[0]);
  }
  navArr.shift();
  $("#myTab").append(liAll);
  for (let newValue of navArr) {
    const li = $(`<li class="nav-item" role="presentation">`);
    const button = $(
      `<button class="nav-link" id="${newValue}-tab" data-bs-toggle="tab" data-bs-target="#${newValue}" type="button" role="tab" aria-controls="${newValue}" aria-selected="false">`
    ).html(newValue);
    li.append(button);

    $("#myTab").append(li);
  }
  AllBook();

  // FETCH BOOK INFO FROM DATABASE
  $("#myTab .nav-link").on("click", function () {
    $(".spin-animation").css("display", "flex");
    delete window.CarouselCall;
    const buttonValue = $(this).html().trim().toLowerCase();
    const branch = ref(db, `/book-store/catalog/${buttonValue}`);

    onValue(branch, function (snap) {
      const catalogs = snap.val();
      const catalogPageCarousel = $(
        `#${buttonValue} .${buttonValue}-page-carousel`
      );

      for (let {
        addDate,
        author,
        description,
        name,
        url,
        year,
        isNew,
      } of Object.values(catalogs)) {
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
});

// SET ABOUT STORE TO DATABASE
const branchAbout = ref(db, `/book-store/about-store`);
$("#addInfo").on("submit", function (e) {
  e.preventDefault();

  const aboutTitle = $("#aboutTitle").val();
  const aboutDesc = $("#aboutDesc").val();
  const aboutImageUrl = $("#aboutImageUrl").val();
  const countryFirst = $(".data-count #country-first").val();
  const catalog = $(".data-count #catalog").val();
  const countrySecond = $(".data-count #country-second").val();
  const cities = $(".data-count #cities").val();

  set(branchAbout, {
    title: aboutTitle,
    description: aboutDesc,
    url: aboutImageUrl,
    countryCountFirst: countryFirst,
    catalog,
    countryCountSecond: countrySecond,
    cities,
  });
});

// FETCH ABOUT DATA FROM DATABASE
onValue(branchAbout, function (snap) {
  const aboutVal = snap.val();
  $(".about-store h2").html(aboutVal.title);
  $(".about-store p").html(aboutVal.description);
  $(".about-store .about-img").attr("src", aboutVal.url);
  $(".about-store .spin-animation").css("display", "flex");
  $(".about-section .country-first").attr(
    "data-count",
    aboutVal.countryCountFirst
  );
  $(".about-section .catalog").attr("data-count", aboutVal.catalog);
  $(".about-section .cities").attr("data-count", aboutVal.cities);
  $(".about-section .country-second").attr(
    "data-count",
    aboutVal.countryCountSecond
  );

  let a = 0;
  $(window).scroll(function () {
    const oTop = $(".about-section").offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() > oTop) {
      $(".value").each(function () {
        const $this = $(this),
          countTo = $this.attr("data-count");
        $(this).animate({ fontSize: "2.7rem" }, 1500);
        $({
          countNum: $this.text(),
        }).animate(
          {
            countNum: countTo,
          },

          {
            duration: 2500,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
            },
          }
        );
      });
    }
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
// CHECK ADMIN LOGIN WITH DATABASE
$("#admin-login-form").on("submit", function (e) {
  e.preventDefault();
  const userName = $("#admin-login-form #userName").val();
  const password = $("#admin-login-form #password").val();
  onValue(ref(db, "/book-store/admin-login"), function (snap) {
    const loginInfo = snap.val();

    if (userName === loginInfo.username && password === loginInfo.password) {
      $("#adminPanel").css("display", "flex");
    } else {
      $("#admin-login-form .check-user").css("display", "block");
      setTimeout(() => {
        $("#admin-login-form .check-user").css("display", "none");
      }, 4000);
    }
  });
});

// ADMIN SEARCH BOOK // Kenan
$("#admin-search-form button").on("click", function (e) {
  e.preventDefault();
  // $(".modal.fade").css("display", "block")
  const searchVal = $("#admin-search-form input").val();
  $("#searchAdminResult").css("display", "block");
  const branch = ref(db, `/book-store/catalog/all`);
  let checkVal = [];
  if (searchVal) {
    onValue(branch, function (snap) {
      const databaseVal = snap.val();
      checkVal = [];
      // const tHead = $("<thead class='bg-pink-dark text-white'>");
      // const tr = $("<tr>");
      // const thCount = $("<th scope='col'>").html("#");
      // const thBook = $("<th scope='col'>").html("Book Name");
      // const thAuthor = $("<th scope='col'>").html("Author Name");
      // const thButton = $("<th scope='col'>").html("");
      // tr.append(thCount, thBook, thAuthor, thButton);
      // tHead.append(tr);
      // $("#searchAdminResult .context table").append(tHead);

      $("#searchAdminResult img").css("display", "block");
      for (let value of Object.values(databaseVal)) {
        if (value.name.includes(searchVal)) {
          checkVal.push(value);
        }
      }

      if (checkVal.length > 0) {
        checkVal.map((value, index) => {
          const Bodytr = $("<tr>");
          const BodythCount = $("<th scope='row'>").html(index + 1);
          const BodytdBook = $("<td class='book-name'>").html(value.name);
          const BodytdAuthor = $("<td>").html(value.author);
          const button = $("<button class='removeBtn'>").html("x");
          Bodytr.append(BodythCount, BodytdBook, BodytdAuthor, button);

          $("#searchAdminResult .context table tbody").append(Bodytr);
        });
      } else {
        $("#searchAdminResult .context table").html("No Result");
      }

      $(".modal-content .close").on("click", function () {
        $("#searchAdminResult .context table").html("");
        checkVal = [];
      });
    });
  } else {
    $("#searchAdminResult .context table").html("No Result");
  }

  $(".search-book-section #searchAdminInput").on("keydown", function (e) {
    $("#searchAdminResult").css("display", "none");
  });

  $("#searchAdminResult .removeBtn").on("click", function () {
    let bookName = $(this)
      .closest("tr")
      .children(".book-name")
      .html()
      .toLowerCase()
      .trim();
    let tr = $(this).closest("tr");
    // console.log(tr);
    const branchSearch = ref(db, "/book-store/catalog");
    onValue(branchSearch, function (snap) {
      const searchVal = snap.val();
      for (let catalog of Object.entries(searchVal)) {
        for (let value of Object.entries(catalog[1])) {
          if (bookName === value[1].name) {
            // Problemli Yer
            // checkVal.map(value => {
            //   console.log(value);
            // })
            $("#searchAdminResult .context table tbody").html("");

            tr.remove();
            remove(ref(db, `/book-store/catalog/${catalog[0]}/${value[0]}`));
            let newArr = [...new Set(checkVal)];

            // Problemli Yer Bitdi
            newArr.map((value, index) => {
              const newBodytr = $("<tr>");
              const newBodythCount = $("<th scope='row'>").html(index + 1);
              const newBodytdBook = $("<td class='book-name'>").html(
                value.name
              );
              const newBodytdAuthor = $("<td>").html(value.author);
              const newbutton = $("<button class='removeBtn'>").html("x");
              newBodytr.append(
                newBodythCount,
                newBodytdBook,
                newBodytdAuthor,
                newbutton
              );

              $("#searchAdminResult .context table tbody").append(newBodytr);
            });
          }
        }
      }
    });
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
  $("#bookCounter").html(e.target.value.length);
});

// STORE DESC CHARACTER LENGTH
$("#aboutDesc").on("keyup", function (e) {
  $("#aboutCounter").html(e.target.value.length);
});

// CONTATC US
const branchForm = ref(db, "/book-store/contact");
$(".contact-us #sendBtn").on("click", function () {
  const inputName = $(".contact-us #inputName").val();
  const inputEmail = $(".contact-us #inputEmail").val();
  const inputAddress = $(".contact-us #inputAddress").val();
  const inputPhone = $(".contact-us #inputPhone").val();
  const pushNew = push(branchForm);

  set(pushNew, {
    name: inputName,
    email: inputEmail,
    address: inputAddress,
    phone: inputPhone,
  });
});

// FETCH CONTACTED USERS FROM DATABASE
onValue(branchForm, function (snap) {
  let count = 1;
  const contactUsers = snap.val();
  for (let value of Object.values(contactUsers)) {
    const tr = $("<tr>");
    const th = $("<th scope='row'>").html(count);
    const tdName = $("<td>").html(value.name);
    const tdAddress = $("<td>").html(value.address);
    const tdEmail = $("<td>").html(value.email);
    const tdPhone = $("<td>").html(value.phone);
    tr.append(th, tdName, tdAddress, tdEmail, tdPhone);
    $("#contact-table tbody").append(tr);
    count++;
  }
});

// SEARCH PAGE SEARCH FROM DATABASE
$(".search-form button").on("click", function (e) {
  e.preventDefault();
  const buttonVal = $(this).html().trim().toLowerCase();

  const searchVal = $(".search-form input").val();

  $(".search-page-carousel").html("");

  $(".search-spin-animation").css("display", "flex");

  const branch = ref(db, `/book-store/catalog/all`);
  let checkVal = [];

  if (searchVal) {
    onValue(branch, function (snap) {
      const databaseVal = snap.val();
      checkVal = [];

      for (let value of Object.values(databaseVal)) {
        if (value.name.includes(searchVal)) {
          checkVal.push(value);
        }
      }

      if (checkVal.length > 0) {
        setTimeout(() => {
          $(".search-spin-animation").css("display", "none");

          checkVal.map((value, index) => {
            const card = $("<div class='card'>");
            const image = $("<div class='image'>");
            const about = $("<div class='about'>");
            const spanNew = $("<span class='new-book'>").html("New");
            const img = $(`<img src='${value.url}'>`);
            const h2 = $("<h2>").html(value.name);
            const p = $("<p>").html(value.author);
            const spanDes = $("<span>").html(value.description);
            about.append(h2, p, spanDes);
            image.append(spanNew, img);
            card.append(image, about);
            $(".search-page-carousel").append(card);
          });

          SearchCarousel();
        }, 1000);
      } else {
        $(".search-page-carousel").html("No Result Found");
        $(".search-spin-animation").css("display", "none");
      }
    });
  } else {
    $(".search-spin-animation").css("display", "none");
  }
});

// CAROUSEL FOR SEARCH PAGE
function SearchCarousel() {
  $(`.search-page-carousel`).attr(
    "class",
    "search-page-carousel page-carousel"
  );
  let changeClass = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

  $(`.search-page-carousel`).addClass(changeClass);
  $(`.${changeClass}`).slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: true,
    dots: false,
    prevArrow:
      "<button type='button' class='slick-prev slick-arrow'><img src='./images/icon/carousel-left-arrow.svg'/></button>",
    nextArrow:
      "<button type='button' class='slick-next slick-arrow'><img   src='./images/icon/carousel-right-arrow.svg'/></button>",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
        },
      },
    ],
  });
}

// BESTSELLER CAROUSEL
BestSeller();
function BestSeller() {
  $(".spin-animation").css("display", "flex");

  const branchSeller = ref(db, "/book-store/catalog/bestseller");

  onValue(branchSeller, function (snap) {
    const sellerVal = snap.val();
    const sellerCarousel = $(".bestseller-page-carousel");

    for (let {
      addDate,
      author,
      description,
      name,
      url,
      year,
      isNew,
    } of Object.values(sellerVal)) {
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
      sellerCarousel.append(card);
    }
    var buttonValue = "bestseller";
    CarouselCall(buttonValue);
  });
}

// NEW RELEASE CAROUSEL
NewRelease();
function NewRelease() {
  $(".spin-animation").css("display", "flex");

  const branchNew = ref(db, "/book-store/catalog");

  onValue(branchNew, function (snap) {
    const newVal = snap.val();
    const newCarousel = $(".newrelease-page-carousel");

    for (let key of Object.values(newVal)) {
      for (let value of Object.values(key)) {
        // console.log(value);
        const publishDate = new Date(value.addDate);
        const updateDate = publishDate.setDate(publishDate.getDate() + 40);
        const newDate = new Date().getTime();
        const dayDiff = Math.floor(
          (updateDate - newDate) / (24 * 1000 * 3600) + 1
        );
        if (value.isNew && dayDiff > 0) {
          const card = $("<div class = 'card'>");
          const cardSpan = $("<span class = 'new-book'>").html("New");
          const cardImg = $(`<img src = ${value.url} alt = ${value.name}>`);
          const cardBody = $("<div class = 'card-body'>");
          const cardBodyH5 = $("<h5>").html(value.name);
          const cardBodyH6 = $("<h6>").html(value.author);
          const cardBodyButton = $("<button class = 'read-more'>").html(
            "Read More"
          );

          cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
          card.append(cardSpan, cardImg, cardBody);
          newCarousel.append(card);
        }
      }
    }
  
    var buttonValue = "newrelease";
    CarouselCall(buttonValue);
  });
}
