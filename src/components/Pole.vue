<template>
  <div
    class="w-[285px] bg-[#303030] overflow-auto"
    style="height: calc(100vh - 84px)"
    v-if="modelStore.isShowPoleInfo"
  >
    <div class="flex justify-between items-center px-3.5 pt-3.5 pb-1">
      <a-typography-text class="text-base font-medium text-white">Thông tin cột</a-typography-text>
      <div>
        <a-button
          type="ghost"
          @click="modelStore.isShowPoleInfo = !modelStore.isShowPoleInfo"
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
        <h3 class="text-white m-0">{{ modelStore.selectedPole?.name }}</h3>
      </div>

      <h5 class="text-white font-semibold mt-4">Thông tin chung</h5>
      <a-descriptions
        layout="horizontal"
        :column="1"
        class="mt-2 p-2 rounded-lg"
        style="border: 1px solid #404040"
      >
        <a-descriptions-item
          label="Loại cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.category?.name }} ({{
            modelStore.selectedPole?.category?.code
          }})
        </a-descriptions-item>
        <a-descriptions-item
          label="Vị trí"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.is_roof ? 'Trên mái' : 'Dưới đất' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Chiều cao cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.height + ' (m)' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Chiều cao nhà"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
          v-if="modelStore.selectedPole?.is_roof"
        >
          {{ modelStore.selectedPole?.house_height + ' (m)' }}
        </a-descriptions-item>
      </a-descriptions>

      <h5 class="text-white font-semibold mt-4">Thông số cột</h5>
      <a-descriptions
        layout="horizontal"
        :column="1"
        class="mt-2 p-2 rounded-lg"
        style="border: 1px solid #404040"
      >
        <a-descriptions-item
          label="Đường kính ống thân"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.diameter_body_tube + ' (mm)' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Đường kính ống thanh chống"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.diameter_strut_tube + ' (mm)' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Đường kính ống thân mép trên"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
          v-if="modelStore.selectedPole?.diameter_top_tube"
        >
          {{ modelStore.selectedPole?.diameter_top_tube }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Đường kính ống thân mép dưới"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
          v-if="modelStore.selectedPole?.diameter_bottom_tube"
        >
          {{ modelStore.selectedPole?.diameter_bottom_tube }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Kích thước cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.size ?? ' Chưa xác định' }}
        </a-descriptions-item>

        <a-descriptions-item
          label="Kích thước chân cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.foot_size ?? ' Chưa xác định' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Kích thước đỉnh cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.top_size ?? ' Chưa xác định' }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Cấu trúc cột"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.structure ?? ' Chưa xác định' }}
        </a-descriptions-item>

        <a-descriptions-item
          label="Góc Tilt"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.tilt_angle }}
        </a-descriptions-item>
        <a-descriptions-item
          label="Giá trị ứng suất"
          :labelStyle="descriptionStyle"
          :contentStyle="descriptionStyle"
        >
          {{ modelStore.selectedPole?.stress_value }}%
        </a-descriptions-item>
      </a-descriptions>

      <a-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        class="mt-2"
      >
        <a-form-item
          name="description"
          label="Mô tả"
          class="mb-2"
        >
          <a-textarea
            v-model:value="formState.description"
            placeholder="Nhập mô tả cột"
            :allow-clear="true"
            :rows="3"
          />
        </a-form-item>
        <a-form-item
          name="status"
          label="Có vật che chắn"
          class="mb-2"
        >
          <a-select v-model:value="formState.status">
            <a-select-option value="1">Có</a-select-option>
            <a-select-option value="0">Không</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue';
import { useModelStore } from '@/stores/model';
import IconClose from '@/components/icon/IconClose.vue';
import IconBTS from '@/components/icons/home/IconBTS.vue';

const modelStore = useModelStore();

interface FormState {
  description?: string;
  status?: string;
}
// set value for status from modelStore
onMounted(() => {
  formState.status = modelStore.selectedPole?.is_shielded?.toString() || '0';
});

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
