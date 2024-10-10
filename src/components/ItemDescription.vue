<template>
  <div class="flex flex-row items-center justify-between py-0.5 gap-2">
    <div class="w-1/2">
      <a-typography-text class="text-[#FAFAFA] text-xs">{{ label }}</a-typography-text>
    </div>
    <div class="w-1/2 flex flex-row justify-end edit-field">
      <a-typography-paragraph
        v-if="editable"
        v-model:content="content"
        :editable="{
          triggerType: !content ? ['icon'] : ['text'],
          onEnd: () => {
            lastContent = content;
            if (onSubmit && submitKey) onSubmit(submitKey, content);
          },
        }"
        :class="[
          'text-xs m-0 pt-0.5 flex flex-row',
          submitKey && modelStore.fieldHover[submitKey] ? 'text-main' : 'text-[#FAFAFA]',
        ]"
      >
        <template #editableTooltip>Click để chỉnh sửa</template>
      </a-typography-paragraph>
      <a-typography-text
        v-else
        class="text-[#FAFAFA] text-xs"
      >
        {{ content }}
      </a-typography-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useModelStore } from '@/stores/model';

const props = defineProps<{
  label: string;
  submitKey?: string;
  value?: string | number;
  editable?: boolean;
  onSubmit?: (key: string, value: string) => void;
}>();

const content = ref(props.value?.toString() || '');
const modelStore = useModelStore();

let lastContent = props.value?.toString() || '';

watch(
  () => props.value,
  () => {
    content.value = props.value?.toString() || '';
    lastContent = props.value?.toString() || '';
  },
);

watch(
  () => modelStore.fieldHover,
  () => {
    if (props.submitKey && modelStore.fieldHover[props.submitKey]) {
      content.value = modelStore.fieldHover[props.submitKey]?.toString();
    } else {
      content.value = lastContent;
    }
  },
);
</script>
