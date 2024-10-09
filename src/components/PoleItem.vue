<template>
  <div>
    <div
      :class="[
        'flex flex-row justify-between items-center cursor-pointer',

        pole.id === modelStore.selectedPole?.id && 'bg-[#38536d]',
      ]"
      v-if="modelStore.activeTool === ACTIVE_TOOL.INVENTORY"
    >
      <div
        class="flex flex-row items-center pl-2 py-1 w-full"
        @click="onShowInfoPole"
      >
        <div class="h-8 w-7">
          <img
            :src="domain + pole?.category?.icon"
            alt="icon"
            class="w-full h-full"
          />
        </div>
        <!--        <IconBTS />-->
        <a-typography-text class="text-base font-semibold text-[#E3E3E3] capitalize">
          Cột {{ pole.name }}
        </a-typography-text>
      </div>
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
      <div class="mt-4 flex flex-row items-center gap-1">
        <a-input
          :placeholder="$t('search')"
          v-model:value="searchValue"
          allow-clear
          style="background: #424242; border-radius: 2px; border-width: 0; height: 26px"
        >
          <template #prefix>
            <IconSearchInput />
          </template>
        </a-input>
        <a-button class="m-0 p-0 w-[26px] h-[26px] border-none bg-[#424242] rounded-sm">
          <IconFilter />
        </a-button>
      </div>
    </div>
    <div
      class="flex flex-1 overflow-auto mt-2"
      v-if="pole.isExpanded || modelStore.activeTool !== ACTIVE_TOOL.INVENTORY"
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
          v-for="deviceCategory in pole.deviceCategories"
          :key="deviceCategory.name"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <span>{{ deviceCategory.name }}</span>
              <span class="text-[#8C8C8C] text-xs">
                {{ deviceCategory.devices.length }} thiết bị
              </span>
            </div>
          </template>

          <InventoryItem
            v-for="(item, index) in deviceCategory.devices
              .filter((device: any) =>
                modelStore.activeTool === ACTIVE_TOOL.INVENTORY ? !device.isNewDevice : true,
              )
              .filter((device: any) => compareString(device.device_info.name, searchValue))"
            :key="index"
            :item="item"
            :index="index"
          />
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div
      class="flex flex-col m-4"
      v-if="modelStore.activeTool === ACTIVE_TOOL.EVALUATE"
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
          {{ stressValue ? (stressValue < 90 ? 'Phù hợp' : 'Không phù hợp') : 'Chưa có giá trị' }}
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
import { useStationScan } from '@/services/hooks/useStation';
import { useRoute } from 'vue-router';
import { useCalculate } from '@/services/hooks/useBTS';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconFilter from '@/components/icons/home/IconFilter.vue';
import { ACTIVE_TOOL } from '@/utils/enums';
import IconBTS from '@/components/icons/home/IconBTS.vue';

const baseUrl = import.meta.env.VITE_BASE_URL;
const domain = baseUrl.slice(0, baseUrl.length - 5);

const props = defineProps<{
  pole: Pole;
}>();

const searchValue = ref<string>('');

const modelStore = useModelStore();
const { onError } = useErrorHandler();
const route = useRoute();

const { mutate, isPending, data } = useCalculate();

const { data: dataBTS } = useStationScan(
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

  const inventories: Device[] = [];

  const pole = modelStore.poles.find((pole) => pole.id === modelStore.activePole);
  if (!pole) return;

  modelStore.poles.forEach((pole) => {
    pole.deviceCategories.forEach((category) => {
      category.devices.forEach((item) => {
        if (item.isNewDevice) {
          let dimensions = item.newDevice.scale.toArray();
          dimensions = dimensions.map((v: number) => Potree.Utils.addCommas(v.toFixed(2)));
          inventories.push({
            name: item.name as string,
            depth: Number(dimensions[0]),
            width: Number(dimensions[1]),
            height: Number(dimensions[2]),
            DC: Math.abs(
              item.newDevice
                ? (item.newDevice.position.z - (modelStore.positionValue || pole.z_plane)) *
                    modelStore.gpsRatio
                : 0,
            ),
          });
        } else {
          if (!item.clip) {
            inventories.push({
              name: item.name as string,
              depth: Number(item.depth) / 1000,
              width: Number(item.width) / 1000,
              height: Number(item.length) / 1000,
              DC: Math.abs(
                item.boxMesh
                  ? (item.boxMesh.position.z - (modelStore.positionValue || pole.z_plane)) *
                      modelStore.gpsRatio
                  : 0,
              ),
            });
          }
        }
      });
    });
  });

  mutate(
    {
      pole_id: pole?.id,
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
    item.id === props.pole.id
      ? {
          ...item,
          isExpanded: !item.isExpanded,
        }
      : item,
  );
};
</script>
