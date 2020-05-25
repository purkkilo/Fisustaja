<template>
  <div class="container">
    <Timedate />
    <h1>Competition overview</h1>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';

export default {
  name: 'Overview',
  components: {
    Timedate
  }
}
</script>