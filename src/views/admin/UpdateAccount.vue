<template>
  <img
    src="/images/admin/profile.png"
    alt="background-update-account-image"
    class="w-full"
  />
  <div class="relative bg-white">
    <div
      class="absolute top-0 z-10"
      style="margin-top: -106px; margin-left: 120px"
    >
      <a-avatar
        :size="200"
        class="border-4 border-solid border-white"
      >
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </div>
    <div style="margin-left: 350px; margin-right: 200px">
      <a-typography-title
        class="pt-4"
        style="margin-bottom: 14px"
      >
        {{ profileData?.data.name }}
      </a-typography-title>
      <a-typography-text>
        {{ profileData?.data?.profile?.title?.name }}
      </a-typography-text>
      <a-tabs
        v-model:activeKey="activeKey"
        class="mt-4"
      >
        <a-tab-pane
          key="1"
          tab="Thông tin cơ bản"
          class="mt-4"
        >
          <a-form
            ref="formRefProfile"
            :model="formStateProfile"
            layout="vertical"
            @finish="handleFinishUpdateProfile"
          >
            <a-row :gutter="[16, 32]">
              <a-col :span="12">
                <a-form-item
                  name="name"
                  label="Họ tên"
                >
                  <a-input
                    v-model:value="formStateProfile.name"
                    :allow-clear="true"
                    placeholder="Nhập tên"
                  />
                </a-form-item>
                <a-form-item
                  name="username"
                  label="Tên tài khoản"
                >
                  <a-input
                    v-model:value="formStateProfile.username"
                    readonly
                  />
                </a-form-item>
                <a-form-item
                  label="Đơn vị"
                  name="unitName"
                >
                  <a-input
                    v-model:value="formStateProfile.unitName"
                    class="w-full"
                    readonly
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Chức danh"
                  name="titleName"
                >
                  <a-input
                    v-model:value="formStateProfile.titleName"
                    class="w-full"
                    readonly
                  />
                </a-form-item>
                <a-form-item
                  label="Vai trò"
                  name="roleName"
                >
                  <a-input
                    v-model:value="formStateProfile.roleName"
                    class="w-full"
                    readonly
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <div class="flex flex-row justify-end gap-x-4">
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="isUpdating"
                >
                  Lưu lại
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="Thông tin liên hệ"
          force-render
        >
          <a-form
            ref="formRefProfile"
            :model="formStateProfile"
            layout="vertical"
            @finish="handleFinishUpdateProfile"
          >
            <a-row :gutter="[16, 32]">
              <a-col :span="12">
                <a-form-item
                  name="email"
                  label="Email"
                  :rules="[{ type: 'email', message: 'Email không đúng định dạng' }]"
                >
                  <a-input
                    :allow-clear="true"
                    v-model:value="formStateProfile.email"
                    :maxlength="100"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Số điện thoại"
                  name="phone"
                >
                  <a-input
                    v-model:value="formStateProfile.phone"
                    class="w-full"
                    :allow-clear="true"
                    :maxlength="12"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <div class="flex flex-row justify-end gap-x-4">
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="isUpdating"
                >
                  Lưu lại
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="3"
          tab="Đổi mật khẩu"
        >
          <a-form
            ref="formRef"
            :model="formState"
            layout="vertical"
            @finish="handleFinish"
            :rules="rules"
          >
            <a-form-item
              label="Mật khẩu hiện tại"
              name="currentPassword"
            >
              <a-input-password
                v-model:value="formState.currentPassword"
                autocomplete="off"
                :allow-clear="true"
              />
            </a-form-item>
            <a-form-item
              has-feedback
              label="Mật khẩu"
              name="pass"
            >
              <a-input-password
                v-model:value="formState.pass"
                autocomplete="off"
                :allow-clear="true"
              />
            </a-form-item>
            <a-form-item
              has-feedback
              label="Nhâp lại mật khẩu"
              name="checkPass"
            >
              <a-input-password
                v-model:value="formState.checkPass"
                autocomplete="off"
                :allow-clear="true"
              />
            </a-form-item>
            <a-form-item>
              <div class="flex flex-row justify-end gap-x-4">
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="isUpdatingPassword"
                >
                  Xác nhận
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { UnwrapRef } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { Rule } from 'ant-design-vue/es/form';
import { AntDesignOutlined } from '@ant-design/icons-vue';
import {
  PROFILE_QUERY_KEY,
  useChangePassword,
  useProfile,
  useUpdateProfile,
} from '@/services/hooks/useUser';

type FormStateProfile = {
  name?: string;
  phone?: string;
  email?: string;
  username?: string;
  unitName?: string;
  titleName?: string;
  roleName?: string;
};

interface FormState {
  currentPassword?: string;
  pass: string;
  checkPass: string;
}

const formStateProfile: UnwrapRef<FormStateProfile> = reactive({});
const formState: UnwrapRef<FormState> = reactive({
  pass: '',
  checkPass: '',
});
const { data: profileData } = useProfile();
const { mutate: updatePassword, isPending: isUpdatingPassword } = useChangePassword();

watch(profileData, () => {
  formStateProfile.name = profileData.value?.data.name;
  formStateProfile.phone = profileData.value?.data.profile?.phone;
  formStateProfile.email = profileData.value?.data.email;
  formStateProfile.username = profileData.value?.data.username;
  formStateProfile.unitName = profileData.value?.data.profile?.unit?.name;
  formStateProfile.titleName = profileData.value?.data.profile?.title?.name;
  formStateProfile.roleName = profileData.value?.data.roles
    ? profileData.value?.data.roles[0].name
    : undefined;
});

const formRef = ref();
const activeKey = ref('1');

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Vui lòng nhập mật khẩu');
  } else {
    if (formState.checkPass !== '') {
      formRef?.value?.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Vui lòng nhập lại mật khẩu');
  } else if (value !== formState.pass) {
    return Promise.reject('Mật khẩu không trùng khớp!');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  currentPassword: [
    { required: true, trigger: 'change', message: 'Vui lòng nhập mật khẩu hiện tại' },
  ],
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
};

const formRefProfile = ref();

const { mutate: updateUser, isPending: isUpdating } = useUpdateProfile();
const { onError } = useErrorHandler();
const queryClient = useQueryClient();
const { handleSuccess } = useSuccessHandler();

const handleFinishUpdateProfile = () => {
  formRefProfile.value.validate().then(() => {
    updateUser(
      {
        name: formStateProfile.name,
        email: formStateProfile.email,
        phone: formStateProfile.phone,
      },
      {
        onSuccess(data) {
          handleSuccess(data);
          queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
        },
        onError,
      },
    );
  });
};

const onCancelUpdatePassword = () => {
  formRef.value.resetFields();
};

const handleFinish = (values: FormState) => {
  formRef.value.validate().then(() => {
    updatePassword(
      {
        newPassword: values.pass,
        confirmPassword: values.pass,
        oldPassword: values.currentPassword || '',
      },
      {
        onSuccess(data) {
          handleSuccess(data);
          onCancelUpdatePassword();
        },
        onError,
      },
    );
  });
};
</script>
