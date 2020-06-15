<template>

    <div class="container">
        <Timedate/>
        <h1>Welcome to administrator page</h1>
        <h2>{{msg}}</h2>
    </div>
</template>

<script>
    import Timedate from '../components/layout/Timedate';
    export default {
        data () {
            return {
                msg: 'The superheros'
            }
        },
        components: {
            Timedate,
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