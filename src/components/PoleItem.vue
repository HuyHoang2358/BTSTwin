<template>
  <div>
    <div class="flex flex-row justify-between items-center cursor-pointer">
      <a-typography-text
        :class="[
          'text-base px-3',
          pole.pivot.id === modelStore.selectedPole?.pivot.id ? 'text-main' : 'text-white',
        ]"
        @click="onShowInfoPole"
      >
        {{ pole.name }}
      </a-typography-text>
      <a-button
        type="ghost"
        @click="onToggleExpand"
      >
        <caret-right-outlined
          :rotate="pole.isExpanded ? 90 : 180"
          style="color: white"
        />
      </a-button>
    </div>
    <div
      class="px-3 my-2"
      v-if="pole.isExpanded"
    >
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
      class="flex flex-1 overflow-auto mt-2"
      v-if="pole.isExpanded"
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
          :header="`${deviceCategory.name} (${deviceCategory.devices.length} thiết bị)`"
          v-for="deviceCategory in pole.deviceCategories"
          :key="deviceCategory.name"
        >
          <InventoryItem
            v-for="(item, index) in deviceCategory.devices.filter(() =>
              compareString(deviceCategory.name, searchValue),
            )"
            :key="index"
            :item="item"
            :category="deviceCategory.name"
            :index="index"
          />
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div
      class="flex flex-col m-4"
      v-if="modelStore.activeTool === 'evaluate'"
    >
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
          {{ stressValue }} %
        </a-descriptions-item>
        <a-descriptions-item
          label="Đánh giá"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ stressValue ? (stressValue < 0.95 ? 'Phù hợp' : 'Không phù hợp') : 'Chưa có giá trị' }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <a-divider class="my-2" />
  </div>
</template>
<script setup lang="ts">
import { compareString } from '@/utils/helpers';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import InventoryItem from '@/components/InventoryItem.vue';
import { computed, onMounted, ref } from 'vue';
import type { Pole } from '@/services/apis/station';
import { useModelStore } from '@/stores/model';
import type { Device } from '@/services/apis/bts';
import { notification } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useBTSDetail } from '@/services/hooks/useStation';
import { useRoute } from 'vue-router';
import { useCalculate } from '@/services/hooks/useBTS';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';

const props = defineProps<{
  pole: Pole;
}>();

const searchValue = ref<string>('');

const modelStore = useModelStore();
const { onError } = useErrorHandler();
const route = useRoute();

const { mutate, isPending, data } = useCalculate();

const { data: dataBTS } = useBTSDetail(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

const stressValue = computed(() => data?.value?.data?.pole_stress || props.pole.stress_value || 0);

const activeKey = ref<string[]>([]);

onMounted(() => {
  activeKey.value = props.pole.deviceCategories.map((item) => item.name);
});

const onShowInfoPole = () => {
  modelStore.selectedPole = props.pole;
};

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '14px' }));

const onCalculate = () => {
  if (!dataBTS.value?.data) return;

  const zPlane = dataBTS.value.data.poles[0].z_plane;

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
      station_code: dataBTS.value?.data?.name,
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

const onToggleExpand = () => {
  modelStore.poles = modelStore.poles.map((item) =>
    item.pivot.id === props.pole.pivot.id
      ? {
          ...item,
          isExpanded: !item.isExpanded,
        }
      : item,
  );
};
</script>
