<template>
  <!-- PDF orientation before downloading -->
  <v-dialog v-model="open" max-width="440">
    <v-card :title="$t('pdf-settings')">
      <v-card-text>
        <v-checkbox
          v-model="landscape"
          :label="$t('pdf-landscape')"
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
          @click="
            open = false;
            emit('download');
          "
          >{{ $t("download") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const open = defineModel({ type: Boolean, default: false });
const landscape = defineModel("landscape", { type: Boolean, default: false });
const emit = defineEmits(["download"]);
</script>
