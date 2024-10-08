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
import { useBTSDetail, useStationReport } from '@/services/hooks/useStation';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { ACTIVE_TOOL } from '@/utils/enums';

const modelStore = useModelStore();
const route = useRoute();

const { data: btsDetail } = useBTSDetail(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

const { mutate: exportReport, isPending: isPendingDownload } = useStationReport();
const { onError } = useErrorHandler();

const onDownload = () => {
  console.log(btsDetail.value?.data?.id.toString());
  exportReport(btsDetail.value?.data?.id.toString(), {
    onError,
    onSuccess(data) {
      console.log('data', data?.data?.file);
      const link = document.createElement('a');
      link.href = data?.data?.file;
      link.setAttribute('download', 'Station_report');
      document.body.appendChild(link);
      link.click();
    },
  });
};
</script>
