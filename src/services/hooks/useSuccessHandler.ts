import { notification } from 'ant-design-vue';

export const useSuccessHandler = () => {
  function handleSuccess(data: unknown) {
    const dataAsType = data as {
      data: {
        message: string;
      };
      message: string;
    };

    const messageSever = dataAsType?.data?.message || dataAsType?.message;

    notification.success({
      message: 'Thành công',
      description: messageSever,
      placement: 'top',
    });
  }

  return {
    handleSuccess,
  };
};
