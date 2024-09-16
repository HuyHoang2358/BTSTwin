<template>
  <div class="flex flex-row items-center justify-between mb-4">
    <h1 class="text-3xl mb-1">{{ $t('admin.unit.list') }}</h1>
    <div class="flex flex-row gap-x-4 justify-end">
      <!-- import excel -->
      <a-upload
        :file-list="[]"
        name="file"
        :before-upload="
          () => {
            return false;
          }
        "
        :accept="excelMineType"
        @change="handleChange"
      >
        <a-button v-if="checkPermission(`${SERVICE_UNIT}${ACTION_IMPORT_DATA}`)">
          <upload-outlined />
          {{ $t('import') }}
        </a-button>
      </a-upload>
      <!-- add new Unit -->
      <a-button
        type="primary"
        class="flex justify-center items-center space-x-2.5"
        @click="onAdd"
        v-if="checkPermission(`${SERVICE_UNIT}${ACTION_STORE}`)"
      >
        {{ $t('add') }}
      </a-button>
    </div>
  </div>
  <a-row class="border border-solid border-[#ECEFF4] rounded-md overflow-hidden">
    <UnitTree
      :on-change-selected-unit-ids="onChangeSelectedUnitIds"
      :open="open"
      :on-close="onClose"
    />
    <a-col :span="16">
      <UsersInUnits :unit-ids-params="unitIds" />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { AxiosError } from 'axios';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { excelMineType } from '@/utils/constants';
import type { UploadChangeParam } from 'ant-design-vue';
import { useInsertUnitFromExcel, useMutationUnitSuccess } from '@/services/hooks/useUnit';
import UnitTree from '@/components/admin/UnitTree.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { checkPermission, downloadFile } from '@/utils/helpers';
import { downloadErrorFile } from '@/services/apis/unit';
import UsersInUnits from '@/components/admin/UsersInUnits.vue';
import { ACTION_IMPORT_DATA, ACTION_STORE, SERVICE_UNIT } from '@/utils/IAM_constants';

const unitIds = ref<string[]>([]);
const open = ref<boolean>(false);

const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { mutate: insertUnitList } = useInsertUnitFromExcel();
const { invalidateQueries } = useMutationUnitSuccess();

const onAdd = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};

const onChangeSelectedUnitIds = (ids: string[]) => {
  unitIds.value = ids;
};

const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);
  insertUnitList(formData, {
    onSuccess(data) {
      handleSuccess(data);
      invalidateQueries();
    },
    onError(error: unknown) {
      const errorAsType = error as AxiosError<{ code: number; data: string }>;
      onError(errorAsType);
      if (errorAsType.response?.data.code === 2) {
        downloadErrorFile(errorAsType.response.data.data).then((response) => {
          downloadFile(response as Blob);
        });
      }
    },
  });
};
</script>
