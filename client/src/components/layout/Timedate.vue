<template>
    <div class="row section">
        <div class="col s4 left-align"><h4 id="date"> </h4></div>
        <div class="col s4 left-align"></div>
        <div class="col s4 right-align"><h4 id="clock"> </h4></div>
    </div>
</template>

<script>
export default {
  name: "Timedate",
  mounted () {
    this.setTime();
    this.setDate();
  },
  methods: {
    setTime: function(){
        // Get time, parse it and change the text of the clock
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = this.checkZeros(m);
        s = this.checkZeros(s);
        document.getElementById('clock').innerText = h + ":" + m + ":" + s;
        /* eslint-disable no-unused-vars */
        let t = setTimeout(this.setTime, 500); //timeout for a bit
        /* eslint-enable no-unused-vars */
    },
    setDate: function(){
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; //month is zero indexed
        let year = today.getFullYear();
        day = this.checkZeros(day);
        month = this.checkZeros(month);
        document.getElementById('date').innerText =day + "." + month + "." + year;
        /* eslint-disable no-unused-vars */
        let t = setTimeout(this.setDate, 60000);
        /* eslint-enable no-unused-vars */
    },
    checkZeros: function(time){
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    }
  },
}
</script>

<style scoped>
  .header {
    background: rgba(255, 255, 255, 0.411);
    color: #fff;
    text-align: center;
    padding: 10px;
  }
  .header a {
    padding-right: 5px;
    text-decoration: none;
  }
</style>
