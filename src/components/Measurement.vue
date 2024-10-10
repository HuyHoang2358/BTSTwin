<template>
  <div
    class="bg-[#303030] w-[260px] overflow-auto flex flex-col"
    v-if="modelStore.activeTool === ACTIVE_TOOL.MEASUREMENT"
  >
    <HeaderMenu title="Đo lường">
      <a-tooltip
        title="Lưu lại"
        placement="top"
      >
        <a-button
          @click="onSave"
          class="p-0 m-0 border-none bg-transparent flex items-center h-[20px]"
        >
          <SaveOutlined class="text-[20px]" />
        </a-button>
      </a-tooltip>
    </HeaderMenu>
    <div class="px-3 mb-1">
      <a-input
        :placeholder="$t('search')"
        v-model:value="searchValue"
        allow-clear
        class="bg-[#424242] text-white focus:outline-0"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
    </div>
    <div class="flex flex-row justify-between items-start px-3 mt-2">
      <div>
        <span class="text-white text-sm">Danh sách đo lường</span>
        <br />
        <span class="text-[#8C8C8C] text-xs">({{ modelStore.measurements.length }} items)</span>
      </div>
      <div
        class="flex"
        v-if="modelStore.measurements.length > 0"
      >
        <a-tooltip
          title="Ẩn/Hiện tất cả"
          placement="top"
        >
          <a-button
            @click="onToggleAllMeasurement"
            class="p-0 m-0 border-none bg-transparent flex items-center"
          >
            <IconVisible v-if="modelStore.visibleAllMeasurements" />
            <IconInvisible v-else />
          </a-button>
        </a-tooltip>
        <a-tooltip
          title="Xóa tất cả"
          placement="top"
        >
          <a-button
            @click="onRemoveAllMeasurement"
            class="p-0 m-0 border-none bg-transparent ml-2 flex items-center"
          >
            <IconRemove />
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <div
      class="flex flex-1 items-center"
      v-if="modelStore.measurements.length === 0"
    >
      <CustomAEmpty empty-text="Chưa có dữ liệu, chọn công cụ để thêm" />
    </div>
    <div
      v-for="(item, index) in modelStore.measurements"
      :key="index"
      :class="[
        'flex flex-row items-center justify-between cursor-pointer pr-3 mt-2',
        item.id === modelStore.selectedMeasurement?.id && 'bg-[#38536d]',
      ]"
    >
      <div
        class="flex flex-row flex-1 items-center"
        @click="onMoveToMeasurement(item)"
      >
        <img
          :src="item.icon"
          class="w-6 h-6 ml-3"
          alt="tool"
        />
        <a-typography-text class="text-white text-sm ml-3">
          {{ item.name }}
        </a-typography-text>
      </div>
      <div class="flex">
        <a-button
          @click="onToggleMeasurement(item)"
          class="p-0 m-0 border-none bg-transparent flex items-center"
        >
          <IconVisible v-if="item.visible" />
          <IconInvisible v-else />
        </a-button>
        <a-button
          @click="onRemoveMeasurement(item)"
          class="p-0 m-0 border-none bg-transparent ml-2 flex items-center"
        >
          <IconRemove />
        </a-button>
      </div>
    </div>
    <!--    <a-button @click="onTestExport">Export</a-button>-->
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import * as THREE from 'three';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { ref, toRaw } from 'vue';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { ACTIVE_TOOL, LOCAL_STORAGE_KEY } from '@/utils/enums';
import CustomAEmpty from '@/components/CustomAEmpty.vue';
import IconRemove from '@/components/icon/IconRemove.vue';
import IconInvisible from '@/components/icons/IconInvisible.vue';
import IconVisible from '@/components/icons/IconVisible.vue';
import { SaveOutlined } from '@ant-design/icons-vue';
import { useSaveMeasurements } from '@/services/hooks/useStation';
import { useRoute } from 'vue-router';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const modelStore = useModelStore();

const onMoveToMeasurement = (object: any) => {
  modelStore.selectedInventory = undefined;
  modelStore.selectedPole = undefined;
  modelStore.isSelectedBasePlate = false;
  modelStore.selectedMeasurement = object;
  let points = object.points.map((p: any) => p.position);
  let box = new THREE.Box3().setFromPoints(points);
  if (box.getSize(new THREE.Vector3()).length() > 0) {
    let node = new THREE.Object3D();
    node.boundingBox = box;
    window.potreeViewer.zoomTo(node, 2, 500);
  }
};

const onRemoveMeasurement = (object: any) => {
  window.potreeViewer.scene.removeMeasurement(toRaw(object));
  if (modelStore.selectedMeasurement?.id === object.id) {
    modelStore.selectedMeasurement = undefined;
  }
  modelStore.measurements = modelStore.measurements.filter((item) => item.id !== object.id);
};

const onToggleMeasurement = (object: any) => {
  object.visible = !object.visible;
};

const onToggleAllMeasurement = () => {
  const nextState = !modelStore.visibleAllMeasurements;
  modelStore.visibleAllMeasurements = nextState;
  modelStore.measurements.forEach((object: any) => {
    object.visible = nextState;
  });
};

const onRemoveAllMeasurement = () => {
  modelStore.selectedMeasurement = undefined;
  modelStore.measurements.forEach((object: any) => {
    window.potreeViewer.scene.removeMeasurement(toRaw(object));
  });
  modelStore.measurements = [];
};

const searchValue = ref<string>();

const { mutate } = useSaveMeasurements();
const route = useRoute();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSave = () => {
  const data = Potree.saveProject(window.potreeViewer) as { measurements: string };
  mutate(
    {
      scanId: Number(route.query.id),
      measurements: JSON.stringify(data.measurements),
    },
    {
      onSuccess: (data) => {
        handleSuccess(data);
      },
      onError,
    },
  );
};
</script>
<style>
.ant-input {
  background-color: #424242 !important;
}
</style>
