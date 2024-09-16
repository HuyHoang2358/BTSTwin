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
          <h1 class="text-3xl mb-1">Bản đồ bên thứ ba</h1>
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
              v-if="checkPermission('LayerThirdPartyService.importLayerThirdParty')"
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
      <template v-if="column.title === $t('admin.spec.expiredDate')">
        {{ record.validFrom }} - {{ record.validTo }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center justify-end gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onUpdateSpecLayer(record)"
            :icon="h(IconEdit)"
            :id="`edit-${record.id}`"
            v-if="checkPermission('LayerThirdPartyService.updateLayerThirdParty')"
          />
          <a-popconfirm
            :title="$t('admin.spec.confirmDelete')"
            @confirm="confirm(record.id)"
            v-if="checkPermission('LayerThirdPartyService.destroyLayerThirdParty')"
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
  <ModalHandleDefaultLayer
    :close="() => (open = false)"
    :open="open"
    :selected-item="selectedItem"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useI18n } from 'vue-i18n';
import { imageFallback } from '@/utils/constants';
import {
  useDefaultLayers,
  useDeleteDefaultLayer,
  useMutationLayerSuccess,
} from '@/services/hooks/useLayer';
import type { Layer } from '@/services/apis/layer';
import type { ColumnType } from '@/utils/types';
import ModalHandleDefaultLayer from '@/components/admin/ModalHandleDefaultLayer.vue';
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
    title: t('admin.spec.previewImage'),
  },
  {
    title: t('admin.spec.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: t('admin.spec.createdDate'),
    dataIndex: 'createdAt',
    sorter: true,
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const open = ref<boolean>(false);
const selectedItem = ref<Layer>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data?.length),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useDefaultLayers({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
});
const { mutate: mutateDelete } = useDeleteDefaultLayer();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateDefaultLayerQueries } = useMutationLayerSuccess();

const dataSource: ComputedRef<Layer[]> = computed(() => data?.value?.data?.items || []);

const showModalHandleBaseLayer = () => {
  open.value = true;
};

const onCreateSpecLayer = () => {
  selectedItem.value = undefined;
  showModalHandleBaseLayer();
};

const onUpdateSpecLayer = (item: Layer) => {
  selectedItem.value = item;
  showModalHandleBaseLayer();
};

const confirm = (id: number) => {
  return new Promise((resolve) => {
    mutateDelete(id, {
      onSuccess(data) {
        invalidateDefaultLayerQueries();
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
