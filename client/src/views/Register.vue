<template>
    <div class="container">
      <Timedate/>
      <div class="container-transparent" style="margin-top:10px">

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
        <h4>Register</h4>
        <form>
            <div class="row">
                <div class="input-fields col s8 push-s2">
                    <span class="flow-text black-text col s6"
                    >Käyttäjänimi</span
                    >                    
                    <input
                    id="name"
                    v-model="name"
                    name="name"
                    type="text"
                    class="validate col s6"
                    maxlength="40"
                    />
                </div>
            </div>
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
            <div class="row">
                <div class="input-fields col s8 push-s2">
                    <span class="flow-text black-text col s6"
                    >Salasana Vahvistus</span
                    >                    
                    <input
                    id="password_confirmation"
                    v-model="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    class="validate col s6"
                    maxlength="40"
                    />
                </div>

            </div>
            <div class="row">
                <div class="input-fields col s8 push-s2 valign-wrapper">
                    <span class="col s6 flow-text">Admin?</span>
                    <p class="col s3 push flow-text">
                      <label>
                        <input class="with-gap" name="group1" type="radio" value="Kyllä" v-model="is_admin"/>
                        <span class="flow-text black-text">Kyllä</span>
                      </label>
                    </p>
                    <p class="col s3 flow-text">
                      <label>
                        <input class="with-gap" name="group1" value="Ei" v-model="is_admin" type="radio"/>
                        <span class="black-text">Ei</span>
                      </label>
                    </p>
                </div>
            </div>
            <ProgressBarQuery v-if="loading" style="margin-bottom:20px"/>
            <button
                style="margin-bottom:20px"
                v-else
                class="waves-effect waves-light blue darken-4 btn-large"
                v-on:click="handleSubmit"
                ><i class="material-icons left">login</i>Rekisteröidy</button
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
        props : ["nextUrl"],
        data(){
            return {
                errors: [],
                name : "",
                email : "",
                password : "",
                password_confirmation : "",
                is_admin : "Ei",
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
                this.loading = true;
                e.preventDefault();
                if(!this.email){
                    this.showError("Syötä sähköposti!");
                }
                if(!this.password) {
                    this.showError("Syötä salasana!");
                }
                if(!this.name){
                    this.showError("Syötä nimi!");
                }
                if (this.password === this.password_confirmation && this.password.length > 0)
                {


                    if(this.is_admin == "Kyllä"){
                        let admin =  true;
                        const user = {
                                name: this.name,
                                email: this.email,
                                password: this.password,
                                is_admin: admin                
                        };
                        await UserService.insertAdmin(user)
                        .then(response => {
                            let is_admin = JSON.stringify(response.data.user.is_admin);
                            localStorage.setItem('user',JSON.stringify({id:response.data.user._id ,name: response.data.user.name, email: response.data.user.email, is_admin: response.data.user.is_admin, createdAt: response.data.user.createdAt}));
                            localStorage.setItem('jwt',response.data.token);
                            this.$store.state.logged_in = true;
                            this.$store.state.is_admin = true;
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
                        .catch(error => {
                            this.loading = false;
                            this.showError(error);
                        });
                    }
                    else {
                        const user = {
                                name: this.name,
                                email: this.email,
                                password: this.password,               
                        };
                        await UserService.insertUser(user)
                        .then(response => {
                            localStorage.setItem('user',JSON.stringify({id:response.data.user._id ,name: response.data.user.name, email: response.data.user.email, is_admin: false, createdAt: response.data.user.createdAt}));
                            localStorage.setItem('jwt',response.data.token);
                            this.$store.state.logged_in = true;
                            this.$store.state.is_admin = false;
                            if (localStorage.getItem('jwt') != null){
                                this.$emit('loggedIn')
                                if(this.$route.params.nextUrl != null){
                                    this.$router.push(this.$route.params.nextUrl)
                                }
                                else {
                                    this.$router.push('dashboard');
                                }
                            }
                            this.loading = false;
                        })
                        .catch(err => {
                            if (err.response.status === 500) {
                                this.loading = false;
                                this.showError("Ongelma käyttäjän rekisteröimisessä... Tarkasta tiedot ja yritä uudelleen");
                                return;
                            }
                            this.loading = false;
                            return console.log(err)
                        });
                    }
                } else {
                    this.loading = false;
                    this.showError("Salasanat eivät vastaa toisiaan!");
                }
            }
        }
    }
</script>