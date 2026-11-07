import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Same API as the old vue-simple-alert plugin (which has no Vue 3 version):
//   this.$alert(message, title, type)   -> resolves when closed
//   this.$confirm(message, title, type) -> resolves true on OK, rejects on cancel
//   this.$fire(options)                 -> Swal.fire(options)

function alert(message, title, type, options = {}) {
  return Swal.fire({ title, text: message, icon: type, ...options }).then(
    () => true
  );
}

function confirm(message, title, type = "question", options = {}) {
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

export default {
  install(app) {
    app.config.globalProperties.$alert = alert;
    app.config.globalProperties.$confirm = confirm;
    app.config.globalProperties.$fire = (options) => Swal.fire(options);
  },
};
