<template>
  <!-- Back / modify / continue buttons at the bottom of each wizard step -->
  <v-row style="margin: 20px 0">
    <v-col v-if="showBack">
      <v-btn rounded="0" color="blue-lighten-2" @click="emit('back')" size="large"
        ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
      >
    </v-col>
    <v-col v-if="locked">
      <v-btn rounded="0" color="grey" @click="emit('unlock')" size="large"
        ><v-icon>mdi-pencil</v-icon>{{ $t("modify-info") }}</v-btn
      >
    </v-col>
    <v-col>
      <!-- an unlocked step is validated first, a locked one just moves on -->
      <v-btn
        rounded="0"
        color="green"
        @click="emit(locked ? 'next' : 'validate')"
        size="large"
        ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  locked: { type: Boolean, default: false },
  showBack: { type: Boolean, default: true },
});
const emit = defineEmits(["back", "unlock", "validate", "next"]);
</script>
