<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    :width="720"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="name"
            :label="t('admin.pole.name')"
            :rules="[{ required: true, message: t('admin.pole.form.inputName') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.name"
              :allow-clear="true"
              :maxlength="100"
              :placeholder="t('admin.pole.form.placeholderName')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="station_code"
            :label="t('admin.station.code')"
            :rules="[{ required: true, message: t('admin.station.form.inputCode') }]"
            class="my-1"
          >
            <a-select
              v-model:value="formState.station_code"
              :allow-clear="true"
              :placeholder="t('admin.station.form.placeholderCode')"
              :options="stationOptions"
              :loading="isLoading"
              show-search
              :filter-option="filterOption"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        name="pole_category_id"
        :label="t('admin.pole.category')"
        :rules="[{ required: true, message: t('admin.pole.form.inputCategory') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.pole_category_id"
          :options="categoryOptions"
          :allow-clear="true"
          :placeholder="t('admin.pole.form.placeholderCategory')"
        />
      </a-form-item>

      <a-form-item
        name="is_roof"
        :label="t('admin.pole.is_roof')"
        :rules="[{ required: false, message: t('admin.pole.form.inputIsRoof') }]"
        class="my-1"
      >
        <a-select
          v-model:value="formState.is_roof"
          :options="[
            { label: 'Trên mái(TM)', value: 1 },
            { label: 'Dưới mặt đất(DD)', value: 0 },
          ]"
          :allow-clear="true"
          :placeholder="t('admin.pole.form.placeholderIsRoof')"
        />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="height"
            :label="t('admin.pole.height')"
            :rules="[{ required: true, message: t('admin.pole.form.inputHeight') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.height"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderHeight')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="house_height"
            :label="t('admin.pole.house_height')"
            :rules="[{ required: false, message: t('admin.pole.form.inputHouseHeight') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.house_height"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderHouseHeight')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="diameter_body_tube"
            :label="t('admin.pole.diameter_body_tube')"
            :rules="[{ required: false, message: t('admin.pole.form.inputDiameterBodyTube') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.diameter_body_tube"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderDiameterBodyTube')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="diameter_strut_tube"
            :label="t('admin.pole.diameter_strut_tube')"
            :rules="[{ required: false, message: t('admin.pole.form.inputDiameterStrutTube') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.diameter_strut_tube"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderDiameterStrutTube')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="diameter_top_tube"
            :label="t('admin.pole.diameter_top_tube')"
            :rules="[{ required: false, message: t('admin.pole.form.inputDiameterTopTube') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.diameter_top_tube"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderDiameterTopTube')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="diameter_bottom_tube"
            :label="t('admin.pole.diameter_bottom_tube')"
            :rules="[{ required: false, message: t('admin.pole.form.inputDiameterBottomTube') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.diameter_bottom_tube"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderDiameterBottomTube')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="foot_size"
            :label="t('admin.pole.foot_size')"
            :rules="[{ required: false, message: t('admin.pole.form.inputFootSize') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.foot_size"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderFootSize')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="top_size"
            :label="t('admin.pole.top_size')"
            :rules="[{ required: false, message: t('admin.pole.form.inputTopSize') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.top_size"
              :allow-clear="true"
              class="w-full"
              :placeholder="t('admin.pole.form.placeholderTopSize')"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        name="structure"
        :label="t('admin.pole.structure')"
        :rules="[{ required: false, message: t('admin.pole.form.inputStructure') }]"
        class="my-1 w-full"
      >
        <a-input
          v-model:value="formState.structure"
          :allow-clear="true"
          :placeholder="t('admin.pole.form.placeholderStructure')"
        />
      </a-form-item>

      <div>
        <div class="flex justify-between items-center">
          <div>Thông số kỹ thuật</div>
          <div class="flex justify-self-end">
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="addParam"
            />
          </div>
        </div>
        <a-space
          v-for="(param, index) in formState.params"
          :key="param.id"
          style="display: flex; margin-bottom: 8px"
          align="baseline"
        >
          <a-form-item
            :name="['params', index, 'key']"
            :rules="{
              required: true,
              message: 'Nhập tên thông số',
            }"
            class="my-0.5"
          >
            <a-input
              v-model:value="param.key"
              placeholder="Nhập tên thông số"
            />
          </a-form-item>
          <a-form-item
            :name="['params', index, 'value']"
            :rules="{
              required: true,
              message: 'Nhập giá trị thông số',
            }"
            class="my-0.5"
          >
            <a-input
              v-model:value="param.value"
              placeholder="Nhập giá trị thông số"
            />
          </a-form-item>

          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconTrash)"
            @click="removeParam(param)"
          />
        </a-space>
      </div>

      <a-form-item
        name="description"
        :label="$t('admin.pole.description')"
        :rules="[{ required: false, message: $t('admin.pole.form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('admin.pole.form.placeholderDescription')"
          :allow-clear="true"
          :rows="3"
        />
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
import { ref, reactive, computed, h } from 'vue';
import { type FormInstance } from 'ant-design-vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { OptionType } from '@/utils/types';
import type { Pole, PoleData, PoleParam } from '@/services/apis/pole';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import { useCreatePole, useMutationPoleSuccess, useUpdatePole } from '@/services/hooks/usePole';
import { useStationCodes } from '@/services/hooks/useStation';
import type { StationCode } from '@/services/apis/station';
import { compareString } from '@/utils/helpers';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentPole?: Pole;
  categoryOptions: OptionType[];
}>();

