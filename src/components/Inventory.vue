<template>
  <div
    v-if="modelStore.objectGroupArray.length > 0 && modelStore.activeTool === 'inventory'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">Thiết bị</a-typography-text>
      <a-button
        class="p-0 border-none"
        ghost
        @click="onAddBox"
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
            d="M14 9H9v5H7V9H2V7h5V2h2v5h5v2Z"
          ></path>
        </svg>
      </a-button>
    </div>
    <div class="px-3 mb-4">
      <a-input
        :placeholder="$t('search')"
        v-model:value="searchValue"
        allow-clear
        style="border: 1px solid #424242"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
    </div>
    <div
      class="flex flex-1 overflow-auto"
      v-if="modelStore.objectGroup"
    >
      <a-collapse
        v-model:activeKey="activeKey"
        :bordered="false"
        class="w-full"
        style="border-radius: unset"
      >
        <template #expandIcon="{ isActive }">
          <caret-right-outlined
            :rotate="isActive ? 90 : 0"
            style="color: white"
          />
        </template>
        <a-collapse-panel
          :header="`${category} (${modelStore.objectGroup[category].length} thiết bị)`"
          v-for="category in modelStore.objectGroupArray"
          :key="category"
        >
          <InventoryItem
            v-for="(item, index) in modelStore.objectGroup[category].filter(() =>
              compareString(category, searchValue),
            )"
            :key="index"
            :item="item"
            :category="category"
            :index="index"
          />
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="flex flex-col m-4">
      <a-button
        class="w-full"
        type="primary"
        @click="onCalculate"
        :loading="isPending"
      >
        Tính ứng suất
      </a-button>
      <a-descriptions
        layout="horizontal"
        :column="1"
        class="mt-4"
      >
        <a-descriptions-item
          label="Giá trị ứng suất"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ data?.data?.pole_stress || 0 }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Đánh giá"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{
            data?.data?.pole_stress
              ? data?.data?.pole_stress < 0.95
                ? 'Phù hợp'
                : 'Không phù hợp'
              : 'Chưa có giá trị'
          }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { computed, ref, watch } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { compareString } from '@/utils/helpers';
import InventoryItem from '@/components/InventoryItem.vue';
import { useBTSDetail, useCalculate } from '@/services/hooks/useBTS';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import type { Device } from '@/services/apis/bts';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';

const activeKey = ref<string[]>([]);
const searchValue = ref<string>('');

const modelStore = useModelStore();
const { mutate, isPending, data } = useCalculate();
const { onError } = useErrorHandler();
const route = useRoute();

const { data: dataBTS } = useBTSDetail(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

watch(
  () => modelStore.objectGroupArray,
  () => {
    activeKey.value = modelStore.objectGroupArray.map((item) => item) || [];
  },
);

const onAddBox = () => {
  modelStore.openModalAddInventory = true;
  modelStore.activeTool = undefined;
  modelStore.selectedImage = undefined;
  modelStore.selectedInventory = undefined;
};

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '14px' }));

const onCalculate = () => {
  console.log('modelStore.objectGroup', modelStore.objectGroup);
  if (!dataBTS.value?.data) return;

  const zPlane = dataBTS.value?.data.zplane;

  const inventories: Device[] = [];

  modelStore.objectGroupArray.forEach((category) => {
    if (modelStore.objectGroup && modelStore.objectGroup[category]) {
      modelStore.objectGroup[category].forEach((item) => {
        if (item.isNewDevice) {
          let dimensions = item.newDevice.scale.toArray();
          dimensions = dimensions.map((v: number) => Potree.Utils.addCommas(v.toFixed(2)));
          inventories.push({
            name: item.model as string,
            depth: Number(dimensions[0]),
            width: Number(dimensions[1]),
            height: Number(dimensions[2]),
            DC: item.newDevice ? Math.round(item.newDevice.position.z - zPlane) : 0,
          });
        } else {
          if (item.visible) {
            inventories.push({
              name: item.model as string,
              depth: Number(item.modelDepth) / 1000,
              width: Number(item.modelWidth) / 1000,
              height: Number(item.modelHeight) / 1000,
              DC: item.boxMesh ? Math.round(item.boxMesh.position.z - zPlane) : 0,
            });
          }
        }
      });
    }
  });

  mutate(
    {
      station_code: dataBTS.value?.data?.station,
      devices: inventories,
    },
    {
      onSuccess() {
        notification.success({
          message: 'Thành công',
          description: 'Tính toán giá trị ứng suất cột thành công',
          placement: 'top',
        });
      },
      onError(error) {
        onError(error);
      },
    },
  );
};
</script>
