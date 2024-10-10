<template>
  <div class="flex flex-row justify-between items-center">
    <a-typography class="text-[#F4F4F4] text-lg mb-2">
      {{ modelStore.selectedInventory?.device_info?.name }}
    </a-typography>
    <a-button
      class="m-0 p-0 w-8 h-8 border-none bg-[#212121] rounded-full flex items-center justify-center"
      @click="onRemoveDevice"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path
          fill="white"
          d="M3 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6H3v6Zm11-9h-3.5l-1-1h-3l-1 1H2v2h12V3Z"
        ></path>
      </svg>
    </a-button>
  </div>
  <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
    Thông tin chung
  </a-typography>
  <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
    <ItemDescription
      label="Danh mục"
      :value="modelStore.selectedInventory?.device_info?.category.name"
    />
    <ItemDescription
      label="Loại thiết bị"
      :value="modelStore.selectedInventory?.device_info?.name"
    />
    <ItemDescription
      label="Nhà cung cấp"
      :value="modelStore.selectedInventory?.device_info?.vendor?.name"
    />
  </div>

  <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
    Thông số kỹ thuật
  </a-typography>
  <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
    <ItemDescription
      label="Chiều rộng (mm)"
      :value="properties.elWidth"
    />
    <ItemDescription
      label="Chiều dài (mm)"
      :value="properties.elHeight"
    />
    <ItemDescription
      label="Chiều sâu (mm)"
      :value="properties.elLength"
    />
    <ItemDescription
      label="Trọng lượng (kg)"
      :value="modelStore.selectedInventory?.device_info?.weight"
    />
    <ItemDescription
      label="α"
      :value="properties.elAlpha"
    />
    <ItemDescription
      label="β"
      :value="properties.elBetta"
    />
    <ItemDescription
      label="γ"
      :value="properties.elGamma"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import { useModelStore } from '@/stores/model';
import ItemDescription from '@/components/ItemDescription.vue';

const properties = ref<Record<string, number | string>>({});

const modelStore = useModelStore();

const onUpdate = (e: any) => {
  const volumes = e.target.scene.volumes;
  const findVolume = volumes.find(
    (item: any) => item.uuid === modelStore.selectedInventory?.newDevice?.uuid,
  );

  if (findVolume) {
    let angles = findVolume.rotation.toVector3();
    angles = angles.toArray();
    angles = angles.map((v: number) => (180 * v) / Math.PI);
    angles = angles.map((a: number) => a.toFixed(1) + '\u00B0');

    let dimensions = findVolume.scale.toArray();
    dimensions = dimensions.map((v: number) => Potree.Utils.addCommas(v));

    const point = findVolume.position;

    const x = Potree.Utils.addCommas(point.x.toFixed(3));
    const y = Potree.Utils.addCommas(point.y.toFixed(3));
    const z = Potree.Utils.addCommas(point.z.toFixed(3));

    properties.value = {
      ...properties.value,
      elLength: (dimensions[0] * 1000 * modelStore.gpsRatio).toFixed(2),
      elWidth: (dimensions[1] * 1000 * modelStore.gpsRatio).toFixed(2),
      elHeight: (dimensions[2] * 1000 * modelStore.gpsRatio).toFixed(2),
      elAlpha: angles[0],
      elBetta: angles[1],
      elGamma: angles[2],
      x,
      y,
      z,
    };
  }
};

onMounted(() => {
  window.potreeViewer.addEventListener('update', onUpdate);
});

onUnmounted(() => {
  window.potreeViewer.removeEventListener('update', onUpdate);
});

const onRemoveDevice = () => {
  if (!modelStore.selectedInventory) {
    return;
  }

  modelStore.poles = modelStore.poles.map((item) => ({
    ...item,
    deviceCategories: item.deviceCategories.map((category) => ({
      ...category,
      devices: category.devices.filter((device) => device.id !== modelStore.selectedInventory?.id),
    })),
  }));
  window.potreeViewer.scene.removeVolume(toRaw(modelStore.selectedInventory?.newDevice));
  window.potreeViewer.inputHandler.deselectAll();
  modelStore.selectedInventory = undefined;
};
</script>
