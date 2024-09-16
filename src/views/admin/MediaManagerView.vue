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
          <h1 class="text-3xl mb-1">Quản lý media</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
            <a-upload
              :file-list="[]"
              name="file"
              :before-upload="
          () => {
            return false;
          }
        "
              @change="handleChange"
            >
              <a-button v-if="checkPermission(`${SERVICE_UNIT}${ACTION_IMPORT_DATA}`)">
                <upload-outlined />
                Tải file media
              </a-button>
            </a-upload>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-popconfirm
            title="Xác nhận loại dữ liệu?"
            @confirm="confirm(record.name)"
            v-if="checkPermission(`${SERVICE_LOG}${ACTION_DESTROY}`)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
            />
          </a-popconfirm>
          <div
            v-if="checkPermission(`${SERVICE_LOG}${ACTION_DESTROY}`)"
          >
            <a-spin
              :spinning="true"
              v-if="isDownloading"
            />
            <a-button
              type="primary"
              size="small"
              @click="downloadMediaFile(record.path)"
              v-else
            >
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
          </div>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { checkPermission, downloadFile } from '@/utils/helpers';
import {
  ACTION_DESTROY,
  ACTION_IMPORT_DATA, SERVICE_LOG,
  SERVICE_PROJECT,
  SERVICE_UNIT
} from '@/utils/IAM_constants';
import { useDeleteMediaFile, useMedia, useMutationMediaSuccess, useUploadMediaFile } from '@/services/hooks/useSystem';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import axios, { type AxiosError } from 'axios';
import { downloadErrorFile } from '@/services/apis/unit';



const { data, isLoading } = useMedia();
const { mutate: deleteItem } = useDeleteMediaFile();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationMediaSuccess();
const { mutate:uploadMediaFile } = useUploadMediaFile();
const dataSource = computed(
  () => data?.value?.data || []
);
console.log(data);
const confirm = (name: string) => {
  return new Promise((resolve) => {
    deleteItem(name, {
      onSuccess(data) {
        invalidateQueries();
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

const columns = computed(() => [
  {
    title: 'STT',
  },
  {
    title: 'Tên file',
    dataIndex: 'name',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
]);


const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);

  uploadMediaFile(formData, {
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

// Download Image with public image url
const isDownloading = ref(false);

const downloadMediaFile= async (filePath: string) => {
  try {
    isDownloading.value = true;
    const response = await axios.get(filePath, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filePath);
    document.body.appendChild(link);
    isDownloading.value = false;
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    isDownloading.value = false;
  }
};
</script>
