<template>
  <div
    class="w-[285px] bg-[#303030] overflow-auto flex flex-col"
    style="height: calc(100vh - 84px)"
  >
    <HeaderInformation
      title="Thông tin đo lường"
      :on-close="() => (modelStore.selectedMeasurement = undefined)"
    />
    <div class="p-3 flex flex-col">
      <div class="flex row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <img
            :src="modelStore.selectedMeasurement.icon"
            class="w-6 h-6"
            alt="tool"
          />
          <a-typography-paragraph
            v-model:content="editableStr"
            :editable="{ triggerType: !editableStr ? ['icon'] : ['text'], onEnd: onEndEditing }"
            style="margin-bottom: 0; margin-left: 12px"
            class="text-base"
          >
            <template #editableTooltip>Click để sửa tên</template>
          </a-typography-paragraph>
        </div>
        <a-button
          @click="onRemoveMeasurement"
          class="p-0 m-0 border-none bg-transparent flex items-center"
        >
          <IconRemove />
        </a-button>
      </div>
      <a-typography-text class="text-[14px] font-medium mt-4">Đo lường chi tiết</a-typography-text>
      <div v-if="type === 'distance'">
        <div class="flex flex-row mt-2">
          <div class="w-1/3">
            <a-typography>Khoảng cách:</a-typography>
          </div>
          <div class="w-2/3">
            <a-typography
              v-for="(item, index) in distancesRef"
              :key="index"
            >
              {{ item }}
            </a-typography>
          </div>
        </div>
        <MeasurementDetail
          label="Tổng độ dài:"
          :value="totalDistance"
        />
      </div>
      <div v-if="type === 'area'">
        <MeasurementDetail
          label="Diện tích"
          :value="area"
        />
      </div>
      <div v-if="type === 'angle'">
        <MeasurementDetail
          label="Góc α"
          :value="anglesRef[0]"
        />
        <MeasurementDetail
          label="Góc β"
          :value="anglesRef[1]"
        />
        <MeasurementDetail
          label="Góc γ"
          :value="anglesRef[2]"
        />
      </div>
      <div v-if="type === 'tilt'">
        <MeasurementDetail
          label="Góc tilt"
          :value="tilt"
        />
      </div>
      <div v-if="type === 'azimuth'">
        <MeasurementDetail
          label="Góc azimuth"
          :value="txtAzimuth"
        />
      </div>
      <div v-if="type === 'circle'">
        <MeasurementDetail
          label="Bán kính"
          :value="txtRadius"
        />
        <MeasurementDetail
          label="Chu vi"
          :value="txtCircumference"
        />
      </div>
      <a-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        class="mt-2.5"
      >
        <a-form-item
          name="description"
          class="mb-2"
          label="Mô tả"
        >
          <a-textarea
            v-model:value="formState.description"
            placeholder="Nhập mô tả"
            :allow-clear="true"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, toRaw, type UnwrapRef, watch } from 'vue';
import { useModelStore } from '@/stores/model';
import { radToDeg } from 'three/src/math/MathUtils';
import IconRemove from '@/components/icon/IconRemove.vue';
import HeaderInformation from '@/components/HeaderInformation.vue';
import MeasurementDetail from '@/components/MeasurementDetail.vue';

interface FormState {
  description?: string;
}

const modelStore = useModelStore();

const editableStr = ref(modelStore.selectedMeasurement.name || '');

const distancesRef = ref<string[]>([]);
const anglesRef = ref<string[]>([]);
const totalDistance = ref('');
const area = ref('');
const tilt = ref('');
const type = ref('');
const txtAzimuth = ref('');
const txtRadius = ref('');
const txtCircumference = ref('');
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({});

watch(
  () => modelStore.selectedMeasurement,
  () => {
    editableStr.value = modelStore.selectedMeasurement?.name || '';
    formState.description = '';
    type.value = '';
  },
);

const onRemoveMeasurement = () => {
  const potreeSelectedMeasurement = window.potreeViewer.scene.measurements.find(
    (item: any) => item.uuid === modelStore.selectedMeasurement.uuid,
  );
  window.potreeViewer.scene.removeMeasurement(toRaw(potreeSelectedMeasurement));

  modelStore.measurements = modelStore.measurements.filter(
    (item) => item.uuid !== modelStore.selectedMeasurement.uuid,
  );
  modelStore.selectedMeasurement = undefined;
};

