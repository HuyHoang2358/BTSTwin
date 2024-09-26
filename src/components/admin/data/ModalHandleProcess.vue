<template>
  <a-drawer
    :open="open"
    :title="title"
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
        name="station_code"
        :label="t('admin.process.station')"
        :rules="[{ required: true, message: t('admin.process.form.inputStationCode') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.station_code"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.process.form.placeholderStationCode')"
        />
      </a-form-item>

      <a-form-item
        name="date"
        :label="t('admin.process.date')"
        :rules="[{ required: true, message: t('admin.process.form.inputDate') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.date"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.process.form.placeholderDate')"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">Hủy bỏ</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating"
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
import { type FormInstance } from 'ant-design-vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';

import type { Process, ProcessData } from '@/services/apis/process';
import { useCreateProcess, useMutationProcessSuccess } from '@/services/hooks/useProcess';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentProcess?: Process;
}>();

// TODO handle Form
type ProcessForm = {
  id?: string;
} & Partial<ProcessData>;

const formRef = ref<FormInstance>();

const formState = reactive<ProcessForm>({});

const isUpdate = computed(() => !!props?.currentProcess);
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới luồng'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { mutate: createProcess, isPending: isCreating } = useCreateProcess();
const { invalidateQueries } = useMutationProcessSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    console.log('currentStation', props.currentProcess);
    formState.station_code = props.currentProcess?.station?.code || undefined;
    formState.date = props.currentProcess?.station?.date || undefined;
  },
);

// TODO: submit form
const handleFinish = () => {
  console.log(formState);
  formRef.value?.validate().then(() => {
    const data: ProcessData = {
      station_code: formState.station_code ?? null,
      date: formState.date ?? null,
    };
    if (isUpdate.value && props?.currentProcess?.id) {
      return;
    }

    createProcess(data, {
      onError,
      onSuccess: (data) => {
        invalidateQueries();
        handleSuccess(data);
        props.close();
      },
    });
  });
};
</script>
