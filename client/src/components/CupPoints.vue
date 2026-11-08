<template>
  <!-- Cup standings: options, the points table and PDF download -->
  <div class="cpoints">
    <div v-if="allCompetitions.length" class="fs-panel cpoints__tools">
      <v-select
        v-model="headerSelection"
        :items="headerOptions"
        :label="$t('comp.header')"
        density="comfortable"
        hide-details
        class="cpoints__field"
        @update:model-value="(v) => emit('change', v)"
      />
      <v-select
        v-model="selectedCompetitions"
        :items="selectNumbers"
        :label="$t('cup-page.counted')"
        density="comfortable"
        hide-details
        class="cpoints__field"
        @update:model-value="(v) => emit('calculate', v)"
      />
      <v-switch
        v-if="unfinishedCount"
        v-model="showUnfinishedCompetitions"
        :label="$t('comp.show-not-finished')"
        color="weighing"
        inset
        hide-details
        density="compact"
        @update:model-value="(v) => emit('sort', v)"
      />
      <v-spacer />
      <v-btn
        variant="text"
        prepend-icon="mdi-refresh"
        :loading="loading"
        :disabled="!isResults"
        @click="emit('refresh', cup)"
        >{{ $t("button.update") }}</v-btn
      >
      <v-btn
        color="results"
        prepend-icon="mdi-file-pdf-box"
        :disabled="!isResults"
        @click="dialog = true"
        >PDF</v-btn
      >
    </div>

    <FsSection
      tone="results"
      icon="mdi-podium"
      :title="$t('point-status')"
      flush
    >
      <template #actions>
        <v-text-field
          v-if="isResults"
          v-model="search"
          :label="$t('search-boat')"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
          bg-color="surface"
          class="cpoints__search"
        />
      </template>

      <v-data-table
        v-if="isResults"
        :headers="headers"
        :items="results"
        :search="search || ''"
        :loading="loading"
        density="comfortable"
      >
        <template
          v-for="h in headers"
          :key="h.key"
          #[`header.${h.key}`]="{ column: header }"
        >
          <span
            v-if="header.highlight"
            :class="{ cpoints__unfinished: !header.isFinished }"
            :title="header.isFinished ? undefined : $t('not-finished')"
          >
            <v-icon v-if="!header.isFinished" icon="mdi-timer-sand" size="14" />
            {{ header.title }}
          </span>
          <span v-else>{{ $t(header.title) }}</span>
        </template>
        <template #[`item.final_placement`]="{ item }">
          <PlacementBadge :placement="item.final_placement" />
        </template>
        <template
          v-for="comp in competitions"
          :key="comp.key_name"
          #[resultSlot(comp.key_name)]="{ item }"
        >
          <span
            v-if="item.cup_results[comp.key_name]"
            class="fs-num"
            :class="{
              cpoints__scored:
                item.cup_results[comp.key_name].points !==
                comp.cup_participation_points,
            }"
            >{{ item.cup_results[comp.key_name].points }}
            <span class="fs-muted"
              >({{ item.cup_results[comp.key_name].placement }}.)</span
            ></span
          >
          <span v-else class="fs-muted">–</span>
        </template>
        <template #[`item.final_cup_points`]="{ item }">
          <strong class="fs-num cpoints__total"
            >{{ item.final_cup_points }} p</strong
          >
        </template>
      </v-data-table>
      <p v-else-if="!loading" class="fs-muted pa-6">
        {{
          competitions.length ? $t("no-results") : $t("cup-page.no-finished")
        }}
      </p>
    </FsSection>

    <v-dialog v-model="dialog" max-width="480">
      <v-card :title="$t('pdf-settings')">
        <v-card-text>
          <v-checkbox
            v-model="isLandscape"
            :label="$t('pdf-landscape')"
            hide-details
          />
          <v-checkbox
            v-model="inkSaver"
            :label="$t('pdf-ink-saver')"
            hide-details
          />
          <v-checkbox
            v-model="showInfoInPdf"
            :label="$t('cup.show-important-amount')"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">{{
            $t("cancel")
          }}</v-btn>
          <v-btn
            color="results"
            variant="flat"
            prepend-icon="mdi-download"
            @click="download"
            >{{ $t("download") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getPdfInkSaver, setPdfInkSaver } from "@/pdf";
import FsSection from "./ui/FsSection.vue";
import PlacementBadge from "./results/PlacementBadge.vue";

defineOptions({ name: "CupPoints" });
const props = defineProps({
  competitions: { type: Array, default: () => [] },
  allCompetitions: { type: Array, default: () => [] },
  results: { type: Array, default: () => [] },
  cup: { type: Object, default: null },
  headers: { type: Array, default: () => [] },
  isResults: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  selectNumbers: { type: Array, default: () => [] },
});
const emit = defineEmits(["calculate", "change", "refresh", "save", "sort"]);
const { t } = useI18n();

const headerOptions = computed(() => [
  { value: "locality", title: t("locality") },
  { value: "name", title: t("name") },
]);
const headerSelection = ref("locality");
const selectedCompetitions = ref(props.competitions.length);
const search = ref("");
const showInfoInPdf = ref(false);
const showUnfinishedCompetitions = ref(false);
const isLandscape = ref(false);
const inkSaver = ref(getPdfInkSaver());
const dialog = ref(false);

const unfinishedCount = computed(
  () => props.allCompetitions.filter((c) => !c.isFinished).length,
);

// Vue can't parse "[" "]" inside a dynamic slot name in the template
function resultSlot(c) {
  return `item.cup_results[${c}].points`;
}

function download() {
  dialog.value = false;
  setPdfInkSaver(inkSaver.value);
  emit("save", {
    selectedCompetitions: selectedCompetitions.value,
    isLandscape: isLandscape.value,
    showInfoInPdf: showInfoInPdf.value,
  });
}

onMounted(() => {
  if (props.cup?.meaningful_competitions > 0)
    selectedCompetitions.value = props.cup.meaningful_competitions;
  else selectedCompetitions.value = props.competitions.length;
});
</script>

<style scoped>
.cpoints {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cpoints__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 14px 20px;
}
.cpoints__field {
  flex: 0 1 220px;
  min-width: 180px;
}
.cpoints__search {
  width: 240px;
}
.cpoints__unfinished {
  font-style: italic;
  opacity: 0.75;
}
.cpoints__scored {
  font-weight: 700;
}
.cpoints__total {
  font-size: 16px;
}
</style>
