import { mount } from '@vue/test-utils';
import Calendar from '@/calendar.vue';

describe('Calendar', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(Calendar);
  });

  describe(':props', () => {
    it('props:lang', async () => {
      await wrapper.setProps({ lang: 'zh' });
      expect(wrapper.find('li').text()).toEqual('日');
    });
    it('props:showToday', async () => {
      await wrapper.setProps({ showToday: true });
      expect(wrapper.find('.is-checked').text()).toEqual(new Date().getDate() + '');
    });
    it('props:initDate', async () => {
      await wrapper.setProps({ initDate: Date.now() });
      expect(wrapper.vm.currentDisplayDates).toHaveLength(42);
    });
  });

  describe(':methods', () => {
    it('methods:getCheckedDate', async () => {
      await wrapper.setProps({ showToday: true });
      expect(wrapper.vm.getCheckedDate()).toHaveLength(1);
    });
    it('methods:setCheckedDate', async () => {
      await wrapper.vm.setCheckedDate(['2021-01-01', '2021-01-02']);
      expect(wrapper.vm.getCheckedDate()).toHaveLength(2);
    });
    it('methods:setYearMonth', async () => {
      await wrapper.vm.setYearMonth(1999, 1);
      expect(wrapper.vm.currentDisplayYear).toEqual(1999);
      expect(wrapper.vm.currentDisplayMonth).toEqual(1);
    });
  });
});
