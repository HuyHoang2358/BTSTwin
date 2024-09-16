<template>
  <a-table
    :columns="columns"
    :data-source="rasterDataStores"
    :loading="isLoading"
    size="middle"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.raster-store.title') }}</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row justify-end gap-x-2.5 w-full">
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
              v-if="checkPermission(`${SERVICE_RASTER_DATA_STORE}${ACTION_STORE}`)"
              id="add-field"
            >
              {{ $t('add') }}
            </a-button>
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
        column: ColumnType;
        index: number;
        record: RasterDataStore;
      }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(FolderViewOutlined)"
            @click="onViewImages(record)"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(CloudSyncOutlined)"
            @click="onSync(record.id)"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            :id="`edit-field-${record.id}`"
            v-if="checkPermission(`${SERVICE_RASTER_DATA_STORE}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            :title="$t('admin.raster-store.confirmDelete')"
            @confirm="confirm(record.id)"
            v-if="checkPermission(`${SERVICE_RASTER_DATA_STORE}${ACTION_DESTROY}`)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              :id="`delete-field-${record.id}`"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleRasterDataStore
    :close="() => (open = false)"
    :open="open"
    :current-raster-data-store="currentRasterDataStore"
    :get-container="testMode ? false : 'body'"
  />
  <ModalViewImagery
    v-if="openViewImages"
    :close="() => (openViewImages = false)"
    :open="openViewImages"
    :current-raster-data-store="currentRasterDataStore"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script setup lang="ts">
import { computed, type ComputedRef, h, ref } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useI18n } from 'vue-i18n';
import {
  useDeleteRasterDataStore,
  useMutationRasterDataStoreSuccess,
  useRasterDataStore,
  useSyncRasterDataStore,
} from '@/services/hooks/useRasterDataStore';
import type { RasterDataStore } from '@/services/apis/rasterDataStore';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandleRasterDataStore from '@/components/admin/ModalHandleRasterDataStore.vue';
import { checkPermission } from '@/utils/helpers';
import { CloudSyncOutlined, FolderViewOutlined } from '@ant-design/icons-vue';
import {
  ACTION_DESTROY,
  ACTION_STORE,
  ACTION_UPDATE,
  SERVICE_RASTER_DATA_STORE,
} from '@/utils/IAM_constants';
import type { ColumnType } from '@/utils/types';
import ModalViewImagery from '@/components/admin/ModalViewImagery.vue';

const { t } = useI18n();
defineProps<{
  testMode?: boolean;
}>();
// TODO: Define columns
const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.raster-store.name'),
    dataIndex: 'name',
  },
  {
    title: t('admin.raster-store.geo-store-type'),
    dataIndex: 'geoStoreType',
  },
  {
    title: t('admin.raster-store.storage-folder'),
    dataIndex: 'storageFolder',
  },
  {
    title: t('admin.raster-store.geo-data-path'),
    dataIndex: 'geoDataPath',
  },
  {
    title: t('admin.raster-store.status'),
    dataIndex: 'layerId',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

// TODO: fetch all raster data store
const { data, isLoading } = useRasterDataStore();
const rasterDataStores: ComputedRef<RasterDataStore[]> = computed(() => data?.value?.data || []);
const currentRasterDataStore = ref<RasterDataStore>();

// TODO: Edit label
const open = ref<boolean>(false);
const openViewImages = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentRasterDataStore.value = undefined;
  showModal();
};

const onEdit = (item: RasterDataStore) => {
  currentRasterDataStore.value = item;
  showModal();
};

const { mutate: deleteRasterDataStore } = useDeleteRasterDataStore();
const { mutate: syncRasterDataStore } = useSyncRasterDataStore();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationRasterDataStoreSuccess();

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteRasterDataStore(id, {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueries();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const onViewImages = (item: RasterDataStore) => {
  openViewImages.value = true;
  currentRasterDataStore.value = item;
};

const onSync = (id: number) => {
  syncRasterDataStore(id, {
    onSuccess(data) {
      handleSuccess(data);
      invalidateQueries();
    },
    onError(error) {
      onError(error);
    },
  });
};
</script>
