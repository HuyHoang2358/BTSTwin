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
        <a-col :span="16">
          <h1 class="text-3xl mb-1">{{ $t('admin.role.title') }}</h1>
        </a-col>
        <a-col :span="8">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              :placeholder="$t('search')"
              v-model:value="searchValue"
              data-test="search"
              allow-clear
            >
              <template #prefix>
                <IconSearchAdmin />
              </template>
            </a-input>
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
              id="add"
              v-if="checkPermission(`${SERVICE_ROLE}${ACTION_STORE}`)"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === $t('index')">
        <p class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</p>
      </template>
      <template v-if="column.title === $t('admin.role.function')">
        <div class="max-h-64 overflow-x-scroll">
          <a-typography-text
            v-for="item in record.permissions"
            :key="item"
          >
            {{ item.name }}
            <br />
          </a-typography-text>
        </div>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            v-if="checkPermission(`${SERVICE_ROLE}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            title="Xác nhận xóa vai trò?"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              v-if="checkPermission(`${SERVICE_ROLE}${ACTION_DESTROY}`)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleRole
    :close="closeModal"
    :open="open"
    :current-role="currentRole"
  />
</template>
<script lang="ts" setup>
import { ref, h, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComputedRef } from 'vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandleRole from '@/components/admin/ModalHandleRole.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useDeleteRole, useMutationIAMSuccess, useRoles } from '@/services/hooks/useIAM';
import type { RoleResType } from '@/services/apis/iam';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { checkPermission } from '@/utils/helpers';
import IconSearchAdmin from '@/components/icons/admin/IconSearchAdmin.vue';
import { ACTION_DESTROY, ACTION_STORE, ACTION_UPDATE, SERVICE_ROLE } from '@/utils/IAM_constants';

const { t } = useI18n();
const open = ref<boolean>(false);
const currentRole = ref<RoleResType>();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueriesRoles } = useMutationIAMSuccess();
const { mutate: deleteRole } = useDeleteRole();
const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data?.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading } = useRoles({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
});

const showModal = () => {
  open.value = true;
};

const closeModal = () => {
  open.value = false;
};

const onAdd = () => {
  currentRole.value = undefined;
  showModal();
};

const onEdit = (item: RoleResType) => {
  currentRole.value = item;
  showModal();
};

const dataSource: ComputedRef<RoleResType[]> = computed(() => data?.value?.data?.items || []);

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteRole(id, {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueriesRoles();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.role.form.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.role.function'),
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);
</script>
