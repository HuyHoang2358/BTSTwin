<template>
  <a-table
    :columns="columns"
    :data-source="labels"
    :loading="isLoading"
    size="middle"
  >
    <template #title>
      <div class="flex flex-row items-center justify-between">
        <h1 class="text-3xl mb-1">{{ $t('admin.ai-module.label.title') }}</h1>
        <div class="flex flex-row items-center gap-3">
          <a-select
            v-model:value="categorySlug"
            :options="labelCategoryOptions"
            placeholder="Chọn bài toán"
            style="width: 200px"
          />
          <a-button
            type="primary"
            class="flex justify-center items-center space-x-2.5"
            :icon="h(IconAddCircle)"
            @click="onAdd"
            id="add-field"
            v-if="checkPermission('AiLabelService.storeAiLabel')"
          >
            {{ $t('add') }}
          </a-button>
          <a-button
            @click="exportStyle"
            id="export-style-xml"
          >
            <IconDownloadExcel />
            {{ $t('admin.ai-module.label.export-style') }}
          </a-button>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'color'">
        <div
          class="w-16 h-8 rounded-lg"
          :style="{ background: record.color }"
        ></div>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            :id="`edit-field-${record.id}`"
            v-if="checkPermission('AiLabelService.updateAiLabel')"
          />
          <a-popconfirm
            :title="$t('admin.ai-module.label.confirmDelete')"
            @confirm="confirm(record.id)"
            v-if="checkPermission('AiLabelService.destroyAiLabel')"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              :id="`delete-field-${record.id}`"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleAILabel
    :close="() => (open = false)"
    :open="open"
    :current-label="currentLabel"
    :get-container="testMode ? false : 'body'"
    :current-label-category-id="categoryId"
  />
  <ModalExportStyle
    :close="() => (openExportStyle = false)"
    :open="openExportStyle"
    :category-slug="categorySlug"
    :get-container="testMode ? false : 'body'"
    :labels="labels"
  />
</template>
<script lang="ts" setup>
import { computed, h, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';

import { useI18n } from 'vue-i18n';
import { useAILabelCategory } from '@/services/hooks/useAILabelCategory';
import type { AILabelCategory } from '@/services/apis/aiLabelCategory';
import {
  useAILabel,
  useDeleteAILabel,
  useMutationAILabelSuccess,
} from '@/services/hooks/useAILabel';
import type { AILabel } from '@/services/apis/aiLabel';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandleAILabel from '@/views/admin/AIModule/ModalHandleAILabel.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import IconDownloadExcel from '@/components/icons/admin/IconDownloadExcel.vue';
import ModalExportStyle from '@/views/admin/AIModule/ModalExportStyle.vue';
import { checkPermission } from '@/utils/helpers';

const categorySlug = ref('');
const categoryId = ref();
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
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: t('admin.ai-module.label.name'),
    dataIndex: 'name',
  },
  {
    title: t('admin.ai-module.label.ai-class'),
    dataIndex: 'aiClass',
  },
  {
    title: t('admin.ai-module.label.color'),
    dataIndex: 'color',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

// TODO: fetch all AI label categories
const { data } = useAILabelCategory();
const labelCategories: ComputedRef<AILabelCategory[]> = computed(() => data?.value?.data || []);
const labelCategoryOptions = computed(() =>
  labelCategories.value.map((item: AILabelCategory) => ({
    label: item.name,
    value: item.slug,
  })),
);

// TODO: Fetch label
const enableFetch = computed(() => !!categorySlug.value);
const { data: labelResponse, isLoading } = useAILabel(categorySlug, enableFetch);
const labels: ComputedRef<AILabel[]> = computed(() => labelResponse?.value?.data || []);

// TODO: watch fetch label categories
onMounted(() => {
  if (labelCategoryOptions.value.length === 0) {
    categorySlug.value = '';
  } else categorySlug.value = labelCategoryOptions.value[0].value;
});
watch(labelCategoryOptions, () => {
  categorySlug.value = labelCategoryOptions.value[0].value;
});

// TODO: change AI label category
watch(categorySlug, () => {
  categoryId.value =
    labelCategories.value.find((item) => item.slug === categorySlug.value)?.id || 0;
});

// TODO: Edit label
const open = ref<boolean>(false);

const currentLabel = ref<AILabel>();
const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentLabel.value = undefined;
  showModal();
};

const onEdit = (item: AILabel) => {
  currentLabel.value = item;
  showModal();
};

const { mutate: deleteAILabel } = useDeleteAILabel();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationAILabelSuccess();

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteAILabel(id, {
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

// TODO: EXPORT Style
const openExportStyle = ref<boolean>(false);

const exportStyle = () => {
  openExportStyle.value = true;
};
</script>
