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
              v-if="!deviceParamHistories || deviceParamHistories.length === 0"
              class="h-[100px]"
            />
            <div
              class="max-h-[200px] overflow-auto"
              v-else
            >
              <div
                class="flex flex-row gap-2 items-center cursor-pointer group mb-2"
                v-for="item in deviceParamHistories"
                :key="item.id"
                @mouseenter="modelStore.fieldHover = item"
                @mouseleave="modelStore.fieldHover = {}"
              >
                <a-typography-text class="group-hover:text-main">
                  {{ item.date_time }}
                </a-typography-text>
                <a-button
                  type="primary"
                  class="w-8 h-8 flex justify-center items-center"
                  @click="onRollback(item.id)"
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
        :value="modelStore.selectedInventory?.device_info?.width"
      />
      <ItemDescription
        label="Chiều dài (mm)"
        :value="modelStore.selectedInventory?.device_info?.depth"
      />
      <ItemDescription
        label="Chiều sâu (mm)"
        :value="modelStore.selectedInventory?.device_info?.length"
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
          @blur="submitComment"
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
  useDeviceHistory,
  useRollbackPoleDeviceParam,
  useUpdateDeviceParam,
} from '@/services/hooks/useStation';
import ItemDescription from '@/components/ItemDescription.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { COMMENT_QUERY_KEY, useComments, useStoreComment } from '@/services/hooks/useComment';

interface FormState {
  description?: string;
}

const modelStore = useModelStore();

const visibleHistory = ref<boolean>(false);
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});

const route = useRoute();

const { data: DeviceHistoryResponse } = useDeviceHistory(
  {
    id: computed(() => route.query.id as string),
    poleId: computed(() => modelStore.selectedInventory?.pole_id || 0),
    index: computed(() => modelStore.selectedInventory?.index || 0),
  },
  computed(() => !!route.query.id),
);
const deviceParamHistories = computed(() => DeviceHistoryResponse?.value?.data || []);

const { mutate: updateDeviceParam } = useUpdateDeviceParam();
const { mutate: rollbackPoleDeviceParam } = useRollbackPoleDeviceParam();
const queryClient = useQueryClient();

const handleSetForm = () => {
  formState.description = modelStore.selectedInventory?.description;
};

watch(() => modelStore.selectedInventory, handleSetForm);
onMounted(handleSetForm);

const onRollback = (pole_device_id: number) => {
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

  rollbackPoleDeviceParam(
    {
      scanId: Number(route.query.id),
      index: Number(modelStore.selectedInventory?.index),
      poleId: Number(modelStore.selectedInventory?.pole_id),
      poleDeviceId: pole_device_id,
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [HISTORY_DEVICE_LIST_QUERY_KEY] });
      },
    },
  );
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
  updateDeviceParam(
    {
      scanId: Number(route.query.id),
      index: Number(modelStore.selectedInventory?.index),
      poleId: Number(modelStore.selectedInventory?.pole_id),
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

// Fetch comments
const { data: comments, refetch } = useComments(
  'pole-device',
  computed(() => modelStore.selectedInventory?.id || 0),
);
watch(
  () => modelStore.selectedInventory,
  () => {
    refetch();
  },
);

watch([comments], () => {
  formState.description = comments?.value?.data?.content || '';
});
const { mutate: storeComment } = useStoreComment();

const submitComment = () => {
  if (formState.description === comments?.value?.data?.content) return;
  if (!formState.description) return;
  storeComment(
    {
      model: 'pole-device',
      model_id: Number(modelStore.selectedInventory?.id),
      content: formState.description,
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEY] });
      },
    },
  );
};
</script>
