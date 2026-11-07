import UserService from "@/services/UserService";
import { useMainStore } from "@/store";

let bootstrapPromise = null;

/** Resolve the session once from HttpOnly cookies (/me, with refresh via interceptor). */
export function bootstrapAuth() {
  const store = useMainStore();
  if (store.authChecked) {
    return Promise.resolve(store.logged_in);
  }
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        const res = await UserService.getMe();
        if (res?.success && res.user) {
          store.setSession(res.user);
        } else {
          store.clearSession();
        }
      } catch {
        store.clearSession();
      } finally {
        store.authChecked = true;
      }
      return store.logged_in;
    })();
  }
  return bootstrapPromise;
}
