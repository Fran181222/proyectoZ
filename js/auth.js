$(function () {
  const authModalElement = document.getElementById("authModal");
  const confirmModalElement = document.getElementById("confirmModal");
  const authModal = authModalElement ? new bootstrap.Modal(authModalElement) : null;
  const confirmModal = confirmModalElement
    ? new bootstrap.Modal(confirmModalElement)
    : null;

  const defaultView = $("body").data("authView") || "login";

  const sanitizeInput = (value, keepSymbols = false) => {
    const clean = value.replace(/[<>]/g, "").replace(/\s{2,}/g, " ").trimStart();
    if (keepSymbols) {
      return clean;
    }
    return clean.replace(/[^a-zA-Z0-9@._+\-\s\u00C0-\u017F]/g, "");
  };

  const setFeedback = ($field, message, isValid) => {
    const $feedback = $field.closest(".mb-3, .col-12, .col-md-6").find(".input-feedback");
    $field.toggleClass("is-valid", isValid);
    $field.toggleClass("is-invalid", !isValid);
    $feedback
      .text(message)
      .removeClass("error success")
      .addClass(isValid ? "success" : "error");
  };

  const validateField = ($field) => {
    const value = $field.val().trim();
    const name = $field.attr("name");
    let valid = true;
    let message = "Se ve bien.";

    if ($field.prop("required") && !value) {
      valid = false;
      message = "Este campo es obligatorio.";
    } else if (name === "loginEmail" || name === "registerEmail") {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      message = valid ? "Email valido." : "Ingresa un email correcto.";
    } else if (name === "loginPassword" || name === "registerPassword") {
      valid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);
      message = valid
        ? "Contrasena segura."
        : "Minimo 8 caracteres, con letras y numeros.";
    } else if (name === "registerName") {
      valid = /^[A-Za-z\u00C0-\u017F\s]{2,}$/.test(value);
      message = valid ? "Nombre valido." : "Usa solo letras y minimo 2 caracteres.";
    } else if (name === "registerPhone") {
      valid = /^[0-9+\s-]{8,}$/.test(value);
      message = valid ? "Telefono valido." : "Revisa el formato del telefono.";
    } else if (name === "registerConfirmPassword") {
      const password = $('input[name="registerPassword"]').val().trim();
      valid = value && value === password;
      message = valid ? "Las contrasenas coinciden." : "Las contrasenas no coinciden.";
    }

    setFeedback($field, message, valid);
    return valid;
  };

  const showView = (view) => {
    $(".switch-btn").removeClass("active");
    $(`.switch-btn[data-view="${view}"]`).addClass("active");
    $(".auth-form").removeClass("active");
    $(`#${view}Form`).addClass("active");
    $(".auth-title").text(view === "login" ? "Ingresar a Malibu" : "Crear cuenta Malibu");
  };

  $("[data-auth-open]").on("click", function (event) {
    event.preventDefault();
    const view = $(this).data("authOpen") || "login";
    showView(view);
    if (authModal) {
      authModal.show();
    }
  });

  $(".toggle-auth-view").on("click", function () {
    showView($(this).data("view"));
  });

  $("input").on("input", function () {
    const keepSymbols = this.type === "password" || this.type === "email";
    if (this.type !== "password") {
      $(this).val(sanitizeInput($(this).val(), keepSymbols));
    }
    validateField($(this));
  });

  const handleSubmit = ($form, successMessage) => {
    let allValid = true;
    $form.find("input").each(function () {
      if (!validateField($(this))) {
        allValid = false;
      }
    });

    if (!allValid) {
      return;
    }

    const $button = $form.find('button[type="submit"]');
    $button.addClass("loading").prop("disabled", true);

    setTimeout(() => {
      $button.removeClass("loading").prop("disabled", false);
      authModal.hide();
      $(".confirm-message").text(successMessage);
      confirmModal.show();
      $form[0].reset();
      $form.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
      $form.find(".input-feedback").text("").removeClass("error success");
    }, 1200);
  };

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    handleSubmit($(this), "Sesion iniciada. Tus favoritos y pedidos ya estan listos.");
  });

  $("#registerForm").on("submit", function (event) {
    event.preventDefault();
    handleSubmit($(this), "Cuenta creada con exito. Ya puedes explorar las colecciones Malibu.");
  });

  $("#year").text(new Date().getFullYear());
  showView(defaultView);
});
