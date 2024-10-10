<template>
  <div v-if="modelStore.selectedInventory">
    <div class="flex flex-row items-center">
      <div class="flex flex-row flex-1 items-center justify-between">
        <h3
          class="text-white m-0"
          style="font-size: 22px"
        >
          {{ modelStore.selectedInventory?.device_info?.name }}
        </h3>
        <a-popover
          placement="left"
          trigger="click"
          v-model:open="visibleHistory"
        >
          <template #content>
            <CustomAEmpty
              v-if="!dataHistory || dataHistory.length === 0"
              class="h-[100px]"
            />
            <div
              class="max-h-[200px] overflow-auto"
              v-else
            >
              <div
                class="flex flex-row gap-2 items-center cursor-pointer group mb-2"
                v-for="item in dataHistory"
                :key="item.id"
                @mouseenter="modelStore.fieldHover = item.field"
                @mouseleave="modelStore.fieldHover = {}"
              >
                <a-typography-text class="group-hover:text-main">
                  {{ item.createdAt }}
                </a-typography-text>
                <a-button
                  type="primary"
                  class="w-8 h-8 flex justify-center items-center"
                  @click="onRollback"
                >
                  <RollbackOutlined class="text-white h-4 w-4" />
                </a-button>
              </div>
            </div>
          </template>
          <template #title>
            <span>Lịch sử thay đổi</span>
          </template>
          <a-button
            ghost
            class="border-none m-0 p-0"
          >
            <HistoryOutlined class="text-white h-4 w-4" />
          </a-button>
        </a-popover>
      </div>
    </div>
    <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
      Thông tin chung
    </a-typography>
    <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
      <ItemDescription
        label="Danh mục"
        :value="modelStore.selectedInventory.device_info?.category.name"
      />
      <ItemDescription
        label="Loại thiết bị"
        :value="modelStore.selectedInventory.device_info?.name"
      />
      <ItemDescription
        label="Nhà cung cấp"
        :value="modelStore.selectedInventory?.device_info?.vendor?.name"
      />
    </div>

    <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
      Thông số kỹ thuật
    </a-typography>
    <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
      <ItemDescription
        label="Chiều rộng (mm)"
        :value="modelStore.selectedInventory?.ai_device_width"
      />
      <ItemDescription
        label="Chiều dài (mm)"
        :value="modelStore.selectedInventory?.ai_device_height"
      />
      <ItemDescription
        label="Chiều sâu (mm)"
        :value="modelStore.selectedInventory?.ai_device_depth"
      />
      <ItemDescription
        label="Trọng lượng (kg)"
        :value="modelStore.selectedInventory?.device_info?.weight"
      />
      <ItemDescription
        :label="item.key"
        :value="item.value"
        :submit-key="item.key"
        :on-submit="onSubmitEditing"
        v-for="item in modelStore.selectedInventory.device_info?.params"
        :key="item.key"
        editable
      />
    </div>

    <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
      Thông số lắp đặt
    </a-typography>
    <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
      <ItemDescription
        label="Góc tilt (°)"
        :value="modelStore.selectedInventory?.tilt"
        submit-key="tilt"
        :on-submit="onSubmitEditing"
        editable
      />
      <ItemDescription
        label="Góc Azimuth (°)"
        :value="modelStore.selectedInventory?.azimuth"
        submit-key="azimuth"
        :on-submit="onSubmitEditing"
        editable
      />
      <ItemDescription
        label="Độ cao so với mặt đất (m)"
        :value="modelStore.selectedInventory?.height"
        submit-key="height"
        :on-submit="onSubmitEditing"
        editable
      />
    </div>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="mt-2.5"
    >
      <a-form-item
        name="description"
        class="mb-2"
        label="Mô tả"
      >
        <a-textarea
          v-model:value="formState.description"
          placeholder="Nhập mô tả thiết bị"
          :allow-clear="true"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { useModelStore } from '@/stores/model';
import { computed, onMounted, reactive, ref, type UnwrapRef, watch } from 'vue';
import { HistoryOutlined, RollbackOutlined } from '@ant-design/icons-vue';
import CustomAEmpty from '@/components/CustomAEmpty.vue';
import { useRoute } from 'vue-router';
import {
  HISTORY_DEVICE_LIST_QUERY_KEY,
  useCreateDeviceHistory,
  useDeviceHistory,
} from '@/services/hooks/useStation';
import ItemDescription from '@/components/ItemDescription.vue';
import { useQueryClient } from '@tanstack/vue-query';

interface FormState {
  description?: string;
}

const modelStore = useModelStore();

const visibleHistory = ref<boolean>(false);
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});

const route = useRoute();

const { data: dataHistory } = useDeviceHistory(
  {
    id: computed(() => route.query.id as string),
    deviceId: computed(() => modelStore.selectedInventory?.id || 0),
  },
  computed(() => !!route.query.id),
);
const { mutate: createDeviceHistory } = useCreateDeviceHistory();
const queryClient = useQueryClient();

const handleSetForm = () => {
  formState.description = modelStore.selectedInventory?.description;
};

watch(() => modelStore.selectedInventory, handleSetForm);
onMounted(handleSetForm);

const onRollback = () => {
  modelStore.poles = modelStore.poles.map((pole) => ({
    ...pole,
    deviceCategories: pole.deviceCategories.map((category) => ({
      ...category,
      devices: category.devices.map((device) => {
        if (device.id === modelStore.selectedInventory?.id) {
          return {
            ...device,
            ...modelStore.fieldHover,
          };
        }

        return device;
      }),
    })),
  }));
  modelStore.poles.forEach((pole) => {
    pole.deviceCategories.forEach((category) => {
      category.devices.forEach((device) => {
        if (device.id === modelStore.selectedInventory?.id) {
          modelStore.selectedInventory = device;
          return {
            ...device,
            ...modelStore.fieldHover,
          };
        }
        return device;
      });
    });
  });
  visibleHistory.value = false;
};

const onSubmitEditing = (key: string, value: string) => {
  modelStore.poles = modelStore.poles.map((pole) => ({
    ...pole,
    deviceCategories: pole.deviceCategories.map((category) => ({
      ...category,
      devices: category.devices.map((device) => {
        if (device.id === modelStore.selectedInventory?.id) {
          return {
            ...device,
            [key]: value,
          };
        }
        return device;
      }),
    })),
  }));
  modelStore.poles.forEach((pole) => {
    pole.deviceCategories.forEach((category) => {
      category.devices.forEach((device) => {
        if (device.id === modelStore.selectedInventory?.id) {
          modelStore.selectedInventory = device;
          return {
            ...device,
            [key]: value,
          };
        }
        return device;
      });
    });
  });
  createDeviceHistory(
    {
      scanId: Number(route.query.id),
      deviceId: Number(modelStore.selectedInventory?.id),
      field: {
        [key]: value,
      },
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [HISTORY_DEVICE_LIST_QUERY_KEY] });
      },
    },
  );
};
</script>
