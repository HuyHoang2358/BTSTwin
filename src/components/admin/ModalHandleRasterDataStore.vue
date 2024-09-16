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
        :label="$t('admin.raster-store.name')"
        :rules="[{ required: true, message: $t('admin.raster-store.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          allow-clear
          :placeholder="$t('admin.raster-store.form.inputName')"
          data-test="name"
        />
      </a-form-item>

      <a-form-item
        name="geoStoreType"
        :label="$t('admin.raster-store.geo-store-type')"
      >
        <a-select
          class="w-full"
          v-model:value="formState.geoStoreType"
          :options="geoStoreTypeOptions"
          placeholder="Chọn bài toán"
        />
      </a-form-item>

      <a-form-item
        name="storageFolder"
        :label="$t('admin.raster-store.storage-folder')"
        :rules="[{ required: true, message: $t('admin.raster-store.form.inputStorageFolder') }]"
      >
        <a-input
          v-model:value="formState.storageFolder"
          allow-clear
          :placeholder="$t('admin.raster-store.form.inputName')"
          data-test="name"
        />
      </a-form-item>

      <a-form-item
        name="geoDataPath"
        :label="$t('admin.raster-store.geo-data-path')"
        :rules="[{ required: true, message: $t('admin.raster-store.form.inputGeoDataPath') }]"
      >
        <a-input
          v-model:value="formState.geoDataPath"
          allow-clear
          :placeholder="$t('admin.raster-store.form.inputGeoDataPath')"
          data-test="name"
        />
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
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { type FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { DrawerProps } from 'ant-design-vue/es/drawer';

import { type RasterDataStore, type RasterDataStoreData } from '@/services/apis/rasterDataStore';
import {
  useCreateRasterDataStore,
  useMutationRasterDataStoreSuccess,
  useUpdateRasterDataStore
} from '@/services/hooks/useRasterDataStore';

const props = defineProps<
  {
    close: () => void;
    currentRasterDataStore?: RasterDataStore;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const { t } = useI18n();

const isUpdate = computed(() => Boolean(props.currentRasterDataStore));
const title = computed(() =>
  isUpdate.value ? t('admin.raster-store.form.updateLabel') : t('admin.raster-store.form.createLabel'),
);

const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

const formRef = ref<FormInstance>();
const formState = reactive<RasterDataStoreData>({
  name: "",
  storageFolder: "",
  geoStoreType: "GeoTIFF",
  geoDataPath: "",
});

const geoStoreTypeOptions = [
  {
    "value": "GeoTIFF",
    "label": "GeoTIFF"
  },  {
    "value": "ImagePyramid",
    "label": "ImagePyramid"
  },

]
// TODO:watch props
watch(
  () => props.open,
  () => {
    formState.name = props.currentRasterDataStore?.name || "";
    formState.storageFolder = props.currentRasterDataStore?.storageFolder || "";
    formState.geoStoreType = props.currentRasterDataStore?.geoStoreType || "GeoTIFF";
    formState.geoDataPath = props.currentRasterDataStore?.geoDataPath || "";
  },
);

// TODO: handle Finish
const { mutate: createRasterDataStore, isPending: isCreating } = useCreateRasterDataStore();
const { mutate: updateRasterDataStore, isPending: isUpdating } = useUpdateRasterDataStore();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationRasterDataStoreSuccess();

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const body: RasterDataStoreData = {
      name: formState.name,
      storageFolder: formState.storageFolder,
      geoStoreType: formState.geoStoreType,
      geoDataPath: formState.geoDataPath,
    };
    if (isUpdate.value) {
      if (!props.currentRasterDataStore?.id) {
        return;
      }
      updateRasterDataStore(
        {
          ...body,
          id: props.currentRasterDataStore?.id,
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
      createRasterDataStore(body, {
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
