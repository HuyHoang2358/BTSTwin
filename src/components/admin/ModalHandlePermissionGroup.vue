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
        :label="$t('admin.permissionGroups.permissionGroupName')"
        :rules="[
          { required: true, message: $t('admin.permissionGroups.form.inputPermissionGroupName') },
        ]"
      >
        <a-input
          v-model:value="formState.name"
          allow-clear
          :placeholder="$t('admin.permissionGroups.form.placeholderPermissionGroupName')"
          data-test="permissionGroupName"
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
  useCreatePermissionGroup,
  useMutationIAMSuccess, useUpdatePermissionGroup
} from '@/services/hooks/useIAM';
import { type PermissionGroup, type PermissionGroupData } from '@/services/apis/iam';

const { t } = useI18n();
const props = defineProps<
  {
    close: () => void;
    currentPermissionGroup?: PermissionGroup
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

// TODO: Check update or add action
const isUpdate = computed(() => Boolean(props.currentPermissionGroup));
const title = computed(() =>
  isUpdate.value ? 'Chỉnh sửa nhóm chức năng' : "Thêm mới nhóm chức năng"
);
const buttonTitle = computed(() => (isUpdate.value ? t('update') : t('add')));

// TODO: Define form
type FormState = { name: string; };
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({ name: ''});

// TODO: Define handle action
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueriesPermissionGroup } = useMutationIAMSuccess();
const { mutate: createPermissionGroup, isPending: isCreating } = useCreatePermissionGroup()
const { mutate: updatePermissionGroup,isPending: isUpdating } = useUpdatePermissionGroup()
// TODO: watch props open
watch(
  () => props.open,
  () => {
    formState.name = props.currentPermissionGroup?.name || '';
  },
);

// TODO: handle submit form
const handleFinish = () => {
  formRef.value?.validate().then( () => {
    if (!formState.name) return;

    const body: PermissionGroupData = {
      name: formState.name.trim(),
    };
    if(isUpdate.value){
      if (!props.currentPermissionGroup?.id) return;

      updatePermissionGroup(
        {
          ...body,
          id: props.currentPermissionGroup?.id,
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
      createPermissionGroup(body, {
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
