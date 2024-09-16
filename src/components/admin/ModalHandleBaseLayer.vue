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
        name="takePhotoDate"
        :label="'Ngày chụp ảnh'"
      >
        <a-date-picker
          class="w-full"
          v-model:value="formState.takePhotoDate"
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
        name="rasterDataStoreId"
        label="Đường dẫn file trên GeoServer"
        v-if="!isUpdate"
      >
        <a-select
          v-model:value="formState.rasterDataStoreId"
          :options="
            dataTiffPaths?.data.map((item) => ({
              label: item.name,
              value: item.id?.toString(),
            })) || []
          "
          :allow-clear="true"
          placeholder="Chọn đường dẫn file"
          :loading="isLoadingTiffPaths"
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
          :loading="isCreating || isUpdating || isProcessTiffs"
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
import { computed, reactive, ref, watch } from 'vue';
import {
  useCreateBaseLayer,
  useMutationLayerSuccess,
  useProcessTiffs,
  useUpdateBaseLayer,
} from '@/services/hooks/useLayer';
import type { BaseLayerData, Layer } from '@/services/apis/layer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { useI18n } from 'vue-i18n';
import { useUnusedRasterDataStore } from '@/services/hooks/useRasterDataStore';
import dayjs, { type Dayjs } from 'dayjs';
import { bodyDateFormat, responseDateFormat } from '@/utils/constants';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: Layer;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const formRef = ref();

const { t } = useI18n();

const isUpdate = computed(() => !!props?.selectedItem);
const title = computed(() => (props?.selectedItem ? 'Cập nhật bản đồ nền' : 'Thêm mới bản đồ nền'));
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

watch(
  () => props.open,
  () => {
    formState.name = props?.selectedItem?.name;
    formState.source = props?.selectedItem?.source;
    formState.description = props?.selectedItem?.description;
    formState.takePhotoDate =  props?.selectedItem?.takePhotoDate  ?
      dayjs(props?.selectedItem?.takePhotoDate, responseDateFormat)
      : dayjs(new Date());
  },
);
export type FormStateData = {
  description: string;
  rasterDataStoreId: string;
  name: string;
  source: string;
  takePhotoDate: Dayjs;
};

const formState: Partial<FormStateData> = reactive({});

const { data: dataTiffPaths, isLoading: isLoadingTiffPaths } = useUnusedRasterDataStore();
const { mutate: create, isPending: isCreating } = useCreateBaseLayer();
const { mutate: update, isPending: isUpdating } = useUpdateBaseLayer();
const { mutate: processTiffs, isPending: isProcessTiffs } = useProcessTiffs();

const { invalidateSpecLayerQueries } = useMutationLayerSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    const data = {
      description: formState.description,
      rasterDataStoreId: formState.rasterDataStoreId,
      name: formState.name,
      source: formState.source,
      takePhotoDate: formState?.takePhotoDate?.format(bodyDateFormat) || new Date(bodyDateFormat)
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
            invalidateSpecLayerQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    create(data as BaseLayerData, {
      onError,
      onSuccess: (data) => {
        processTiffs(data?.data?.id);
        invalidateSpecLayerQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
