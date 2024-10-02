<template>
  <div v-if="modelStore.selectedInventory">
    <h5 class="text-white font-semibold mt-4">Thông tin chung</h5>
    <a-descriptions
      layout="horizontal"
      :column="1"
      class="mt-2 p-2 rounded-lg"
      style="border: 1px solid #404040"
    >
      <a-descriptions-item
        label="Danh mục"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory.category.name }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Loại thiết bị"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory.name }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Nhà cung cấp"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.vendor?.name }}
      </a-descriptions-item>
    </a-descriptions>

    <h5 class="text-white font-semibold mt-4">Thông số kỹ thuật</h5>
    <a-descriptions
      layout="horizontal"
      :column="1"
      class="mt-2 p-2 rounded-lg"
      style="border: 1px solid #404040"
    >
      <a-descriptions-item
        label="Chiều rộng"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.width || 0 }} (mm)
      </a-descriptions-item>
      <a-descriptions-item
        label="Chiều dài"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.length || 0 }} (mm)
      </a-descriptions-item>
      <a-descriptions-item
        label="Chiều sâu"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.depth || 0 }} (mm)
      </a-descriptions-item>
      <a-descriptions-item
        label="Trọng lượng"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedInventory?.weight }} (kg)
      </a-descriptions-item>
      <a-descriptions-item
        :label="item.key"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
        v-for="item in modelStore.selectedInventory.params"
        :key="item.value"
      >
        {{ item.value }}
      </a-descriptions-item>
    </a-descriptions>
    <h5 class="text-white font-semibold mt-4">Thông số lắp đặt</h5>

    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="mt-2 p-2 rounded-lg"
      style="border: 1px solid #404040"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="deviceTilt"
            label="Góc tilt (°)"
            class="mb-2"
          >
            <a-input-number
              v-model:value="formState.deviceTilt"
              class="w-full rounded bg-[#424242]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="deviceAzimuth"
            label="Góc Azimuth (°)"
            class="mb-2"
          >
            <a-input-number
              v-model:value="formState.deviceAzimuth"
              class="w-full rounded bg-[#424242]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        name="deviceHeight"
        label="Độ cao thiết bị so với chân cột (m)"
        class="mb-2"
      >
        <a-input-number
          v-model:value="formState.deviceHeight"
          class="w-full rounded bg-[#424242]"
        />
      </a-form-item>

      <!--      <div class="flex flex-row gap-2 mb-2">
        <a-form-item
          name="x"
          label="x"
          class="mb-0"
          :colon="false"
        >
          <a-input-number
            v-model:value="formState.x"
            class="w-full rounded bg-[#424242]"
          />
        </a-form-item>
        <a-form-item
          name="y"
          label="y"
          :colon="false"
          class="mb-0"
        >
          <a-input-number
            v-model:value="formState.y"
            class="w-full rounded bg-[#424242]"
          />
        </a-form-item>
        <a-form-item
          name="z"
          label="z"
          class="mb-0"
          :colon="false"
        >
          <a-input-number
            v-model:value="formState.z"
            class="w-full rounded bg-[#424242]"
          />
        </a-form-item>
      </div>-->
    </a-form>

    <h5 class="text-white font-semibold mt-4">Mô tả</h5>
    <a-form-item
      name="description"
      class="mb-2"
    >
      <a-textarea
        v-model:value="formState.description"
        placeholder="Nhập mô tả thiết bị"
        :allow-clear="true"
        :rows="3"
      />
    </a-form-item>

    <a-form-item
      name="status"
      label="Trạng thái"
      class="mb-2"
    >
      <a-select
        v-model:value="formState.status"
        class="bg-[#424242]"
      >
        <a-select-option value="active">Hoạt động</a-select-option>
        <a-select-option value="inactive">Không hoạt động</a-select-option>
        <a-select-option value="installation">Đang lắp đặt</a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script lang="ts" setup>
import { useModelStore } from '@/stores/model';
import { computed, onMounted, reactive, ref, type UnwrapRef, watch } from 'vue';
import * as THREE from 'three';

interface FormState {
  frequencies?: string;
  deviceTilt?: number;
  deviceAzimuth?: number;
  deviceHeight?: number;
  x?: number;
  y?: number;
  z?: number;
  description?: string;
  status?: string;
}

const modelStore = useModelStore();

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  status: 'active',
});

const handleSetForm = () => {
  if (modelStore.selectedInventory?.pivot.vertices) {
    const vertices = JSON.parse(modelStore.selectedInventory?.pivot.vertices);
    // Define vertices of the Antenna
    const antennaVertices = vertices.map(
      (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
    );

    // Compute bounding box
    const box = new THREE.Box3().setFromPoints(antennaVertices);
    formState.x = box.getCenter(new THREE.Vector3()).x;
    formState.y = box.getCenter(new THREE.Vector3()).y;
    formState.z = box.getCenter(new THREE.Vector3()).z;
  }

  formState.deviceTilt = modelStore.selectedInventory?.pivot.tilt;
  formState.deviceAzimuth = modelStore.selectedInventory?.pivot.azimuth;
  formState.deviceHeight = modelStore.selectedInventory?.pivot.height;

  formState.description = modelStore.selectedInventory?.pivot.description;
};

watch(() => modelStore.selectedInventory, handleSetForm);

onMounted(handleSetForm);

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
<style>
.ant-select-selector {
  background-color: #424242 !important;
  border-radius: 2px;
}
</style>
