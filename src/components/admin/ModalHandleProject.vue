<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
  >
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="projectName"
        label="Loại dữ liệu"
        :rules="[{ required: true, message: 'Vui lòng nhập tên dự án' }]"
      >
        <a-input
          v-model:value="formState.projectName"
          :allow-clear="true"
          placeholder="Nhập tên dự án"
        />
      </a-form-item>
      <a-form-item
        name="investorName"
        label="Nhà đầu tư"
        :rules="[{ required: true, message: 'Vui lòng nhập tên nhà đầu tư' }]"
      >
        <a-input
          v-model:value="formState.investorName"
          :allow-clear="true"
          placeholder="Nhập tên nhà đầu tư"
        />
      </a-form-item>
      <a-form-item
        name="clearanceArea"
        label="Diện tích GPMB (ha)"
        :rules="[{ required: true, message: 'Vui lòng nhập diện tích GPMB' }]"
      >
        <a-input-number
          v-model:value="formState.clearanceArea"
          :min="0"
          class="w-full"
          placeholder="Nhập diện tích (ha)"
        />
      </a-form-item>
      <a-form-item
        name="constructionArea"
        label="Diện tích thi công (ha)"
        :rules="[{ required: true, message: 'Vui lòng nhập diện tích thi công' }]"
      >
        <a-input-number
          v-model:value="formState.constructionArea"
          :min="0"
          class="w-full"
          placeholder="Nhập diện tích (ha)"
        />
      </a-form-item>
      <a-form-item
        name="layerId"
        label="Bản đồ của dự án"
      >
        <a-select
          v-model:value="formState.layerId"
          :options="layerOptions"
          show-search
          placeholder="Chọn bản đồ của dự án"
        />
      </a-form-item>
      <a-form-item
        label="Thời gian"
        name="date"
        :rules="[{ required: true, message: 'Vui lòng chọn thời gian' }]"
      >
        <a-range-picker
          v-model:value="formState.date"
          :placeholder="[$t('startDate'), $t('endDate')]"
          :format="displayDateFormat"
          class="w-full"
        >
          <template #suffixIcon>
            <IconDatePicker />
          </template>
        </a-range-picker>
      </a-form-item>
      <a-form-item
        label="Thời gian GPMB"
        name="clearanceDate"
        :rules="[{ required: true, message: 'Vui lòng chọn thời gian' }]"
      >
        <a-range-picker
          v-model:value="formState.clearanceDate"
          :placeholder="[$t('startDate'), $t('endDate')]"
          :format="displayDateFormat"
          class="w-full"
        >
          <template #suffixIcon>
            <IconDatePicker />
          </template>
        </a-range-picker>
      </a-form-item>
      <a-form-item
        label="Thời gian thi công"
        name="constructionDate"
        :rules="[{ required: true, message: 'Vui lòng chọn thời gian' }]"
      >
        <a-range-picker
          v-model:value="formState.constructionDate"
          :placeholder="[$t('startDate'), $t('endDate')]"
          :format="displayDateFormat"
          class="w-full"
        >
          <template #suffixIcon>
            <IconDatePicker />
          </template>
        </a-range-picker>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">Hủy bỏ</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating || isUpdating"
          @click="handleFinish"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { Project, ProjectData } from '@/services/apis/project';
import dayjs, { type Dayjs } from 'dayjs';
import {
  bodyDateFormat,
  displayDateFormat,
  maxPageSize,
  responseDateFormat,
} from '@/utils/constants';
import IconDatePicker from '@/components/icons/IconDatePicker.vue';
import { useInfinitySpecLayers } from '@/services/hooks/useLayer';
import {
  useCreateProject,
  useMutationProjectSuccess,
  useUpdateProject,
} from '@/services/hooks/useProject';

const props = defineProps<{
  open: boolean;
  close: () => void;
  selectedItem?: Project;
}>();

interface FormState {
  investorName: string;
  projectName: string;
  layerId?: string;
  clearanceArea?: number;
  constructionArea?: number;
  date: Dayjs[];
  clearanceDate: Dayjs[];
  constructionDate: Dayjs[];
}

const isUpdate = computed(() => Boolean(props.selectedItem));
const title = computed(() => (isUpdate.value ? 'Cập nhật dự án' : 'Thêm mới dự án'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  clearanceDate: [],
  constructionDate: [],
  date: [],
  investorName: '',
  projectName: '',
});

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: create, isPending: isCreating } = useCreateProject();
const { mutate: update, isPending: isUpdating } = useUpdateProject();
const { invalidateQueries } = useMutationProjectSuccess();
const { data: layers } = useInfinitySpecLayers({
  pageSize: ref(maxPageSize),
});

watch(
  () => props.open,
  () => {
    formRef.value?.clearValidate();
    formState.investorName = props?.selectedItem?.investorName || '';
    formState.projectName = props?.selectedItem?.projectName || '';
    formState.layerId = props?.selectedItem?.layer.id?.toString() || '';
    formState.clearanceArea = props?.selectedItem?.clearanceArea;
    formState.constructionArea = props?.selectedItem?.constructionArea;
    formState.date =
      props?.selectedItem?.startDate && props?.selectedItem?.endDate
        ? [
            dayjs(props?.selectedItem?.startDate, responseDateFormat),
            dayjs(props?.selectedItem?.endDate, responseDateFormat),
          ]
        : [];
    formState.clearanceDate =
      props?.selectedItem?.clearanceStartDate && props?.selectedItem?.clearanceEndDate
        ? [
            dayjs(props?.selectedItem?.clearanceStartDate, responseDateFormat),
            dayjs(props?.selectedItem?.clearanceEndDate, responseDateFormat),
          ]
        : [];
    formState.constructionDate =
      props?.selectedItem?.constructionStartDate && props?.selectedItem?.constructionEndDate
        ? [
            dayjs(props?.selectedItem?.constructionStartDate, responseDateFormat),
            dayjs(props?.selectedItem?.constructionEndDate, responseDateFormat),
          ]
        : [];
  },
);

const layerOptions = computed(() => {
  return (
    layers?.value?.pages
      ?.flatMap((item) => item?.data.items)
      .map((layer) => ({ label: layer.name, value: layer.id?.toString() })) || []
  );
});

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const data: ProjectData = {
      ...formState,
      clearanceArea: formState.clearanceArea as number,
      constructionArea: formState.constructionArea as number,
      layerId: Number(formState.layerId),
      clearanceEndDate: formState.clearanceDate[1].format(bodyDateFormat),
      clearanceStartDate: formState.clearanceDate[0].format(bodyDateFormat),
      constructionEndDate: formState.constructionDate[1].format(bodyDateFormat),
      constructionStartDate: formState.constructionDate[0].format(bodyDateFormat),
      endDate: formState.date[1].format(bodyDateFormat),
      startDate: formState.date[0].format(bodyDateFormat),
    };
    if (isUpdate.value) {
      update(
        {
          ...data,
          id: props.selectedItem?.id?.toString() || '',
        },
        {
          onSuccess(data) {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
          onError,
        },
      );
    } else {
      create(data, {
        onSuccess(data) {
          invalidateQueries();
          props.close();
          handleSuccess(data);
        },
        onError,
      });
    }
  });
};
</script>
