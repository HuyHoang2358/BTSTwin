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
        name="username"
        :label="t('accountName')"
        :rules="[
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản',
          },
        ]"
      >
        <a-input
          v-model:value="formState.username"
          :allow-clear="true"
          :maxlength="100"
          placeholder="Nhập tên tài khoản"
        />
      </a-form-item>
      <a-form-item
        label="Mật khẩu"
        v-if="!isUpdate"
      >
        <a-input-password
          value="123456aA@"
          readonly
        />
      </a-form-item>
      <a-form-item
        name="email"
        label="Email"
        :rules="[{ type: 'email', message: 'Email không đúng định dạng' }]"
      >
        <a-input
          :allow-clear="true"
          v-model:value="formState.email"
          :maxlength="100"
          placeholder="Nhập email"
        />
      </a-form-item>
      <a-form-item
        label="Số điện thoại"
        name="phone"
      >
        <a-input
          v-model:value="formState.phone"
          class="w-full"
          :allow-clear="true"
          :maxlength="12"
          placeholder="Nhập số điện thoại"
        />
      </a-form-item>
      <a-form-item
        name="titleId"
        label="Chức danh"
        :rules="[
          {
            required: true,
            message: 'Vui lòng chọn chức danh',
          },
        ]"
      >
        <a-select
          v-model:value="formState.titleId"
          :options="positionOptions"
          :allow-clear="true"
          placeholder="Chọn chức danh"
        />
      </a-form-item>
      <a-form-item
        name="unitId"
        label="Đơn vị"
        :rules="[
          {
            required: true,
            message: 'Vui lòng chọn đơn vị',
          },
        ]"
      >
        <a-tree-select
          v-model:value="formState.unitId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          allow-clear
          tree-default-expand-all
          :tree-data="unitOptions"
          tree-node-filter-prop="label"
          placeholder="Chọn đơn vị"
        />
      </a-form-item>
      <a-form-item
        name="roleId"
        label="Vai trò"
        :rules="[
          {
            required: true,
            message: 'Vui lòng chọn vai trò',
          },
        ]"
      >
        <a-select
          :options="roleOptions"
          :allow-clear="true"
          v-model:value="formState.roleId"
          placeholder="Chọn vai trò"
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
import { ref, reactive, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import type { User, UserData } from '@/services/apis/user';
import { useCreateUser, useMutationUserSuccess, useUpdateUser } from '@/services/hooks/useUser';
import { useUnitTree } from '@/services/hooks/useUnit';
import type { OptionType } from '@/utils/types';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentUser?: User;
  roleOptions: OptionType[];
  positionOptions: OptionType[];
}>();

type UserForm = {
  roleId?: string;
} & Partial<UserData>;

const formRef = ref<FormInstance>();

const formState = reactive<UserForm>({});

const isUpdate = computed(() => Boolean(props.currentUser));
const title = computed(() => (isUpdate.value ? 'Cập nhật người dùng' : 'Thêm mới người dùng'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { data: units } = useUnitTree();
const { mutate: createUser, isPending: isCreating } = useCreateUser();
const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
const { invalidateQueries } = useMutationUserSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const unitOptions = computed(() => units?.value?.data || []);

watch(
  () => props.open,
  () => {
    formState.username = props.currentUser?.username || undefined;
    formState.email = props.currentUser?.email || undefined;
    formState.phone = props.currentUser?.profile?.phone || undefined;
    formState.titleId = props.currentUser?.profile?.title?.id?.toString() || undefined;
    formState.unitId = props.currentUser?.profile?.unit?.id?.toString() || undefined;
    formState.roleId = props.currentUser?.roles
      ? props.currentUser?.roles[0].id?.toString()
      : undefined;
  },
);

const handleFinish = () => {
  formRef.value?.validate().then(() => {
    const data: UserData = {
      roleIds: [Number(formState.roleId)],
      email: formState.email as string,
      phone: formState.phone as string,
      titleId: formState.titleId?.toString() as string,
      unitId: formState.unitId?.toString() as string,
      username: formState.username as string,
    };

    if (isUpdate.value) {
      if (!props.currentUser?.id) {
        return;
      }
      updateUser(
        {
          ...data,
          id: props.currentUser?.id,
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
      return;
    }

    createUser(data, {
      onSuccess(data) {
        invalidateQueries();
        props.close();
        handleSuccess(data);
      },
      onError,
    });
  });
};
</script>
