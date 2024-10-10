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
import { useStationScan, useStationScanImages } from '@/services/hooks/useStation';
import type { Image, PoleDevice } from '@/services/apis/station';
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
  // Define store to save state
  const modelStore = useModelStore();

  const route = useRoute();

  // Fetch information of scan
  const { data: scanInfoResponse } = useStationScan(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );
  const scanInfo = computed(() => scanInfoResponse?.value?.data);

  // Fetch images of scan
  const { data: imagesInfoResponse } = useStationScanImages(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );
  const imageData = computed(() => imagesInfoResponse?.value?.data || []);

  const resetState = () => {
    modelStore.measurements = [];
    modelStore.activeTool = ACTIVE_TOOL.INVENTORY;
    modelStore.selectedMeasurement = undefined;
    modelStore.selectedInventory = undefined;
    modelStore.selectedImage = undefined;
    modelStore.selectedPole = undefined;
    modelStore.isSelectedBasePlate = false;
  };

  // When change route query -> reset State
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

  const loadInventory = () => {
    const poles = scanInfo.value?.poles || [];
    let allDevices: PoleDevice[] = [];

    if (poles[0]?.gps_ratio) {
      const gpsRatio = Number(poles[0].gps_ratio) / 1000 / modelStore.gpsRatio;
      modelStore.gpsRatio = gpsRatio;
      window.potreeViewer.setGPSRatio(gpsRatio);
    }

    poles.forEach((pole) => {
      allDevices = allDevices.concat(pole.pole_devices || []);
    });

    const boxMeshArray =
      allDevices.map((poleDevice: PoleDevice) => {
        const vertices = JSON.parse(poleDevice.vertices);

        const poleDeviceVertices = vertices.map(
          (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
        );

        const box = new THREE.Box3().setFromPoints(poleDeviceVertices);
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
          poleDevice,
        };
        window.potreeViewer.scene.scene.add(boxMesh);

        const volume = new Potree.BoxVolume();
        volume.position.set(boxCenter.x, boxCenter.y, boxCenter.z);
        volume.scale.set(boxSize.x, boxSize.y, boxSize.z);
        volume.visible = false;
        window.potreeViewer.scene.addVolume(volume);

        return {
          id: poleDevice.id,
          boxMesh,
          volume,
        };
      }) || [];

    modelStore.poles = poles.map((pole) => {
      const deviceCategories: string[] = [];
      pole.pole_devices.forEach((poleDevice) => {
        if (!deviceCategories.includes(poleDevice.device_info.category.name)) {
          deviceCategories.push(poleDevice.device_info.category.name);
        }
      });

      return {
        ...pole,
        isExpanded: true,
        deviceCategories: deviceCategories.map((deviceCategory) => {
          return {
            name: deviceCategory,
            devices: pole.pole_devices
              .filter((poleDevice) => poleDevice.device_info.category.name === deviceCategory)
              .map((poleDevice) => {
                const boxMesh = boxMeshArray?.find((elem) => elem.id === poleDevice.id);

                return {
                  ...poleDevice,
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
    console.log('poles', modelStore.poles);
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
    const url = scanInfo.value?.models?.find((item) => item.type === 'potree')?.url;
    const name = scanInfo.value?.name;
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
    if (!scanInfo.value) return;

    const planeGeometry = new THREE.PlaneGeometry(widthBasePlate, heightBasePlate); // Adjust size as needed
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x095888,
      //wireframe: true,
      //wireframeLinewidth: 5.0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthWrite: true, // Add this line
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    const zPlane = scanInfo.value.poles?.[0]?.z_plane || 0;

    plane.position.set(0, 0, zPlane);
    plane.userData = {
      type: 'basePlate',
    };

    window.potreeViewer.scene.scene.add(plane);

    modelStore.basePlate = plane;
    modelStore.zPlaneHistory = zPlane;
  };

  const loadImages = () => {
    if (!imageData.value) return;
    const images: Image[] = imageData.value;

    images.forEach((item) => {
      addCameraToScene(item);
    });

    modelStore.images = images;
  };
  const addCameraToScene = (image2D: Image) => {
    const geometryCone = image2D.camera_pose.geometry_cone;
    const position = new THREE.Vector3(geometryCone.pos_x, geometryCone.pos_y, geometryCone.pos_z);
    const rotation = new THREE.Euler(
      geometryCone.rotate_x * THREE.MathUtils.DEG2RAD,
      geometryCone.rotate_y * THREE.MathUtils.DEG2RAD,
      geometryCone.rotate_z * THREE.MathUtils.DEG2RAD,
    );
    // TODO try new camera
    const coneX = new THREE.Mesh(
      new THREE.ConeGeometry(
        geometryCone.radius,
        geometryCone.height,
        geometryCone.radial_segments,
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        opacity: 0.5,
        transparent: true,
        wireframe: true,
        wireframeLinewidth: 2,
      }),
    );
    coneX.rotation.copy(rotation);
    coneX.position.copy(position);
    coneX.rotateX(-Math.PI / 2); // rotate x 90 degree

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

  watch([scanInfo], () => {
    if (scanInfo.value && !loaded) {
      loaded = true;
      loadPointCloud();
      loadInventory();
      loadBasePlate();
    }
  });

  watch([imageData], () => {
    loadImages();
  });
};
