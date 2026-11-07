import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// SweetAlert2 dialogs with the API of the old vue-simple-alert plugin:
//   alert(message, title, type)   -> resolves when closed
//   confirm(message, title, type) -> resolves true on OK, rejects on cancel
// Import them in components: import { confirm } from "@/plugins/alerts";

export function alert(message, title, type, options = {}) {
  return Swal.fire({ title, text: message, icon: type, ...options }).then(
    () => true,
  );
}

export function confirm(message, title, type = "question", options = {}) {
  return Swal.fire({
    title,
    text: message,
    icon: type,
    showCancelButton: true,
    ...options,
  }).then((result) => {
    if (result.isConfirmed) return true;
    // vue-simple-alert rejected with no value on cancel
    return Promise.reject();
  });
}
