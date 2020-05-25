<template>
  <div id="app">
    <div class="container">
      <Timedate />
      <CompetitionComponent />
    </div>
  </div>
</template>

<script>
import CompetitionComponent from '../components/CompetitionComponent.vue'
import Timedate from '../components/layout/Timedate';

export default {
  name: 'ContinueComp',
  components: {
    CompetitionComponent,
    Timedate
  }
}
</script>

<style>

</style>
