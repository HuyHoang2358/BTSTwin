<template>
  <a-drawer
    :open="open"
    :title="isAdd ? 'Thêm mới chức năng' : $t('admin.permissionGroups.update')"
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
        name="permissionGroupName"
        :label="$t('admin.permissionGroups.permissionGroupName')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputPermissionGroupName') },
        ]"

      >
        <a-input
          v-model:value="formState.permissionGroupName"
          :placeholder="$t('admin.permissionGroups.form.placeholderPermissionGroupName')"
          data-test="permissionGroupName"
          :readonly="isAdd"
        />
      </a-form-item>
      <a-form-item
        name="permissionName"
        :label="$t('admin.permissionGroups.permissionName')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputPermissionName') },
        ]"
      >
        <a-input
          v-model:value="formState.permissionName"
          allow-clear
          :placeholder="$t('admin.permissionGroups.form.placeholderPermissionName')"
          data-test="permissionName"
        />
      </a-form-item>
      <a-form-item
        name="module"
        :label="$t('admin.permissionGroups.module')"
      >
        <a-input
          v-model:value="formState.module"
          data-test="module"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-update-permission-group"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isPendingUpdatePermissionGroup || isPendingUpdatePermission || isPendingAddPermission"
          @click="handleFinish"
          id="submit-update-permission-group"
        >
          {{ isAdd ? $t('add') : $t('update') }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { PermissionRecordType } from '@/views/admin/PermissionGroupView.vue';
import {
  useCreatePermission,
  useMutationIAMSuccess,
  useUpdatePermission,
  useUpdatePermissionGroup
} from '@/services/hooks/useIAM';

const props = defineProps<
  {
    close: () => void;
    selectedItem?: PermissionRecordType;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

type FormState = {
  permissionGroupName: string;
  permissionName: string;
  module: string;
};

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  permissionGroupName: '',
  permissionName: '',
  module: '',
});

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueriesPermissionGroup } = useMutationIAMSuccess();
const { mutateAsync: updatePermissionGroup, isPending: isPendingUpdatePermissionGroup } =
  useUpdatePermissionGroup();
const { mutateAsync: updatePermission, isPending: isPendingUpdatePermission } =
  useUpdatePermission();
const { mutateAsync: addPermission, isPending: isPendingAddPermission } = useCreatePermission();

const isAdd = ref(false);
watch(
  () => props.open,
  () => {
    formState.permissionGroupName = props.selectedItem?.permissionGroup || '';
    formState.permissionName = props.selectedItem?.name || '';
    formState.module = props.selectedItem?.scope || '';
    if (props.selectedItem?.name === '') isAdd.value =true;
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(async () => {
    if (!formState.permissionGroupName || !formState.permissionName || !props.selectedItem) {
      return;
    }

    try {
      const data = await Promise.all([
        updatePermissionGroup({
          name: formState.permissionGroupName,
          id: props.selectedItem.permissionGroupId,
        }),
        isAdd.value ? addPermission({
          name: formState.permissionName,
          permissionGroupId: props.selectedItem.permissionGroupId,
          scope: formState.module,
        }) :  updatePermission({
            name: formState.permissionName,
            scope: formState.module,
            id: props.selectedItem.id,
          }),
      ]);
      if (data) {
        await invalidateQueriesPermissionGroup();
        handleSuccess(data[0]);
        handleSuccess(data[1]);
        props.close();
      }
    } catch (e) {
      onError(e);
    }
  });
};
</script>
