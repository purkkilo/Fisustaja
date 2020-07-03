<template>
    <div class="container" style="margin-top:100px">
        <MainHeader />
        <div class="section">
            <div class="col s12 center-align"><h1>Fisustaja</h1></div>
        </div>

        <div class="section row inputarea">
            <div class="col s12">
                <h4>Sovellus kalastuskilpailujen järjestämistä varten</h4>
            </div>
        </div>
    </div>

</template>

<script>
import MainHeader from '../components/layout/MainHeader';

export default {
    name: 'Home',
    components: {
        MainHeader,
    },
    data() {
        return {
        }
    },
    mounted() {
        this.checkLogin();
        localStorage.removeItem("competition");
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
