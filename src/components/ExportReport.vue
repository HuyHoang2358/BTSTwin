<template>
  <div
    class="bg-[#303030] w-[260px] overflow-auto"
    v-if="modelStore.activeTool === ACTIVE_TOOL.REPORT"
  >
    <HeaderMenu
      title="Xuất báo cáo"
      show-divider
    />
    <div class="mx-3 py-4">
      <a-typography-text class="text-base font-semibold text-white">
        Danh sách báo cáo
      </a-typography-text>
      <a-button
        type="primary"
        class="w-full mt-2"
        @click="onDownload"
        :loading="isPendingDownload"
      >
        Xuất báo cáo EXCEL
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { useStationReport } from '@/services/hooks/useStation';
import { useRoute } from 'vue-router';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { ACTIVE_TOOL } from '@/utils/enums';

const modelStore = useModelStore();
const route = useRoute();

const { mutate: exportReport, isPending: isPendingDownload } = useStationReport();
const { onError } = useErrorHandler();

const onDownload = () => {
  if (!route.query.id) return;
  exportReport([route.query.id.toString()], {
    onError,
    onSuccess(data) {
      const link = document.createElement('a');
      link.href = data?.data?.file;
      link.setAttribute('download', 'Station_report');
      document.body.appendChild(link);
      link.click();
    },
  });
};
</script>
