import { computed, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { useModelStore } from '@/stores/model';
import { useRoute } from 'vue-router';
import { useBTSDetail, useGetImage2D, useGetInventory } from '@/services/hooks/useBTS';
import type { Image2D, Inventory } from '@/services/apis/bts';

export const useInitial = () => {
  const modelStore = useModelStore();

  const route = useRoute();

  const { data: dataDetail } = useBTSDetail(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );

  const { data: dataInventory } = useGetInventory(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );

  const { data: dataImage2D } = useGetImage2D(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );

  const resetState = () => {
    modelStore.currentMeasurement = undefined;
    modelStore.measurements = [];
    modelStore.activeTool = undefined;
    modelStore.selectedInventory = undefined;
    modelStore.selectedImage = undefined;
  };

  watch(
    () => route.query.id,
    () => {
      resetState();
    },
  );

  const onMeasurementAdded = (e: any) => {
    modelStore.currentMeasurement = e.measurement;
    e.measurement.icon = Potree.Utils.getMeasurementIcon(e.measurement);
    modelStore.measurements.push(e.measurement);
  };

  const addCameraToScene = (image2D: Image2D) => {
    const data = image2D.cameraPose;
    const camCenter = JSON.parse(data.camCent);
    const eulerAngle = JSON.parse(data.eulerAngle);
    const position = new THREE.Vector3(...camCenter);
    const rotation = new THREE.Euler(
      THREE.MathUtils.degToRad(eulerAngle[0]),
      THREE.MathUtils.degToRad(eulerAngle[1]),
      THREE.MathUtils.degToRad(eulerAngle[2]),
      'XYZ',
    );

    // Create a box to represent orientation
    const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    // Set position and rotation
    box.position.copy(position);
    box.rotation.copy(rotation);

    box.userData = {
      data: image2D,
      type: 'camera_pose',
    };

    // Add to scene
    window.potreeViewer.scene.scene.add(box);
  };

  const loadInventory = () => {
    const boxMeshs =
      dataInventory.value?.data?.map((object) => {
        const vertices = JSON.parse(object.vertices);
        // Define vertices of the Antenna
        const antennaVertices = vertices.map(
          (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
        );

        // Compute bounding box
        const box = new THREE.Box3().setFromPoints(antennaVertices);

        // Create geometry for the bounding box
        const boxSize = box.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);

        // Create a material with transparency
        const boxMaterial = new THREE.MeshBasicMaterial({
          color: 0x83bb95,
          opacity: 0.3, // Độ trong suốt
          transparent: true, // Bật chế độ trong suốt
          depthWrite: false, // Ngăn chặn việc ghi vào buffer độ sâu
          side: THREE.DoubleSide, // Hiển thị cả hai mặt
        });

        // Create the bounding box mesh
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

        // Set the position of the bounding box
        const boxCenter = box.getCenter(new THREE.Vector3());
        boxMesh.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

        boxMesh.userData = {
          type: 'inventory',
          boxCenter,
          object,
        };

        window.potreeViewer.scene.scene.add(boxMesh);

        // Create and configure Potree.BoxVolume
        const volume = new Potree.BoxVolume();

        // Set the position to the center of the bounding box
        volume.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

        // Set the scale to the size of the bounding box
        volume.scale.set(boxSize.x, boxSize.y, boxSize.z); // Convert vertices to THREE.Vector3
        // Thêm volume vào cảnh
        volume.visible = false;
        window.potreeViewer.scene.addVolume(volume);

        return {
          id: object.id,
          boxMesh,
          volume,
        };
      }) || [];

    modelStore.objectGroup = dataInventory.value?.data?.reduce((acc: any, object: Inventory) => {
      if (!acc[object.name]) {
        acc[object.name] = [];
      }
      acc[object.name].push({
        ...object,
        boxMesh: boxMeshs?.find((elem) => elem.id === object.id)?.boxMesh,
        volume: boxMeshs?.find((elem) => elem.id === object.id)?.volume,
        visibleMesh: true,
        visible: true,
      });
      return acc;
    }, {});
  };

  onMounted(() => {
    modelStore.loadingModel = true;
    const viewerElement = document.getElementById('potree_render_area');
    if (!viewerElement) return;
    window.potreeViewer = new Potree.Viewer(viewerElement);

    window.potreeViewer.setEDLEnabled(true);
    window.potreeViewer.setFOV(60);
    window.potreeViewer.loadSettingsFromURL();
    window.potreeViewer.setBackground('black');
    window.potreeViewer.setPointBudget(1_000_000);
    window.potreeViewer.useHQ = true;
    window.potreeViewer.compass.setVisible(true);

    window.potreeViewer.scene.addEventListener('measurement_added', onMeasurementAdded);
  });
  resetState();

  let loaded = false;

  watch([dataDetail, dataInventory, dataImage2D], () => {
    if (dataDetail.value && dataInventory.value && dataImage2D.value && !loaded) {
      loaded = true;
      loadInventory();

      Potree.loadPointCloud(
        dataDetail.value?.data?.modelLink,
        dataDetail.value?.data?.station,
        (e: any) => {
          const scene = window.potreeViewer.scene;
          const pointCloud = e.pointcloud;

          // Thêm pointCloud vào cảnh
          scene.addPointCloud(pointCloud);

          const material = e.pointcloud.material;
          material.size = 1;

          // Cài đặt camera
          scene.view.yaw = 0;
          scene.view.pitch = 0;
          window.potreeViewer.fitToScreen(0.6);

          // Set clip task
          window.potreeViewer.setClipTask(Potree.ClipTask.SHOW_OUTSIDE);

          modelStore.loadingModel = false;
        },
      );

      dataImage2D.value?.data.forEach((item) => {
        addCameraToScene(item);
      });
    }
  });
};
