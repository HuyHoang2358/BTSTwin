<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    @change="handleTableChange"
    :pagination="pagination"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.field.title') }}</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              :placeholder="$t('search')"
              v-model:value="searchValue"
              data-test="search-input"
              allow-clear
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
              id="add-field"
              v-if="checkPermission(`${SERVICE_DEPARTMENT}${ACTION_STORE}`)"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Field }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.title === $t('admin.field.previewImage') && record.previewImage">
        <a-image
          :width="100"
          :height="100"
          :src="record.previewImage"
          :fallback="imageFallback"
          class="object-contain"
          alt="Phát hiện thay đổi"
        />
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag :color="record.locked ? 'volcano' : 'green'">
            {{ record.locked ? 'Bị khóa' : 'Hoạt động' }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            :id="`edit-field-${record.id}`"
            v-if="checkPermission(`${SERVICE_DEPARTMENT}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            :title="$t('admin.field.confirmDelete')"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              :id="`delete-field-${record.id}`"
              v-if="checkPermission(`${SERVICE_DEPARTMENT}${ACTION_DESTROY}`)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleField
    :close="() => (open = false)"
    :open="open"
    :current-field="currentField"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandleField from '@/components/admin/ModalHandleField.vue';
import { SYS_FIELDS_QUERY_KEY, useDeleteField, useFields } from '@/services/hooks/useField';
import type { Field } from '@/services/apis/field';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useI18n } from 'vue-i18n';
import { imageFallback } from '@/utils/constants';
import { checkPermission } from '@/utils/helpers';
import {
  ACTION_DESTROY,
  ACTION_STORE,
  ACTION_UPDATE,
  SERVICE_DEPARTMENT,
} from '@/utils/IAM_constants';
import type { ColumnType } from '@/utils/types';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.field.previewImage'),
  },
  {
    title: t('admin.field.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('description'),
    dataIndex: 'description',
  },
  {
    title: 'Trạng thái',
    key: 'tags',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const open = ref<boolean>(false);
const currentField = ref<Field>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useFields({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
});
const { mutate: deleteField } = useDeleteField();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<Field[]> = computed(() => data?.value?.data.items || []);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentField.value = undefined;
  showModal();
};

const onEdit = (item: Field) => {
  currentField.value = item;
  showModal();
};

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteField(id, {
      onSuccess(data) {
        handleSuccess(data);
        queryClient.invalidateQueries({ queryKey: [SYS_FIELDS_QUERY_KEY] });
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
