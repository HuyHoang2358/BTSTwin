<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="400"
    :get-container="getContainer"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        :label="$t('admin.ai-module.label.name')"
        :rules="[{ required: true, message: $t('admin.ai-module.label.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          allow-clear
          :placeholder="$t('admin.ai-module.label.form.inputName')"
          data-test="name"
        />
      </a-form-item>

      <a-form-item
        name="aiClass"
        :label="$t('admin.ai-module.label.ai-class')"
        :rules="[{ required: true, message: $t('admin.ai-module.label.form.inputAIClass') }]"
      >
        <a-input-number
          v-model:value="formState.aiClass"
          allow-clear
          :placeholder="$t('admin.ai-module.label.form.inputAIClass')"
          data-test="name"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        name="color"
        :label="$t('admin.ai-module.label.color')"
      >
        <a-input
          v-model:value="formState.color"
          allow-clear
          :placeholder="$t('admin.ai-module.label.form.inputColor')"
          :change="previewColor()"
        />
      </a-form-item>
      <div class="w-12 h-12 bg-gray-200 rounded-lg" id="color-preview" style="border: 1px solid gray"></div>


    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-create-field"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isCreating || isUpdating"
          @click="handleFinish"
          id="submit-field"
        >
          {{ buttonTitle }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { type FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { AILabel, AILabelData } from '@/services/apis/aiLabel';
import { useCreateAILabel, useMutationAILabelSuccess, useUpdateAILabel } from '@/services/hooks/useAILabel';

const props = defineProps<
  {
    close: () => void;
    currentLabel?: AILabel;
    currentLabelCategoryId?: number;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const { t } = useI18n();

const isUpdate = computed(() => Boolean(props.currentLabel));
const title = computed(() =>
  isUpdate.value ? t('admin.ai-module.label.form.updateLabel') : t('admin.ai-module.label.form.createLabel'),
);
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

const formRef = ref<FormInstance>();
const formState = reactive<AILabelData>({
  aiCategoryId: 0,
  aiClass: 0,
  name: '',
  color: "",
  status: true,
});

// TODO: preview color
const previewColor = ()=>{
  //console.log('color:', formState.color)
  formState.color = formState.color.trim();
  if (formState.color.length === 0) return;
  if (formState.color[0] !== '#') formState.color = "#" + formState.color;
  const eColorPreview = document.getElementById("color-preview");
  if (eColorPreview) {
    eColorPreview.style.backgroundColor = formState.color;
  }
}


// TODO:watch props
watch(
  () => props.open,
  () => {
    formState.name = props.currentLabel?.name || '';
    formState.aiClass = props.currentLabel?.aiClass || 0;
    formState.aiCategoryId = props.currentLabelCategoryId || 0;
    formState.color = props.currentLabel?.color || "";
    formState.status = props.currentLabel?.status || true;
  },
);

// TODO: handle Finish
const { mutate: createAILabel, isPending: isCreating } = useCreateAILabel();
const { mutate: updateAILabel, isPending: isUpdating } = useUpdateAILabel();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationAILabelSuccess();

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    //console.log("form", formState)
    const body: AILabelData = {
      name: formState.name,
      aiClass: formState.aiClass,
      color: formState.color,
      aiCategoryId: formState.aiCategoryId,
      status: formState.status,
    };
    if (body.aiCategoryId === 0) return;
    if (isUpdate.value) {
      if (!props.currentLabel?.id) {
        return;
      }
      updateAILabel(
        {
          ...body,
          id: props.currentLabel?.id,
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
      createAILabel(body, {
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
