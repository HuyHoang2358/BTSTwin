<template>
  <a-drawer
    :open="open"
    title="Chia sẻ bản đồ"
    @close="props.close"
    width="80%"
    :get-container="getContainer"
  >
    <a-row class="border border-solid border-[#ECEFF4] rounded-md overflow-hidden">
      <UnitTree
        v-if="open"
        :on-change-selected-unit-ids="onChangeSelectedUnitIds"
        view-only
      />
      <a-col :span="16">
        <UsersInUnits
          :unit-ids-params="unitIds"
          :on-change-selected-row-keys="onChangeSelectedRowKeys"
          :initial-selected-row-keys="
            props.selectedItem?.layerUsers.map((item) => item.idOfUser) || []
          "
          view-only
          v-if="open"
        />
      </a-col>
    </a-row>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-create-field"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleFinish"
          id="submit-field"
          :loading="isPending"
        >
          {{ $t('save') }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { Layer } from '@/services/apis/layer';
import UsersInUnits from '@/components/admin/UsersInUnits.vue';
import UnitTree from '@/components/admin/UnitTree.vue';
import { ref } from 'vue';
import { useMutationLayerSuccess, useShareSpecLayer } from '@/services/hooks/useLayer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Layer;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const unitIds = ref<string[]>([]);
const selectedRowKeys = ref<number[]>([]);
const { mutate: shareSpecLayer, isPending } = useShareSpecLayer();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateSpecLayerQueries } = useMutationLayerSuccess();

const onChangeSelectedUnitIds = (ids: string[]) => {
  unitIds.value = ids;
};

const onChangeSelectedRowKeys = (ids: number[]) => {
  selectedRowKeys.value = ids;
};

const handleFinish = () => {
  if (!props.selectedItem?.id) {
    return;
  }
  shareSpecLayer(
    {
      id: props.selectedItem.id,
      userIds: selectedRowKeys.value,
    },
    {
      onSuccess(data) {
        invalidateSpecLayerQueries();
        handleSuccess(data);
        props.close();
      },
      onError(error) {
        onError(error);
      },
    },
  );
};
</script>
