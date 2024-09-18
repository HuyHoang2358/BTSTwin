<template>
  <a-drawer
    :open="open"
    :title="title"
    :width="500"
    @close="props.close"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="pole_id"
        :label="t('admin.pole.name')"
        :rules="[{ required: true, message: t('admin.pole.form.inputName') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.pole_id"
          :options="poleOptions"
          :allow-clear="true"
          :placeholder="t('admin.pole.form.placeholderSelectName')"
        />
      </a-form-item>

      <a-form-item
        name="device_id"
        :label="t('admin.device.name')"
        :rules="[{ required: true, message: t('admin.device.form.inputName') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.device_id"
          :allow-clear="true"
          :loading="isLoadingDevices"
          :options="deviceOptions"
          show-search
          :filter-option="filterOption"
          :placeholder="t('admin.device.form.placeholderName')"
        />
      </a-form-item>

      <a-form-item
        name="name"
        :label="t('admin.pole-device.attached_at')"
        :rules="[{ required: false, message: t('admin.pole-device.form.inputAttachedAt') }]"
        class="my-1"
      >
        <a-date-picker
          v-model:value="formState.attached_at"
          :format="dateFormatList"
          :placeholder="t('admin.pole-device.form.placeholderAttachedAt')"
          class="w-full"
        />
      </a-form-item>

      <div class="my-2">
        <div class="mt-2">Vị trí lắp đặt</div>
        <div class="px-2">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                name="x"
                :label="t('admin.pole-device.x')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputX') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.x"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderX')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                name="y"
                :label="t('admin.pole-device.y')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputY') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.y"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderY')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                name="z"
                :label="t('admin.pole-device.z')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputZ') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.z"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderZ')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                name="alpha"
                :label="t('admin.pole-device.alpha')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputAlpha') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.alpha"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderAlpha')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                name="beta"
                :label="t('admin.pole-device.beta')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputBeta') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.beta"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderBeta')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                name="gama"
                :label="t('admin.pole-device.gama')"
                :rules="[{ required: false, message: t('admin.pole-device.form.inputGama') }]"
                class="my-1"
              >
                <a-input-number
                  v-model:value="formState.gama"
                  :allow-clear="true"
                  class="w-full"
                  :placeholder="t('admin.pole-device.form.placeholderGama')"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">Hủy bỏ</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating || isUpdating"
          @click="handleFinish"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';

import { type FormInstance } from 'ant-design-vue';
import type { OptionType } from '@/utils/types';
import type { PoleDeviceData } from '@/services/apis/pole';
import type { DeviceCode } from '@/services/apis/device';
import { compareString } from '@/utils/helpers';

import { useDeviceCodes } from '@/services/hooks/useDevice';
import { useAddDeviceToPole, useUpdateDeviceInPole } from '@/services/hooks/usePole';
import dayjs from 'dayjs';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentPoleDevice?: any;
  poleOptions: OptionType[];
  refetch?: any;
}>();

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

// TODO handle Form
type PoleDeviceForm = {
  id?: string;
} & Partial<PoleDeviceData>;

const formRef = ref<FormInstance>();

const formState = reactive<PoleDeviceForm>({});

const isUpdate = computed(() => !!props?.currentPoleDevice);
const title = computed(() =>
  isUpdate.value ? 'Chỉnh sửa thông tin thiết bị trên cột' : 'Thêm mới thiết bị vào cột',
);
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    console.log('currentDevice', props.currentPoleDevice);
    formState.pole_id = props.currentPoleDevice?.pole_id.toString() ?? null;
    formState.device_id = props.currentPoleDevice?.pivot?.device_id.toString() ?? null;
    formState.x = props.currentPoleDevice?.pivot?.x ?? null;
    formState.y = props.currentPoleDevice?.pivot?.y ?? null;
    formState.z = props.currentPoleDevice?.pivot?.z ?? null;
    formState.alpha = props.currentPoleDevice?.pivot?.alpha ?? null;
    formState.beta = props.currentPoleDevice?.pivot?.beta ?? null;
    formState.gama = props.currentPoleDevice?.pivot?.gama ?? null;
    formState.attached_at = props.currentPoleDevice?.pivot?.attached_at
      ? dayjs(props.currentPoleDevice?.pivot?.attached_at, 'YYYY-MM-DD HH:mm:ss')
      : null;
  },
);

// TODO: filter option in select
const filterOption = (input: string, option: any) => {
  return compareString(option.label, input);
};

// TODO: fetch data for select
const { data: deviceData, isLoading: isLoadingDevices } = useDeviceCodes();
const deviceOptions = computed(
  () =>
    deviceData?.value?.data?.map((i: DeviceCode) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);

// TODO: submit form
const { mutate: addDeviceToPole, isPending: isCreating } = useAddDeviceToPole();
const { mutate: updateDeviceInPole, isPending: isUpdating } = useUpdateDeviceInPole();
const handleFinish = () => {
  console.log(formState);
  formRef.value?.validate().then(() => {
    console.log('data', formState);
    console.log('attached_at', formState.attached_at?.valueOf() || null);
    const data: PoleDeviceData = {
      pole_id: formState.pole_id ?? null,
      device_id: formState.device_id ?? null,
      x: formState.x ?? null,
      y: formState.y ?? null,
      z: formState.z ?? null,
      alpha: formState.alpha ?? null,
      beta: formState.beta ?? null,
      gama: formState.gama ?? null,
      attached_at: formState.attached_at?.valueOf()
        ? formState.attached_at?.valueOf() / 1000
        : null,
    };
    console.log('data', data);

    if (isUpdate.value && props?.currentPoleDevice?.id) {
      updateDeviceInPole(
        {
          ...data,
          id: props?.currentPoleDevice?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            props.refetch();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    addDeviceToPole(data, {
      onError,
      onSuccess: (data) => {
        props.refetch();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
