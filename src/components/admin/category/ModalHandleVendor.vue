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
        name="name"
        :label="$t('admin.category.vendor.name')"
        :rules="[{ required: true, message: $t('admin.category.vendor.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :placeholder="$t('admin.category.vendor.form.placeholderName')"
          autofocus
        />
      </a-form-item>
<!--      <a-form-item
        name="logo"
        :label="$t('admin.category.vendor.logo')"
        :rules="[{ required: true, message: $t('admin.category.vendor.form.inputLogo') }]"
      >
        <a-input
          v-model:value="formState.logo"
          :allow-clear="true"
          :placeholder="$t('admin.category.vendor.form.placeholderLogo')"
        />
      </a-form-item>

      <a-form-item
        name="website"
        :label="$t('admin.category.vendor.website')"
        :rules="[{ required: true, message: $t('admin.category.vendor.form.inputWebsite') }]"
      >
        <a-input
          v-model:value="formState.website"
          :allow-clear="true"
          :placeholder="$t('admin.category.vendor.form.placeholderWebsite')"
        />
      </a-form-item>-->

      <a-form-item
        name="description"
        :label="$t('admin.category.vendor.description')"
        :rules="[{ required: false, message: $t('admin.category.vendor.form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('admin.category.vendor.form.placeholderDescription')"
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
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { Vendor, VendorData } from '@/services/apis/vendor';
import { useCreateVendor, useMutationVendorSuccess, useUpdateVendor } from '@/services/hooks/useVendor';

const props = defineProps<{
  open: boolean;
  close: () => void;
  selectedItem?: Vendor;
}>();

interface FormState {
  name: string;
  website: string;
  logo: string;
  description: string;
}

const isUpdate = computed(() => Boolean(props.selectedItem));
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới nhà cung cấp'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: '',
  logo: '',
  website: '',
  description: '',
});

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: create, isPending: isCreating } = useCreateVendor();
const { mutate: update, isPending: isUpdating } = useUpdateVendor();
const { invalidateQueries } = useMutationVendorSuccess();

watch(
  () => props.open,
  () => {
    formRef.value?.clearValidate();
    formState.name = props?.selectedItem?.name || '';
    formState.description = props?.selectedItem?.description || '';
  },
);


const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const data: VendorData = {
      ...formState,
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
