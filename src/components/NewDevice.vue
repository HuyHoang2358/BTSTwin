<template>
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
  <a-descriptions
    layout="horizontal"
    :column="1"
    class="mt-4"
  >
    <a-descriptions-item
      label="Loại thiết bị"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ modelStore.selectedInventory?.model }}
    </a-descriptions-item>
  </a-descriptions>
  <a-descriptions
    layout="vertical"
    :column="3"
    :colon="false"
  >
    <a-descriptions-item
      label="x"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.x }}
    </a-descriptions-item>
    <a-descriptions-item
      label="y"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.y }}
    </a-descriptions-item>
    <a-descriptions-item
      label="z"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.z }}
    </a-descriptions-item>
    <a-descriptions-item
      label="α"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elAlpha }}
    </a-descriptions-item>
    <a-descriptions-item
      label="β"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elBetta }}
    </a-descriptions-item>
    <a-descriptions-item
      label="γ"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elGamma }}
    </a-descriptions-item>
    <a-descriptions-item
      label="Chiều dài"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elLength }} mm
    </a-descriptions-item>
    <a-descriptions-item
      label="Chiều rộng"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elWidth }} mm
    </a-descriptions-item>
    <a-descriptions-item
      label="Chiều cao"
      :labelStyle="descriptionStyle"
      :contentStyle="descriptionStyle"
    >
      {{ properties.elHeight }} mm
    </a-descriptions-item>
  </a-descriptions>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRaw } from 'vue';
import { useModelStore } from '@/stores/model';

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));

const properties = ref<Record<string, number>>({});

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
    dimensions = dimensions.map((v: number) =>
      Potree.Utils.addCommas((v * modelStore.gpsRatio).toFixed(2)),
    );

    const point = findVolume.position;

    const x = Potree.Utils.addCommas(point.x.toFixed(3));
    const y = Potree.Utils.addCommas(point.y.toFixed(3));
    const z = Potree.Utils.addCommas(point.z.toFixed(3));

    properties.value = {
      ...properties.value,
      elLength: dimensions[0] * 1000,
      elWidth: dimensions[1] * 1000,
      elHeight: dimensions[2] * 1000,
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
      devices: category.devices.filter(
        (device) => device.pivot.id !== modelStore.selectedInventory.pivot.id,
      ),
    })),
  }));
  window.potreeViewer.scene.removeVolume(toRaw(modelStore.selectedInventory?.newDevice));
  window.potreeViewer.inputHandler.deselectAll();
  modelStore.selectedInventory = undefined;
};
</script>
