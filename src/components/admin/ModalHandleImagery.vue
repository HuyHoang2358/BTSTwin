<template>
  <a-drawer
    :open="open"
    title="Chỉnh sửa ảnh vệ tinh"
    @close="props.close"
    width="400"
    :get-container="getContainer"
    :mask-closable="false"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-form-item
        name="name"
        :label="$t('admin.imagery.name')"
        :rules="[{ required: true, message: $t('admin.imagery.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :placeholder="$t('admin.imagery.form.placeholderName')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('admin.imagery.satellite')"
        name="satellite"
      >
        <a-input
          v-model:value="formState.satellite"
          :allow-clear="true"
          :placeholder="$t('admin.imagery.form.placeholderSatellite')"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-create-base-layer"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isUpdating"
          @click="onSubmit"
          id="submit-base-layer"
        >
          Cập nhật
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { type UnwrapRef } from 'vue';
import { reactive, ref, watch } from 'vue';
import { useMutationLayerSuccess, useUpdateImagery } from '@/services/hooks/useLayer';
import type { Imagery, ImageryData } from '@/services/apis/layer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Imagery;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const formRef = ref();

watch(
  () => props.open,
  () => {
    formState.name = props?.selectedItem?.name;
    formState.satellite = props?.selectedItem?.satellite;
  },
);

const formState: UnwrapRef<ImageryData> = reactive({});

const { mutate: update, isPending: isUpdating } = useUpdateImagery();

const { invalidateImageryQueries } = useMutationLayerSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    if (!props.selectedItem?.id) {
      return;
    }
    update(
      {
        ...formState,
        id: props.selectedItem?.id,
      },
      {
        onError,
        onSuccess: (data) => {
          invalidateImageryQueries();
          props.close();
          handleSuccess(data);
        },
      },
    );
  });
};
</script>
