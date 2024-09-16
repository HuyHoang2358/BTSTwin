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
        :label="$t('admin.role.form.name')"
        :rules="[{ required: true, message: $t('admin.role.form.inputName') }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :placeholder="$t('admin.role.form.placeholderName')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('admin.role.function')"
        class="mb-0"
      >
        <a-checkbox
          v-model:checked="formState.checkAllPermission"
          :indeterminate="formState.indeterminatePermission"
          @change="onCheckAllPermissionChange"
        >
          {{ $t('selectAll') }}
        </a-checkbox>
      </a-form-item>
      <a-form-item name="functions">
        <a-checkbox-group
          v-model:value="formState.permissions"
          :options="permissionOptions"
          class="flex flex-col"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button @click="close">{{ $t('cancel') }}</a-button>
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
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import type { RoleResType } from '@/services/apis/iam';
import {
  useCreateRole,
  useMutationIAMSuccess,
  usePermissions,
  useUpdateRole,
} from '@/services/hooks/useIAM';
import { useI18n } from 'vue-i18n';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentRole?: RoleResType;
}>();

export type FormState = {
  permissions: string[];
  name?: string;
  indeterminatePermission: boolean;
  checkAllPermission: boolean;
};

const { t } = useI18n();
const isCreate = computed(() => !props.currentRole);
const title = computed(() => (isCreate.value ? t('admin.role.create') : t('admin.role.update')));
const buttonTitle = computed(() => (isCreate.value ? t('add') : t('update')));

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  permissions: [],
  indeterminatePermission: true,
  checkAllPermission: false,
});

const { data: permissionsData } = usePermissions();
const { mutate: addNewRole, isPending: isCreating } = useCreateRole();
const { mutate: editRole, isPending: isUpdating } = useUpdateRole();
const { onError } = useErrorHandler();
const { invalidateQueriesRoles } = useMutationIAMSuccess();
const { handleSuccess } = useSuccessHandler();

const permissionOptions = computed(
  () => permissionsData.value?.data?.filter((item) => item.public).map((item) => item.name) || [],
);

const onCheckAllPermissionChange = (e: any) => {
  Object.assign(formState, {
    permissions: e.target.checked ? permissionOptions.value : [],
    indeterminate: false,
  });
};

watch(
  () => formState.permissions,
  (val) => {
    formState.indeterminatePermission = !!val.length && val.length < permissionOptions.value.length;
    formState.checkAllPermission = val.length === permissionOptions.value.length;
  },
);

watch(
  () => props.open,
  () => {
    formState.name = props.currentRole?.name || undefined;
    formState.permissions = props.currentRole?.permissions?.map((item) => item.name) || [];
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    if (!formState.name) {
      return;
    }

    const data = {
      name: formState.name,
      permissionIds: formState.permissions.map(
        (item) => permissionsData.value?.data.find((_item) => _item.name === item)?.id as number,
      ),
    };

    if (isCreate.value) {
      addNewRole(data, {
        onSuccess(data) {
          handleSuccess(data);
          invalidateQueriesRoles();
          props.close();
        },
        onError,
      });
    } else {
      if (!props.currentRole?.id) {
        return;
      }

      editRole(
        {
          ...data,
          id: props.currentRole.id,
        },
        {
          onSuccess(data) {
            handleSuccess(data);
            invalidateQueriesRoles();
            props.close();
          },
          onError,
        },
      );
    }
  });
};
</script>
