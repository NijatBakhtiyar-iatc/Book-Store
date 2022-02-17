import { db, set, ref, onValue, push, remove } from "./firebase.js";

// ADD SELECT VALUE
$(".dropdown-menu #addTypeBtn").on("click", function () {
  const newCatVal = $(".dropdown-menu #addType").val();
  $(".dropdown-menu #addType").val("");
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
  $("#bookName").val("");
  const authorName = $("#authorName").val();
  $("#authorName").val("");
  const bookImageUrl = $("#bookImageUrl").val();
  $("#bookImageUrl").val("");
  const publicationYear = $("#publicationYear").val();
  $("#publicationYear").val("");
  const isNew = true;
  const bookDesc = $("#bookDesc").val();
  $("#bookDesc").val("");
  const selectVal = $("#bookSelectType").val();
  $("#bookSelectType").val("");
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
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
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

     
      cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
      card.append(cardSpan, cardImg, cardBody);
      catalogPageCarousel.append(card);
    }
    var buttonValue = "all";
    CarouselCall(buttonValue);
  });
  ReadMore();
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
    const buttonValue = $(this).html().trim().toLowerCase();
    const branch = ref(db, `/book-store/catalog/${buttonValue}`);

    onValue(branch, function (snap) {
      const catalogs = snap.val();
      $(".catalog-carousel .tab-content").html("");
      const tabPane = $(
        `<div class="tab-pane fade show active" id="${buttonValue}" role="tabpanel" aria-labelledby="${buttonValue}-tab">`
      );
      const tabCarousel = $(
        `<div class="${buttonValue}-page-carousel page-carousel test">`
      );
      const spin = $(`<div class="spin-animation">`);
      const spinImg = $(`<img
      class="rounded-circle"
      src="./images/Spinner-1s-200px.gif"
      width="45"/>`);

      spin.append(spinImg);
      tabPane.append(spin, tabCarousel);

      for (let {
        addDate,
        author,
        description,
        name,
        url,
        year,
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

        cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
        card.append(cardSpan, cardImg, cardBody);

        tabCarousel.append(card);
      }
      $(".catalog-carousel .tab-content").append(tabPane);
      ReadMore();
      CarouselCall(buttonValue);
    });
  });
});

