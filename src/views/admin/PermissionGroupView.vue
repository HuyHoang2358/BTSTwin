<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    :pagination="false"
  >
    <!-- Table Tile -->
    <template #title>
      <a-row jutify="center">
        <a-col :span="12">
          <h1 class="text-3xl mb-1">{{ $t('admin.permissionGroups.title') }}</h1>
        </a-col>
        <a-col :span="12">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              :placeholder="$t('search')"
              v-model:value="searchValue"
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
              @click="onAddPermissionGroup"
              id="add"
              v-if="checkPermission(`${SERVICE_PERMISSION_GROUP}${ACTION_STORE}`)"
            >
              {{ $t('add') }} nhóm chức năng
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>

    <!-- Table Body -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'permissionName'">
        <div class="flex justify-start gap-x-2 items-center">
          <p class="mb-0">{{ record.permissionName }}</p>
          <div
            class="w-2 h-2 bg-green-600 rounded-full border-0"
            v-if="record.public"
          ></div>
        </div>

      </template>
      <template v-if="column.dataIndex === 'action'">
        <div
          class="flex flex-row items-center gap-x-4"
          v-if="record.name !== ''"
        >
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconAddPopUp)"
            :id="`edit-permission-groups-${record.key}`"
            @click="onAdd(record)"
            v-if="
              checkPermission(`${SERVICE_PERMISSION}${ACTION_STORE}`) && record.type === 'group'
            "
          />

          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconEdit)"
            :id="`edit-permission-groups-${record.key}`"
            @click="onEdit(record)"
            v-if="checkPermission(`${SERVICE_PERMISSION}${ACTION_UPDATE}`)"
          />

          <a-popconfirm
            :title="`Xác nhận xóa ${record.type === 'group' ? 'nhóm quyền' : 'quyền'}?`"
            @confirm="onDelete(record)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              v-if="checkPermission(`${SERVICE_PERMISSION}${ACTION_DESTROY}`)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>

  <ModalHandlePermissionGroup
    :close="() => (openPermissionGroupModal = false)"
    :open="openPermissionGroupModal"
    :current-permission-group="currentPermissionGroup"
    :get-container="'body'"
  />

  <ModalHandlePermission
    :close="() => (openPermissionModal = false)"
    :open="openPermissionModal"
    :current-permission="currentPermission"
    :current-permission-group="currentPermissionGroup"
    :get-container="'body'"
  />

</template>
<script lang="ts" setup>
import { ref, computed, h } from 'vue';
import {
  useMutationIAMSuccess, usePermissionGroups,
  useRemovePermission, useRemovePermissionGroup
} from '@/services/hooks/useIAM';
import type { Permission, PermissionGroup } from '@/services/apis/iam';
import { checkPermission } from '@/utils/helpers';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddPopUp from '@/components/icons/IconAddPopUp.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchAdmin from '@/components/icons/admin/IconSearchAdmin.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandlePermission from '@/components/admin/ModalHandlePermission.vue';
import ModalHandlePermissionGroup from '@/components/admin/ModalHandlePermissionGroup.vue';
import {
  ACTION_DESTROY, ACTION_STORE, ACTION_UPDATE,
  SERVICE_PERMISSION, SERVICE_PERMISSION_GROUP,
} from '@/utils/IAM_constants';
import { useTableSearch } from '@/utils/hooks/useTableSearch';

// TODO: Type
export type PermissionChildType = {
  key: number;
  type: string; // permission || group
  permissionGroupId: number;
  permissionGroupName: string;
  permissionName: string;
  permissionId: number;
  permissionModule: string;
  public: boolean;
};
export type PermissionRecordType = {
  key: number;
  type: string; // permission || group
  permissionGroupId: number;
  permissionGroupName: string;
  permissionName: string;
  permissionId: number;
  permissionModule: string;
  children: PermissionChildType[];
};

// TODO: Define modal variables
const openPermissionModal = ref<boolean>(false);
const openPermissionGroupModal = ref<boolean>(false);
const currentPermissionGroup = ref<PermissionGroup>();
const currentPermission = ref<Permission>();

// TODO: Handle Action
const onAddPermissionGroup = () => {
  openPermissionGroupModal.value = true;
  currentPermissionGroup.value = undefined;
};
const onAdd = (item: PermissionChildType) => {
  openPermissionModal.value = true;
  currentPermission.value = undefined;
  currentPermissionGroup.value = {
    id: item.permissionGroupId,
    name: item.permissionGroupName
  }
  console.log(currentPermissionGroup.value);
  console.log(currentPermission.value);
}
const onEdit = (item:PermissionChildType) => {
  if (item.type === 'group') {
    openPermissionGroupModal.value = true;
    currentPermissionGroup.value = {
      id: item.permissionGroupId,
      name: item.permissionGroupName
    }
  }else{
    openPermissionModal.value = true;
    currentPermission.value = {
      id: item.permissionId,
      name: item.permissionName,
      scope: item.permissionModule,
      public: item.public
    };
    currentPermissionGroup.value = {
      id: item.permissionGroupId,
      name: item.permissionGroupName
    }
  }
}
const onDelete = (item:PermissionChildType) => {
    return new Promise((resolve) => {
      if (item.type === 'group') {
        deletePermissionGroup(item.permissionGroupId.toString(), {
          onSuccess(data) {
            handleSuccess(data);
            invalidateQueriesPermissionGroup();
            resolve(true);
          },
          onError(error) {
            onError(error);
            resolve(true);
          },
        });
      }
      else {
        deletePermission(item.permissionId.toString(), {
          onSuccess(data) {
            handleSuccess(data);
            invalidateQueriesPermissionGroup();
            resolve(true);
          },
          onError(error) {
            onError(error);
            resolve(true);
          },
        });
      }
    });
}


const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueriesPermissionGroup } = useMutationIAMSuccess();
const { mutate: deletePermission } = useRemovePermission();
const { mutate: deletePermissionGroup } = useRemovePermissionGroup();


// TODO: Preprocessing data to view
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading } = usePermissionGroups({ searchValue: debouncedSearch });
const dataSource = computed(() => {
  const tempData: PermissionRecordType[] = [];
  data.value?.data
    ?.forEach((item) => {
      const permissions:PermissionChildType[] = [];
      if (item.permissions){
        item?.permissions.forEach((permission, ) => {
          permissions.push({
            type: 'permission',
            key: permission.id,
            permissionGroupName: "",
            permissionGroupId: item.id,
            permissionName: permission.name,
            permissionModule: permission.scope,
            permissionId: permission.id,
            public: permission.public
          });
        });
      }
      tempData.push({
        type: 'group',
        key: item.id * 1000 + item.id,
        permissionGroupName: item.name,
        permissionGroupId: item.id,
        permissionName: '',
        permissionModule: '',
        permissionId: 0,
        children: permissions
      })

    });
  return tempData;
});

// TODO: Define Columns
const columns = [
  {
    title: 'Tên nhóm năng',
    dataIndex: 'permissionGroupName',
    key: 'permissionGroupName',
    width: '30%'
  },
  {
    title: 'Tên chức năng',
    dataIndex: 'permissionName',
    key: 'permissionName',
    width: '30%'
  },
  {
    title: 'Module',
    dataIndex: 'permissionModule',
    key: 'module',
    width: '20%'
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: '20%',
    key: 'action',
  },
];


</script>
