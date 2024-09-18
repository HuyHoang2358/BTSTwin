<template>
  <a-modal
    v-model:open="modelStore.openModalAddInventory"
    title="Thêm mới thiết bị"
    centered
    style="width: 400px"
    ok-text="Xác nhận"
    cancel-text="Hủy"
    :mask-closable="false"
    @ok="onSubmit"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-form-item
        name="rasterDataStoreId"
        label="Loại thiết bị"
      >
        <a-select
          v-model:value="formState.template"
          placeholder="Chọn loại thiết bị"
        >
          <a-select-option value="anten">Anten</a-select-option>
          <a-select-option value="rru">RRU</a-select-option>
          <a-select-option value="viba">VIBA</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Chiều rộng (mm)">
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.width"
          placeholder="Nhập chiều rộng"
        />
      </a-form-item>
      <a-form-item label="Chiều cao (mm)">
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.height"
          placeholder="Nhập chiều cao"
        />
      </a-form-item>
      <a-form-item label="Chiều sâu (mm)">
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.depth"
          placeholder="Nhập chiều sâu"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useModelStore } from '@/stores/model';

export type FormStateData = {
  template: string;
  width: number;
  height: number;
  depth: number;
};

const modelStore = useModelStore();

const formRef = ref();

const formState: Partial<FormStateData> = reactive({
  template: 'anten',
  width: 0,
  height: 0,
  depth: 0,
});

const onSubmit = () => {
  modelStore.openModalAddInventory = false;
  window.potreeViewer.volumeTool.startInsertion();
};
</script>
