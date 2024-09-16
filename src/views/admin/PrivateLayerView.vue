<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">Bản đồ mặc định của hệ thống</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row justify-end gap-x-2.5">
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onCreateSpecLayer"
              v-if="checkPermission('LayerVectorService.publicLayerVector')"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { record: Layer; index: number; column: ColumnType }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.title === $t('admin.spec.previewImage') && record.previewImageURL">
        <a-image
          :width="100"
          :height="100"
          :src="record.previewImageURL"
          :fallback="imageFallback"
          class="object-contain"
          :alt="record.name"
        />
      </template>
      <template v-if="column.title === $t('admin.spec.dataType')">
        {{ record.dataCategoryResponse.name }}
      </template>
      <template v-if="column.title === $t('admin.spec.field')">
        {{ record.dataCategoryResponse.departmentName }}
      </template>
      <template v-if="column.title === $t('admin.spec.expiredDate')">
        {{ record.validFrom }} - {{ record.validTo }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center justify-center gap-x-4">
          <a-popconfirm
            :title="$t('admin.spec.confirmDelete')"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              :id="`delete-field-${record.id}`"
              v-if="checkPermission('LayerVectorService.destroyPrivateLayerVector')"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandlePrivateLayer
    :close="() => (modalHandleSpecLayerOpen = false)"
    :open="modalHandleSpecLayerOpen"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import { imageFallback } from '@/utils/constants';
import {
  useDeleteLayerPrivate,
  useLayersPrivate,
  useMutationLayerSuccess,
} from '@/services/hooks/useLayer';
import type { Layer } from '@/services/apis/layer';
import type { ColumnType } from '@/utils/types';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandlePrivateLayer from '@/components/admin/ModalHandlePrivateLayer.vue';
import { checkPermission } from '@/utils/helpers';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.spec.name'),
    dataIndex: 'name',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const modalHandleSpecLayerOpen = ref<boolean>(false);
const selectedItem = ref<Layer>();

const { data, isLoading } = useLayersPrivate();

const { mutate: mutateDelete } = useDeleteLayerPrivate();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateLayerPrivateQueries } = useMutationLayerSuccess();

const dataSource: ComputedRef<Layer[]> = computed(() => data?.value?.data || []);

const showModalHandleSpecLayer = () => {
  modalHandleSpecLayerOpen.value = true;
};

const onCreateSpecLayer = () => {
  selectedItem.value = undefined;
  showModalHandleSpecLayer();
};

const confirm = (id: number) => {
  return new Promise((resolve) => {
    mutateDelete(id, {
      onSuccess(data) {
        invalidateLayerPrivateQueries();
        handleSuccess(data);
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
