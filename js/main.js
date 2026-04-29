$(function () {
  const rotatingWords = [
    "brillo costero",
    "oro artesanal",
    "piezas iconicas",
    "elegancia diaria"
  ];

  $(".rotating-text").each(function () {
    const $target = $(this);
    let index = 0;

    const rotate = () => {
      $target.fadeOut(180, function () {
        $target.text(rotatingWords[index]);
        $target.fadeIn(220);
      });
      index = (index + 1) % rotatingWords.length;
    };

    $target.text(rotatingWords[0]);
    setInterval(rotate, 2200);
  });

  const currentPage = $("body").data("page");
  if (currentPage) {
    $(`.navbar-nav .nav-link[data-page="${currentPage}"]`).addClass("active");
  }

  $(".filter-btn").on("click", function () {
    const filter = $(this).data("filter");
    const $items = $(".catalog-item");

    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    $items.hide();
    if (filter === "all") {
      $items.show();
    } else {
      $items
        .filter(function () {
          const tags = ($(this).data("filter") || "").toString().split(" ");
          return tags.includes(filter);
        })
        .show();
    }

    const visibleCount = $(".catalog-item:visible").length;
    $(".filter-count strong").text(visibleCount);
  });

  $(".gold-card").on("mouseenter", function () {
    $(this).addClass("is-zoomed");
  });

  $(".gold-card").on("mouseleave", function () {
    $(this).removeClass("is-zoomed");
  });

  $(".flip-trigger").on("click", function () {
    $(this).closest(".silver-card").toggleClass("is-flipped");
  });

  $(".flip-trigger-back").on("click", function () {
    $(this).closest(".silver-card").toggleClass("is-flipped");
  });

  $(".cart-qty-btn").on("click", function () {
    const $button = $(this);
    const $qty = $button.siblings(".cart-qty-value");
    const current = parseInt($qty.text(), 10) || 1;
    const next = $button.data("action") === "plus" ? current + 1 : Math.max(1, current - 1);
    $qty.text(next);
  });

  $("#year").text(new Date().getFullYear());
});
