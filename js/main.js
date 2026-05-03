$(function () {
  $(".navbar-brand").each(function () {
    const $brand = $(this);
    const brandText = $brand.text();
    const isAdminBrand = /admin/i.test(brandText);

    $brand.html(`
      <span class="brand-logo" aria-hidden="true">
        <span class="brand-logo-word">MAL</span>
        <span class="brand-logo-dot"></span>
        <span class="brand-logo-word">IBU</span>
      </span>
      ${isAdminBrand ? '<span class="brand-admin-tag">Admin</span>' : ""}
      <span class="visually-hidden">Malibu${isAdminBrand ? " Admin" : ""}</span>
    `);
  });

  const navSearchTemplate = `
    <form class="nav-search-shell" aria-label="Buscador visual">
      <input
        class="nav-search-input"
        type="search"
        placeholder="Buscar pieza o set"
        aria-label="Buscar por texto"
      >
      <button class="nav-search-visual" type="button" aria-label="Buscar por imagen">
        <i class="bi bi-image"></i>
        <span>Imagen</span>
      </button>
      <button class="nav-search-submit" type="submit" aria-label="Buscar">
        <i class="bi bi-search"></i>
      </button>
    </form>
  `;

  $(".nav-utility").each(function () {
    const $utility = $(this);
    if (!$utility.find(".nav-search-shell").length) {
      $utility.prepend(navSearchTemplate);
    }
  });

  $(document).on("submit", ".nav-search-shell", function (event) {
    event.preventDefault();
  });

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

  $(".size-chip").on("click", function () {
    const $chip = $(this);
    const selectedSize = $chip.text().trim();
    $chip.closest(".size-selector").find(".size-chip").removeClass("active");
    $chip.addClass("active");
    $(".selected-size-label").text(`Talle ${selectedSize}`);
  });

  $(".detail-thumb-toggle").on("click", function () {
    const $trigger = $(this);
    const imageSrc = $trigger.data("image");
    const imageAlt = $trigger.data("alt") || "Vista del producto";
    const $gallery = $trigger.closest(".detail-gallery");
    $gallery.find(".detail-main-image img").attr({
      src: imageSrc,
      alt: imageAlt
    });
    $gallery.find(".detail-thumb").removeClass("active");
    $trigger.closest(".detail-thumb").addClass("active");
  });

  $("#year").text(new Date().getFullYear());
});
