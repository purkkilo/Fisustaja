<template>
    <div class="container">
        <Timedate/>
        <div class="container-transparent">
            <div class="section">
                <div class="col s12 center-align"><h1>Fisustaja - Dashboard</h1></div>
            </div>
        
            <div class="section row inputarea">
                <div class="col s12">
                    <div v-if="user">
                        <h3><b>{{ user.name }}</b></h3>
                        <h3><b>{{ user.email }}</b></h3>
                        <h3><b>Tili luotu: {{ created }}</b></h3>
                    </div>

                    <div class="divider black"></div>
                    <div class="section">
                        <div class="row">
                            
                            <div class="col s6 center-align">
                                <router-link to="/register-comp">
                                    <a class="waves-effect waves-light blue lighten-1 btn-large"><i class="material-icons left">add_circle_outline</i>Uusi kilpailu</a>
                                </router-link>
                            </div>
                            
                            <div class="col s6 center-align">
                                <router-link to="/continue">
                                <a class="waves-effect waves-light green lighten-1 btn-large"><i class="material-icons left">play_circle_filled</i>Jatka kilpailua</a>
                                </router-link>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Timedate from '../components/layout/Timedate';
import moment from 'moment';

export default {
    name: 'Home',
    components: {
      Timedate
    },
    data() {
        return {
            user: null,
            created: null,
        }
    },
    mounted() {
        this.$store.commit('refreshCompetition', null);
        this.checkLogin();
        localStorage.removeItem("competition");
        if(localStorage.getItem('user') != null){
            this.user = JSON.parse(localStorage.getItem('user'));
            let createdAt = moment(this.user.createdAt);
            this.created = `${createdAt.date()}.${createdAt.month()+1}.${createdAt.year()}`;

        }

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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
    background-image: url('../assets/background_waterdrop.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}

</style>
