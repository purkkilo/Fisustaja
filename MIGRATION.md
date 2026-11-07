# Vue 2 → Vue 3 migration (November 2026)

The client was still on Vue 2.7.16 + Vuetify 2 + Vue CLI 4. Nothing had been
migrated yet. The last step had been the January 2026 bump to the final
Vue 2 release. This migration moves it to the current stable stack.

There is no Vue 4. Vue 3.5 is the newest stable line (3.6 is in release
candidates). Vuetify, Vue Router and Pinia have newer majors, listed below.

| Before | After |
| --- | --- |
| Vue 2.7.16 | Vue 3.5 |
| Vuetify 2.7 | Vuetify 4.3 |
| Vue CLI 4 (webpack, babel) | Vite 8 |
| Vuex 3 | Pinia 4 |
| Vue Router 3 | Vue Router 5 |
| vue-i18n 8 | vue-i18n 11 (composition mode) |
| vue-chartjs 4 (legacy) + Chart.js 3 | vue-chartjs 5 + Chart.js 4 |
| jsPDF 2 + AutoTable 3 | jsPDF 4 + AutoTable 5 |
| vuedraggable 2 | vuedraggable 4 |
| vue-simple-alert | small SweetAlert2 plugin with the same `$alert` / `$confirm` API |
| vue-select (registered, never used) | removed |
| Material Icons + MDI from CDN | `@mdi/font` package |

## First run

The new code was written without running `npm install` (no network where it was
made), so the first install and test run happen on your machine.

```bash
cd client
# old Vue CLI files that Vite must not see
git rm vue.config.js babel.config.js public/index.html package-lock.json
rm -rf node_modules
npm install
npm run dev        # http://localhost:8080, /api is proxied to port 5000
```

In another terminal, from the repo root: `npm run server`.

`client/public/index.html` must be gone: Vite uses `client/index.html`.

## What changed in the code

### Setup
- `main.js` uses `createApp`. Pinia, the router, i18n, Vuetify and the alert plugin are installed there.
- `vite.config.js` replaces `vue.config.js`. Same proxy, same output folder (`../server/public`).
- `index.html` moved to `client/`. Env vars are `VITE_*` now (`VUE_APP_*` still load too).
- `src/plugins/vuetify.js`: `createVuetify` with the Vuetify 2 colour palette,
  the old breakpoints (960/1280/1920) so the `md`/`lg` layouts stay the same, and
  underlined text fields like in Vuetify 2. Vuetify's own texts follow the vue-i18n language.
- `src/styles/vuetify-compat.css` puts back the Vuetify 2 margin reset and
  wrapping card titles.

### Store
- `src/store/index.js` is a Pinia store with the same getter and action names.
  It's exposed as `this.$store`, so components use `this.$store.getCompetition`
  and `this.$store.refreshCompetition(c)` (no `getters.` / `commit()` any more).
- Dark mode is handled by Vuetify's theme (`App.vue` watches `$store.isDark`).
  The 135 per-component `:dark="..."` bindings are gone.

### Vuetify 2 → 4 template changes (all components and views)
- `v-list-item-content` removed, `v-list-item-icon`/`-avatar` → `prepend` slot.
- `v-tabs-items`/`v-tab-item` → `v-window`/`v-window-item`. `href="#x"` → `value="x"`.
- `outlined`/`text`/`solo` → `variant`, `large`/`small` → `size`, `left`/`right` → `start`/`end`.
- `append-outer-icon` → `append-icon`, `append-icon` → `append-inner-icon`.
- `item-text` → `item-title`, `@input`/`@change` → `@update:model-value`.
- Activator slots `{ on, attrs }` → `{ props }`, `v-hover` → `{ isHovering, props }`.
- Colour names `blue darken-4` → `blue-darken-4`, classes `white--text` → `text-white`,
  `grey darken-4` → `bg-grey-darken-4`.
- `v-row align/justify` → utility classes. Elevations mapped to the 0–5 scale.
  Typography classes (`headline`, `display-1`) → Material 3 names.
- Data tables: headers go through `$tableHeaders()` (adds the `title`/`key` that
  Vuetify 3+ needs). `@click:row` handlers get `(event, { item })`.
- Select/autocomplete item slots render their own `v-list-item`. The boat search
  in Weighting uses `custom-filter`.
- Dashboard's year picker is now a year dropdown.
- The sub-navigation inside the app bar is a button group (`v-bottom-navigation`
  is a fixed bottom bar in Vuetify 3+).

### Other fixes along the way
- `App.vue` had a hook named `NotificationBarted()` (a find-and-replace accident), so saved
  preferences never loaded on startup. It's `created()` again.
- `parseJwt` used Node's `Buffer`, which webpack 4 polyfilled. It uses `atob` now.
- Components that `$emit` declare `emits`, so parent listeners don't also land on the root element.
- New fish rows in CompSettings get unique ids (deleting and re-adding could duplicate them).

## Check these by hand

There are no tests, so click through these screens:

1. **Login / logout / register**, and the dark mode switch and language switch in the drawer.
2. **Create competition**: date and time pickers, the fish species combobox (create, edit, remove chips).
3. **Comp settings**: drag to reorder fish rows, +/- multiplier buttons, delete fish confirmation.
4. **Signing**: team combobox, row click in the table, delete confirmation.
5. **Weighting**: boat search (typing a name or number), row clicks in both tables, saving weights.
6. **Results / Public results**: tables, charts, PDF export (charts are read from the canvas ids).
7. **Cup overview / Public cups**: PDF export, editing a signee (dialog per row).
8. **Admin**: user list (menu per user), competition table.

## If the layout looks off

Vuetify 4 changed a few visual defaults on purpose. Each can be reverted:

- **Grid spacing**: rows use CSS `gap` instead of negative margins. To get the
  old spacing back, add the "Grid legacy mode" CSS from the Vuetify docs to `vuetify-compat.css`.
- **Shadows**: Material 3 shadows are lighter. The Vuetify "Elevation migration" page has the MD2 shadow CSS.
- **Buttons**: no longer uppercase. Add `defaults: { VBtn: { class: 'text-uppercase' } }` in `plugins/vuetify.js`.
- **Breakpoints**: the old ones are kept in `plugins/vuetify.js`. Remove `display.thresholds` to use Vuetify 4's.

`npm run lint` runs eslint-plugin-vuetify's v2→v3 and v3→v4 rules and points at anything left over.
