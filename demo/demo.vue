<template>
  <div id="app">
    <Calendar class="demo" :lang="lang" :showToday="showToday" ref="calendar" />
    <div class="tools">
      <p>
        <label>Set init DATE</label>
        <input type="text" v-model="initDateInput" />
        <button @click="setInitDate">Set</button>
      </p>
      <p>
        <label>Get all selected date</label>
        <button @click="getSelectedDate">Get</button>
      </p>
    </div>
  </div>
</template>

<script>
import Calendar from 'vue-selectable-calendar';
export default {
  name: 'App',
  components: {
    Calendar
  },
  data() {
    return {
      lang: 'en',
      showToday: true,
      initDateInput: '1999-1',
      selectedDates: []
    };
  },
  methods: {
    setInitDate() {
      if (this.initDateInput !== '') {
        if (new Date(this.initDateInput).toString() === 'Invalid Date') {
          alert('Please check the input date');
        } else {
          const dateArr = this.initDateInput.split('-');
          this.$refs.calendar.setYearMonth(+dateArr[0], +dateArr[1]);
        }
      } else {
        alert('Please input the init date');
      }
    },
    getSelectedDate() {
      alert(this.$refs.calendar.getCheckedDate());
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  background: #ddd;
}
#app {
  margin: auto;
  overflow: hidden;
}
.demo {
  margin-top: 50px;
  width: 333px;
}
.tools {
  margin: 0 auto;
  width: 400px;
  text-align: center;
}
.tools p {
  margin: 40px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
label {
  font-size: 12px;
}
input {
  padding: 2px 4px;
  outline: none;
}
button {
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
}
</style>
