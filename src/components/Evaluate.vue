<template>
  <div
    v-if="modelStore.poles.length > 0 && modelStore.activeTool === 'evaluate'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <a-typography-title
      :level="3"
      style="font-size: 16px; color: white"
      class="ml-3 mt-4"
    >
      Đánh giá thiết kế
    </a-typography-title>
    <div>
      <a-segmented
        v-model:value="splat"
        :options="splatData"
        size="middle"
        class="my-2 mx-3"
        block
      />
      <div
        class="flex justify-between items-center px-3 py-3"
        v-if="splat === splatData[1]"
      >
        <a-button
          class="w-full flex flex-row items-center justify-center"
          @click="onAddBox"
          type="primary"
        >
          Thêm thiết bị cho cột
        </a-button>
      </div>
      <div
        class="mx-3 my-2"
        v-else
      >
        <a-upload-dragger
          v-model:fileList="files"
          name="upload"
          :before-upload="beforeUpload"
          @change="handleChange"
          :max-count="1"
          :custom-request="() => {}"
        >
          <template #removeIcon>
            <IconTrash class="text-[#BBBBBB]" />
          </template>
          <div class="flex flex-row items-center justify-center py-6">
            <IconUploadForm />
            <a-typography-text class="text-white text-sm font-normal ml-2">
              Tải hoặc kéo thả file
              <br />
              thiết kế của cột
            </a-typography-text>
          </div>
        </a-upload-dragger>
      </div>
    </div>
    <div class="flex flex-col overflow-auto">
      <a-tabs
        v-model:activeKey="modelStore.activePole"
        @change="onChangeTab"
      >
        <a-tab-pane
          v-for="pole in modelStore.poles"
          :key="pole.pivot.id"
          :tab="pole.name"
        >
          <PoleItem :pole="pole" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import PoleItem from '@/components/PoleItem.vue';
import { reactive, ref, watch } from 'vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconUploadForm from '@/components/icons/IconUploadForm.vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

const modelStore = useModelStore();

const splatData = reactive(['Danh định', 'Thủ công']);
const splat = ref(splatData[0]);
const files = ref([]);

const onChangeTab = (value: number) => {
  modelStore.selectedPole = modelStore.poles.find((item) => item.pivot.id === value);
};

let isSetActivePole = false;

watch(
  () => modelStore.poles,
  () => {
    if (!isSetActivePole && modelStore.poles.length > 0) {
      isSetActivePole = true;
      modelStore.activePole = modelStore.poles[0].pivot.id;
    }
  },
);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file) {
    return;
  }

  // if (!checkValid(file.name)) {
  //   message.error(`Vui lòng tải lên ${activeIndexTab.value}!`);
  //   return false;
  // }
  return true;
};

const handleChange = (info: UploadChangeParam<any>) => {
  files.value = info.fileList.map((item) => {
    return {
      ...item,
      status: 'done',
      percent: 100,
    };
  });
};

const onAddBox = () => {
  modelStore.openModalAddInventory = true;
  modelStore.activeTool = undefined;
  modelStore.selectedImage = undefined;
  modelStore.selectedInventory = undefined;
  modelStore.selectedPole = undefined;
  modelStore.isSelectedBasePlate = false;
};
</script>
