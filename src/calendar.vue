<template>
  <section class="calendar-container">
    <div class="calendar-header">
      <span class="prev-month-btn" @click="toPrevMonth">
        <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g class="transform-group">
            <g transform="scale(0.015625, 0.015625)">
              <path
                d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z"
                fill="#ccc"
              ></path>
            </g>
          </g>
        </svg>
      </span>
      <span>{{ currentDisplayYearMonth }}</span>
      <span class="next-month-btn" @click="toNextMonth">
        <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g class="transform-group">
            <g transform="scale(0.015625, 0.015625)">
              <path
                d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z"
                fill="#ccc"
              ></path>
            </g>
          </g>
        </svg>
      </span>
    </div>
    <ul class="date-table">
      <li v-for="day in weekDays" :key="day">{{ day }}</li>
      <li
        v-for="date in currentDisplayDates"
        :key="date.tag + date.value"
        class="date-cell"
        :class="{
          'current-month': date.tag === 'current-month',
          'not-current-month': date.tag !== 'current-month',
          'is-checked': checkedDates.includes(date.value),
          'breath-animation': multiCheckStartDate === date.value
        }"
        @click="checkDate(date)"
        @contextmenu.prevent="multiCheckDate(date)"
      >
        {{ displayDate(date.value) }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    // language (English: en, Chinese: zh)
    lang: {
      type: String,
      default: 'en'
    },
    showToday: {
      type: Boolean,
      default: false
    },
    initDate: {
      type: String | Number | Object,
      default: Date.now()
    }
  },
  data() {
    return {
      currentDisplayYear: null,
      currentDisplayMonth: null,
      currentDisplayDates: [],
      checkedDates: [],
      multiCheckStartDate: '',
      multiCheckEndDate: ''
    };
  },
  computed: {
    currentDisplayYearMonth() {
      return `${this.currentDisplayYear}.${this.zeroPadding(this.currentDisplayMonth)}`;
    },
    weekDays() {
      return this.lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六'];
    },
    displayDate() {
      return date => (date[8] === '0' ? date.substr(9) : date.substr(8));
    }
  },
  created() {
    this.renderCalendar(this.initDate);
  },
  watch: {
    initDate: {
      handler(val) {
        this.renderCalendar(val);
      },
      deep: true,
      immediate: true
    },
    showToday(val) {
      const today = this.formatDate(Date.now());
      const i = this.checkedDates.indexOf(today);
      if (val) {
        if (i === -1) {
          this.checkedDates.push(today);
        }
      } else {
        if (i > -1) {
          this.checkedDates.splice(i, 1);
        }
      }
    }
  },
  methods: {
    /**
     * Calendar render method
     */
    renderCalendar(_Date) {
      this.currentDisplayDates = [];
      const _date = new Date(_Date);
      this.currentDisplayYear = _date.getFullYear();
      this.currentDisplayMonth = _date.getMonth() + 1;
      const currentDisplayMonth_1th_Date = new Date(`${this.currentDisplayYear}-${this.currentDisplayMonth}-1`).getDay(); // what day is the first day of the current display month
      const currentDisplayMonth_Date_Num = new Date(this.currentDisplayYear, this.currentDisplayMonth, 0).getDate(); // total days in current month
      const lastDisplayMonth_Date_Num = new Date(this.currentDisplayYear, this.currentDisplayMonth - 1, 0).getDate(); // total days in prev month
      const lastDisplayMonth = this.currentDisplayMonth === 1 ? 12 : this.currentDisplayMonth - 1; // prev display month
      const lastDisplayYear = lastDisplayMonth === 12 ? this.currentDisplayYear - 1 : this.currentDisplayYear; // prev display year
      const nextDisplayMonth = this.currentDisplayMonth === 12 ? 1 : this.currentDisplayMonth + 1; // next display month
      const nextDisplayYear = nextDisplayMonth === 1 ? this.currentDisplayYear + 1 : this.currentDisplayYear; // next display year
      // Push prev month date
      for (let i = 0; i < currentDisplayMonth_1th_Date; i++) {
        this.currentDisplayDates.unshift({
          tag: 'last-month',
          value: this.getFullDate(lastDisplayYear, lastDisplayMonth, lastDisplayMonth_Date_Num - i)
        });
      }
      // Push current month date
      for (let j = 0; j < currentDisplayMonth_Date_Num; j++) {
        this.currentDisplayDates.push({
          tag: 'current-month',
          value: this.getFullDate(this.currentDisplayYear, this.currentDisplayMonth, j + 1)
        });
      }
      // Push next month date
      for (let k = 0; k < 42 - currentDisplayMonth_1th_Date - currentDisplayMonth_Date_Num; k++) {
        this.currentDisplayDates.push({
          tag: 'next-month',
          value: this.getFullDate(nextDisplayYear, nextDisplayMonth, k + 1)
        });
      }
      // Whether to select today
      if (this.showToday) {
        const today = this.formatDate(Date.now());
        if (!this.checkedDates.includes(today)) {
          this.checkedDates.push(today);
        }
      }
    },
    /**
     * Render prev month calendar
     */
    toPrevMonth() {
      this.currentDisplayMonth -= 1;
      if (this.currentDisplayMonth === 0) {
        this.currentDisplayYear -= 1;
        this.currentDisplayMonth = 12;
      }
      this.renderCalendar(`${this.currentDisplayYear}-${this.currentDisplayMonth}`);
    },
    /**
     * Render next month calendar
     */
    toNextMonth() {
      this.currentDisplayMonth += 1;
      if (this.currentDisplayMonth === 13) {
        this.currentDisplayYear += 1;
        this.currentDisplayMonth = 1;
      }
      this.renderCalendar(`${this.currentDisplayYear}-${this.currentDisplayMonth}`);
    },
    /**
     * Click date to select
     */
    checkDate(date) {
      if (date.tag === 'current-month') {
        if (this.multiCheckStartDate !== '') {
          this.multiCheckStartDate = '';
          this.multiCheckEndDate = '';
        }
        const i = this.checkedDates.indexOf(date.value);
        i === -1 ? this.checkedDates.push(date.value) : this.checkedDates.splice(i, 1);
      }
    },
    /**
     * Right-click date to range selection
     */
    multiCheckDate(date) {
      if (date.tag === 'current-month') {
        if (!this.multiCheckStartDate) {
          this.setCheckedDate([]);
          this.multiCheckStartDate = date.value;
        } else {
          this.multiCheckEndDate = date.value;
          const bothEnds = [this.multiCheckStartDate, this.multiCheckEndDate]
            .map(date => new Date(date).getTime())
            .sort()
            .map(time => this.formatDate(time));
          this.multiCheckStartDate = '';
          this.multiCheckEndDate = '';
          this.setCheckedDate(this.getAllDateBetweenStartAndEnd(bothEnds[0], bothEnds[1]));
        }
      }
    },
    /**
     * Format Date: yyyy-MM-dd
     */
    formatDate(date) {
      const _date = new Date(date);
      const currentYear = _date.getFullYear();
      const currentMonth = _date.getMonth() + 1;
      const currentDate = _date.getDate();
      return this.getFullDate(currentYear, currentMonth, currentDate);
    },
    getFullDate(year, month, date) {
      return `${year}-${this.zeroPadding(month)}-${this.zeroPadding(date)}`;
    },
    /**
     * Get all dates between the start date and end date
     */
    getAllDateBetweenStartAndEnd(start, end) {
      let dateArr = [];
      const startArr = start.split('-');
      const endArr = end.split('-');
      let db = new Date();
      db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2]);
      let de = new Date();
      de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2]);
      const dbTime = db.getTime();
      const deTime = de.getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      for (let i = dbTime; i <= deTime; i += oneDay) {
        dateArr.push(this.formatDate(new Date(+i)));
      }
      return dateArr;
    },
    /**
     * Zero padding method
     */
    zeroPadding(n) {
      n = n + '';
      return n[1] ? n : '0' + n;
    },

    /**
     * Methods exposed to the parent component
     */

    // Get all dates currently selected
    getCheckedDate() {
      return this.checkedDates
        .map(date => new Date(date).getTime())
        .sort()
        .map(time => this.formatDate(time));
    },

    // Manually set selected dates in batches
    setCheckedDate(dateList) {
      if (Array.isArray(dateList)) {
        this.checkedDates = [...new Set(dateList)].map(date => this.formatDate(date));
      } else {
        console.error('The parameter type of the function setCheckedDate must be Array.');
      }
    },

    // Specify the year and month to render the calendar
    setYearMonth(year, month) {
      this.renderCalendar(`${year}-${month}`);
    }
  }
};
</script>

<style>
.calendar-container {
  margin: auto;
  min-width: 300px;
  background: #404040;
  user-select: none;
  color: #ccc;
  box-shadow: #111 2px 2px 3px;
}
.calendar-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.prev-month-btn,
.next-month-btn {
  padding: 5px;
  cursor: pointer;
}

.date-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  list-style: none;
}
.date-table li {
  margin: 5px 0;
  padding: 5px 0;
  width: calc(100% / 7);
  height: calc(100% / 7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-table .date-cell {
  border-radius: 20px;
}
.date-table .current-month {
  cursor: pointer;
}
.date-table .current-month:hover:not(.is-checked) {
  background: #606060;
}
.date-table .not-current-month {
  color: #888;
}
.is-checked {
  background: #e84f48;
}
.breath-animation {
  background: #e84f48;
  animation-name: breath;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes breath {
  from {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0.1;
  }
}
</style>
