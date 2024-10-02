<template>
  <div
    v-if="modelStore.isShowBTSInfo"
    class="flex flex-col search-bts z-10 absolute top-[68px] rounded-sm right-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <div class="flex justify-between items-center px-3.5 pt-3.5 pb-1">
      <a-typography-text class="text-base font-medium text-white">
        Thông tin trạm BTS
      </a-typography-text>
      <div>
        <a-button
          type="ghost"
          @click="modelStore.isShowBTSInfo = !modelStore.isShowBTSInfo"
        >
          <IconClose />
        </a-button>
      </div>
    </div>

    <a-divider class="mt-1 mb-0 border-[#404040]" />
    <div class="p-3.5">
      <div class="flex justify-start gap-2 items-center">
        <div class="w-12 h-12">
          <IconBTS class="w-full h-full" />
        </div>
        <h3 class="text-white m-0">Trạm {{ modelStore.selectedBTS?.name }}</h3>
      </div>
      <h5 class="text-white font-semibold mt-4">Thông tin chi tiết</h5>
      <a-descriptions
        layout="horizontal"
        :column="1"
        class="mt-4 p-2 rounded-lg"
        style="border: 1px solid #404040"
      >
        <a-descriptions-item
          label="Tên trạm"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedBTS?.name }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Địa chỉ"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedBTS?.address?.address_detail }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Tọa độ"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ convertToDMS(Number(modelStore.selectedBTS?.location?.longitude)) }}
          {{ `, ` }}
          {{ convertToDMS(Number(modelStore.selectedBTS?.location?.latitude)) }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Đơn vị vận hành"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ 'VTNET' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Dự án"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        ></a-descriptions-item>
        <a-descriptions-item
          label="Nguời quản lý trạm"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        ></a-descriptions-item>
        <a-descriptions-item
          label="Ngày chụp gần nhất"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedBTS?.scans?.[0]?.date }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { computed } from 'vue';
import { convertToDMS } from '@/utils/helpers';
import IconBTS from '@/components/icons/home/IconBTS.vue';
import IconClose from '@/components/icon/IconClose.vue';

const modelStore = useModelStore();

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
