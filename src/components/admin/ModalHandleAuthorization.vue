<template>
  <a-drawer
    :open="open"
    title="Danh sách chức năng"
    @close="props.close"
    width="800"
    :get-container="getContainer"
  >
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="isLoading"
      :pagination="false"
    >
      <template
        #bodyCell="{ column, record }: { record: DataItem; index: number; column: ColumnType }"
      >
        <template v-if="column.title === $t('operation')">
          <a-switch
            v-model:checked="record.checked"
            @change="onSwitchChange(record)"
            :disabled="!checkPermission(`${SERVICE_AUTHORIZATION}${ACTION_UPDATE}`)"
          />
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { Authorization } from '@/services/apis/iam';
import { computed, type ComputedRef, ref, watch } from 'vue';
import type { PermissionRecordType } from '@/views/admin/PermissionGroupView.vue';
import { useI18n } from 'vue-i18n';
import type { ColumnType } from '@/utils/types';
import {
  useAddPermissionToUser,
  useMutationIAMSuccess,
  useRemovePermissionFromUser, useUserPermissions
} from '@/services/hooks/useIAM';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { checkPermission } from '@/utils/helpers';
import { ACTION_UPDATE, SERVICE_AUTHORIZATION } from '@/utils/IAM_constants';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Authorization;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

// TODO: Define type for data
interface DataItem {
  id: number;
  name: string;
  permissionGroup?: string;
  rowSpan?: number;
  checked?: boolean;
  userId?: number;
}
interface PermissionItem {
  id: number;
  name: string;
  isPermitted: boolean;
}

interface PermissionGroupItem {
  permissionGroupName: string;
  permissions: PermissionItem[];
}

const { t } = useI18n();

// TODO: mutate for action remove and add
const { mutate: remove } = useRemovePermissionFromUser();
const { mutate: add } = useAddPermissionToUser();
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { invalidateQueriesAuthorizations } = useMutationIAMSuccess();

// TODO: Define table structure
const columns = computed(() => {
  return [
    {
      title: 'Nhóm chức năng',
      dataIndex: 'permissionGroup',
      customCell: (_: PermissionRecordType) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: 'Chức năng',
      dataIndex: 'name',
    },
    {
      title: t('operation'),
    },
  ];
});

// TODO: Data for table
const data = ref<DataItem[]>();

// TODO: watch open props and have UserId
const userId = ref<number>(-1);
const isEnableFetchData: ComputedRef<boolean> = computed(()=> userId.value > -1)
const { data: userPermissions, isLoading } = useUserPermissions( userId, isEnableFetchData);

watch(
  () => props.selectedItem?.userId,
  () => {
    userId.value = props.selectedItem?.userId || -1;
  },
);
const dataSource = computed(() => {
  let dataRows :DataItem[] = [];
  userPermissions.value?.data?.forEach((item: PermissionGroupItem) => {
    const permissionsLength = item.permissions.length;
    item.permissions.forEach( (permission:PermissionItem, _index) => {
      dataRows.push({
        permissionGroup: item.permissionGroupName,
        id: permission.id,
        name: permission.name,
        checked: permission.isPermitted,
        userId: props.selectedItem?.userId,
        rowSpan: _index === 0 ? permissionsLength : 0
      })
    })
  })
  return dataRows;
});


// TODO: Handle change permission
function onSwitchChange(item: DataItem) {
  if (!item.userId) {
    return;
  }
  if (item.checked) {
    console.log("add", [item.id].join(','))
    add(
      {
        userId: item.userId,
        permissionId: [item.id].join(','),
      },
      {
        onSuccess(data) {
          invalidateQueriesAuthorizations();
          handleSuccess(data);
        },
        onError(error) {
          onError(error);
        },
      },
    );
  } else {
    console.log("remove", [item.id].join(','))
    remove(
      {
        userId: item.userId,
        permissionId: [item.id].join(','),
      },
      {
        onSuccess(data) {
          invalidateQueriesAuthorizations();
          handleSuccess(data);
        },
        onError(error) {
          onError(error);
        },
      },
    );
  }
}
</script>