// SET ABOUT STORE TO DATABASE
const branchAbout = ref(db, `/book-store/about-store`);
$("#addInfo").on("submit", function (e) {
  e.preventDefault();

  const aboutTitle = $("#aboutTitle").val();
  $("#aboutTitle").val("");
  const aboutDesc = $("#aboutDesc").val();
  $("#aboutDesc").val("");
  const aboutImageUrl = $("#aboutImageUrl").val();
  $("#aboutImageUrl").val("");
  const countryFirst = $(".data-count #country-first").val();
  $(".data-count #country-first").val("");
  const catalog = $(".data-count #catalog").val();
  $(".data-count #catalog").val("");
  const countrySecond = $(".data-count #country-second").val();
  $(".data-count #country-second").val("");
  const cities = $(".data-count #cities").val();
  $(".data-count #cities").val("");

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

// CHECK LOGIN WITH LOCALSTORAGE
const localStorageLogin = localStorage.getItem("admin-login");
if (localStorageLogin) {
  $("#adminSignPanel").css("display", "none");
  $("#adminPanel").css("display", "flex");
} else {
  $("#adminPanel").css("display", "none");
  $("#adminSignPanel").css("display", "flex");
}

// CHECK ADMIN LOGIN WITH DATABASE
$("#admin-login-form").on("submit", function (e) {
  e.preventDefault();
  const userName = $("#admin-login-form #userName").val();
  $("#admin-login-form #userName").val("");
  const password = $("#admin-login-form #password").val();
  $("#admin-login-form #password").val("");
  onValue(ref(db, "/book-store/admin-login"), function (snap) {
    const loginInfo = snap.val();

    if (userName === loginInfo.username && password === loginInfo.password) {
      localStorage.setItem("admin-login", "logged in");
      $("#adminPanel").css("display", "flex");
      $("#adminSignPanel").css("display", "none");
    } else {
      $("#admin-login-form .check-user").css("display", "block");
      setTimeout(() => {
        $("#admin-login-form .check-user").css("display", "none");
      }, 4000);
    }
  });
});

$("#adminLogout").on("click", function () {
  localStorage.removeItem("admin-login");
  $("#adminPanel").css("display", "none");
  $("#adminSignPanel").css("display", "flex");
});

// ADMIN SEARCH BOOK
$("#admin-search-form button").on("click", function (e) {
  const searchVal = $("#admin-search-form input").val();
  $("#admin-search-form input").val("");
  $("#searchAdminResult").css("display", "block");
  const branch = ref(db, `/book-store/catalog/all`);
  let checkVal = [];


  if (searchVal) {
    onValue(branch, function (snap) {
      const databaseVal = snap.val();
      checkVal = [];

      $("#searchAdminResult img").css("display", "block");
      for (let value of Object.values(databaseVal)) {
        if (value.name.toLowerCase().includes(searchVal.toLowerCase())) {
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
        $("#searchAdminResult .context table tbody").html("");
        checkVal = [];
      });
    });
  } else {
    $("#searchAdminResult .context table").html("No Result");
  }

  $(".search-book-section #searchAdminInput").on("keydown", function (e) {
    $("#searchAdminResult").css("display", "none");
  });

  $(document).on("click", "#searchAdminResult .removeBtn", function () {
    let bookName = $(this)
      .closest("tr")
      .children(".book-name")
      .html()
      .toLowerCase()
      .trim();
    let tr = $(this).closest("tr");
    const branchSearch = ref(db, "/book-store/catalog");

    onValue(branchSearch, function (snap) {
      const searchVal = snap.val();

      for (let catalog of Object.entries(searchVal)) {
        for (let value of Object.entries(catalog[1])) {
          if (bookName === value[1].name.toLowerCase()) {
            $("#searchAdminResult .context table tbody").html("");

            tr.remove();
            remove(ref(db, `/book-store/catalog/${catalog[0]}/${value[0]}`));
            let newArr = [...new Set(checkVal)];

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
  $("#joinTable").html("");
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
$("#contactForm").on("submit", function (e) {
  e.preventDefault();
  const inputName = $("#inputName").val();
  $("#inputName").val("");
  const inputEmail = $("#inputEmail").val();
  $("#inputEmail").val("");
  const inputAddress = $("#inputAddress").val();
  $("#inputAddress").val("");
  const inputPhone = $("#inputPhone").val();
  $("#inputPhone").val("");

if(inputName.trim()==="" || inputAddress.trim()===""){
  $(".contactAlert").text("Please fill out this field.")
  $(".contactAlert").css("display", "block");
  setTimeout(() => {
    $(".contactAlert").css("display", "none");
  }, 3000);
}
else{
  const pushNew = push(branchForm);

  set(pushNew, {
    name: inputName,
    email: inputEmail,
    address: inputAddress,
    phone: inputPhone,
  });
}
});



// FETCH CONTACTED USERS FROM DATABASE
onValue(branchForm, function (snap) {
  let count = 1;
  const contactUsers = snap.val();
  $("#contact-table tbody").html("");
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
        if (value.name.toLowerCase().includes(searchVal.toLowerCase())) {
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

      cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
      card.append(cardSpan, cardImg, cardBody);
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

  const branchNew = ref(db, "/book-store/catalog/all");

  onValue(branchNew, function (snap) {
    const newVal = snap.val();
    const newCarousel = $(".newrelease-page-carousel");

    for (let key of Object.values(newVal)) {
      const publishDate = new Date(key.addDate);
      const updateDate = publishDate.setDate(publishDate.getDate() + 40);
      const newDate = new Date().getTime();
      const dayDiff = Math.floor(
        (updateDate - newDate) / (24 * 1000 * 3600) + 1
      );
      if (key.isNew && dayDiff > 0) {
        const card = $("<div class = 'card'>");
        const cardSpan = $("<span class = 'new-book'>").html("New");
        const cardImg = $(`<img src = ${key.url} alt = ${key.name}>`);
        const cardBody = $("<div class = 'card-body'>");
        const cardBodyH5 = $("<h5>").html(key.name);
        const cardBodyH6 = $("<h6>").html(key.author);
        const cardBodyButton = $("<button class = 'read-more'>").html(
          "Read More"
        );

        cardBody.append(cardBodyH5, cardBodyH6, cardBodyButton);
        card.append(cardSpan, cardImg, cardBody);
        newCarousel.append(card);
      }
    }

    var buttonValue = "newrelease";
    CarouselCall(buttonValue);
    ReadMore();
  });
}

// READ MORE COMPONENT
function ReadMore() {
  $(".catalog-carousel .read-more").on("click", function () {
    $(".catalog-carousel").css("display", "none");
    $(".read-more-page").css("display", "block");

    let bookName = $(this).closest(".card-body").children("h5").html();
    const branchAll = ref(db, "/book-store/catalog/all");
    onValue(branchAll, function (snap) {
      const allVal = snap.val();
      for (let value of Object.values(allVal)) {
        if (bookName === value.name) {
          $(".read-more-page .book-info span").html(value.year || "No added");
          $(".read-more-page .book-info h2").html(value.name || "No added");
          $(".read-more-page .book-info h3").html(value.author || "No added");
          $(".read-more-page .book-info p").html(
            value.description || "No added"
          );

          $(".read-more-page .book-image img").attr("src", `${value.url}`);
        }
      }
    });
  });
  $(".read-more-page .back-btn").on("click", function () {
    $(".catalog-carousel").css("display", "block");
    $(".read-more-page").css("display", "none");
  });
}

// INDEX CATALOG NAMES
const branchCatalogName = ref(db, "/book-store/catalog");
onValue(branchCatalogName, function (snap) {
  const catalogNameVal = snap.val();

  for (let value of Object.entries(catalogNameVal)) {
    const button = $(
      "<a href='catalog.html' target='_blank' class='btn'>"
    ).html(value[0]);
    $(".catalog-btns").append(button);
  }
});
