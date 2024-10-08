import { computed, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { useModelStore } from '@/stores/model';
import { useRoute } from 'vue-router';
import type { Inventory } from '@/services/apis/bts';
import {
  budgetPoint,
  EDL,
  EDLRadius,
  heightBasePlate,
  pointSizeValue,
  widthBasePlate,
} from '@/utils/constants';
import { useBTSDetail } from '@/services/hooks/useStation';
import type { Device, Image } from '@/services/apis/station';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ACTIVE_TOOL } from '@/utils/enums';

export type InventoryDetail = {
  boxMesh?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
  volume?: Potree.BoxVolume;
  visibleMesh: boolean;
  visible: boolean;
  clip: boolean;
  isNewDevice: boolean;
  newDevice?: any;
  x?: number;
  y?: number;
  z?: number;
} & Partial<Inventory>;

export const useInitial = () => {
  const modelStore = useModelStore();

  const route = useRoute();

  const { data: dataDetail } = useBTSDetail(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );

  const resetState = () => {
    modelStore.measurements = [];
    modelStore.activeTool = ACTIVE_TOOL.INVENTORY;
    modelStore.selectedMeasurement = undefined;
    modelStore.selectedInventory = undefined;
    modelStore.selectedImage = undefined;
    modelStore.selectedPole = undefined;
    modelStore.isSelectedBasePlate = false;
  };

  watch(
    () => route.query.id,
    () => {
      resetState();
    },
  );

  const onMeasurementAdded = (e: any) => {
    modelStore.hoverInformation = 'Nhấn chuột trái để thêm điểm, nhấn chuột phải để kết thúc đo';
    const measurement = e.measurement;
    const modelStoreListener = useModelStore();
    modelStoreListener.isDrawing = true;

    measurement.addEventListener('marker_dropped', () => {
      const modelStoreListener = useModelStore();

      if (
        (measurement.points.length === 3 && modelStoreListener.activeSubTool === 'angle') ||
        (measurement.points.length === 2 && modelStoreListener.activeSubTool === 'height') ||
        (measurement.points.length === 2 && modelStoreListener.activeSubTool === 'azimuth') ||
        (measurement.points.length === 3 && modelStoreListener.activeSubTool === 'circle')
      ) {
        setTimeout(() => {
          modelStoreListener.hoverInformation = '';
          modelStoreListener.activeSubTool = undefined;
          modelStoreListener.isDrawing = false;
        }, 100);
      }
    });

    measurement.addEventListener('marker_moved', () => {
      const modelStoreListener = useModelStore();
      modelStoreListener.isDrawing = true;
    });

    measurement.icon = Potree.Utils.getMeasurementIcon(measurement);
    if (modelStore.activeTool === ACTIVE_TOOL.MEASUREMENT) {
      modelStore.selectedMeasurement = measurement;
      modelStore.selectedInventory = undefined;
      modelStore.selectedPole = undefined;
      modelStore.isSelectedBasePlate = false;
    }
    modelStore.measurements.push(e.measurement);
  };

  const addCameraToScene = (image2D: Image) => {
    const data = image2D.camera_pose;
    const camCenter = JSON.parse(data.cent_point);
    const eulerAngle = JSON.parse(data.euler_angle);
    const position = new THREE.Vector3(...camCenter);
    const rotation = new THREE.Euler(
      eulerAngle[0] * THREE.MathUtils.DEG2RAD,
      eulerAngle[1] * THREE.MathUtils.DEG2RAD,
      eulerAngle[2] * THREE.MathUtils.DEG2RAD,
    );

    /* const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.copy(position);
    box.rotation.copy(rotation);

    box.userData = {
      data: image2D,
      type: 'camera_pose',
    };

    window.potreeViewer.scene.scene.add(box);*/
    // TODO try new camera
    const coneX = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.15, 24),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        opacity: 0.5,
        transparent: true,
        wireframe: true,
        wireframeLinewidth: 2,
      }),
    );
    coneX.rotation.copy(rotation);
    coneX.rotateX(-Math.PI / 2);
    coneX.position.copy(position);
    coneX.userData = {
      data: image2D,
      type: 'camera_pose',
    };
    window.potreeViewer.scene.scene.add(coneX);

    /*    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
    };
    const loader = new OBJLoader(manager);
    loader.load(`/obj/cmae_v6.obj`, function (object) {
      object.position.copy(position);
      object.rotation.copy(rotation);
      object.scale.multiplyScalar(0.1);
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            /!* transparent: true,
            opacity: 0.5,*!/
          });
        }
      });
      object.rotateX(Math.PI / 2);
      object.userData = {
        data: image2D,
        type: 'camera_pose',
      };
      window.potreeViewer.scene.scene.add(object);
    });*/
  };

  const loadInventory = () => {
    const poles = dataDetail.value?.data?.poles || [];
    let allDevices: Device[] = [];
    if (poles[0]?.gps_ratio) {
      const gpsRatio = Number(poles[0].gps_ratio) / 1000 / modelStore.gpsRatio;
      modelStore.gpsRatio = gpsRatio;
      window.potreeViewer.setGPSRatio(gpsRatio);
    }

    poles.forEach((pole) => {
      allDevices = allDevices.concat(pole.devices || []);
    });

    const boxMeshArray =
      allDevices.map((device) => {
        const vertices = JSON.parse(device.pivot.vertices);
        const antennaVertices = vertices.map(
          (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
        );
        const box = new THREE.Box3().setFromPoints(antennaVertices);
        const boxSize = box.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
        const boxMaterial = new THREE.MeshBasicMaterial({
          color: 0x83bb95,
          opacity: 0,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        const boxCenter = box.getCenter(new THREE.Vector3());
        boxMesh.position.set(boxCenter.x, boxCenter.y, boxCenter.z);
        boxMesh.userData = {
          type: 'inventory',
          boxCenter,
          device,
        };
        window.potreeViewer.scene.scene.add(boxMesh);

        const volume = new Potree.BoxVolume();
        volume.position.set(boxCenter.x, boxCenter.y, boxCenter.z);
        volume.scale.set(boxSize.x, boxSize.y, boxSize.z);
        volume.visible = false;
        window.potreeViewer.scene.addVolume(volume);

        return {
          id: device.pivot.id,
          boxMesh,
          volume,
        };
      }) || [];

    modelStore.poles = poles.map((pole) => {
      const deviceCategories: string[] = [];
      pole.devices.forEach((device) => {
        if (!deviceCategories.includes(device.category.name)) {
          deviceCategories.push(device.category.name);
        }
      });

      return {
        ...pole,
        isExpanded: true,
        deviceCategories: deviceCategories.map((deviceCategory) => {
          return {
            name: deviceCategory,
            devices: pole.devices
              .filter((device) => device.category.name === deviceCategory)
              .map((device) => {
                const boxMesh = boxMeshArray?.find((elem) => elem.id === device.pivot.id);

                return {
                  ...device,
                  boxMesh: boxMesh?.boxMesh,
                  volume: boxMesh?.volume,
                  visibleMesh: true,
                  visible: true,
                  clip: false,
                  isNewDevice: false,
                };
              }),
          };
        }),
      };
    });
  };

  onMounted(() => {
    modelStore.loadingModel = true;
    const viewerElement = document.getElementById('potree_render_area');
    if (!viewerElement) return;
    window.potreeViewer = new Potree.Viewer(viewerElement);

    window.potreeViewer.setEDLEnabled(EDL);
    window.potreeViewer.setEDLRadius(EDLRadius);
    window.potreeViewer.setFOV(60);
    window.potreeViewer.loadSettingsFromURL();
    window.potreeViewer.setBackground('black');
    window.potreeViewer.setPointBudget(budgetPoint);
    window.potreeViewer.useHQ = false;
    window.potreeViewer.compass.setVisible(true);

    window.potreeViewer.scene.addEventListener('measurement_added', onMeasurementAdded);
  });
  resetState();

  onUnmounted(() => {
    window.potreeViewer.scene.removeEventListener('measurement_added', onMeasurementAdded);
    window.location.reload();
  });

  let loaded = false;

  const loadPointCloud = () => {
    const url = dataDetail.value?.data?.models.find((item) => item.type === 'potree')?.url;
    const name = dataDetail.value?.data?.code;

    if (!url || !name) return;

    Potree.loadPointCloud(url, name, (e: any) => {
      const scene = window.potreeViewer.scene;
      const pointCloud = e.pointcloud;

      // Thêm pointCloud vào cảnh
      scene.addPointCloud(pointCloud);

      const material = e.pointcloud.material;
      material.size = pointSizeValue;

      scene.view.yaw = 0;
      scene.view.pitch = 0;
      window.potreeViewer.fitToScreen(0.6);

      window.potreeViewer.setClipTask(Potree.ClipTask.SHOW_OUTSIDE);
      window.potreeViewer.renderer.setPixelRatio(2);

      modelStore.loadingModel = false;
    });
  };

  const loadBasePlate = () => {
    if (!dataDetail.value) return;

    const planeGeometry = new THREE.PlaneGeometry(widthBasePlate, heightBasePlate); // Adjust size as needed
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x095888,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthWrite: true, // Add this line
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    const zPlane = dataDetail.value.data.poles[0]?.z_plane;

    plane.position.set(0, 0, zPlane);
    plane.userData = {
      type: 'basePlate',
    };

    window.potreeViewer.scene.scene.add(plane);

    modelStore.basePlate = plane;
    modelStore.zPlaneHistory = zPlane;
  };

  const loadImages = () => {
    if (!dataDetail.value) return;
    const images = dataDetail.value?.data.images;
    //addCameraToScene(images[0]);
    images.forEach((item) => {
      addCameraToScene(item);
    });
    modelStore.images = images;
  };

  watch([dataDetail], () => {
    if (dataDetail.value && !loaded) {
      loaded = true;
      loadInventory();
      loadPointCloud();
      loadImages();
      loadBasePlate();
    }
  });
};