const onUpdate = (e: any) => {
  const measurements = e.target.scene.measurements;
  const measurement = measurements.find(
    (item: any) => item.uuid === modelStore.selectedMeasurement?.uuid,
  );
  if (!measurement) {
    type.value = '';
    return;
  }
  if (measurement.showDistances && !measurement.showArea && !measurement.showAngles) {
    type.value = 'distance';
    let positions = measurement.points.map((p: any) => p.position);
    let distances = [];
    for (let i = 0; i < positions.length - 1; i++) {
      let d = positions[i].distanceTo(positions[i + 1]);
      distances.push((d * modelStore.gpsRatio).toFixed(3) + 'm');
    }

    distancesRef.value = distances;
    totalDistance.value = (measurement.getTotalDistance() * modelStore.gpsRatio).toFixed(3) + 'm';
  } else if (measurement.showDistances && measurement.showArea && !measurement.showAngles) {
    type.value = 'area';
    area.value = (measurement.getArea() * modelStore.gpsRatio).toFixed(3) + 'm2';
  } else if (!measurement.showDistances && !measurement.showArea && measurement.showAngles) {
    if (measurement.points.length != 3) {
      return;
    }
    type.value = 'angle';
    let angles = [];
    for (let i = 0; i < measurement.points.length; i++) {
      angles.push(measurement.getAngle(i) * (180.0 / Math.PI));
    }
    anglesRef.value = angles.map((a) => a.toFixed(1) + '\u00B0');
  } else if (measurement.showHeight) {
    type.value = 'tilt';
    let sorted = measurement.points.slice().sort((a: any, b: any) => a.position.z - b.position.z);
    let highPoint = sorted[0].position.clone();
    let lowPoint = sorted[sorted.length - 1].position.clone();
    let min = lowPoint.z;
    let max = highPoint.z;
    let height = max - min;
    const a = Math.abs(height);
    const b = Math.abs(highPoint.x - lowPoint.x);

    const angleB = Math.atan(b / a) * (180 / Math.PI); // góc B

    tilt.value = !Number.isNaN(angleB) ? `${angleB.toFixed(2)}°` : '0°';
  } else if (measurement.showAzimuth) {
    type.value = 'azimuth';
    if (measurement.points.length != 2) {
      return;
    }
    const [p0, p1] = measurement.points;
    const radians = Potree.Utils.computeAzimuth(
      p0.position,
      p1.position,
      window.potreeViewer.getProjection(),
    );
    let degrees = radToDeg(radians);
    if (degrees < 0) {
      degrees = 360 + degrees;
    }
    txtAzimuth.value = `${degrees.toFixed(2)}°`;
  } else if (measurement.showCircle) {
    if (measurement.points.length !== 3) {
      return;
    }
    type.value = 'circle';

    const A = measurement.points[0].position;
    const B = measurement.points[1].position;
    const C = measurement.points[2].position;

    const center = Potree.Utils.computeCircleCenter(A, B, C);
    const radius = center.distanceTo(A);
    const circumference = 2 * Math.PI * radius;

    const format = (number: number) => {
      return Potree.Utils.addCommas(number.toFixed(3));
    };

    txtRadius.value = format(radius * modelStore.gpsRatio) + 'm';
    txtCircumference.value = format(circumference * modelStore.gpsRatio) + 'm';
  }
};

onMounted(() => {
  window.potreeViewer.addEventListener('update', onUpdate);
});

onUnmounted(() => {
  window.potreeViewer.removeEventListener('update', onUpdate);
});

const onEndEditing = () => {
  modelStore.measurements = modelStore.measurements.map((item) => {
    if (item.uuid === modelStore.selectedMeasurement.uuid) {
      console.log('have item', item);
      item.name = editableStr.value;
      return { ...item, name: editableStr.value };
    } else return item;
  });
  console.log('measurements', window.potreeViewer.scene.measurements);
};
</script>