// TODO: handle param
const removeParam = (item: PoleParam) => {
  const index = formState.params?.indexOf(item);
  if (index && index >= 0) formState.params?.splice(index, 1);
};

const addParam = () => {
  formState.params?.push({ key: '', value: '', id: Date.now() });
};

// TODO handle Form
type PoleForm = {
  id?: string;
} & Partial<PoleData>;

const formRef = ref<FormInstance>();

const formState = reactive<PoleForm>({});

const isUpdate = computed(() => !!props?.currentPole);
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới thông tin cột'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { mutate: createPole, isPending: isCreating } = useCreatePole();
const { mutate: updatePole, isPending: isUpdating } = useUpdatePole();
const { invalidateQueries } = useMutationPoleSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    console.log('currentPole', props.currentPole);
    formState.name = props.currentPole?.name || undefined;
    formState.station_code = props.currentPole?.station_code || undefined;
    formState.height = props.currentPole?.height || undefined;
    formState.is_roof = props.currentPole?.is_roof ? 1 : 0;
    formState.house_height = props.currentPole?.house_height || undefined;
    formState.pole_category_id = props.currentPole?.category.id.toString() || undefined;
    formState.size = props.currentPole?.size || undefined;
    formState.diameter_body_tube = props.currentPole?.diameter_body_tube || undefined;
    formState.diameter_strut_tube = props.currentPole?.diameter_strut_tube || undefined;
    formState.diameter_top_tube = props.currentPole?.diameter_top_tube || undefined;
    formState.diameter_bottom_tube = props.currentPole?.diameter_bottom_tube || undefined;
    formState.foot_size = props.currentPole?.foot_size || undefined;
    formState.top_size = props.currentPole?.top_size || undefined;
    formState.structure = props.currentPole?.structure || undefined;
    formState.description = props.currentPole?.description || undefined;
    formState.params =
      props.currentPole?.params?.map((i) => ({
        key: i.key,
        value: i.value,
        id: i?.id || Date.now(),
      })) || [];
  },
);

// TODO: submit form
const handleFinish = () => {
  console.log(formState);
  formRef.value?.validate().then(() => {
    const data: PoleData = {
      name: formState.name ?? null,
      station_code: formState.station_code ?? null,
      height: formState.height ?? null,
      is_roof: formState.is_roof ?? 0,
      house_height: formState.house_height ?? null,
      pole_category_id: formState.pole_category_id ?? null,
      size: formState.size ?? null,
      diameter_body_tube: formState.diameter_body_tube ?? null,
      diameter_strut_tube: formState.diameter_strut_tube ?? null,
      diameter_top_tube: formState.diameter_top_tube ?? null,
      diameter_bottom_tube: formState.diameter_bottom_tube ?? null,
      foot_size: formState.foot_size ?? null,
      top_size: formState.top_size ?? null,
      structure: formState.structure ?? null,
      description: formState.description ?? '',

      params:
        formState?.params?.map((i) => ({
          key: i.key,
          value: i.value,
          id: i?.id,
        })) || [],
    };
    console.log('data', data);
    if (isUpdate.value && props?.currentPole?.id) {
      updatePole(
        {
          ...data,
          id: props?.currentPole?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    createPole(data, {
      onError,
      onSuccess: (data) => {
        invalidateQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};

const { data: stationData, isLoading } = useStationCodes();
const stationOptions = computed(
  () =>
    stationData?.value?.data?.map((i: StationCode) => {
      return {
        text: i.code,
        label: i.code,
        value: i.code,
      };
    }) || [],
);

// TODO: filter option in select
const filterOption = (input: string, option: any) => {
  return compareString(option.label, input);
};
</script>
