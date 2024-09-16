<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
    :get-container="getContainer"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        :label="$t('admin.field.name')"
        :rules="[{ required: true, message: $t('admin.field.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          allow-clear
          :placeholder="$t('admin.field.form.placeholderName')"
          data-test="name"
        />
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
      <a-form-item
        label="Hoạt động"
        name="isActive"
      >
        <a-switch v-model:checked="formState.isActive" />
      </a-form-item>
      <a-form-item
        :label="$t('admin.field.previewImage')"
        name="fileList"
        :rules="[{ required: true, message: 'Vui lòng tải lên ảnh lĩnh vực' }]"
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
    </a-form>
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
          :loading="isCreating || isUpdating"
          @click="handleFinish"
          id="submit-field"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
  <a-modal
    :open="previewVisible"
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
  >
    <img
      alt="example"
      style="width: 100%"
      :src="previewImage"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { type FormInstance, message } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { FieldData, Field } from '@/services/apis/field';
import { useCreateField, useMutationFieldSuccess, useUpdateField } from '@/services/hooks/useField';
import { useI18n } from 'vue-i18n';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useConfigStore } from '@/stores/config';
import { baseUrl } from '@/services/client';

const props = defineProps<
  {
    close: () => void;
    currentField?: Field;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const { t } = useI18n();

type FormState = {
  description: string;
  name: string;
  isActive: boolean;
  fileList: any;
};

const isUpdate = computed(() => Boolean(props.currentField));
const title = computed(() =>
  isUpdate.value ? t('admin.field.updateField') : t('admin.field.createField'),
);
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: '',
  description: '',
  fileList: [],
  isActive: true,
});

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const { mutate: createField, isPending: isCreating } = useCreateField();
const { mutate: updateField, isPending: isUpdating } = useUpdateField();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationFieldSuccess();
const configStore = useConfigStore();

watch(
  () => props.open,
  () => {
    formRef.value?.resetFields();
    formState.name = props.currentField?.name || '';
    formState.description = props.currentField?.description || '';
    formState.isActive = !props.currentField?.locked;
    formState.fileList = props.currentField?.previewImage
      ? [
          {
            uid: '-1',
            name: props.currentField?.name,
            status: 'done',
            url: props.currentField?.previewImage,
            response: {
              data: props.currentField?.previewImage,
            },
          },
        ]
      : [];
  },
);

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

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
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

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const body: FieldData = {
      description: formState.description,
      name: formState.name,
      previewImage: formState.fileList && formState.fileList[0].response?.data,
      locked: !formState.isActive,
    };
    if (isUpdate.value) {
      if (!props.currentField?.id) {
        return;
      }
      updateField(
        {
          ...body,
          id: props.currentField?.id,
        },
        {
          onSuccess(data) {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
          onError,
        },
      );
    } else {
      createField(body, {
        onSuccess(data) {
          invalidateQueries();
          props.close();
          handleSuccess(data);
        },
        onError,
      });
    }
  });
};
</script>
