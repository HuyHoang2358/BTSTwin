<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        :label="t('admin.device.name')"
        :rules="[{ required: true, message: t('admin.device.form.inputName') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.device.form.placeholderName')"
        />
      </a-form-item>

      <a-form-item
        name="device_category_id"
        :label="t('admin.device.category')"
        :rules="[{ required: true, message: t('admin.device.form.inputCategory') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.device_category_id"
          :options="categoryOptions"
          :allow-clear="true"
          :placeholder="t('admin.device.form.placeholderCategory')"
        />
      </a-form-item>

      <a-form-item
        name="vendor_id"
        :label="t('admin.device.vendor')"
        :rules="[{ required: false, message: t('admin.device.form.inputVendor') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.vendor_id"
          :options="vendorOptions"
          :allow-clear="true"
          show-search
          :filter-option="filterOption"
          :placeholder="t('admin.device.form.placeholderVendor')"
        />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="length"
            :label="t('admin.device.length')"
            :rules="[{ required: false, message: t('admin.device.form.inputLength') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.length"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.device.form.placeholderLength')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="width"
            :label="t('admin.device.width')"
            :rules="[{ required: false, message: t('admin.device.form.inputWidth') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.width"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.device.form.placeholderWidth')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="depth"
            :label="t('admin.device.depth')"
            :rules="[{ required: false, message: t('admin.device.form.inputDepth') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.depth"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.device.form.placeholderDepth')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="weight"
            :label="t('admin.device.weight')"
            :rules="[{ required: false, message: t('admin.device.form.inputWeight') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.weight"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.device.form.placeholderWeight')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="diameter"
            :label="t('admin.device.diameter')"
            :rules="[{ required: false, message: t('admin.device.form.inputDiameter') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.diameter"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.device.form.placeholderDiameter')"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div>
        <div class="flex justify-between items-center">
          <div>Thông số kỹ thuật</div>
          <div class="flex justify-self-end">
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="addParam"
            />
          </div>
        </div>
        <a-space
          v-for="(param, index) in formState.params"
          :key="param.id"
          style="display: flex; margin-bottom: 8px"
          align="baseline"
        >
          <a-form-item
            :name="['params', index, 'key']"
            :rules="{
              required: true,
              message: 'Nhập tên thông số',
            }"
            class="my-0.5"
          >
            <a-input
              v-model:value="param.key"
              placeholder="Nhập tên thông số"
            />
          </a-form-item>
          <a-form-item
            :name="['params', index, 'value']"
            :rules="{
              required: true,
              message: 'Nhập giá trị thông số',
            }"
            class="my-0.5"
          >
            <a-input
              v-model:value="param.value"
              placeholder="Nhập giá trị thông số"
            />
          </a-form-item>

          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconTrash)"
            @click="removeParam(param)"
          />
        </a-space>
      </div>

      <a-form-item
        name="description"
        :label="$t('admin.device.description')"
        :rules="[{ required: false, message: $t('admin.device.form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('admin.device.form.placeholderDescription')"
          :allow-clear="true"
          :rows="3"
        />
      </a-form-item>
      <a-form-item
        label="Ảnh thiết bị"
        name="images"
        :rules="[{ required: false, message: 'Vui lòng tải lên ảnh xem trước' }]"
      >
        <a-upload
          v-model:file-list="uploadFiles"
          name="file"
          list-type="picture-card"
          :action="`${baseUrl}upload/image`"
          :headers="{
            Authorization: configStore.accessToken
              ? `Bearer ${configStore.accessToken}`
              : undefined,
          }"
          :before-upload="beforeUpload"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="uploadFiles && uploadFiles.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">Tải ảnh</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">Hủy bỏ</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating || isUpdating"
          @click="handleFinish"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { useConfigStore } from '@/stores/config';
import { ref, reactive, computed, h } from 'vue';
import { type FormInstance, message, type UploadChangeParam } from 'ant-design-vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { OptionType } from '@/utils/types';
import type { Device, DeviceData, DeviceParam } from '@/services/apis/device';
import { compareString } from '@/utils/helpers';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  useCreateDevice,
  useMutationDeviceSuccess,
  useUpdateDevice,
} from '@/services/hooks/useDevice';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentDevice?: Device;
  vendorOptions: OptionType[];
  categoryOptions: OptionType[];
}>();

