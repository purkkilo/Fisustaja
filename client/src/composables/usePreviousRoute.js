import { computed } from "vue";
import { useRouter } from "vue-router";

/**
 * The route the user came from (for "back" buttons), or null.
 * Vue Router keeps the previous path in history.state.back.
 */
export function usePreviousRoute() {
  const router = useRouter();
  return computed(() => {
    // re-evaluate on every navigation
    void router.currentRoute.value.fullPath;
    const back = window.history.state?.back;
    return back ? router.resolve(back) : null;
  });
}
