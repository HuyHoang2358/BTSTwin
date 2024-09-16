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
        :label="$t('admin.permissionGroups.permissionName')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputPermissionName') },
        ]"
      >
        <a-input
          v-model:value="formState.name"
          allow-clear
          :placeholder="$t('admin.permissionGroups.form.placeholderPermissionName')"
        />
      </a-form-item>

      <a-form-item
        name="scope"
        :label="$t('admin.permissionGroups.module')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputModule') },
        ]"
      >
        <a-input
          v-model:value="formState.scope"
          allow-clear
          :placeholder="$t('admin.permissionGroups.form.placeholderModule')"
        />
      </a-form-item>

      <a-form-item
        name="public"
        :label="$t('admin.permissionGroups.is_public')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputModule') },
        ]"
      >
        <a-switch v-model:checked="formState.public" />
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
          :loading="isCreating || isUpdating"
          @click="handleFinish"
          id="submit-update-permission-group"
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
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import {
  useCreatePermission,
  useMutationIAMSuccess, useUpdatePermission
} from '@/services/hooks/useIAM';
import {
  type Permission,
  type PermissionData,
  type PermissionGroup,
} from '@/services/apis/iam';

const { t } = useI18n();
const props = defineProps<
  {
    close: () => void;
    currentPermissionGroup?: PermissionGroup
    currentPermission?: Permission
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

// TODO: Check update or add action
const isUpdate = computed(() => Boolean(props.currentPermission));
const title = computed(() =>
  isUpdate.value ? 'Chỉnh sửa chức năng' : "Thêm mới chức năng"
);
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

// TODO: Define form
type FormState = {
  name: string;
  scope: string;
  public: boolean;
};
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: '',
  scope: '',
  public: false
});

// TODO: Define handle action
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueriesPermissionGroup } = useMutationIAMSuccess();
const { mutate: createPermission, isPending: isCreating } = useCreatePermission()
const { mutate: updatePermission, isPending: isUpdating } = useUpdatePermission()
// TODO: watch props open
watch(
  () => props.open,
  () => {
    formState.name = props.currentPermission?.name || '';
    formState.scope = props.currentPermission?.scope || '';
    formState.public = props.currentPermission?.public || false;
  },
);

// TODO: handle submit form
const handleFinish = () => {
  formRef.value?.validate().then( () => {
    if (!formState.name || !formState.scope || !props.currentPermissionGroup?.id) return;

    const body: PermissionData = {
      name: formState.name.trim(),
      scope: formState.scope.trim(),
      public: formState.public,
      permissionGroupId:  props.currentPermissionGroup?.id,
    };

    if(isUpdate.value){
      if (!props.currentPermission?.id) return;

      updatePermission(
        {
          ...body,
          id: props.currentPermission?.id,
        }, {
          onSuccess(data) {
            invalidateQueriesPermissionGroup();
            handleSuccess(data);
            props.close();
          },
          onError,
        })
    }
    else {
      createPermission(body, {
        onSuccess(data) {
          invalidateQueriesPermissionGroup();
          handleSuccess(data);
          props.close();
        },
        onError,
      })
    }
  });
}

</script>
