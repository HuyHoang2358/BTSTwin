<template>
  <div
    class="w-[285px] bg-[#303030] p-6 overflow-auto"
    style="height: calc(100vh - 84px)"
  >
    <a-typography class="text-[#f2f2f2] text-lg mb-2">
      {{ modelStore.selectedPole?.name }}
    </a-typography>
    <a-descriptions
      layout="horizontal"
      :column="1"
      title="Thông tin chung"
      class="ml-4"
    >
      <a-descriptions-item
        label="Loại cột"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedPole?.category?.name }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Vị trí"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedPole?.is_roof ? 'Trên mái' : 'Tự đứng' }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      layout="horizontal"
      :column="1"
      title="Thông số lắp đặt"
      class="ml-4"
    >
      <a-descriptions-item
        label="Số lượng chân cột"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      ></a-descriptions-item>
      <a-descriptions-item
        label="ĐK ống thân"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedPole?.diameter_body_tube + '(mm)' }}
      </a-descriptions-item>
      <a-descriptions-item
        label="ĐK ống thanh chống"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedPole?.diameter_strut_tube + '(mm)' }}
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
        label="Cấu giá trị ứng suất"
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
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue';
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();

interface FormState {
  description?: string;
  status?: string;
}
// set value for status from modelStore
onMounted(() => {
  formState.status = modelStore.selectedPole?.is_shielded.toString() || '0';
});

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
