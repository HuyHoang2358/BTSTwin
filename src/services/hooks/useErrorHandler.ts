import { AxiosError } from 'axios';
import { message, notification } from 'ant-design-vue';

export const useErrorHandler = () => {
  function onError(error: unknown) {
    const errorAsType = error as AxiosError<{ message: string, errors: any }>;
    console.log("errorAsType", errorAsType);
    console.log("error", error);
    if (errorAsType?.status === 422) {
      const errors = errorAsType?.response?.data?.errors || [];
      for (const key in errors) {
        notification.error({
          message: errorAsType?.response?.data?.message || errorAsType?.message,
          description: errors[key]?.join(','),
          placement: 'top',
        });
      }
    } else{
      notification.error({
        message: 'Thất bại',
        description: errorAsType?.response?.data?.message || errorAsType?.message,
        placement: 'top',
      });
    }
  }

  async function handleMessageError(error: unknown) {
    const errorAsType = error as AxiosError<{ msg: string }>;
    message.error({
      content: errorAsType?.response?.data?.msg || errorAsType?.message,
    });
  }

  return {
    onError,
    handleMessageError,
  };
};
