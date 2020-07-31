<template>
    <!-- /register -->  
    <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
    <div class="container">
      <MainHeader />
      <div class="container-transparent" style="margin-top:100px">
        <v-container>
            <div id="errordiv" v-if="errors.length">
            <ul class="collection with-header" style="border:1px solid red;">
                <li class="collection-header" style="background: rgba(0,0,0,0);">
                <v-alert type="error">
                    Korjaa seuraavat virheet:
                </v-alert>
                </li>
                <li class="collection-item" id="error" v-for="(error,index) in errors" v-bind:key="index">
                <p class="flow-text">{{ index+1}}. {{ error }}</p>
                </li>
            </ul>
            </div>
            <v-row>
                <v-col>
                    <h4>Register</h4>
                </v-col>
            </v-row>
            <form>
                <v-row>
                    <v-col md="8" offset-md="2" class="input-fields">
                        <v-text-field
                            label="Käyttäjänimi"
                            id="name"
                            @paste.prevent
                            v-model="name"
                            name="name"
                            type="text"
                            maxlength="40"
                            :loading="loading"
                            :counter="40"
                        />                  
                    </v-col>              
                </v-row>
                <v-row>
                    <v-col md="8" offset-md="2" class="input-fields">
                        <v-text-field
                            label="Sähköpostiosoite"
                            id="email"
                            @paste.prevent
                            v-model="email"
                            name="email"
                            type="email"
                            maxlength="40"
                            :loading="loading"
                            :counter="40"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="8" offset-md="2" class="input-fields">
                        <v-text-field
                            label="Salasana"
                            id="password"
                            @paste.prevent
                            v-model="password"
                            name="password"
                            type="password"
                            maxlength="40"
                            :loading="loading"
                            :counter="40"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="8" offset-md="2" class="input-fields">
                        <v-text-field
                            label="Salasanan vahvistus"
                            id="password_confirmation"
                            @paste.prevent
                            v-model="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            maxlength="40"
                            :loading="loading"
                            :counter="40"
                        />
                    </v-col>
                </v-row>
                <!-- If user has typed at least one letter to password and password confirmation and both are the same-->  
                <v-row v-if="password && (password === password_confirmation)">
                    <v-col>
                        <span class="flow-text">Salasanat täsmäävät! <i class="material-icons green-text">done_outline</i></span> 
                    </v-col>
                </v-row>
                <!-- If password and password confirmation differs from each other-->
                <v-row v-else>
                    <!-- if both inputs have text, show this-->
                    <v-col v-if="password && password_confirmation">
                        <span class="flow-text red-text">Salasanat ei täsmää! <i class="material-icons red-text">error_outline</i></span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="8" offset-md="2" class="input-fields">
                        <span class="col s6 flow-text">Admin?</span>
                        <v-radio-group v-model="is_admin" row>
                            <v-radio label="Kyllä" value="Yes"></v-radio>
                            <v-radio label="Ei" value="No"></v-radio>
                          </v-radio-group>
                    </v-col>
                </v-row>
                <ProgressBarQuery v-if="loading" style="margin-bottom:20px"/>
                <!-- Button only active if passwords match  -->
                <v-row v-else>
                    <v-col>
                        <v-btn id="sbtn" large tile color="blue darken-4" class="white--text" @click="handleSubmit" :disabled="password.length === 0 || (password !== password_confirmation)">
                            <i class="material-icons left">login</i>Rekisteröidy
                        </v-btn>
                    </v-col> 
                </v-row>
            </form>
        </v-container>
      </div>
    </div>
</template>
<script>
    "use strict";
    import M from "materialize-css";
    import "vue-select/dist/vue-select.css";
    import UserService from '../UserService';
    import MainHeader from '../components/layout/MainHeader';
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
                is_admin : "No",
                loading: false,
            }
        },
        components: {
            MainHeader,
            ProgressBarQuery
        },
        mounted() {
            // Press button by enter key when focusing password_confirmation input
            var input = document.getElementById('password_confirmation');
            input.addEventListener("keyup", function(event){
                if (event.keyCode === 13){
                    event.preventDefault();
                    document.getElementById("sbtn").click();
                }
            })

            // Focus on top of the page when changing pages
            location.href = "#";
            location.href = "#app";
        },
        methods : {
            // Add error to error array and direct user to it
            showError: function(error) {
                this.errors.push(error);
                M.toast({ html: error });
                location.href = "#";
                location.href = "#app";
            },
            // Submit register credentials and confirm user login
            async handleSubmit(e) {
                this.loading = true;
                e.preventDefault();
                this.errors = [];
                //TODO check if it's really an email adress
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
                    if(!this.errors.length) {

                        // Check if  user has already registered with this email
                        let users = await UserService.getEmail(this.email);
                        // User(s) found
                        if(users.length){
                            this.showError("Tällä sähköpostilla on jo rekisteröitynyt käyttäjä!");
                            this.loading = false;
                        }
                        // No user found, so register user
                        else {
                        //TODO more password validation (password length etc.)
                            // If value of radiobox is "Yes"
                            if(this.is_admin == "Yes"){
                                // User object, as admin
                                const user = {
                                        name: this.name,
                                        email: this.email,
                                        password: this.password,
                                        is_admin: true                
                                };
                                // Add admin to database (check 'client\src\UserServiceService.js' and 'server\routes\api\users.js' to see how this works) 
                                await UserService.insertAdmin(user)
                                .then(response => {
                                    // If no errors, log in the user
                                    // Set values to localstorage and vuex
                                    localStorage.setItem('user', JSON.stringify({id:response.data.user._id ,name: response.data.user.name, email: response.data.user.email, is_admin: response.data.user.is_admin, createdAt: response.data.user.createdAt}));
                                    localStorage.setItem('jwt', response.data.token);
                                    this.$store.state.logged_in = true;
                                    this.$store.state.is_admin = true;
                                    
                                    // Redirect
                                    if (localStorage.getItem('jwt') != null){
                                        this.$emit('loggedIn');
                                        // if route.params.nextURL not set, redirect to dashboard
                                        if(this.$route.params.nextUrl != null){
                                            this.$router.push(this.$route.params.nextUrl)
                                        }
                                        else {
                                            this.$router.push({path: '/dashboard'}); 
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
                                // If user is not an admin (radiobutton value = "No")
                                // User object, as regular user
                                const user = {
                                        name: this.name,
                                        email: this.email,
                                        password: this.password,               
                                };
                                // Add admin to database (check 'client\src\UserServiceService.js' and 'server\routes\api\users.js' to see how this works) 
                                await UserService.insertUser(user)
                                .then(response => {
                                    // If no errors, log in the user
                                    // Set values to localstorage and vuex
                                    localStorage.setItem('user',JSON.stringify({id:response.data.user._id ,name: response.data.user.name, email: response.data.user.email, is_admin: false, createdAt: response.data.user.createdAt}));
                                    localStorage.setItem('jwt',response.data.token);
                                    this.$store.state.logged_in = true;
                                    this.$store.state.is_admin = false;
                                    
                                    // Redirect
                                    if (localStorage.getItem('jwt') != null){
                                        this.$emit('loggedIn');
                                        if(this.$route.params.nextUrl != null){
                                            this.$router.push(this.$route.params.nextUrl)
                                        }
                                        else {
                                            this.$router.push({path: '/dashboard'});
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
                                    return console.error(err);
                                });
                            }
                        }
                    }
                    else {
                        // IF there are errors left
                        this.loading = false;
                    }
                }
                else {
                    this.loading = false;
                    this.showError("Salasanat eivät vastaa toisiaan!");
                }
            }
        }
    }
</script>