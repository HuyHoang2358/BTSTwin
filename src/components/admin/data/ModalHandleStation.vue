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
        name="name"
        :label="t('admin.station.name')"
        :rules="[{ required: true, message: t('admin.station.form.inputName') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.station.form.placeholderName')"
        />
      </a-form-item>

      <a-form-item
        name="code"
        :label="t('admin.station.code')"
        :rules="[{ required: true, message: t('admin.station.form.inputCode') }]"
        class="my-1"
      >
        <a-input
          v-model:value="formState.code"
          :allow-clear="true"
          :maxlength="100"
          :placeholder="t('admin.station.form.placeholderCode')"
        />
      </a-form-item>
<!-- location -->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="location_longitude"
            :label="t('admin.station.longitude')"
            :rules="[{ required: false, message: t('admin.station.form.inputLocationLongitude') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.location_longitude"
              :allow-clear="true"
              :maxlength="100"
              class="w-full"
              :placeholder="t('admin.station.form.placeholderLocationLongitude')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="location_latitude"
            :label="t('admin.station.latitude')"
            :rules="[{ required: false, message: t('admin.station.form.inputLocationLatitude') }]"
            class="my-1"
          >
            <a-input-number
              v-model:value="formState.location_latitude"
              :allow-clear="true"
              :maxlength="100"
              class="w-full"
              :placeholder="t('admin.station.form.placeholderLocationLatitude')"
            />
          </a-form-item>
        </a-col>
      </a-row>
<!-- address -->
      <a-row :gutter="16">
  <!-- Address Country -->
        <a-col :span="12">
          <a-form-item
            name="address_country_id"
            :label="t('address.country.name')"
            :rules="[{ required: true, message: t('address.country.form.selectName') }]"
            class="my-1"
          >
            <a-select
              v-model:value="formState.address_country_id"
              :placeholder="t('address.country.form.placeholderName')"
              :options="countryOptions"
            />
          </a-form-item>
        </a-col>
  <!-- Address Province -->
        <a-col :span="12">
          <a-form-item
            name="address_province_id"
            :label="t('address.province.name')"
            :rules="[{ required: true, message: t('address.province.form.selectName') }]"
            class="my-1"
          >
            <a-select
              v-model:value="formState.address_province_id"
              :allow-clear="true"
              :placeholder="t('address.province.form.placeholderName')"
              :options="provinceOptions"
              :loading="isLoadingProvince"
              show-search
              :filter-option="filterOption"
            />
          </a-form-item>
        </a-col>
  <!-- Address District -->
        <a-col :span="12">
          <a-form-item
            name="address_district_id"
            :label="t('address.district.name')"
            :rules="[{ required: true, message: t('address.district.form.selectName') }]"
            class="my-1"
          >
            <a-select
              v-model:value="formState.address_district_id"
              :allow-clear="true"
              :placeholder="t('address.district.form.placeholderName')"
              :options="districtOptions"
              :loading="isLoadingDistricts"
              show-search
              :filter-option="filterOption"
            />
          </a-form-item>
        </a-col>
  <!-- Address Commune -->
        <a-col :span="12">
          <a-form-item
            name="address_commune_id"
            :label="t('address.commune.name')"
            :rules="[{ required: true, message: t('address.commune.form.selectName') }]"
            class="my-1"
          >
            <a-select
              v-model:value="formState.address_commune_id"
              :allow-clear="true"
              :placeholder="t('address.commune.form.placeholderName')"
              :options="communeOptions"
              :loading="isLoadingCommunes"
              show-search
              :filter-option="filterOption"
            />
          </a-form-item>
        </a-col>
  <!-- Address detail -->
        <a-col :span="24">
          <a-form-item
            name=""
            :label="t('address.street.name')"
            :rules="[{ required: false, message: t('address.street.form.inputStreet') }]"
            class="my-1"
          >
            <a-input
              v-model:value="formState.address_detail"
              :allow-clear="true"
              :maxlength="100"
              :placeholder="t('address.street.form.placeholderStreet')"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        name="description"
        :label="$t('admin.device.description')"
        :rules="[{ required: false, message: $t('admin.device.form.inputDescription') }]"
      >
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('admin.device.form.placeholderDescription')"
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
import { ref, reactive, computed } from 'vue';
import { type FormInstance} from 'ant-design-vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';
import { compareString } from '@/utils/helpers';
import { useMutationDeviceSuccess } from '@/services/hooks/useDevice';
import type { Station, StationData } from '@/services/apis/station';
import { useCreateStation, useUpdateStation } from '@/services/hooks/useStation';
import {
  useAddressCommunes,
  useAddressCountries,
  useAddressDistricts,
  useAddressProvinces
} from '@/services/hooks/useAddress';
import type { Country, Province, District, Commune } from '@/services/apis/address';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentStation?: Station;
}>();

// TODO handle Form
type StationForm = {
  id?: string;
} & Partial<StationData>  ;

const formRef = ref<FormInstance>();

const formState = reactive<StationForm>({});

