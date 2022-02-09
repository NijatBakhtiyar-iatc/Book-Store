let a = 0;
$(window).scroll(function () {
  const oTop = $(".about-section").offset().top - window.innerHeight;
  console.log($(".about-section").offset());
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
