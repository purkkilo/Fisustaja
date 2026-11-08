import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/styles/alerts.css";
import { t } from "@/i18n";

// SweetAlert2 dialogs with the API of the old vue-simple-alert plugin:
//   alert(message, title, type)   -> resolves when closed
//   confirm(message, title, type) -> resolves true on OK, rejects on cancel
// Import them in components: import { confirm } from "@/plugins/alerts";

function isDark() {
  return (
    !!document.querySelector(".v-theme--dark") ||
    !!JSON.parse(localStorage.getItem("preferences") || "{}").isDark
  );
}

function isDestructive(title, type) {
  return (
    type === "warning" ||
    type === "error" ||
    /delete|poista|remove/i.test(String(title || ""))
  );
}

function baseOptions(title, message, type, options = {}) {
  const dark = isDark();
  const destructive = isDestructive(title, type);
  return {
    title,
    text: message,
    icon: type,
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: destructive,
    confirmButtonText: destructive ? t("delete") : t("confirm"),
    cancelButtonText: t("cancel"),
    customClass: {
      container: "fs-swal-container",
      popup: `fs-swal${dark ? " fs-swal--dark" : ""}`,
      title: "fs-swal__title",
      htmlContainer: "fs-swal__text",
      icon: "fs-swal__icon",
      actions: "fs-swal__actions",
      confirmButton: `fs-swal__btn fs-swal__btn--confirm${
        destructive ? " fs-swal__btn--danger" : ""
      }`,
      cancelButton: "fs-swal__btn fs-swal__btn--cancel",
    },
    ...options,
  };
}

export function alert(message, title, type, options = {}) {
  return Swal.fire(baseOptions(title, message, type, options)).then(() => true);
}

export function confirm(message, title, type = "question", options = {}) {
  return Swal.fire({
    ...baseOptions(title, message, type, options),
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) return true;
    // vue-simple-alert rejected with no value on cancel
    return Promise.reject();
  });
}