const isUpdate = computed(() => !!props?.currentStation);
const title = computed(() => (isUpdate.value ? 'Cập nhật thông tin' : 'Thêm mới trạm'));
const buttonTitle = computed(() => (isUpdate.value ? 'Cập nhật' : 'Thêm mới'));

const { t } = useI18n();
const { mutate: createStation, isPending: isCreating } = useCreateStation();
const { mutate: updateStation, isPending: isUpdating } = useUpdateStation();
const { invalidateQueries } = useMutationDeviceSuccess();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

watch(
  () => props.open,
  () => {
    console.log("currentStation", props.currentStation)
    formState.name = props.currentStation?.name || undefined;
    formState.code = props.currentStation?.code || undefined;
    formState.location_latitude = props.currentStation?.location?.latitude || undefined;
    formState.location_longitude = props.currentStation?.location?.longitude || undefined;
    formState.location_height = props.currentStation?.location?.height || undefined;
    formState.address_detail = props.currentStation?.address?.detail || undefined;
    formState.address_country_id = props.currentStation?.address?.country?.id || 1;
    formState.address_province_id = props.currentStation?.address?.province?.id || undefined;
    formState.address_district_id = props.currentStation?.address?.district?.id || undefined;
    formState.address_commune_id = props.currentStation?.address?.commune?.id || undefined;
    formState.description = props.currentStation?.description || undefined;


    selectionCountryId.value = formState.address_country_id?.toString() || '';
    selectionProvinceId.value = formState.address_province_id?.toString() || '';
    selectionDistrictId.value = formState.address_district_id?.toString() || '';


  },
);

// TODO: fetch data

const selectionCountryId = ref<string>("1");
const selectionProvinceId = ref<string>("");
const selectionDistrictId = ref<string>("");
const {data: dataCountries} = useAddressCountries();
const { data: dataProvinces, isLoading: isLoadingProvince, refetch: refetchProvinces } = useAddressProvinces(selectionCountryId);
const { data: dataDistricts, isLoading: isLoadingDistricts, refetch: refetchDistricts } = useAddressDistricts(selectionProvinceId);
const { data: dataCommunes, isLoading: isLoadingCommunes, refetch: refetchCommunes } = useAddressCommunes(selectionDistrictId);

const countryOptions = computed(
  () =>
    dataCountries?.value?.data?.map((i:Country) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id,
      };
    }) || [],
);

watch(
  () => formState.address_country_id,
  () => {
    console.log("change country", formState.address_country_id);
    if (formState.address_country_id?.toString() !== selectionCountryId.value) {
      selectionCountryId.value = formState.address_country_id?.toString() || '';
      selectionProvinceId.value = "";
      selectionDistrictId.value = "";
      refetchProvinces();
      refetchDistricts();
      refetchCommunes();
    }
  },
);


watch(
  () => formState.address_province_id,
  () => {
    console.log("change province", formState.address_province_id);
    if (selectionProvinceId.value !== formState.address_province_id?.toString()) {
      selectionProvinceId.value = formState.address_province_id?.toString() || '';
      formState.address_district_id = undefined;
      formState.address_commune_id = undefined;
      selectionDistrictId.value = "";
      refetchDistricts();
      refetchCommunes();
    }
  },
);

watch(
  () => formState.address_district_id,
  () => {
    console.log("change district", formState.address_district_id);
    if(selectionDistrictId.value !== formState.address_district_id?.toString()){
      selectionDistrictId.value = formState.address_district_id?.toString() || '';
      formState.address_commune_id = undefined;
      refetchCommunes();
    }
  },
);



const provinceOptions = computed(
  () =>
    dataProvinces?.value?.data?.map((i:Province) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id,
      };
    }) || [],
);

const districtOptions = computed(
  () =>
    dataDistricts?.value?.data?.map((i:District) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id,
      };
    }) || [],
);

const communeOptions = computed(
  () =>
    dataCommunes?.value?.data?.map((i:Commune) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id,
      };
    }) || [],
);

// TODO: submit form
const handleFinish = () => {
  console.log(formState)
  formRef.value?.validate().then(() => {
    const data: StationData = {
      name: formState.name ?? null,
      code: formState.name ?? null,
      description: formState.description ?? '',
      location_latitude: formState.location_latitude ?? null,
      location_longitude: formState.location_longitude ?? null,
      location_height: formState.location_height ?? 0,
      address_detail: formState.address_detail ?? '',
      address_country_id: formState.address_country_id ?? null,
      address_province_id: formState.address_province_id ?? null,
      address_district_id: formState.address_district_id ?? null,
      address_commune_id: formState.address_commune_id ?? null,
    };
    console.log("data", data);
    if (isUpdate.value && props?.currentStation?.id) {
      updateStation(
        {
          ...data,
          id: props?.currentStation?.id,
        },
        {
          onError,
          onSuccess: (data) => {
            invalidateQueries();
            props.close();
            handleSuccess(data);
          },
        },
      );
      return;
    }

    createStation(data, {
      onError,
      onSuccess: (data) => {
        invalidateQueries();
        props.close();
        handleSuccess(data);
      },
    });
  });
};

// TODO: filter option in select
const filterOption = (input: string, option: any) => {
  return compareString(option.label, input)
};

</script>
