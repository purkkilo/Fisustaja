<template>

    <div class="container">
        <Timedate/>
        <h1><b>Todo: tähän jotain tarpeellista</b></h1>
    </div>
</template>

<script>
    import Timedate from '../components/layout/Timedate';
    export default {
        data () {
            return {
            }
        },
        components: {
            Timedate,
        },
        mounted() {
            this.$store.commit('refreshCompetition', null);
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
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>