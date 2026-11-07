<template>
  <!-- Start/end date and start/end time of a competition -->
  <div>
    <v-row class="justify-center align-center" style="padding: 20px">
      <v-col cols="12" md="6">
        <h2 class="text-white">{{ $t("starting-date") }}</h2>
        <v-date-picker
          v-model="startDate"
          style="height: 480px"
          elevation="4"
          class="mt-4"
          first-day-of-week="1"
          :disabled="disabled"
          width="100%"
        ></v-date-picker>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-white">{{ $t("ending-date") }}</h2>
        <v-date-picker
          v-model="endDate"
          style="height: 480px"
          elevation="4"
          class="mt-4"
          first-day-of-week="1"
          :disabled="disabled"
          width="100%"
        ></v-date-picker>
      </v-col>
    </v-row>
    <v-row class="justify-center align-center" style="padding: 20px">
      <v-col cols="12" md="6">
        <h2 class="text-white">{{ $t("starting-time") }}</h2>
        <v-time-picker
          v-model="startTime"
          format="24hr"
          scrollable
          elevation="4"
          :disabled="disabled"
          width="100%"
        ></v-time-picker>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-white">{{ $t("ending-time") }}</h2>
        <v-time-picker
          v-model="endTime"
          format="24hr"
          scrollable
          elevation="4"
          :disabled="disabled"
          width="100%"
        ></v-time-picker>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const startDate = defineModel("startDate");
const endDate = defineModel("endDate");
const startTime = defineModel("startTime");
const endTime = defineModel("endTime");
defineProps({ disabled: { type: Boolean, default: false } });
</script>
