<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    @change="handleTableChange"
    :pagination="true"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.category.vendor.title') }}</h1>
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
              @click="onAdd"
              id="add-field"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Vendor }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            :title="$t('admin.category.vendor.confirmDelete')"
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

  <ModalHandleVendor
    :close="() => (open = false)"
    :open="open"
    :selected-item="selectedItem"
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
import { useI18n } from 'vue-i18n';
import type { ColumnType } from '@/utils/types';
import type { TableProps } from 'ant-design-vue';

import { useDeleteVendor, useMutationVendorSuccess, useVendors } from '@/services/hooks/useVendor';
import type { Vendor } from '@/services/apis/vendor';
import ModalHandleVendor from '@/components/admin/category/ModalHandleVendor.vue';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

// TODO: Define Column in table
const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.category.vendor.name'),
    dataIndex: 'name',
    sorter: true,
  },
 /* {
    title: t('admin.category.vendor.logo'),
    dataIndex: 'logo',

  },
  {
    title: t('admin.category.vendor.website'),
    dataIndex: 'website',
  },*/
  {
    title: t('admin.category.pole.description'),
    dataIndex: 'description',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);


// TODO: handle modal edit and add
const selectedItem = ref<Vendor>();
const open = ref<boolean>(false);
const showModal = () => {open.value = true;};
const onAdd = () => {selectedItem.value = undefined;showModal();}
const onEdit = (item: Vendor) => {selectedItem.value = item;showModal();};

// TODO: Fetch info
const { data, isLoading } = useVendors();
const dataSource: ComputedRef<Vendor[]> = computed(() => data?.value?.data || []);

// TODO: Delete Field
const { mutate: deleteVendor } = useDeleteVendor();
const { invalidateQueries } = useMutationVendorSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteVendor(id, {
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

// TODO: Searching
const searchValue = ref<string>('');

const handleTableChange: TableProps['onChange'] = async () => {
  console.log("change")
};
</script>
