<template>
  <div
    class="w-[285px] bg-[#323232] overflow-auto"
    style="height: calc(100vh - 84px)"
    v-if="modelStore.selectedPole"
  >
    <HeaderInformation
      title="Thông tin cột"
      :on-close="onClosePole"
    />

    <div class="px-4 py-2.5">
      <div class="flex flex-row items-center">
        <a-image
          :src="domain + modelStore.selectedPole?.category?.icon"
          alt="icon"
          :width="32"
          :height="32"
          :preview="false"
        />
        <div class="flex flex-row flex-1 items-center justify-between ml-1">
          <h3
            class="text-white m-0"
            style="font-size: 22px"
          >
            {{ modelStore.selectedPole?.name }}
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
          label="Loại cột"
          :value="`${modelStore.selectedPole?.category?.name} (${modelStore.selectedPole?.category?.code})`"
        />
        <ItemDescription
          label="Vị trí"
          :value="modelStore.selectedPole?.pole_param.is_roof ? 'Trên mái(TM)' : 'Dưới đất(DD)'"
        />
        <ItemDescription
          label="Chiều cao cột (m)"
          :value="modelStore.selectedPole?.pole_param.height"
        />
        <ItemDescription
          label="Chiều cao nhà (m)"
          :value="modelStore.selectedPole?.pole_param.house_height"
          v-if="modelStore.selectedPole?.pole_param.is_roof"
        />
      </div>

      <a-typography class="text-[#E3E3E3] font-medium text-sm mt-2.5 mb-1">
        Thông số cột
      </a-typography>
      <div class="border border-solid border-[#4B4B4B] rounded-[5px] px-3 py-1">
        <ItemDescription
          label="ĐK ống thân (mm)"
          :value="modelStore.selectedPole?.pole_param.diameter_body_tube"
          submit-key="diameter_body_tube"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="ĐK ống thanh chống (mm)"
          :value="modelStore.selectedPole?.pole_param.diameter_strut_tube"
          submit-key="diameter_strut_tube"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="ĐK ống thân mép trên (mm)"
          :value="modelStore.selectedPole?.pole_param.diameter_top_tube"
          submit-key="diameter_top_tube"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="ĐK ống thân mép dưới (mm)"
          :value="modelStore.selectedPole?.pole_param.diameter_bottom_tube"
          submit-key="diameter_bottom_tube"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="Kích thước cột"
          :value="modelStore.selectedPole?.pole_param.size"
          submit-key="size"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="Kích thước chân cột"
          :value="modelStore.selectedPole?.pole_param.foot_size"
          submit-key="foot_size"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="Kích thước đỉnh cột"
          :value="modelStore.selectedPole?.pole_param.top_size"
          submit-key="top_size"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="Góc Tilt (°)"
          :value="modelStore.selectedPole?.pole_param.tilt_angle"
          submit-key="tilt_angle"
          :on-submit="onSubmitEditing"
          editable
        />
        <ItemDescription
          label="Giá trị ứng suất (%)"
          :value="modelStore.selectedPole?.stress_value"
          submit-key="stress_value"
          :on-submit="onSubmitEditing"
          editable
        />
      </div>

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
import { computed, onMounted, reactive, ref, type UnwrapRef, watch } from 'vue';
import { useModelStore } from '@/stores/model';
import { HistoryOutlined, RollbackOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import {
  HISTORY_POLE_LIST_QUERY_KEY,
  useCreatePoleHistory,
  usePoleHistory,
} from '@/services/hooks/useStation';
import HeaderInformation from '@/components/HeaderInformation.vue';
import ItemDescription from '@/components/ItemDescription.vue';
import { useQueryClient } from '@tanstack/vue-query';
import CustomAEmpty from '@/components/CustomAEmpty.vue';

const baseUrl = import.meta.env.VITE_BASE_URL;
const domain = baseUrl.slice(0, baseUrl.length - 5);

const modelStore = useModelStore();
const { mutate: createPoleHistory } = useCreatePoleHistory();

interface FormState {
  description?: string;
  status?: string;
}

const visibleHistory = ref<boolean>(false);

// set value for status from modelStore
onMounted(() => {
  formState.status = modelStore.selectedPole?.pole_param.is_shielded?.toString() || '0';
});

const route = useRoute();

const { data: dataHistory } = usePoleHistory(
  {
    id: computed(() => route.query.id as string),
    poleId: computed(() => modelStore.selectedPole?.id || 0),
  },
  computed(() => !!route.query.id),
);

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});
const queryClient = useQueryClient();

const onSubmitEditing = (key: string, value: string) => {
  modelStore.poles = modelStore.poles.map((pole) => {
    if (pole.id === modelStore.selectedPole?.id) {
      return { ...pole, pole_param: { ...pole.pole_param, [key]: value } };
    }
    return pole;
  });
  const currentPole = modelStore.poles.find((pole) => pole.id === modelStore.selectedPole?.id);
  if (!currentPole) return;
  modelStore.selectedPole = currentPole;
  createPoleHistory(
    {
      scanId: Number(route.query.id),
      poleId: Number(modelStore.selectedPole?.id),
      field: {
        [key]: value,
      },
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [HISTORY_POLE_LIST_QUERY_KEY] });
      },
    },
  );
};

const onRollback = () => {
  modelStore.poles = modelStore.poles.map((pole) => {
    if (pole.id === modelStore.selectedPole?.id) {
      return { ...pole, pole_param: { ...pole.pole_param, ...modelStore.fieldHover } };
    }
    return pole;
  });
  const currentPole = modelStore.poles.find((pole) => pole.id === modelStore.selectedPole?.id);
  if (!currentPole) return;
  modelStore.selectedPole = currentPole;
  visibleHistory.value = false;
};

watch(
  () => modelStore.poles,
  () => {
    console.log('modelStore.poles', modelStore.poles);
  },
);

const onClosePole = () => {
  modelStore.selectedPole = undefined;
};
</script>
