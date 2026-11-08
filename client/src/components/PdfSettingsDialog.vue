<template>
  <!-- PDF orientation / ink mode before downloading -->
  <v-dialog v-model="open" max-width="440">
    <v-card :title="$t('pdf-settings')">
      <v-card-text>
        <v-checkbox
          v-model="landscape"
          :label="$t('pdf-landscape')"
          hide-details
        />
        <v-checkbox
          v-model="inkSaver"
          :label="$t('pdf-ink-saver')"
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open = false">{{ $t("cancel") }}</v-btn>
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
</template>

<script setup>
import { ref, watch } from "vue";
import { getPdfInkSaver, setPdfInkSaver } from "@/pdf";

const open = defineModel({ type: Boolean, default: false });
const landscape = defineModel("landscape", { type: Boolean, default: false });
const emit = defineEmits(["download"]);

const inkSaver = ref(getPdfInkSaver());
watch(open, (isOpen) => {
  if (isOpen) inkSaver.value = getPdfInkSaver();
});

function download() {
  setPdfInkSaver(inkSaver.value);
  open.value = false;
  emit("download");
}
</script>