// TODO: handle param
const removeParam = (item: DeviceParam) => {
  const index = formState.params?.indexOf(item);
  if (index && index >= 0) formState.params?.splice(index, 1);
};

const addParam = () => {
  formState.params?.push({ key: '', value: '', id: Date.now() });
};

// TODO handle Form
type DeviceForm = {
  id?: string;
} & Partial<DeviceData>;

const formRef = ref<FormInstance>();

const formState = reactive<DeviceForm>({});

const isUpdate = computed(() => !!props?.currentDevice);
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới thiết bị'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { mutate: createDevice, isPending: isCreating } = useCreateDevice();
const { mutate: updateDevice, isPending: isUpdating } = useUpdateDevice();
const { invalidateQueries } = useMutationDeviceSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    console.log('currentDevice', props.currentDevice);
    formState.name = props.currentDevice?.name || undefined;
    formState.images = props.currentDevice?.images || undefined;
    formState.model_url = props.currentDevice?.model_url || undefined;
    formState.length = props.currentDevice?.length || undefined;
    formState.width = props.currentDevice?.width || undefined;
    formState.depth = props.currentDevice?.depth || undefined;
    formState.weight = props.currentDevice?.weight || undefined;
    formState.diameter = props.currentDevice?.diameter || undefined;
    formState.description = props.currentDevice?.description || undefined;
    formState.device_category_id = props.currentDevice?.category.id.toString() || undefined;
    formState.vendor_id = props.currentDevice?.vendor.id.toString() || undefined;
    formState.params =
      props.currentDevice?.params?.map((i) => ({
        key: i.key,
        value: i.value,
        id: i?.id || Date.now(),
      })) || [];

    uploadFiles.value = props.currentDevice?.images
      ? [
          {
            uid: '-1',
            name: props.currentDevice?.name,
            status: 'done',
            url: storageUrl + props.currentDevice?.images,
            response: {
              data: storageUrl + props.currentDevice?.images,
            },
          },
        ]
      : [];
  },
);

// TODO: filter option in select
const filterOption = (input: string, option: any) => {
  return compareString(option.label, input);
};

// TODO: handle upload image
const baseUrl = import.meta.env.VITE_BASE_URL;
const storageUrl = import.meta.env.VITE_STORAGE_DOMAIN;
const configStore = useConfigStore();

// validate image
const beforeUpload = (file: { type: string; size: number }) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('Chỉ được upload file hình ảnh!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Vui lòng chọn ảnh kích thước bé hơn 5MB!');
  }
  return isJpgOrPng && isLt5M;
};

// handle preview image
const uploadFiles = ref<any>();
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
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
const handleChange = ({ file, fileList }: UploadChangeParam) => {
  if (file.status !== 'uploading') {
    const images = fileList.map((file) => file.response?.data?.url);
    formState.images = images.length > 0 ? images[0] : '';
  }
};

// TODO: submit form
const handleFinish = () => {
  console.log(formState);
  formRef.value?.validate().then(() => {
    const data: DeviceData = {
      name: formState.name ?? null,
      images: formState.images ?? '',
      model_url: formState.model_url ?? '',
      length: formState.length ?? null,
      width: formState.width ?? null,
      depth: formState.depth ?? null,
      weight: formState.weight ?? null,
      diameter: formState.diameter ?? null,
      description: formState.description ?? '',
      device_category_id: formState.device_category_id ?? null,
      vendor_id: formState.vendor_id ?? null,
      params:
        formState?.params?.map((i) => ({
          key: i.key,
          value: i.value,
          id: i?.id,
        })) || [],
    };
    if (isUpdate.value && props?.currentDevice?.id) {
      updateDevice(
        {
          ...data,
          id: props?.currentDevice?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    createDevice(data, {
      onError,
      onSuccess: (data) => {
        invalidateQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
