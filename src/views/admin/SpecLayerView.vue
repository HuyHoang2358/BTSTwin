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
          <h1 class="text-3xl mb-1">{{ $t('admin.spec.title') }}</h1>
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
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onCreateSpecLayer"
              id="add-field"
              v-if="checkPermission(`${SERVICE_LAYER_VECTOR_DEFAULT}${ACTION_STORE}`)"
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
        <div class="flex flex-row items-center justify-end gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onShowModalSharing(record)"
            :icon="h(ShareAltOutlined)"
            :id="`share-${record.id}`"
            v-if="record.sharing === 'INTERNAL'"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onShowModalLayerPreview(record)"
            :icon="h(IconEye)"
            :id="`share-${record.id}`"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onUpdateSpecLayer(record)"
            :icon="h(IconEdit)"
            :id="`edit-${record.id}`"
            v-if="checkPermission(`${SERVICE_LAYER_VECTOR_DEFAULT}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            :title="$t('admin.spec.confirmDelete')"
            @confirm="confirm(record.id)"
            v-if="checkPermission('LayerVectorService.destroyLayerVector')"
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
  <ModalHandleSpecLayer
    :close="() => (modalHandleSpecLayerOpen = false)"
    :open="modalHandleSpecLayerOpen"
    :selected-item="selectedItem"
    :get-container="testMode ? false : 'body'"
  />
  <ModalUsersHasPermission
    :close="() => (modalSharingOpen = false)"
    :open="modalSharingOpen"
    :selected-item="selectedItem"
    :get-container="testMode ? false : 'body'"
  />
  <ModalLayerPreview
    :close="closeLayerPreview"
    :open="modalLayerPreview"
    :previewing-item="previewingItem"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { ShareAltOutlined } from '@ant-design/icons-vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useI18n } from 'vue-i18n';
import { imageFallback, maxPageSize } from '@/utils/constants';
import {
  useDeleteSpecLayer,
  useMutationLayerSuccess,
  useSpecLayers,
} from '@/services/hooks/useLayer';
import type { Layer } from '@/services/apis/layer';
import type { ColumnType } from '@/utils/types';
import ModalHandleSpecLayer from '@/components/admin/ModalHandleSpecLayer.vue';
import ModalUsersHasPermission from '@/components/admin/ModalUsersHasPermission.vue';
import ModalLayerPreview from '@/components/admin/ModalLayerPreview.vue';
import { useFields } from '@/services/hooks/useField';
import IconEye from '@/components/icons/IconEye.vue';
import { checkPermission } from '@/utils/helpers';
import { ACTION_STORE, ACTION_UPDATE, SERVICE_LAYER_VECTOR_DEFAULT } from '@/utils/IAM_constants';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

const { data: fields } = useFields({
  pageSize: ref(maxPageSize),
});

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.spec.previewImage'),
  },
  {
    title: t('admin.spec.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.spec.field'),
    dataIndex: 'departmentName',
    filters:
      fields?.value?.data?.items.map((item) => ({
        text: item.name,
        value: item.id?.toString(),
      })) || [],
  },
  {
    title: t('admin.spec.dataType'),
    dataIndex: 'dataCategoryName',
  },
  {
    title: t('admin.spec.sharing'),
    dataIndex: 'sharing',
    sorter: true,
  },
  {
    title: t('admin.spec.source'),
    dataIndex: 'source',
    sorter: true,
  },
  {
    title: t('admin.spec.createdDate'),
    dataIndex: 'takePhotoDate',
    sorter: true,
  },
  {
    title: t('admin.spec.expiredDate'),
    sorter: true,
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const modalHandleSpecLayerOpen = ref<boolean>(false);
const modalSharingOpen = ref<boolean>(false);
const selectedItem = ref<Layer>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction, filters } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useSpecLayers({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
  filters,
});

const { mutate: mutateDelete } = useDeleteSpecLayer();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateSpecLayerQueries } = useMutationLayerSuccess();

const dataSource: ComputedRef<Layer[]> = computed(() => data?.value?.data.items || []);

const showModalHandleSpecLayer = () => {
  modalHandleSpecLayerOpen.value = true;
};

const onCreateSpecLayer = () => {
  selectedItem.value = undefined;
  showModalHandleSpecLayer();
};

const onUpdateSpecLayer = (item: Layer) => {
  selectedItem.value = item;
  showModalHandleSpecLayer();
};

const onShowModalSharing = (item: Layer) => {
  selectedItem.value = item;
  modalSharingOpen.value = true;
};

const confirm = (id: number) => {
  return new Promise((resolve) => {
    mutateDelete(id, {
      onSuccess(data) {
        invalidateSpecLayerQueries();
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

// TODO: show modal preview map
const modalLayerPreview = ref<boolean>(false);
const previewingItem = ref<Layer>();
const onShowModalLayerPreview = (item: Layer) => {
  previewingItem.value = item;
  modalLayerPreview.value = true;
};
const closeLayerPreview = () => {
  modalLayerPreview.value = false;
  previewingItem.value = undefined;
};
</script>
