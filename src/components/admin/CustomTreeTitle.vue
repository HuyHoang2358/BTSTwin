<template>
  <div
    v-if="!showInput"
    class="flex flex-row items-center"
  >
    <div @dblclick="onDblclick">
      <span v-if="title.indexOf(searchValue) > -1">
        {{ title.slice(0, title.indexOf(searchValue)) }}
        <span style="color: #d0002d">{{ searchValue }}</span>
        {{ title.slice(title.indexOf(searchValue) + searchValue.length) }}
      </span>
      <span v-else>{{ title }}</span>
    </div>
    <a-popconfirm
      :title="`${$t('admin.unit.confirmDelete')} ${props.title}?`"
      @confirm="confirmDeleteUnit"
    >
      <a-button
        class="m-0 p-0 border-none ml-1 w-6 h-6 flex items-center justify-center group"
        ghost
        v-if="isSelected"
      >
        <IconTrashSmall class="text-[#201C1D] group-hover:text-main" />
      </a-button>
    </a-popconfirm>
  </div>
  <a-input
    v-model:value="value"
    v-else
    @pressEnter="onPressEnter"
    :bordered="false"
    :placeholder="$t('admin.unit.form.placeholderName')"
    class="p-0"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDeleteUnit, useMutationUnitSuccess, useUpdateUnit } from '@/services/hooks/useUnit';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import IconTrashSmall from '@/components/icons/IconTrashSmall.vue';

const props = defineProps<{
  title: string;
  titleKey: string;
  searchValue: string;
  isSelected: boolean;
}>();

let isPressEnter = false;

const showInput = ref(false);
const value = ref(props.title);

const { mutate: updateUnit } = useUpdateUnit();
const { mutate: deleteUnit } = useDeleteUnit();
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { invalidateQueries } = useMutationUnitSuccess();

const onDblclick = () => {
  showInput.value = true;
};

const onPressEnter = () => {
  isPressEnter = true;
  showInput.value = false;
  updateUnit(
    {
      name: value.value,
      id: props.titleKey,
    },
    {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueries();
      },
    },
  );
};

const handleBlur = () => {
  if (isPressEnter) {
    isPressEnter = false;
    return;
  }
  value.value = props.title;
  showInput.value = false;
};

const confirmDeleteUnit = async () => {
  return new Promise((resolve) => {
    deleteUnit(props.titleKey || '', {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueries();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};
</script>
