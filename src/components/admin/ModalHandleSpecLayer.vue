<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="655"
    :get-container="getContainer"
    :mask-closable="false"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
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
            :label="$t('admin.spec.dataType')"
            name="dataCategoryId"
            :rules="[{ required: true, message: $t('admin.spec.form.selectDataType') }]"
          >
            <a-tree-select
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="dataTypeOptions"
              tree-node-filter-prop="label"
              v-model:value="formState.dataCategoryId"
              :placeholder="$t('admin.spec.form.placeHolderDataType')"
              :options="dataTypeOptions"
              allow-clear
              :loading="isLoadingDataTypes"
            />
          </a-form-item>
          <a-form-item
            :label="$t('admin.spec.sharing')"
            name="sharing"
          >
            <a-select
              v-model:value="formState.sharing"
              :options="shareOptions"
              :placeholder="$t('admin.spec.form.placeHolderDataType')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="$t('admin.spec.source')"
            name="source"
            :rules="[{ required: true, message: $t('admin.spec.form.placeHolderSource') }]"
          >
            <a-input
              v-model:value="formState.source"
              :allow-clear="true"
              :placeholder="$t('admin.spec.form.placeHolderSource')"
            />
          </a-form-item>
          <a-form-item
            :label="$t('admin.spec.form.expire')"
            name="expire"
            :rules="[{ required: true, message: $t('admin.spec.form.selectExpire') }]"
          >
            <a-range-picker
              v-model:value="formState.expire"
              :placeholder="[$t('startDate'), $t('endDate')]"
              :format="displayDateFormat"
            >
              <template #suffixIcon>
                <IconDatePicker />
              </template>
            </a-range-picker>
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
        </a-col>
      </a-row>
      <a-form-item
        name="files"
        label="File lớp bản đồ"
        :rules="[
          {
            type: 'array',
            required: !isUpdate,
            message: 'Vui lòng tải lên file.',
            trigger: 'change',
            min: isUpdate? 0 : 1,
          },
        ]"
      >
        <a-upload-dragger
          v-model:fileList="formState.files"
          name="upload"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @change="handleChange"
          :multiple="true"
        >
          <template #removeIcon>
            <IconTrash class="text-main" />
          </template>
          <div class="flex flex-row items-center justify-center">
            <IconUploadForm />
            <a-typography-text class="text-sm font-normal ml-2">Tải file</a-typography-text>
          </div>
          <a-typography-text class="text-[#BEBEBE] font-normal text-xs">
            File SHP
            <span class="text-main">*</span>
            , SHX
            <span class="text-main">*</span>
            , DBF
            <span class="text-main">*</span>
            , PRJ
            <span class="text-main">*</span>
            , XML
          </a-typography-text>
        </a-upload-dragger>
      </a-form-item>
      <div v-if="layerComponentsFiles.length > 0">
          <p v-for="(item, index) in layerComponentsFiles" :key="index">{{item.name}}</p>
      </div>
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
          @click="onSubmit"
          id="submit-field"
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
  bodyDateFormat,
  dataTypeVectorLayer,
  displayDateFormat,
  responseDateFormat,
  shareOptions,
} from '@/utils/constants';
import IconDatePicker from '@/components/icons/IconDatePicker.vue';
import IconUploadForm from '@/components/icons/IconUploadForm.vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import IconTrash from '@/components/icons/home/IconTrashNormal.vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import dayjs, { type Dayjs } from 'dayjs';
import {
  useCreateSpecLayer,
  useMutationLayerSuccess,
  useUpdateSpecLayer,
} from '@/services/hooks/useLayer';
import { FILE_TYPE } from '@/utils/enums';
import type { Layer } from '@/services/apis/layer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { useI18n } from 'vue-i18n';
import { useDataTypesTree } from '@/services/hooks/useDataType';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Layer;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

