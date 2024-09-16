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
          <h1 class="text-3xl mb-1">Quản lý quyền người dùng</h1>
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
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{
        column,
        index,
        record,
      }: {
        record: Authorization;
        index: number;
        column: ColumnType;
      }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>

      <template v-if="column.dataIndex === 'numberPermissions'">
        {{ record.currentPermissionNumber }} / {{ record.totalPermissionInRole }}
        {{ $t('admin.authorization.permission').toLowerCase() }}
      </template>

      <template v-if="column.title === $t('operation')">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            :v-if="checkPermission(`${SERVICE_AUTHORIZATION}${ACTION_UPDATE}`)"
          />
        </div>
      </template>

    </template>
  </a-table>
  <ModalHandleAuthorization
    :close="() => (open = false)"
    :open="open"
    :selected-item="selectedItem"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useI18n } from 'vue-i18n';
import { useAuthorizations } from '@/services/hooks/useIAM';
import type { Authorization } from '@/services/apis/iam';
import type { ColumnType } from '@/utils/types';
import IconEdit from '@/components/icons/IconEdit.vue';
import ModalHandleAuthorization from '@/components/admin/ModalHandleAuthorization.vue';
import { checkPermission } from '@/utils/helpers';
import { ACTION_GET_ALL, ACTION_UPDATE, SERVICE_AUTHORIZATION } from '@/utils/IAM_constants';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'name',
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'username',
  },
  {
    title: 'Vai trò',
    dataIndex: 'roleName',
  },
  {
    title: 'Số lượng chức năng',
    dataIndex: 'numberPermissions',
  },
  {
    title: t('operation'),
  },
]);

const open = ref<boolean>(false);
const selectedItem = ref<Authorization>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useAuthorizations({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
});

const dataSource: ComputedRef<Authorization[]> = computed(() => data?.value?.data.items || []);

const showModal = () => {
  open.value = true;
};

const onEdit = (item: Authorization) => {
  selectedItem.value = item;
  showModal();
};
</script>
