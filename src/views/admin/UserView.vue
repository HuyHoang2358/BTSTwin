<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    :pagination="pagination"
    @change="handleTableChange"
    data-test="table"
  >
    <template #title>
      <div class="flex flex-row justify-between">
        <h1 class="text-3xl mb-1">{{ $t('admin.users.userList') }}</h1>
        <div
          class="flex flex-row gap-x-2.5"
          style="align-items: end"
        >
          <!-- Search -->
          <a-input
            :placeholder="t('search')"
            v-model:value="searchValue"
            data-test="search-input"
            allow-clear
          >
            <template #prefix>
              <IconSearchInput />
            </template>
          </a-input>

          <!-- Import excel file -->
          <a-upload
            :file-list="[]"
            name="file"
            :before-upload="
              () => {
                return false;
              }
            "
            :accept="excelMineType"
            @change="handleChange"
            v-if="checkPermission(`${SERVICE_USER}${ACTION_IMPORT_DATA}`)"
          >
            <a-button>
              <upload-outlined />
              {{ $t('import') }}
            </a-button>
          </a-upload>

          <!-- Export excel file -->
          <a-button
            @click="onDownload"
            id="export-excel"
            :loading="isPendingDownload"
            v-if="checkPermission(`${SERVICE_USER}${ACTION_EXPORT_DATA}`)"
          >
            <DownloadOutlined />
            {{ $t('export') }}
          </a-button>

          <!-- Add account -->
          <a-button
            type="primary"
            class="flex justify-center items-center space-x-2.5"
            :icon="h(IconAddCircle)"
            @click="onAdd"
            v-if="checkPermission(`${SERVICE_USER}${ACTION_STORE}`)"
          >
            {{ $t('add') }}
          </a-button>
        </div>
      </div>
    </template>
    <template
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: User }"
    >
      <template v-if="column.title === $t('index')">
        <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
      </template>
      <template v-if="column.title === $t('phoneNumber')">
        {{ record?.profile?.phone }}
      </template>
      <template v-if="column.title === $t('address')">
        {{ record?.profile?.address?.commune?.communeName }} -
        {{ record?.profile?.address?.district?.districtName }}
      </template>
      <template v-if="column.title === $t('title')">
        {{ record?.profile?.title?.name }}
      </template>
      <template v-if="column.title === $t('unit')">
        {{ record?.profile?.unit?.name }}
      </template>
      <template v-if="column.dataIndex === 'role'">
        {{ record?.roles && record?.roles.length > 0 ? record?.roles[0].name : '' }}
      </template>
      <template v-if="column.title === $t('operation')">
        <div class="flex flex-row gap-x-4">
          <a-dropdown
            trigger="click"
            v-if="
              checkPermission(`${SERVICE_USER}${ACTION_RESET_PASSWORD}`) ||
              checkPermission(`${SERVICE_USER}${ACTION_UPDATE}`) ||
              checkPermission(`${SERVICE_USER}${ACTION_DESTROY}`)
            "
          >
            <a-button
              ghost
              class="group"
            >
              <MoreOutlined
                :data-test="`more-outline-${index}`"
                class="text-gray-700 group-hover:text-main"
              />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  key="update"
                  @click="onEdit(record)"
                  v-if="checkPermission(`${SERVICE_USER}${ACTION_UPDATE}`)"
                >
                  {{ t('admin.users.update') }}
                </a-menu-item>
                <a-menu-item
                  key="resetPassword"
                  @click="confirmResetPassword(record.name, record.id)"
                  id="reset-password"
                  v-if="checkPermission(`${SERVICE_USER}${ACTION_RESET_PASSWORD}`)"
                >
                  {{ t('admin.users.resetPassword') }}
                </a-menu-item>
                <a-menu-item
                  key="delete"
                  @click="confirmDelete(record.name || record.username, record.id)"
                  id="delete-user"
                  v-if="checkPermission(`${SERVICE_USER}${ACTION_DESTROY}`)"
                >
                  {{ t('admin.users.delete') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleUser
    :open="modalHandleUserOpen"
    :close="() => (modalHandleUserOpen = false)"
    :current-user="currentUser"
    :role-options="roleOptions"
    :position-options="positionOptions"
  />
</template>
<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { ref, h, computed, createVNode, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { Modal } from 'ant-design-vue';

import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandleUser from '@/components/admin/ModalHandleUser.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import {
  UploadOutlined,
  DownloadOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { type UploadChangeParam } from 'ant-design-vue';
import {
  useChangePasswordByAdmin,
  useDeleteUser,
  useDownloadUserList,
  useInsertUserFromExcel,
  useMutationUserSuccess,
  useUsers,
} from '@/services/hooks/useUser';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { User } from '@/services/apis/user';
import { usePositions } from '@/services/hooks/usePosition';
import { useUnitTree } from '@/services/hooks/useUnit';
import { useAdministrative } from '@/services/hooks/useAdministrative';
import { displayDateFormat, excelMineType, maxPageSize } from '@/utils/constants';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import type { ColumnType } from '@/utils/types';
import { useRoles } from '@/services/hooks/useIAM';
import { checkPermission, downloadFile } from '@/utils/helpers';
import type { AxiosError } from 'axios';
import { downloadErrorFile } from '@/services/apis/unit';
import {
  ACTION_DESTROY,
  ACTION_EXPORT_DATA,
  ACTION_IMPORT_DATA,
  ACTION_RESET_PASSWORD,
  ACTION_STORE,
  ACTION_UPDATE,
  SERVICE_USER,
} from '@/utils/IAM_constants';

const { t } = useI18n();
const currentUser = ref<User>();
const modalHandleUserOpen = ref<boolean>(false);

// TODO: Get Data
const { pageSize, currentPage, handleTableChange, pagination, sort, direction, filters } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: deleteUser } = useDeleteUser();
const { mutate: changePasswordByAdmin } = useChangePasswordByAdmin();
const { mutate: downloadUserList, isPending: isPendingDownload } = useDownloadUserList();
const { mutate: insertUserList } = useInsertUserFromExcel();

//TODO: Fetch data for tabel and filter
const { data: rolesData } = useRoles({
  pageSize: ref(maxPageSize),
});
const { data: administrativeData } = useAdministrative({
  pageSize: ref(maxPageSize),
});
const { data: unitsData } = useUnitTree();
const { data: positionsData } = usePositions({
  pageSize: ref(maxPageSize),
});
const { data, isLoading, refetch } = useUsers({
  currentPage,
  pageSize,
  searchValue: debouncedSearch,
  sort,
  direction,
  filters,
});
const { invalidateQueries } = useMutationUserSuccess();

watch(filters, () => {
  refetch();
});

const dataSource: ComputedRef<User[]> = computed(() => data?.value?.data?.items || []);

const showModal = () => {
  modalHandleUserOpen.value = true;
};

const onAdd = () => {
  currentUser.value = undefined;
  showModal();
};

const onEdit = (user: User) => {
  currentUser.value = user;
  showModal();
};

const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);
  insertUserList(formData, {
    onError(error: unknown) {
      const errorAsType = error as AxiosError<{ code: number; data: string }>;
      onError(errorAsType);
      if (errorAsType.response?.data.code === 2) {
        downloadErrorFile(errorAsType.response.data.data).then((response) => {
          downloadFile(response as Blob);
        });
      }
    },
    onSuccess(data) {
      handleSuccess(data);
      invalidateQueries();
    },
  });
};

