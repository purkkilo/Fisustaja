<template>
    <footer id="footer" class="page-footer blue darken-2">
        <div class="container">
        <div class="row">
            <div class="col l6 s12">
                <h5 class="white-text">Work in progress</h5>
            </div>
            <div class="col l4 offset-l2 s12">
            <h5 class="white-text">Linkkejä</h5>
            <ul>
                <li><a class="grey-text text-lighten-3" href="#!">-</a></li>
            </ul>
            </div>
        </div>
        </div>
        <div class="footer-copyright blue darken-4">
        <div class="container">
            © 2020 Jori Kosonen, All rights reserved
        </div>
        </div>
    </footer>
</template>

<script>

export default {
  name: "Footer",
    data(){
        return {
        }
    },
  mounted() {
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style scoped>
footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 180px;
    width: 100%;
}
</style>