interface LayerComponentFiles {
  filePath: string;
  fileURL: string;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
interface FormState {
  name?: string;
  dataCategoryId?: string;
  description?: string;
  sharing?: string;
  source?: string;
  expire: Dayjs[];
  files?: any[];
}

const formRef = ref();

const { t } = useI18n();
const { data: dataTypesData, isLoading: isLoadingDataTypes } = useDataTypesTree({
  slug: ref(dataTypeVectorLayer),
});

const layerComponentsFiles = ref<LayerComponentFiles[]>([]);

const dataTypeOptions = computed(() => dataTypesData.value?.data || []);

const isUpdate = computed(() => !!props?.selectedItem);
const title = computed(() => (props?.selectedItem ? 'Cập nhật lớp bản đồ' : 'Thêm mới lớp bản đồ'));
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

watch(
  () => props.open,
  () => {
    formState.dataCategoryId = props?.selectedItem?.dataCategoryResponse.id?.toString();
    formState.name = props?.selectedItem?.name;
    formState.sharing = props?.selectedItem?.sharing || 'PRIVATE';
    formState.source = props?.selectedItem?.source;
    formState.description = props?.selectedItem?.description;
    formState.expire =
      props?.selectedItem?.validFrom && props?.selectedItem?.validTo
        ? [
            dayjs(props?.selectedItem?.validFrom, responseDateFormat),
            dayjs(props?.selectedItem?.validTo, responseDateFormat),
          ]
        : [];
    formState.files = [];
    layerComponentsFiles.value = props?.selectedItem?.layerComponentFiles || []
  },
);

const formState: UnwrapRef<FormState> = reactive({
  sharing: 'PRIVATE',
  expire: [],
});

const checkValid = (fileType = '') =>
  fileType === FILE_TYPE.SHP ||
  fileType === FILE_TYPE.SHX ||
  fileType === FILE_TYPE.DBF ||
  fileType === FILE_TYPE.PRJ ||
  fileType === FILE_TYPE.XML;

const getType = (file: string) => file.slice(-4);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file) {
    return;
  }
  const fileType = getType(file.name);


  if (!checkValid(fileType)) {
    message.error('Vui lòng tải lên File SHP, SHX, DBF, PRJ!');
    return false;
  }

  return true;
};

const customRequest = () => {};

const handleChange = (info: UploadChangeParam<any>) => {
  const uniqueTypes: Record<string, UploadFile> = {};
  info.fileList
    ?.filter((item) => checkValid(getType(item.name)))
    ?.map((item) => {
      return {
        ...item,
        status: 'done',
        percent: 100,
      };
    })
    .filter(function (item) {
      uniqueTypes[getType(item.name)] = item;
      return true;
    });
  formState.files = Object.values(uniqueTypes);
  layerComponentsFiles.value = [];
};

const { mutate: create, isPending: isCreating } = useCreateSpecLayer();
const { mutate: update, isPending: isUpdating } = useUpdateSpecLayer();

const { invalidateSpecLayerQueries } = useMutationLayerSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSubmit = () => {
  console.log("a1")
  formRef.value.validate().then(() => {
    console.log("a")
    const formData = new FormData();
    const dbfFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.DBF,
    )?.originFileObj;
    const prjFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.PRJ,
    )?.originFileObj;
    const shpFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.SHP,
    )?.originFileObj;
    const shxFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.SHX,
    )?.originFileObj;
    const xmlFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.XML,
    )?.originFileObj;

    dbfFile && formData.append('dbfFile', dbfFile);
    prjFile && formData.append('prjFile', prjFile);
    shpFile && formData.append('shpFile', shpFile);
    shxFile && formData.append('shxFile', shxFile);
    xmlFile && formData.append('xmlFile', xmlFile);
    formState.dataCategoryId && formData.append('dataCategoryId', formState.dataCategoryId);
    formState.description && formData.append('description', formState.description);
    formState.name && formData.append('name', formState.name);
    formState.sharing && formData.append('sharing', formState.sharing);
    formState.source && formData.append('source', formState.source);
    formState.expire && formData.append('validFrom', formState.expire[0].format(bodyDateFormat));
    formState.expire && formData.append('validTo', formState.expire[1].format(bodyDateFormat));
    console.log("y")
    if (isUpdate.value && props?.selectedItem?.id) {
      update(
        {
          formData,
          id: props?.selectedItem?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            invalidateSpecLayerQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    create(formData, {
      onError,
      onSuccess: (data) => {
        invalidateSpecLayerQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
