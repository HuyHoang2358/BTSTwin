<template>
  <a-drawer
    :open="open"
    :title="$t('admin.unit.add')"
    @close="props?.close"
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
        :label="$t('admin.unit.name')"
        :rules="[{ required: true, message: $t('admin.unit.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :placeholder="$t('admin.unit.form.placeholderName')"
        />
      </a-form-item>
      <a-form-item :label="$t('admin.unit.parentUnit')">
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          :placeholder="$t('admin.unit.form.placeholderParentId')"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          allow-clear
          tree-default-expand-all
          :tree-data="dataTreeSelect || []"
          tree-node-filter-prop="label"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">{{ $t('cancel') }}</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating"
          @click="handleFinish"
        >
          {{ $t('add') }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, type UnwrapRef } from 'vue';
import type { FormInstance, TreeSelectProps } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { UnitData } from '@/services/apis/unit';
import { useCreateUnit, useMutationUnitSuccess } from '@/services/hooks/useUnit';

const props = defineProps<{
  open: boolean;
  close?: () => void;
  dataTreeSelect: TreeSelectProps['treeData'];
}>();

const { mutate: createUnit, isPending: isCreating } = useCreateUnit();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationUnitSuccess();

const formRef = ref<FormInstance>();
const formState = reactive<UnwrapRef<UnitData>>({
  name: '',
  parentId: undefined,
});

watch(
  () => props.open,
  () => {
    formState.name = '';
    formState.parentId = undefined;
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    createUnit(formState, {
      onSuccess(data) {
        props?.close && props?.close();
        handleSuccess(data);
        invalidateQueries();
      },
      onError,
    });
  });
};
</script>
