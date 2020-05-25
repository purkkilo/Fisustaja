<template>
  <div class="about container">
    <Timedate />
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';

export default {
  name: 'About',
  components: {
    Timedate
  }
}
</script>