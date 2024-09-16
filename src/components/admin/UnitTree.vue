<template>
  <a-col
    :span="8"
    class="border border-solid border-[#ECEFF4]"
  >
    <div>
      <div
        class="bg-[#F3F5F8] pt-3 pb-4 px-7"
        style="height: 60px"
      >
        <a-typography-title
          :level="2"
          style="margin-bottom: 0; font-weight: 500; font-size: 24px; color: #333333"
        >
          {{ $t('admin.unit.department') }}
        </a-typography-title>
      </div>
      <a-input-search
        v-model:value="searchValue"
        class="px-8 pt-4"
        :placeholder="$t('search')"
      />
      <a-tree
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        checkable
        :tree-data="treeData"
        show-line
        draggable
        @drop="onDrop"
        class="m-8"
        @expand="onExpand"
      >
        <template
          #title="{ title, key }"
          v-if="!viewOnly && checkPermission(`${SERVICE_UNIT}${ACTION_UPDATE}`)"
        >
          <CustomTreeTitle
            :title="title"
            :title-key="key"
            :is-selected="selectedKeys.indexOf(key) != -1"
            :search-value="searchValue"
          />
        </template>
      </a-tree>
    </div>
  </a-col>
  <ModalHandleUnit
    v-if="!viewOnly"
    :open="Boolean(open)"
    :close="onClose"
    :data-tree-select="treeData"
  />
</template>
<script setup lang="ts">
import CustomTreeTitle from '@/components/admin/CustomTreeTitle.vue';
import { ref, toRaw, watch } from 'vue';
import {
  useMutationUnitSuccess,
  useUnits,
  useUnitTree,
  useUpdateUnit,
} from '@/services/hooks/useUnit';
import type { AntTreeNodeDropEvent, TreeDataItem } from 'ant-design-vue/es/tree';
import type { TreeProps } from 'ant-design-vue';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandleUnit from '@/components/admin/ModalHandleUnit.vue';
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface';
import { checkPermission } from '@/utils/helpers';
import { ACTION_UPDATE, SERVICE_UNIT } from '@/utils/IAM_constants';

const props = defineProps<{
  onChangeSelectedUnitIds: (ids: string[]) => void;
  onClose?: () => void;
  open?: boolean;
  viewOnly?: boolean;
}>();

const selectedKeys = ref<string[]>([]);
const treeData = ref<DataNode[]>([]);
const checkedKeys = ref<string[]>([]);

const { data: unitTreeData } = useUnitTree();
const { data: unitsData } = useUnits();

const { handleSuccess } = useSuccessHandler();
const { mutate: updateUnit } = useUpdateUnit();
const { invalidateQueries } = useMutationUnitSuccess();

const expandedKeys = ref<(string | number | null | undefined)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

const getParentKey = (key: string | number, tree: DataNode[]): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

watch(searchValue, (value) => {
  expandedKeys.value = (unitsData.value?.data || [])
    .map((item) => ({ title: item.name, key: item?.id?.toString() }))
    .map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData.value);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  searchValue.value = value;
  autoExpandParent.value = true;
});

watch(checkedKeys, () => {
  props.onChangeSelectedUnitIds(checkedKeys.value);
});

watch(unitTreeData, () => {
  treeData.value = unitTreeData?.value?.data || [];
});

const loop = (data: TreeProps['treeData'], key: string | number, callback: any) => {
  data?.forEach((item, index) => {
    if (item.key === key) {
      return callback(item, index, data);
    }
    if (item.children) {
      return loop(item.children, key, callback);
    }
  });
};

let dragObj: TreeDataItem;

const onDrop = (info: AntTreeNodeDropEvent) => {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos?.split('-');
  if (!dropPos) {
    return;
  }

  if (info.dragNode.key && info.node.key) {
    updateUnit(
      {
        parentId: info.node.key?.toString(),
        id: info.dragNode.key.toString(),
        name: info.dragNode.dataRef?.title,
      },
      {
        onSuccess(data) {
          handleSuccess(data);
          invalidateQueries();
        },
      },
    );
  }

  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const data = [...toRaw(treeData.value)];

  // Find dragObject
  loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
    arr?.splice(index, 1);
    dragObj = item;
  });
  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: TreeDataItem) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 && // Has children
    info.node.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item: TreeDataItem) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else {
    let ar: TreeProps['treeData'] = [];
    let i = 0;
    loop(data, dropKey, (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }
  treeData.value = data;
};
</script>