const onDownload = () => {
  downloadUserList(undefined, {
    onError,
    onSuccess(data) {
      const url = URL.createObjectURL(
        new Blob([data], {
          type: excelMineType,
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sách_người_dùng_${dayjs().format(displayDateFormat)}`);
      document.body.appendChild(link);
      link.click();
    },
  });
};

const confirmResetPassword = (name: string, id: number) => {
  Modal.confirm({
    title: `Thông báo`,
    icon: createVNode(ExclamationCircleOutlined),
    content: `Xác nhận đặt lại mât khẩu của ${name}?`,
    onOk: async () => {
      return new Promise((resolve) => {
        changePasswordByAdmin(id, {
          onSuccess(data) {
            handleSuccess(data);
            resolve(true);
          },
          onError(error) {
            onError(error);
            resolve(true);
          },
        });
      });
    },
    centered: true,
  });
};

const confirmDelete = (name: string, id: number) => {
  Modal.confirm({
    title: `Thông báo`,
    icon: createVNode(ExclamationCircleOutlined),
    content: `Xác nhận xóa tài khoản ${name}?`,
    onOk: async () => {
      return new Promise((resolve) => {
        deleteUser(id, {
          onSuccess(data) {
            invalidateQueries();
            handleSuccess(data);
            resolve(true);
          },
          onError(error) {
            onError(error);
            resolve(true);
          },
        });
      });
    },
    centered: true,
  });
};

const roleOptions = computed(
  () =>
    rolesData?.value?.data?.items.map((i) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);

const positionOptions = computed(
  () =>
    positionsData?.value?.data?.items.map((i) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);
// TODO: Create filter Unit

// TODO: Define columns
const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('fullName'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('accountName'),
    dataIndex: 'username',
    sorter: true,
  },
  {
    title: t('email'),
    dataIndex: 'email',
    sorter: true,
  },
  {
    title: t('phoneNumber'),
  },
  {
    title: t('address'),
    dataIndex: 'district',
    filters:
      administrativeData?.value?.data?.items?.map((i) => {
        return {
          text: i.districtName,
          value: i.id,
        };
      }) || [],
    filterSearch: true,
  },
  {
    title: t('title'),
    dataIndex: 'title',
    filters: positionOptions.value,
    filterSearch: true,
  },
  {
    title: t('unit'),
    dataIndex: 'unit',
    filterMode: 'tree',
    filters: unitsData?.value?.data || [],
    filterSearch: true,
  },
  {
    title: t('role'),
    dataIndex: 'role',
    filters: roleOptions.value,
    filterSearch: true,
  },
  {
    title: t('operation'),
  },
]);
</script>
