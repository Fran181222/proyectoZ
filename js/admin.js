$(function () {
  const accessKey = "malibu_admin_access";
  const emailKey = "malibu_admin_email";

  const $gate = $("#adminGate");
  const $dashboard = $("#adminDashboard");
  const $sessionEmail = $("#adminSessionEmail");
  const $loginForm = $("#adminLoginForm");
  const $loginFeedback = $("#adminLoginFeedback");
  const $productsList = $("#adminProductsList");

  const setDashboardState = (isOpen, email = "admin@malibu.com") => {
    $gate.toggleClass("admin-hidden", isOpen);
    $dashboard.toggleClass("admin-hidden", !isOpen);
    $sessionEmail.text(email);
  };

  const isValidAdminLogin = (email, password) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;

  const clearProductForm = () => {
    $("#productIdField").val("");
    $("#productNameField").val("");
    $("#productCategoryField").val("");
    $("#productPriceField").val("");
    $("#productStockField").val("");
    $("#productImageField").val("");
    $("#productDescField").val("");
  };

  const renderProductMarkup = (product) => `
    <img src="${product.image}" alt="${product.name}">
    <div>
      <div class="admin-product-head">
        <div class="admin-product-meta">
          <strong class="admin-product-name">${product.name}</strong>
          <span class="mini-label admin-product-category">${product.category}</span>
        </div>
        <div class="admin-product-actions">
          <button class="admin-mini-btn admin-edit-btn" type="button" aria-label="Editar producto"><i class="bi bi-pencil"></i></button>
          <button class="admin-mini-btn admin-delete-btn" type="button" aria-label="Eliminar producto"><i class="bi bi-trash3"></i></button>
        </div>
      </div>
      <p class="admin-helper-text admin-product-copy mb-2">${product.desc}</p>
      <div class="d-flex justify-content-between gap-3">
        <strong class="admin-product-price">${product.price}</strong>
        <span class="admin-helper-text">Stock <span class="admin-product-stock">${product.stock}</span></span>
      </div>
    </div>
  `;

  const fillProductForm = ($item) => {
    $("#productIdField").val($item.data("productId"));
    $("#productNameField").val($item.data("name"));
    $("#productCategoryField").val($item.data("category"));
    $("#productPriceField").val($item.data("price"));
    $("#productStockField").val($item.data("stock"));
    $("#productImageField").val($item.data("image"));
    $("#productDescField").val($item.data("desc"));
  };

  const collectProductData = () => ({
    id: $("#productIdField").val().trim() || `prod-${Date.now()}`,
    name: $("#productNameField").val().trim() || "Nuevo producto",
    category: $("#productCategoryField").val().trim() || "Categoria",
    price: $("#productPriceField").val().trim() || "$0",
    stock: $("#productStockField").val().trim() || "0",
    image: $("#productImageField").val().trim() || "img/display-shiny-elegant-gold-chain.jpg",
    desc: $("#productDescField").val().trim() || "Descripcion pendiente."
  });

  const updatePreviewImage = (previewKey, imageValue) => {
    const safeValue = imageValue.trim();
    const $fill = $(`[data-preview-fill="${previewKey}"]`);
    const $empty = $(`[data-preview-empty="${previewKey}"]`);

    if (safeValue) {
      $fill.css("background-image", `url("${safeValue.replace(/"/g, "&quot;")}")`);
      $empty.hide();
    } else {
      $fill.css("background-image", "none");
      $empty.show();
    }
  };

  const syncSetPreview = () => {
    $("#previewSetName").text($("#setNameField").val().trim() || "Nombre del set");
    $("#previewSetMood").text($("#setMoodField").val().trim() || "Texto corto del set");
    $("#previewImage1Label").text($("#image1LabelField").val().trim() || "Imagen principal 01");
    $("#previewImage2Label").text($("#image2LabelField").val().trim() || "Imagen principal 02");
    $("#previewImage3Label").text($("#image3LabelField").val().trim() || "Imagen principal 03");

    $("#previewProduct1Name").text($("#setProduct1NameField").val().trim() || "Producto 01");
    $("#previewProduct1Price").text($("#setProduct1PriceField").val().trim() || "$0");
    $("#previewProduct2Name").text($("#setProduct2NameField").val().trim() || "Producto 02");
    $("#previewProduct2Price").text($("#setProduct2PriceField").val().trim() || "$0");
    $("#previewProduct3Name").text($("#setProduct3NameField").val().trim() || "Producto 03");
    $("#previewProduct3Price").text($("#setProduct3PriceField").val().trim() || "$0");

    updatePreviewImage("image1", $("#image1UrlField").val());
    updatePreviewImage("image2", $("#image2UrlField").val());
    updatePreviewImage("image3", $("#image3UrlField").val());
  };

  if (sessionStorage.getItem(accessKey) === "true") {
    setDashboardState(true, sessionStorage.getItem(emailKey) || "admin@malibu.com");
  }

  $loginForm.on("submit", function (event) {
    event.preventDefault();
    const email = $("#adminEmail").val().trim();
    const password = $("#adminPassword").val().trim();

    if (!isValidAdminLogin(email, password)) {
      $loginFeedback
        .text("Ingresa un email valido y una contrasena de al menos 8 caracteres.")
        .removeClass("success")
        .addClass("error");
      return;
    }

    sessionStorage.setItem(accessKey, "true");
    sessionStorage.setItem(emailKey, email);
    $loginFeedback
      .text("Acceso habilitado. Ya puedes editar productos y sets.")
      .removeClass("error")
      .addClass("success");
    setDashboardState(true, email);
  });

  $("#adminLogoutBtn").on("click", function () {
    sessionStorage.removeItem(accessKey);
    sessionStorage.removeItem(emailKey);
    setDashboardState(false);
    $loginForm[0].reset();
    $loginFeedback.text("").removeClass("error success");
  });

  $("#newProductBtn, #resetProductBtn").on("click", function () {
    clearProductForm();
  });

  $productsList.on("click", ".admin-edit-btn", function () {
    const $item = $(this).closest(".admin-product-item");
    $item.removeClass("is-deleted");
    fillProductForm($item);
  });

  $productsList.on("click", ".admin-delete-btn", function () {
    $(this).closest(".admin-product-item").toggleClass("is-deleted");
  });

  $("#adminProductForm").on("submit", function (event) {
    event.preventDefault();
    const product = collectProductData();
    let $item = $productsList.find(`[data-product-id="${product.id}"]`);

    if (!$item.length) {
      $item = $(`<article class="admin-product-item"></article>`);
      $productsList.prepend($item);
    }

    $item
      .attr("data-product-id", product.id)
      .attr("data-name", product.name)
      .attr("data-category", product.category)
      .attr("data-price", product.price)
      .attr("data-stock", product.stock)
      .attr("data-desc", product.desc)
      .attr("data-image", product.image)
      .removeClass("is-deleted")
      .html(renderProductMarkup(product));

    $("#productIdField").val(product.id);
  });

  $("#adminSetForm input").on("input", syncSetPreview);
  syncSetPreview();
});
