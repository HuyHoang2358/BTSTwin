<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
    :get-container="getContainer"
    :mask-closable="false"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-form-item
        name="layerUrl"
        :label="$t('admin.defaultLayer.url')"
        :rules="[{ required: true, message: $t('admin.defaultLayer.form.inputUrl') }]"
      >
        <a-input
          v-model:value="formState.layerUrl"
          :allow-clear="true"
          :placeholder="$t('admin.defaultLayer.form.placeholderUrl')"
        />
      </a-form-item>
      <a-form-item
        name="subDomains"
        :label="$t('admin.defaultLayer.subDomains')"
      >
        <a-input
          v-model:value="formState.subDomains"
          :allow-clear="true"
          :placeholder="$t('admin.defaultLayer.form.placeholderSubDomains')"
        />
      </a-form-item>
      <a-form-item
        name="name"
        :label="$t('admin.spec.name')"
        :rules="[{ required: true, message: $t('admin.spec.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :placeholder="$t('admin.spec.form.placeholderName')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('admin.field.previewImage')"
        name="fileList"
        :rules="[{ required: true, message: 'Vui lòng tải lên ảnh xem trước' }]"
      >
        <a-upload
          v-model:file-list="formState.fileList"
          name="file"
          list-type="picture-card"
          :action="`${baseUrl}departments/upload-image`"
          :headers="{
            Authorization: configStore.accessToken
              ? `Bearer ${configStore.accessToken}`
              : undefined,
          }"
          :before-upload="beforeUpload"
          @preview="handlePreview"
        >
          <div v-if="formState.fileList && formState.fileList.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">Tải ảnh</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        name="description"
        :label="$t('description')"
        :rules="[{ required: true, message: $t('form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          allow-clear
          :placeholder="$t('form.placeholderDescription')"
          data-test="description"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-create-base-layer"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating || isUpdating"
          @click="onSubmit"
          id="submit-base-layer"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { type UnwrapRef } from 'vue';
import { computed, reactive, ref, watch } from 'vue';
import {
  useCreateDefaultLayer,
  useMutationLayerSuccess,
  useUpdateDefaultLayer,
} from '@/services/hooks/useLayer';
import type { DefaultLayerData, Layer } from '@/services/apis/layer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { useI18n } from 'vue-i18n';
import { baseUrl } from '@/services/client';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useConfigStore } from '@/stores/config';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Layer;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

interface FormState {
  description: string;
  layerUrl: string;
  name: string;
  subDomains?: string;
  fileList: any;
}

const formRef = ref();
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const { t } = useI18n();
const configStore = useConfigStore();

const isUpdate = computed(() => !!props?.selectedItem);
const title = computed(() =>
  props?.selectedItem ? 'Cập nhật bản đồ nền mặc định' : 'Thêm mới bản đồ nền mặc định',
);
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

watch(
  () => props.open,
  () => {
    formState.name = props?.selectedItem?.name || '';
    formState.description = props?.selectedItem?.description || '';
    formState.layerUrl = props?.selectedItem?.layerURL || '';
    formState.subDomains =
      props?.selectedItem?.layerParams.find((item) => item.key === 'subdomains')?.value || '';
    formState.fileList = props.selectedItem?.previewImageURL
      ? [
          {
            uid: '-1',
            name: props.selectedItem?.name,
            status: 'done',
            url: props.selectedItem?.previewImageURL,
            response: {
              data: props.selectedItem?.previewImageURL,
            },
          },
        ]
      : [];
  },
);

const formState: UnwrapRef<FormState> = reactive({
  description: '',
  layerUrl: '',
  name: '',
  fileList: [],
});

const { mutate: create, isPending: isCreating } = useCreateDefaultLayer();
const { mutate: update, isPending: isUpdating } = useUpdateDefaultLayer();

const { invalidateDefaultLayerQueries } = useMutationLayerSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const beforeUpload = (file: { type: string; size: number }) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Vui lòng chọn ảnh kích thước bé hơn 5MB!');
  }
  return isJpgOrPng && isLt5M;
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const onSubmit = () => {
  formRef.value.validate().then(() => {
    const data: DefaultLayerData = {
      previewImagePath: formState.fileList && formState.fileList[0].response?.data,
      ...formState,
    };

    if (isUpdate.value && props?.selectedItem?.id) {
      update(
        {
          data,
          id: props?.selectedItem?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            invalidateDefaultLayerQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    create(data, {
      onError,
      onSuccess: (data) => {
        invalidateDefaultLayerQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
