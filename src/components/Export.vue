<template>
  <div
    class="bg-[#303030] w-[260px] overflow-auto"
    v-if="modelStore.activeTool === 'export'"
  >
    <div class="flex justify-between items-center px-3 pt-4">
      <a-typography-text class="text-lg font-semibold text-[#E3E3E3]">
        Xuất báo cáo
      </a-typography-text>
    </div>
    <a-divider class="mt-1 mb-0 border-[#404040]" />
    <div class="mx-3 py-4">
      <a-button
        type="primary"
        class="w-full"
        @click="onDownload"
        :loading="isPendingDownload"
      >
        Xuất báo cáo excel
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { useBTSDetail, useStationReport } from '@/services/hooks/useStation';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { displayDateFormat, excelMineType } from '@/utils/constants';
import dayjs from 'dayjs';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
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
