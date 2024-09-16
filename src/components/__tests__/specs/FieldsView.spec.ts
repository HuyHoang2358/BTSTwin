import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vitest,
  type VitestUtils,
} from 'vitest';
import {
  $$,
  makingHttpRequest,
  mountComponent,
  querySelector,
  renderedNames,
} from '@/components/__tests__/common';
import { flushPromises, VueWrapper } from '@vue/test-utils';
import FieldsView from '@/views/admin/FieldView.vue';
import { API_FIELD } from '@/services/apiPath';
import {
  mockApiGetFieldsAfterCreateSuccess,
  mockApiGetFieldsAfterEditSuccess,
  mockApiGetFieldsSuccess,
  mockApiSearchFieldsSuccess,
} from '@/components/__tests__/mockApi/fieldApi.mock';
import { advanceTimersByTime, debounceSearchTime } from '@/utils/constants';
import { mockApiMutationSuccess } from '@/components/__tests__/mockApi/systemApi.mock';

describe('FieldsView', () => {
  let wrapper: VueWrapper;
  let clock: VitestUtils;

  beforeAll(() => {
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiGetFieldsSuccess,
    });
    wrapper = mountComponent(FieldsView, {
      props: {
        testMode: true,
      },
    });
  });

  beforeEach(() => {
    clock = vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  it('renders properly', async () => {
    expect(wrapper.text()).toContain('Quản lý lĩnh vực');
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual([
      'Điện ThoẠi IPonE',
      'Giao thông vận tải',
      'Kế hoạch đầu tư',
      'linh vuc new',
      'lv2',
      'lv3',
      'lv4',
      'lv5',
      'lv6',
      'lv new',
    ]);
  });

  it('should be able search field', async () => {
    await wrapper.get('[data-test="search-input"]').setValue('lv new');
    clock.advanceTimersByTime(debounceSearchTime);
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiSearchFieldsSuccess,
    });
    await flushPromises();
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual(['linh vuc new', 'lv new']);
    await wrapper.get('[data-test="search-input"]').setValue('');
    clock.advanceTimersByTime(debounceSearchTime);
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiGetFieldsSuccess,
    });
    await flushPromises();
  });

  it('should be able create a field', async () => {
    const buttonAdd = wrapper.get('#add-field');
    expect(buttonAdd.isVisible());
    await buttonAdd.trigger('click');
    expect(wrapper.text()).toContain('Thêm mới lĩnh vực');

    const buttonCancelCreateField = wrapper.get('#cancel-create-field');
    await buttonCancelCreateField.trigger('click');
    await buttonAdd.trigger('click');

    await wrapper.get('[data-test="name"]').setValue('ten linh vuc');
    await wrapper.get('[data-test="description"]').setValue('mo ta');
    const buttonCreateField = wrapper.get('#submit-field');
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'post',
      statusOrCallback: 200,
      data: mockApiMutationSuccess,
    });
    await buttonCreateField.trigger('click');
    clock.advanceTimersByTime(advanceTimersByTime);
    await flushPromises();
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiGetFieldsAfterCreateSuccess,
    });
    clock.advanceTimersByTime(advanceTimersByTime);
    await flushPromises();
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual([
      'ten linh vuc',
      'Điện ThoẠi IPonE',
      'Giao thông vận tải',
      'Kế hoạch đầu tư',
      'linh vuc new',
      'lv2',
      'lv3',
      'lv4',
      'lv5',
      'lv6',
    ]);
  });

  it('should be able edit a field', async () => {
    clock.advanceTimersByTime(advanceTimersByTime);
    await flushPromises();
    const buttonEdit = wrapper.get('#edit-field-20');
    expect(buttonEdit.isVisible());
    await buttonEdit.trigger('click');
    expect(wrapper.text()).toContain('Cập nhật lĩnh vực');

    await wrapper.get('[data-test="name"]').setValue('ten linh vuc edit');
    await wrapper.get('[data-test="description"]').setValue('mo ta');
    const buttonEditField = wrapper.get('#submit-field');
    makingHttpRequest({
      endPoint: `${API_FIELD}/20`,
      method: 'put',
      statusOrCallback: 200,
      data: mockApiMutationSuccess,
    });
    await buttonEditField.trigger('click');
    clock.advanceTimersByTime(advanceTimersByTime);
    await flushPromises();
    makingHttpRequest({
      endPoint: API_FIELD,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiGetFieldsAfterEditSuccess,
    });
    clock.advanceTimersByTime(advanceTimersByTime);
    await flushPromises();
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual([
      'ten linh vuc edit',
      'Điện ThoẠi IPonE',
      'Giao thông vận tải',
      'Kế hoạch đầu tư',
      'linh vuc new',
      'lv2',
      'lv3',
      'lv4',
      'lv5',
      'lv6',
    ]);
  });

  it('should be able delete a field', async () => {
    const buttonEdit = wrapper.get('#delete-field-20');
    expect(buttonEdit.isVisible());
    await buttonEdit.trigger('click');
    await flushPromises();
    clock.advanceTimersByTime(advanceTimersByTime);
    makingHttpRequest({
      endPoint: `${API_FIELD}/20`,
      method: 'delete',
      statusOrCallback: 200,
      data: mockApiMutationSuccess,
    });
    // await wrapper.vm.$nextTick();
    // const okButton = querySelector('.ant-popover-content');
    // console.log('okButton', okButton);
    // return;
    // await flushPromises();
    // clock.advanceTimersByTime(advanceTimersByTime);
    // await flushPromises();
    // makingHttpRequest({
    //   endPoint: API_FIELD,
    //   method: 'get',
    //   statusOrCallback: 200,
    //   data: mockApiGetFieldsSuccess,
    // });
    // clock.advanceTimersByTime(advanceTimersByTime);
    // await flushPromises();
    // const renderedNamesResult = renderedNames(wrapper);
    // expect(renderedNamesResult).toEqual([
    //   'Điện ThoẠi IPonE',
    //   'Giao thông vận tải',
    //   'Kế hoạch đầu tư',
    //   'linh vuc new',
    //   'lv2',
    //   'lv3',
    //   'lv4',
    //   'lv5',
    //   'lv6',
    //   'mo ta new',
    // ]);
  });
});
