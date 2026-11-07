<template>
  <!-- Cup points per placement (#1 = 30p, #2 = 28p...), editable -->
  <v-row class="justify-center" style="margin: 20px 0">
    <v-col cols="6">
      <h2 class="text-white">{{ $t("placement-points") }}</h2>
      <v-list elevation="5" style="max-height: 400px; overflow-y: auto" border>
        <template v-for="(p, index) in points" :key="index">
          <v-list-item>
            <v-row class="align-center">
              <v-col>
                <h3>#{{ p.placement }}</h3>
              </v-col>
              <v-col>
                <v-text-field
                  v-if="!readonly"
                  :label="$t('points')"
                  v-model="p.points"
                  :rules="rules.number"
                  :disabled="disabled || !editing"
                  @blur="sortByPoints"
                />
                <p v-else>{{ p.points }}p</p>
              </v-col>
              <v-col v-if="editing">
                <v-btn @click="remove(index)" color="red">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-list>
      <template v-if="!readonly && !disabled">
        <v-row v-if="editing">
          <v-col>
            <v-btn color="green" @click="add"
              ><v-icon>mdi-plus</v-icon>{{ $t("add-placement") }}</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="editing">
            <v-btn block color="yellow" @click="cancel"
              ><v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}</v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              block
              :color="editing ? 'green-darken-2' : 'grey'"
              @click="editing ? confirm() : startEditing()"
              ><v-icon>mdi-check</v-icon
              >{{ editing ? $t("confirm") : $t("modify") }}</v-btn
            >
          </v-col>
        </v-row>
      </template>
    </v-col>
    <v-col cols="2" v-if="editing">
      <div style="margin-top: 200px">
        <p>
          {{ $t("restore-original-points") }}:<br />#1 = 30, #2 = 28, #3 = 26...
        </p>
        <v-btn color="red" @click="restoreDefaults">{{ $t("restore") }}</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { useRules } from "@/composables/useRules";
import constants from "@/data/constants";

const points = defineModel({ type: Array, required: true });
defineProps({
  disabled: { type: Boolean, default: false },
  // only show the points (summary view)
  readonly: { type: Boolean, default: false },
});

const rules = useRules();
const editing = ref(false);
let backup = [];
const copy = (value) => JSON.parse(JSON.stringify(value));

function renumber() {
  points.value.forEach((p, i) => (p.placement = i + 1));
}

function sortByPoints() {
  points.value.sort((a, b) => b.points - a.points);
  renumber();
}

function add() {
  const last = points.value.at(-1);
  points.value.push({
    points: last && last.points > 1 ? last.points - 1 : 1,
    placement: (last?.placement ?? 0) + 1,
  });
}

function remove(index) {
  points.value.splice(index, 1);
  renumber();
}

function startEditing() {
  backup = copy(points.value);
  editing.value = true;
}

function cancel() {
  points.value = backup;
  editing.value = false;
}

function confirm() {
  renumber();
  editing.value = false;
}

function restoreDefaults() {
  points.value = copy(constants.placement_points);
  editing.value = false;
}
</script>
