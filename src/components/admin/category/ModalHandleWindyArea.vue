<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
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
      <a-form-item
        name="name"
        :label="t('admin.category.windyArea.name')"
        :rules="[{ required: true, message: t('admin.category.windyArea.form.inputName') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.category.windyArea.form.placeholderName')"
        />
      </a-form-item>


      <a-form-item
        name="name"
        :label="t('admin.category.windyArea.wo')"
        :rules="[{ required: false, message: t('admin.category.windyArea.form.inputWo') }]"
        class="my-1"
      >
        <a-input-number
          v-model:value="formState.wo"
          :allow-clear="true"
          class="w-full"
          :placeholder="t('admin.category.windyArea.form.placeholderWo')"
        />
      </a-form-item>

      <a-form-item
        name="name"
        :label="t('admin.category.windyArea.v3s50')"
        :rules="[{ required: false, message: t('admin.category.windyArea.form.inputV3s50') }]"
        class="my-1"
      >
        <a-input-number
          v-model:value="formState.v3s50"
          :allow-clear="true"
          class="w-full"
          :placeholder="t('admin.category.windyArea.form.placeholderV3s50')"
        />
      </a-form-item>

      <a-form-item
        name="name"
        :label="t('admin.category.windyArea.v10m50')"
        :rules="[{ required: false, message: t('admin.category.windyArea.form.inputV10m50') }]"
        class="my-1"
      >
        <a-input-number
          v-model:value="formState.v10m50"
          :allow-clear="true"
          class="w-full"
          :placeholder="t('admin.category.windyArea.form.placeholderV10m50')"
        />
      </a-form-item>


      <a-form-item
        name="description"
        :label="$t('admin.category.windyArea.description')"
        :rules="[{ required: false, message: $t('admin.category.windyArea.form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('admin.category.windyArea.form.placeholderDescription')"
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
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';

import { ref, reactive, computed, watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import { useCreateWindyArea, useMutationWindyAreaSuccess, useUpdateWindyArea } from '@/services/hooks/useWindyArea';

import { type FormInstance } from 'ant-design-vue';
import type { WindyArea, WindyAreaData } from '@/services/apis/windyArea';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentWindyArea?: WindyArea;
}>();

// TODO handle Form
type WindyAreaForm = {
  id?: string;
} & Partial<WindyAreaData>  ;
const formRef = ref<FormInstance>();
const formState = reactive<WindyAreaForm>({});

const isUpdate = computed(() => !!props?.currentWindyArea);
const title = computed(() => (isUpdate.value ? t('admin.form.title.update') : t('admin.form.title.create').replace(':name', 'vùng gió')));
const buttonTitle = computed(() => (isUpdate.value ? t('admin.form.submit-button.update') : t('admin.form.submit-button.create')));

const { t } = useI18n();
const { mutate: createWindyArea, isPending: isCreating } = useCreateWindyArea();
const { mutate: updateWindyArea, isPending: isUpdating } = useUpdateWindyArea();
const { invalidateQueries } = useMutationWindyAreaSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    formState.name = props.currentWindyArea?.name || undefined;
    formState.wo = props.currentWindyArea?.wo || undefined;
    formState.v3s50 = props.currentWindyArea?.v3s50;
    formState.v10m50 = props.currentWindyArea?.v10m50 || undefined;
    formState.description = props.currentWindyArea?.description || undefined;
  },
);


// TODO: submit form
const handleFinish = () => {
  console.log(formState)
  formRef.value?.validate().then(() => {
    const data: WindyAreaData = {
      name: formState.name ?? null,
      wo: formState.wo ?? null,
      v3s50: formState.v3s50 ?? 0,
      v10m50: formState.v10m50 ?? null,
      description: formState.description ?? "",
    };
    console.log("data", data);
    if (isUpdate.value && props?.currentWindyArea?.id) {
      updateWindyArea(
        {
          ...data,
          id: props?.currentWindyArea?.id,
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

    createWindyArea(data, {
      onError,
      onSuccess: (data) => {
        invalidateQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};
</script>
