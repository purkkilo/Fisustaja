<template>
    <div class="container">
      <Timedate/>
      <div class="container-transparent" style="margin-top:50px">
        <div id="errordiv" v-if="errors.length">
            <ul class="collection with-header">
            <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
            <li
                class="collection-item flow-text"
                id="error"
                v-for="(error, index) in errors"
                v-bind:key="index"
            >
                {{ index + 1 }}. {{ error }}
            </li>
            </ul>
        </div>
        <h1>Login</h1>
        <form>
            <div class="row">
                <div class="input-fields col s8 push-s2">
                    <span class="flow-text black-text col s6"
                    >Sähköpostiosoite</span
                    >                    
                    <input
                    id="email"
                    v-model="email"
                    name="email"
                    type="text"
                    class="validate col s6"
                    maxlength="40"
                    />
                </div>
            </div>
            <div class="row">
                <div class="input-fields col s8 push-s2">
                    <span class="flow-text black-text col s6"
                    >Salasana</span
                    >                    
                    <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    class="validate col s6"
                    maxlength="40"
                    />
                </div>
            </div>
            <ProgressBarQuery v-if="loading" style="margin-bottom:20px"/>
            <button
                v-else
                style="margin-bottom:20px"
                class="waves-effect waves-light blue darken-4 btn-large"
                v-on:click="handleSubmit"
                ><i class="material-icons left">login</i>Kirjaudu</button
            >
        </form>
      </div>
    </div>
</template>
<script>
import M from "materialize-css";
import "vue-select/dist/vue-select.css";
import UserService from '../UserService';
import Timedate from '../components/layout/Timedate';
import ProgressBarQuery from '../components/layout/ProgressBarQuery';

export default {
    data(){
        return {
            errors: [],
            email : null,
            password : null,
            loading: false,
        }
    },
    components: {
      Timedate,
      ProgressBarQuery
    },
    methods : {
        showError: function(error) {
            this.errors.push(error);
            M.toast({ html: error });
            location.href = "#";
            location.href = "#app";
        },
        async handleSubmit(e) {
                e.preventDefault();
                this.loading = true;
                this.errors = [];
                if (!this.email) {
                    this.showError("Syötä sähköposti!");
                }
                if (!this.password) {
                    this.showError("Syötä salasana!");
                }
                if(!this.errors.length) {
                    const user = {
                        email: this.email,
                        password: this.password                    
                    };
                    try {
                        await UserService.loginUser(user)
                        .then(response => {
                            let is_admin = JSON.stringify(response.data.user.is_admin);
                            localStorage.setItem('user',JSON.stringify({id:response.data.user._id ,name: response.data.user.name, email: response.data.user.email, is_admin: response.data.user.is_admin, createdAt: response.data.user.createdAt}));
                            localStorage.setItem('jwt',response.data.token);
                            this.$store.state.logged_in = true;
                            if (localStorage.getItem('jwt') != null){
                                this.$emit('loggedIn')
                                if(this.$route.params.nextUrl != null){
                                    this.$router.push(this.$route.params.nextUrl)
                                }
                                else {
                                    if(is_admin == true){
                                        this.$store.state.is_admin = true;
                                        this.$router.push('admin')
                                    }
                                    else {
                                        this.$router.push('dashboard')
                                    }
                                }
                            }
                            this.loading = false;                    
                        })
                        .catch(err => {
                            if (err.response.status === 401 || err.response.status === 404) {
                                this.loading = false; 
                                this.showError("Käyttäjänimi tai salasana ei täsmää!");
                                return;
                            }
                            this.loading = false;
                            return console.log(err);
                        })
                    } catch (error) {
                    console.log(error);
                    this.showError("Näillä tiedoilla ei löytynyt käyttäjää!");
                    this.$router.push("/login");
                }
                }
        },
    }
}
</script>