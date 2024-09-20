<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    @change="handleTableChange"
    :pagination="pagination"
    data-test="table"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.pole.title') }}</h1>
        </a-col>

        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
            <!-- Search -->
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
            <!-- Add -->
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Pole }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>

      <template v-if="column.dataIndex === 'pole_category_id'">
        <span>{{ record.category?.code }}</span>
      </template>
      <template v-if="column.dataIndex === 'is_roof'">
        <span v-if="record.is_roof">TM</span>
        <span v-else>DD</span>
      </template>

      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <!-- Show params -->
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="showParams(record)"
            :icon="h(IconEye)"
          />
          <!-- Edit -->
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <!-- Delete -->
          <a-popconfirm
            :title="$t('admin.pole.confirmDelete')"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="openParams"
    title="Bảng thông số kỹ thuật"
    @ok="openParams = !openParams"
  >
    <a-table
      :columns="paramColumns"
      :data-source="selectedItem?.params"
      :pagination="false"
    >
      <template #bodyCell="{ column, index }: { column: ColumnType; index: number }">
        <template v-if="column.dataIndex === 'index'">
          <p>{{ index + 1 }}</p>
        </template>
      </template>
    </a-table>
  </a-modal>

  <ModalHandlePole
    :open="open"
    :close="() => (open = false)"
    :current-pole="selectedItem"
    :category-options="categoryOptions"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';

import IconEye from '@/components/icons/IconEye.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import ModalHandlePole from '@/components/admin/data/ModalHandlePole.vue';

import type { ComputedRef } from 'vue';
import type { ColumnType } from '@/utils/types';
import type { Pole } from '@/services/apis/pole';
import type { PoleCategory } from '@/services/apis/polecategory';

import { useI18n } from 'vue-i18n';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useDeletePole, useMutationPoleSuccess, usePoles } from '@/services/hooks/usePole';
import { useCategoryPoles } from '@/services/hooks/useCategoryPole';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();
const { mutate: deletePole } = useDeletePole();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationPoleSuccess();

// TODO: handle modal edit and add
const selectedItem = ref<Pole>();
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};
const onEdit = (item: Pole) => {
  selectedItem.value = item;
  showModal();
};

// TODO: Fetch info
const { perPage, page, handleTableChange, pagination, sort, filter } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading, refetch } = usePoles({
  perPage,
  page,
  sort,
  filter,
  searchValue: debouncedSearch,
});
watch(filter, () => {
  refetch();
});

const dataSource: ComputedRef<Pole[]> = computed(() => data?.value?.data?.data || []);
const { data: poleCategories } = useCategoryPoles();

// TODO: Edit
const categoryOptions = computed(
  () =>
    poleCategories?.value?.data?.map((i: PoleCategory) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);

// TODO: Delete Pole

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deletePole(id, {
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

// TODO: Define Column in table
const columns = computed(() => [
  {
    title: t('index'),
    align: 'center',
    fixed: 'left',
    width: 50,
  },
  {
    title: t('admin.pole.name'),
    dataIndex: 'name',
    sorter: true,
    fixed: 'left',
    width: 200,
  },
  {
    title: t('admin.pole.category'),
    dataIndex: 'pole_category_id',
    filters:
      poleCategories?.value?.data?.map((i: PoleCategory) => {
        return {
          text: i.name,
          value: i.id,
        };
      }) || [],
    align: 'center',
    width: 100,
  },
  {
    title: t('admin.pole.is_roof'),
    dataIndex: 'is_roof',
    align: 'center',
    width: 100,
    filters: [
      { text: 'TM', value: true },
      { text: 'DD', value: false },
    ],
  },
  {
    title: t('admin.pole.height'),
    dataIndex: 'height',
    align: 'right',
    width: 100,
    sorter: true,
  },
  {
    title: t('admin.pole.house_height'),
    dataIndex: 'house_height',
    align: 'right',
    width: 100,
    sorter: true,
  },
  {
    title: t('admin.pole.diameter_body_tube'),
    dataIndex: 'diameter_body_tube',
    align: 'right',
    width: 150,
    sorter: true,
  },
  {
    title: t('admin.pole.diameter_strut_tube'),
    dataIndex: 'diameter_strut_tube',
    align: 'right',
    width: 150,
    sorter: true,
  },
  {
    title: t('admin.pole.diameter_top_tube'),
    dataIndex: 'diameter_top_tube',
    align: 'right',
    width: 150,
    sorter: true,
  },
  {
    title: t('admin.pole.diameter_bottom_tube'),
    dataIndex: 'diameter_bottom_tube',
    align: 'right',
    width: 150,
    sorter: true,
  },
  {
    title: t('admin.pole.foot_size'),
    dataIndex: 'diameter_top_tube',
    align: 'right',
    width: 150,
  },
  {
    title: t('admin.pole.top_size'),
    dataIndex: 'diameter_bottom_tube',
    align: 'right',
    width: 150,
  },
  {
    title: t('admin.pole.structure'),
    dataIndex: 'structure',
    align: 'right',
    width: 150,
  },

  {
    title: t('operation'),
    dataIndex: 'action',
    fixed: 'right',
    width: 150,
  },
]);

const paramColumns = computed(() => [
  {
    title: t('index'),
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: t('admin.device.params.key'),
    dataIndex: 'key',
  },
  {
    title: t('admin.device.params.value'),
    dataIndex: 'value',
  },
]);
// TODO: Modal show info
const openParams = ref(false);

// TODO: Show params:
const showParams = (record: Pole) => {
  selectedItem.value = record;
  openParams.value = true;
};
</script>
