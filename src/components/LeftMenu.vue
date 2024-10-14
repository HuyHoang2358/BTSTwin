<template>
  <div class="bg-[#212121] flex flex-col">
    <MenuItem
      title="Đo lường"
      :active-tool="ACTIVE_TOOL.MEASUREMENT"
      class="-mt-[1px]"
    >
      <icon-measurement />
    </MenuItem>
    <MenuItem
      title="Khảo sát"
      :active-tool="ACTIVE_TOOL.INVENTORY"
    >
      <icon3-d-model />
    </MenuItem>
    <MenuItem
      title="Đánh giá"
      :active-tool="ACTIVE_TOOL.EVALUATE"
    >
      <IconEvaluate />
    </MenuItem>
    <MenuItem
      title="Hình ảnh"
      :active-tool="ACTIVE_TOOL.IMAGE"
    >
      <icon-image />
    </MenuItem>
    <MenuItem
      title="Báo cáo"
      :active-tool="ACTIVE_TOOL.REPORT"
    >
      <icon-report />
    </MenuItem>
  </div>
  <div
    style="height: calc(100vh - 84px)"
    class="flex"
  >
    <Measurement />
    <Inventory />
    <Evaluate />
    <ImageSection />
    <ExportReport />
  </div>
</template>

<script setup lang="ts">
import Inventory from '@/components/Inventory.vue';
import Measurement from '@/components/Measurement.vue';
import ImageSection from '@/components/ImageSection.vue';
import Evaluate from '@/components/EvaluateDesign.vue';
import ExportReport from '@/components/ExportReport.vue';
import IconImage from '@/components/icon/IconImage.vue';
import Icon3DModel from '@/components/icon/Icon3DModel.vue';
import IconMeasurement from '@/components/icon/IconMeasurement.vue';
import MenuItem from '@/components/MenuItem.vue';
import { ACTIVE_TOOL } from '@/utils/enums';
import IconReport from '@/components/icon/IconReport.vue';
import IconEvaluate from '@/components/icons/IconEvaluate.vue';
</script>
