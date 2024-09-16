import { AI_FORM, AI_FUNCTION, AI_REQUESTS, FIELD_SLUG } from '@/utils/enums';

export type ColumnType = {
  title: string;
  dataIndex: string;
  key?: string;
};

export type OptionType = {
  label: string;
  text?: string;
  value: number | string;
};

export type AIFunctionType = Record<
  FIELD_SLUG,
  Record<
    AI_FUNCTION,
    Record<
      AI_REQUESTS,
      Record<
        AI_FORM,
        {
          required: boolean;
          placeholder?: string;
        }
      >
    >
  >
>;
