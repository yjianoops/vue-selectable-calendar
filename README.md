## vue-selectable-calendar 

* Calendar component based on Vue2.x. 
* Lightweight, small, easy to use.
* Provide datepick methods, support single-select/multi-select/range-select. 

## Install
```javascript
npm install vue-selectable-calendar --save
```

## Demo 
The demo page is [Here](http://yjianoops.github.io/vue-selectable-calendar/demo/index.html).  

![image](https://raw.githubusercontent.com/yjianoops/yjoosps.github.io/master/assets/images/imgs/exploring-functional-programming.jpg)  

## Usage

### Click events for datepicker
* ```Left mouse click```  
  * Select one date at one time(support multiple).  
  * Click the selected date will remove this date.
* ```Right mouse click (Long-press on mobile instead)```  
  * This event is used for range selection.  
  * First right-click will select the range-start date, breathing light effects will be added on this date.  
  * Second right-click will select all date between startDate and endDate, breathing light effects will be removed.

### Example
```html
<template>
  <Calendar :lang="lang" :showToday="showToday" :initDate="initDate" ref="calendar" />
</template>
```
```javascript
import Calendar from 'vue-selectable-calendar';
export default {
  data() {
    return {
      lang: 'zh',
      showToday: true,
      initDate: Date.now()
    };
  },
  components: {
    Calendar
  },
  methods: {
    // Get all dates currently selected
    getDates() {
      this.$refs.calendar.getCheckedDate()
    },

    // Manually set selected dates
    setDates() {
      this.$refs.calendar.setCheckedDate(['2020-12-08', '2020-12-09', '2020-12-10'])
    },

    // Set the year and month to render the calendar
    setYearMonth() {
      this.$refs.calendar.setYearMonth(1999, 1);
    }
  }
};
```  

### Props
| props     | type                 | description                                                                       | Default    | Required |
| :-------- | :------------------- | :-------------------------------------------------------------------------------- | :--------- | :------- |
| lang      | String               | Calendar language. Provide 'en'(Engilsh) and 'zh'(Chinese).                       | en         | No       |
| showToday | Boolean              | Whether today is selected by default.                                             | false      | No       |
| initDate  | String/Number/Object | Initialize Date for calendar renderer. Provide date string/timestamp/Date object. | Date.now() | No       |

### Methods
```javascript
Add ref attribute on Calendar tag, and exposed three methods for calling.  

Example:  

<Calendar ref="calendar"></Calendar>

this.$refs.calendar.getCheckedDate();
this.$refs.calendar.setCheckedDate(['2020-12-08', '2020-12-09', '2020-12-10']);
this.$refs.calendar.setYearMonth(1999, 1);
```  
| method name    | params                 | params required | description                                    |
| :------------- | :--------------------- | --------------- | :--------------------------------------------- |
| getCheckedDate | Null                   | No              | Return all dates(Array) currently selected.    |
| setCheckedDate | [date1,date2,date3...] | Yes             | Manually set selected dates.                   |
| setYearMonth   | year,month             | Yes             | Set the year and month to render the calendar. |

## License

[The MIT License](http://opensource.org/licenses/MIT)