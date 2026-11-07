<template>
  <!-- PDF orientation before downloading -->
  <v-dialog v-model="open" width="500">
    <v-card>
      <v-card-title>Pdf {{ $t("settings") }}</v-card-title>
      <v-card-text>
        <v-checkbox
          :label="$t('pdf-landscape')"
          v-model="landscape"
        ></v-checkbox>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="yellow" variant="text" @click="open = false">{{
          $t("cancel")
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
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
