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
      :data-source="data"
    >
      <template
        #bodyCell="{ column, record }: { record: DataItem; index: number; column: ColumnType }"
      >
        <template v-if="column.title === $t('operation')">
          <a-switch
            v-model:checked="record.checked"
            @change="onSwitchChange(record)"
          />
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { Authorization } from '@/services/apis/iam';
import { computed, ref, watch } from 'vue';
import type { PermissionRecordType } from '@/views/admin/PermissionGroupView.vue';
import { useI18n } from 'vue-i18n';
import type { ColumnType } from '@/utils/types';
import type { PERMISSION_TYPE } from '@/utils/enums';
import {
  useAddPermission,
  useMutationIAMSuccess,
  useRemovePermission,
} from '@/services/hooks/useIAM';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Authorization;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

interface DataItem {
  id: number;
  name: string;
  scope: string;
  createdDate: string;
  updatedDate: string;
  type: PERMISSION_TYPE;
  permissionGroup?: string;
  rowSpan?: number;
  checked?: boolean;
  userId?: number;
}

const { t } = useI18n();

const { mutate: remove } = useRemovePermission();
const { mutate: add } = useAddPermission();
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { invalidateQueriesAuthorizations } = useMutationIAMSuccess();

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
      title: 'Module hệ thống',
      dataIndex: 'scope',
    },
    {
      title: t('operation'),
    },
  ];
});

const data = ref<DataItem[]>();

watch(
  () => props.selectedItem?.permissions,
  () => {
    data.value =
      props.selectedItem?.permissions?.map((item, index) => {
        return {
          ...item,
          permissionGroup: props.selectedItem?.permissionGroup.name,
          rowSpan: index === 0 ? props.selectedItem?.permissions.length : 0,
          checked: !!props.selectedItem?.permissionGroup.permissions.find((p) => p.id === item.id),
          userId: props.selectedItem?.userId,
        };
      }) || [];
  },
);

function onSwitchChange(item: DataItem) {
  if (!item.userId) {
    return;
  }
  if (item.checked) {
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
