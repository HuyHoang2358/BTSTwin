<template>
  <a-drawer
    :open="open"
    title="Thêm mới bản đồ mặc định của hệ thống"
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
        name="tableName"
        label="Tên bảng"
        :rules="[{ required: true, message: 'Vui lòng nhập tên bảng' }]"
      >
        <a-input
          v-model:value="formState.tableName"
          :allow-clear="true"
          :placeholder="$t('admin.spec.form.placeholderName')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('admin.spec.dataType')"
        name="dataCategoryId"
        :rules="[{ required: true, message: $t('admin.spec.form.selectDataType') }]"
      >
        <a-tree-select
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="dataTypeOptions"
          tree-node-filter-prop="label"
          v-model:value="formState.dataCategoryId"
          :placeholder="$t('admin.spec.form.placeHolderDataType')"
          :options="dataTypeOptions"
          allow-clear
          :loading="isLoadingDataTypes"
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
          :loading="isCreating"
          @click="onSubmit"
          id="submit-base-layer"
        >
          {{ $t('add') }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { computed, type UnwrapRef } from 'vue';
import { reactive, ref } from 'vue';
import { useCreateLayerPrivate, useMutationLayerSuccess } from '@/services/hooks/useLayer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { useDataTypesTree } from '@/services/hooks/useDataType';
import { dataTypeVectorLayer } from '@/utils/constants';

const props = defineProps<
  {
    close: () => void;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

interface FormState {
  tableName: string;
  dataCategoryId: string;
}

const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  tableName: '',
  dataCategoryId: '',
});

const { data: dataTypesData, isLoading: isLoadingDataTypes } = useDataTypesTree({
  slug: ref(dataTypeVectorLayer),
});

const dataTypeOptions = computed(() => dataTypesData.value?.data || []);
const { mutate: create, isPending: isCreating } = useCreateLayerPrivate();
const { invalidateLayerPrivateQueries } = useMutationLayerSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    create(formState, {
      onError,
      onSuccess: (data) => {
        invalidateLayerPrivateQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
