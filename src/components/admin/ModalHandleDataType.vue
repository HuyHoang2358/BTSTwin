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
        label="Loại dữ liệu"
        :rules="[{ required: true, message: 'Vui lòng nhập loại dữ liệu' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên loại dữ liệu"
        />
      </a-form-item>
      <a-form-item
        name="departmentId"
        label="Lĩnh vực"
        :rules="[
          {
            required: true,
            message: 'Vui lòng chọn lĩnh vực',
          },
        ]"
      >
        <a-select
          v-model:value="formState.departmentId"
          :options="categoryOptions"
          :loading="isLoadingFields"
        />
      </a-form-item>
      <a-form-item
        name="description"
        label="Mô tả"
        :rules="[{ required: true, message: 'Vui lòng nhập mô tả' }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :allow-clear="true"
          placeholder="Nhập mô tả"
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
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import {
  DATA_TYPES_QUERY_KEY,
  useCreateDataType,
  useUpdateDataType,
} from '@/services/hooks/useDataType';
import type { DataTypeResType, DataTypeData } from '@/services/apis/dataType';
import { useGetAllFields } from '@/services/hooks/useField';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentDataType?: DataTypeResType;
}>();

const isUpdate = computed(() => Boolean(props.currentDataType));
const title = computed(() => (isUpdate.value ? 'Cập nhật loại dữ liệu' : 'Thêm mới loại dữ liệu'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));
const formRef = ref<FormInstance>();
const formState = reactive<DataTypeData>({
  name: '',
  departmentId: '',
  description: '',
  parentId: 32 // bản đồ chuyên đề
});

const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: createDataType, isPending: isCreating } = useCreateDataType();
const { mutate: updateDataType, isPending: isUpdating } = useUpdateDataType();
const { data: fieldsData, isLoading: isLoadingFields } = useGetAllFields();

const categoryOptions = computed(
  () =>
    fieldsData?.value?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [],
);

watch(
  () => props.open,
  () => {
    formState.name = props.currentDataType?.name || '';
    formState.departmentId = props.currentDataType?.departmentId || '';
    formState.description = props.currentDataType?.description || '';
    formState.parentId = 32;
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    console.log(formState)
    if (isUpdate.value) {
      updateDataType(
        {
          ...formState,
          id: props.currentDataType?.id?.toString() || '',
        },
        {
          onSuccess(data) {
            props.close();
            handleSuccess(data);
            queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
          },
          onError,
        },
      );
    } else {
      createDataType(formState, {
        onSuccess(data) {
          props.close();
          handleSuccess(data);
          queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
        },
        onError,
      });
    }
  });
};
</script>
