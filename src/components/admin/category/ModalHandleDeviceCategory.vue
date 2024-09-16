<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
  >
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        label="Tên danh mục"
        :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên danh mục"
          autofocus
        />
      </a-form-item>
      <a-form-item
        name="description"
        label="Mô tả"
        :rules="[{ required: false, message: 'Vui lòng nhập mô tả' }]"
      >
        <a-textarea
          v-model:value="formState.description"
          placeholder="Nhập mô tả cho loại cột"
          :allow-clear="true"
          :rows="3"
        />
      </a-form-item>


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
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DeviceCategory, DeviceCategoryData } from '@/services/apis/devicecategory';
import {
  useCreateDeviceCategory,
  useMutationDeviceCategorySuccess,
  useUpdateDeviceCategory
} from '@/services/hooks/useCategoryDevice';

const props = defineProps<{
  open: boolean;
  close: () => void;
  selectedItem?: DeviceCategory;
}>();

interface FormState {
  name: string;
  description: string;
}

const isUpdate = computed(() => Boolean(props.selectedItem));
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới danh mục'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: '',
  description: '',
});

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: create, isPending: isCreating } = useCreateDeviceCategory();
const { mutate: update, isPending: isUpdating } = useUpdateDeviceCategory();
const { invalidateQueries } = useMutationDeviceCategorySuccess();

watch(
  () => props.open,
  () => {
    formRef.value?.clearValidate();
    formState.name = props?.selectedItem?.name || '';
    formState.description = props?.selectedItem?.description || '';
  },
);


const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const data: DeviceCategoryData = {
      ...formState,
    };
    if (isUpdate.value) {
      update(
        {
          ...data,
          id: props.selectedItem?.id?.toString() || '',
        },
        {
          onSuccess(data) {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
          onError,
        },
      );
    } else {
      create(data, {
        onSuccess(data) {
          invalidateQueries();
          props.close();
          handleSuccess(data);
        },
        onError,
      });
    }
  });
};
</script>
