<template>
  <a-drawer
    :open="open"
    :title="'Xuất style'"
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
        name="layer_name"
        :label="'Tên layer'"
        :rules="[{ required: true, message: 'Nhập tên layer' }]"
      >
        <a-input
          v-model:value="formState.layer_name"
          allow-clear
          :placeholder="'Nhập tên layer'"
          data-test="name"
        />
      </a-form-item>


      <a-form-item
        name="user_style_name"
        :label="'Tên User Style'"
        :rules="[{ required: true, message: 'Nhập tên user style' }]"
      >
        <a-input
          v-model:value="formState.user_style_name"
          allow-clear
          :placeholder="'Nhập tên User Style'"
          data-test="name"
        />
      </a-form-item>


      <a-form-item
        name="property_name"
        :label="'Tên cột để đánh style'"
        :rules="[{ required: true, message: 'Nhập tên cột để đánh style' }]"
      >
        <a-input
          v-model:value="formState.property_name"
          allow-clear
          :placeholder="'Nhập tên cột để đánh style'"
          data-test="name"
        />
      </a-form-item>



      <a-form-item
        name="style_type"
        :label="'Kiểu style'"
        :rules="[{ required: true }]"
      >
        <a-select
          v-model:value="formState.style_type"
          :options="[
            {
              label: 'polygon',
              value: 'polygon',
            }
          ]"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row justify-end gap-x-4">
        <a-button
          @click="close"
          id="cancel-create-field"
        >
          {{ $t('cancel') }}
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleFinish"
          id="submit-field"
        >
          {{ "Xuất Style" }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import type { AILabel } from '@/services/apis/aiLabel';
import { reactive, watch } from 'vue';

const props = defineProps<
  {
    close: () => void;
    labels: AILabel[];
    categorySlug: string;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const formState = reactive({
  layer_name: "",
  user_style_name: "",
  property_name: "",
  style_type: "polygon"
});


// TODO:watch props
watch(
  () => props.open,
  () => {
    formState.layer_name = props.categorySlug + '_style';
    formState.user_style_name = props.categorySlug;
    formState.property_name = "ai_label_id";
    formState.property_name = "ai_label_id";
    formState.style_type = "polygon";
  },
);
const handleFinish = () => {
  const styleData = convertData();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
              <StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
                <NamedLayer>
                  <se:Name>${styleData.layer_name}</se:Name>
                  <UserStyle>
                    <se:Name>${styleData.user_name}</se:Name>
                    <se:FeatureTypeStyle>`;
  styleData.rule.forEach((ruleItem :any)=> {
          xml += `<se:Rule>
                    <se:Name>${ruleItem.name}</se:Name>
                    <se:Description>
                      <se:Title>${ruleItem.description}</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                      <ogc:PropertyIsEqualTo>
                        <ogc:PropertyName>${ruleItem.filter.propertyName}</ogc:PropertyName>
                        <ogc:Literal>${ruleItem.filter.literal}</ogc:Literal>
                      </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                      <se:Fill>
                        <se:SvgParameter name="fill">${ruleItem.value}</se:SvgParameter>
                      </se:Fill>
                    </se:PolygonSymbolizer>
                  </se:Rule>`})
      xml += `</se:FeatureTypeStyle>
        </UserStyle>
      </NamedLayer>
    </StyledLayerDescriptor>`;
  //console.log("xmlString", xml);

  // Download xml file
  const link = document.createElement('a');
  link.href = 'data:text/xml;charset=UTF-8,' + encodeURIComponent(xml);
  link.download = formState.layer_name + '_style.xml';
  link.click();

}

// TODO: Convert labels data to style Data
const convertData = () => {
 return {
    layer_name: formState.layer_name,
    user_name: formState.user_style_name,
    rule: props.labels.map((item: AILabel) => {
      return {
        name: item.name,
        description: item.name,
        filter: {
          propertyName: formState.property_name,
          literal: item.id,
        },
        type: formState.style_type,
        value: item.color,
      }
    })
  };
}

// TODO: export style

/*const exportStyle = () => {
  const styleData = convertData(labels.value)
  console.log("styleData", styleData);

  const layer_name = "ai_lulc_result_102";
  const property_name = "covers_id"

  console.log("labels", labels.value)


  // Download xml file
  const link = document.createElement('a');
  link.href = 'data:text/xml;charset=UTF-8,' + encodeURIComponent(formattedXml);
  link.download = 'SLD_XML.xml';
  link.click();
}*/
</script>
