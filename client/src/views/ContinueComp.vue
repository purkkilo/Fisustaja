<template>
    <div class="container">
      <Timedate/>
      <CompetitionComponent />
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
    },
    mounted() {
        this.checkLogin();
    },
    methods: {
        checkLogin: function() {
            if(localStorage.getItem('jwt') != null){
                this.$store.state.logged_in = true;
                let user = JSON.parse(localStorage.getItem('user'));
                user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
            }
            else {
                this.$store.state.logged_in = false;
                this.$store.state.is_admin = false;
            }
        },
    },
}
</script>

<style>

</style>
