<template>
  <div
    class="w-[285px] bg-[#303030] p-6 overflow-auto"
    v-if="modelStore.selectedInventory"
  >
    <div>
      <a-typography-paragraph
        v-model:content="editableStr"
        :editable="{ triggerType: 'text' }"
        class="text-[#f2f2f2] text-lg"
      />
      <div class="flex flex-row items-center mb-2">
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
            d="M13 4H3a1.003 1.003 0 0 0-1 1v6a1.003 1.003 0 0 0 1 1h10a1.003 1.003 0 0 0 1-1V5a1.003 1.003 0 0 0-1-1Zm0 7H3V7h1V5h2v2h1V5h2v2h1V5h2v2h1v4Z"
          ></path>
        </svg>
        <a-typography-text class="text-white text-xs">
          {{ '&nbsp;Dữ liệu nhận dạng tự động' }}
        </a-typography-text>
      </div>
    </div>
    <a-descriptions
      layout="horizontal"
      :column="1"
      class="ml-4"
    >
      <a-descriptions-item
        label="Id"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory.id }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Loại thiết bị"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory.model }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Nghiêng xuống"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        0°
      </a-descriptions-item>
      <a-descriptions-item
        label="Phương vị"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.deviceAzimuth || 0 }} °
      </a-descriptions-item>
      <a-descriptions-item
        label="Dọi thẳng"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        0°
      </a-descriptions-item>
      <a-descriptions-item
        label="Chiều rộng"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.modelWidth || 0 }} mm
      </a-descriptions-item>
      <a-descriptions-item
        label="Chiều cao"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.modelHeight || 0 }} mm
      </a-descriptions-item>
      <a-descriptions-item
        label="Độ sâu"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.modelDepth || 0 }} mm
      </a-descriptions-item>
      <a-descriptions-item
        label="Độ cao (L)"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.deviceHeight || 0 }} mm
      </a-descriptions-item>
      <a-descriptions-item
        label="Tọa độ"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        46.70991°,
        <br />
        6.42839°,
        <br />
        1.25 km
      </a-descriptions-item>
    </a-descriptions>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="dark-form mt-2"
    >
      <a-form-item
        name="name"
        label="Tên thiết bị"
        class="mb-4"
      >
        <a-input
          v-model:value="formState.name"
          placeholder="Nhập tên thiết bị"
        />
      </a-form-item>
      <a-form-item
        name="weight"
        label="Cân nặng"
        class="mb-4"
      >
        <a-input
          v-model:value="formState.weight"
          placeholder="Nhập cân nặng"
        />
      </a-form-item>
      <a-form-item
        name="frequencies"
        label="Tần số"
        class="mb-4"
      >
        <a-input
          v-model:value="formState.frequencies"
          placeholder="Nhập tần số"
        />
      </a-form-item>
      <a-form-item
        name="status"
        label="Trạng thái"
        class="mb-4"
      >
        <a-select v-model:value="formState.status">
          <a-select-option value="active">Hoạt động</a-select-option>
          <a-select-option value="inactive">Không hoạt động</a-select-option>
          <a-select-option value="installation">Đang lắp đặt</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { useModelStore } from '@/stores/model';
import { computed, reactive, ref, type UnwrapRef, watch } from 'vue';

interface FormState {
  name?: string;
  weight?: string;
  frequencies?: string;
  status?: string;
}

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});
const modelStore = useModelStore();
const editableStr = ref(modelStore.selectedInventory?.name);

watch(
  () => modelStore.selectedInventory,
  () => {
    editableStr.value = modelStore.selectedInventory?.name;
  },
);

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
