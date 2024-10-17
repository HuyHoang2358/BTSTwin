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
import { useMeasurements, useStationScan, useStationScanImages } from '@/services/hooks/useStation';
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
  const { data: measurementsResponse } = useMeasurements(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );
  const scanInfo = computed(() => scanInfoResponse?.value?.data);
  const measurements = computed(() => measurementsResponse?.value?.data || []);
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
    if (modelStore.activeTool === ACTIVE_TOOL.MEASUREMENT) {
      modelStore.hoverInformation = 'Nhấn chuột trái để thêm điểm, nhấn chuột phải để kết thúc đo';
    }
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
      if (
        modelStoreListener.activeTool === ACTIVE_TOOL.MEASUREMENT &&
        (measurement.uuid !== modelStoreListener.selectedMeasurement?.uuid ||
          !modelStoreListener.selectedMeasurement)
      ) {
        modelStoreListener.selectedMeasurement = measurement;
      }
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

  const drawOxOyOz = (vertices) => {
    // calculate center of vertices
    const center = vertices
      .reduce(
        (acc, item) => {
          return [acc[0] + item[0], acc[1] + item[1], acc[2] + item[2]];
        },
        [0, 0, 0],
      )
      .map((item) => item / vertices.length);

    // draw Ox
    const ox = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      1,
      0xff0000, // red color
    );
    ox.position.set(center[0], center[1], center[2]);
    window.potreeViewer.scene.scene.add(ox);
    // draw Oy
    const oy = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      1,
      0x00ff00, // green color
    );
    oy.position.set(center[0], center[1], center[2]);
    window.potreeViewer.scene.scene.add(oy);
    // draw Oz
    const oz = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      1,
      0x0000ff, // blue color
    );
    oz.position.set(center[0], center[1], center[2]);
    window.potreeViewer.scene.scene.add(oz);
    return center;
  };

  const draw_points = (points, material) => {
    const flatArray: number[] = [];

    points.forEach((p: number[]) => {
      flatArray.push(p[0], p[1], p[2]);
    });
    const pointsFloat32Array = new Float32Array(flatArray);
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsFloat32Array, 3));
    const entities = new THREE.Points(pointsGeometry, material);
    window.potreeViewer.scene.scene.add(entities);
  };
  const greenPointMaterial = new THREE.PointsMaterial({
    color: 0x00ff00, // green color
    size: 0.03, // Size of the points
  });
  const redPointMaterial = new THREE.PointsMaterial({
    color: 0xff0000, // red color
    size: 0.03, // Size of the points
  });

  const drawDepth = (top_points, bottom_points, center_point) => {
    // GS: goc  = top_points[0]
    // Chọn gốc là điểm thuộc top_points  sao cho oo[1] < center[1] oo[0] < center[0]
    const oos = top_points.filter((p) => p[0] <= center_point[0] || p[1] <= center_point[1]);
    const oo = oos[0];
    // find point in bottom_points distace to oo min
    let ooz = bottom_points[0];
    let min_distance = Math.sqrt(
      Math.pow(oo[0] - ooz[0], 2) + Math.pow(oo[1] - ooz[1], 2) + Math.pow(oo[2] - ooz[2], 2),
    );
    bottom_points.forEach((point) => {
      const distance = Math.sqrt(
        Math.pow(oo[0] - point[0], 2) +
          Math.pow(oo[1] - point[1], 2) +
          Math.pow(oo[2] - point[2], 2),
      );
      if (distance < min_distance) {
        min_distance = distance;
        ooz = point;
      }
    });
    // draw line from oo to ooz
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([
      new THREE.Vector3(oo[0], oo[1], oo[2]),
      new THREE.Vector3(ooz[0], ooz[1], ooz[2]),
    ]);

    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    window.potreeViewer.scene.scene.add(line);
  };

  const drawWidth = (top_points, center_point) => {
    // width follow x
    const oos = top_points.filter((p) => p[0] <= center_point[0] || p[1] <= center_point[1]);
    const oo = oos[0];
    let max_dis = -1;
    let index = -1;
    top_points = top_points.filter((p) => p[0] != oo[0] && p[1] != oo[1] && p[2] != oo[2]);

    for (let i = 0; i < top_points.length; i++) {
      const p = top_points[i];
      const dis = Math.sqrt(
        Math.pow(p[0] - oo[0], 2) + Math.pow(p[1] - oo[1], 2) + Math.pow(p[2] - oo[2], 2),
      );
      if (dis > max_dis) {
        max_dis = dis;
        index = i;
      }
    }

    // remove element i in top_points
    top_points = top_points.filter(
      (p) =>
        p[0] != top_points[index][0] &&
        p[1] != top_points[index][1] &&
        p[2] != top_points[index][2],
    );
    console.log('top_points', top_points);

    //const ox = [1, 0, 0];
    // find projection of oo to 0xy
    const oox = top_points[0];
    const ooy = top_points[1];
    const ox = [oo[0] + 1, oo[1], oo[2]];
    const oy = [oo[0], oo[1] + 1, oo[2]];

    // determine the width follow x
  };

  const drawDeviceFromVertices = (vertices: number[][]) => {
    //const center = drawOxOyOz(vertices);
    // draw cone from vertices
    vertices.sort((a, b) => b[2] - a[2]); //  sort vertices by z
    console.log('vertices', vertices);

    const top_points = vertices.slice(0, 4);
    const bottom_points = vertices.slice(4, 8);
    draw_points(top_points, greenPointMaterial);
    draw_points(bottom_points, redPointMaterial);
    const center = drawOxOyOz(top_points);
    //drawDepth(top_points, bottom_points, center);
    drawWidth(top_points, center);
  };

  const loadInventory = () => {
    const poles = scanInfo.value?.poles || [];
    let allDevices: PoleDevice[] = [];

    poles.forEach((pole) => {
      allDevices = allDevices.concat(pole.pole_devices || []);
    });

    //allDevices = [allDevices[0]];
    const boxMeshArray =
      allDevices.map((poleDevice: PoleDevice) => {
        const vertices = JSON.parse(poleDevice.vertices);

        // drawDeviceFromVertices(vertices);
        const poleDeviceVertices = vertices.map(
          (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
        );

        const box = new THREE.Box3().setFromPoints(poleDeviceVertices);
        const boxSize = box.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
        const boxMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          opacity: 0,
          transparent: true,
          //wireframe: true,
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
        volume.scale.set(boxSize.x, boxSize.y, boxSize.z); // expand
        volume.visible = false;
        volume.clip = false; // add more to remove point
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
  let loadedImage = false;

  const loadPointCloud = () => {
    const url = scanInfo.value?.models?.find((item) => item.type === 'potree')?.url;
    const name = scanInfo.value?.name;
    if (!url || !name) return;

    Potree.loadPointCloud(url, name, (e: any) => {
      const scene = window.potreeViewer.scene;
      const pointCloud = e.pointcloud;
      modelStore.pointCloud = pointCloud;

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
    // Add north direction
    const northDirection = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, zPlane),
      new THREE.Vector3(0, 0, zPlane),
      Math.max(widthBasePlate, heightBasePlate) + 5,
      0xff0000,
    );
    window.potreeViewer.scene.scene.add(northDirection);
    // hidden north direction

    modelStore.basePlate = plane;
    modelStore.northDirection = northDirection;
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

  const loadMeasure = () => {
    measurements.value.forEach((measurement: any) => {
      const mm = JSON.parse(measurement?.measurements);

      mm.forEach((data: any) => {
        const measure = new Potree.Measure(window.potreeViewer);

        measure.uuid = data.uuid;
        measure.name = data.name;
        measure.showDistances = data.showDistances;
        measure.showCoordinates = data.showCoordinates;
        measure.showArea = data.showArea;
        measure.closed = data.closed;
        measure.showAngles = data.showAngles;
        measure.showHeight = data.showHeight;
        measure.showCircle = data.showCircle;
        measure.showAzimuth = data.showAzimuth;
        measure.showEdges = data.showEdges;

        for (const point of data.points) {
          const pos = new THREE.Vector3(...point);
          measure.addMarker(pos);
        }

        window.potreeViewer.scene.addMeasurement(measure);
      });
    });
  };

  watch([scanInfo], () => {
    if (scanInfo.value && measurements.value && !loaded) {
      loaded = true;
      const poles = scanInfo.value?.poles || [];
      if (poles[0]?.gps_ratio) {
        const gpsRatio = Number(poles[0].gps_ratio) / 1000 / modelStore.gpsRatio;
        modelStore.gpsRatio = gpsRatio;
        window.potreeViewer.setGPSRatio(gpsRatio);
      }
      loadPointCloud();
      loadInventory();
      loadBasePlate();
      loadMeasure();
    }
  });

  watch([imageData], () => {
    if (imageData.value && !loadedImage) {
      loadedImage = true;
      loadImages();
    }
  });
};
