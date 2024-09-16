<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.ai-module.label-category.title') }}</h1>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record}">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'resolution'">
        <span>{{ record.resolution }} m</span>
      </template>
      <template v-if="column.dataIndex === 'aiLabels'">
        <span>{{ record.aiLabels.length }} nhãn</span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, } from 'vue';
import type { ComputedRef } from 'vue';

import { useI18n } from 'vue-i18n';
import { useAILabelCategory } from '@/services/hooks/useAILabelCategory';
import type { AILabelCategory } from '@/services/apis/aiLabelCategory';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();
// TODO: Define columns
const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: "Tên danh mục",
    dataIndex: 'name',
  },
  {
    title: t('admin.ai-module.label-category.name'),
    dataIndex: 'problem',
  },
  {
    title: t('admin.ai-module.label-category.slug'),
    dataIndex: 'slug',
  },
  {
    title: t('admin.ai-module.label-category.resolution'),
    dataIndex: 'resolution',
  },
  {
    title: "Số lượng nhãn",
    dataIndex: 'aiLabels',
  },
]);


// TODO: fetch all AI label categories
const { data, isLoading } = useAILabelCategory();
const dataSource: ComputedRef<AILabelCategory[]> = computed(() => data?.value?.data || []);

</script>
