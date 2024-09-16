<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        label="Tên chức danh"
        :rules="[{ required: true, message: 'Vui lòng nhập tên chức danh' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên chức danh"
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
          style="height: 73px"
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
import type { PositionData, PositionResType } from '@/services/apis/position';
import {
  POSITIONS_QUERY_KEY,
  useCreatePosition,
  useUpdatePosition,
} from '@/services/hooks/usePosition';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentPosition?: PositionResType;
}>();

const isUpdate = computed(() => Boolean(props.currentPosition));
const title = computed(() => (isUpdate.value ? 'Cập nhật chức danh' : 'Thêm mới chức danh'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const formRef = ref<FormInstance>();
const formState = reactive<PositionData>({
  description: '',
  name: '',
});

const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
const { mutate: updatePosition, isPending: isUpdating } = useUpdatePosition();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    formState.description = props.currentPosition?.description || '';
    formState.name = props.currentPosition?.name || '';
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    if (isUpdate.value) {
      updatePosition(
        { ...formState, id: props.currentPosition?.id || '' },
        {
          onSuccess(data) {
            props.close();
            handleSuccess(data);
            queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
          },
          onError,
        },
      );
    } else {
      createPosition(formState, {
        onSuccess(data) {
          props.close();
          handleSuccess(data);
          queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
        },
        onError,
      });
    }
  });
};
</script>
