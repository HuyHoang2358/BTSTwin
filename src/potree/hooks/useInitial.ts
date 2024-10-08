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
import { useBTSDetail, useStationScan, useStationScanImages } from '@/services/hooks/useStation';
import type { Device, Image, PoleDevice } from '@/services/apis/station';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { Vector3 } from 'three';

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

  const { data: dataScanResponse } = useStationScan(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );
  const dataScan = computed(() => dataScanResponse.value?.data);
  const scanModels = computed(() => dataScan.value?.models || []);

  const { data: fetchImagesResponse } = useStationScanImages(
    computed(() => route.query.id as string),
    computed(() => !!route.query.id),
  );
  const scanImages = computed(() => fetchImagesResponse.value?.data || []);

  const resetState = () => {
    modelStore.currentMeasurement = undefined;
    modelStore.measurements = [];
    modelStore.activeTool = undefined;
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
    modelStore.currentMeasurement = e.measurement;
    e.measurement.icon = Potree.Utils.getMeasurementIcon(e.measurement);
    modelStore.measurements.push(e.measurement);
  };

  const addCameraToScene = (image2D: Image) => {
    const data = image2D.camera_pose;
    const position = new THREE.Vector3(
      data.geometry_cone.pos_x,
      data.geometry_cone.pos_y,
      data.geometry_cone.pos_z,
    );
    const rotation = new THREE.Euler(
      data.geometry_cone.rotate_x * THREE.MathUtils.DEG2RAD,
      data.geometry_cone.rotate_y * THREE.MathUtils.DEG2RAD,
      data.geometry_cone.rotate_z * THREE.MathUtils.DEG2RAD,
    );

    // TODO try new camera
    const coneX = new THREE.Mesh(
      new THREE.ConeGeometry(
        data.geometry_cone.radius,
        data.geometry_cone.height,
        data.geometry_cone.radial_segments,
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

  const getCenterPoint = (vertices: number[][]) => {
    const p0 = vertices[0];
    const p1 = vertices[1];
    const p3 = vertices[3];
    const p4 = vertices[4];
    // calculate angle between 2 vectors p0p3 vs Ox and convert to degree
    const angle_xO3 = Math.abs(Math.atan2(p3[1] - p0[1], p3[0] - p0[0]) * (180 / Math.PI));

    // calculate angle between 2 vectors p0p1 vs Ox and convert to degree
    const angle_xO1 = Math.abs(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI));

    console.log('angle_xO3', angle_xO3);
    console.log('angle_xO1', angle_xO1);

    // width  = distance between p0 and p3
    // height = distance between p0 and p1
    let width = Math.sqrt((p3[0] - p0[0]) ** 2 + (p3[1] - p0[1]) ** 2); // x
    let height = Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2); // y
    if (angle_xO3 > angle_xO1) {
      width = Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2); // x
      height = Math.sqrt((p3[0] - p0[0]) ** 2 + (p3[1] - p0[1]) ** 2); // y
    }

    const points = [];
    vertices.forEach((vertex) => {
      points.push(new THREE.Vector3(...vertex));
    });
    // using webgl_geometry_convex to draw box
    const geometry = new ConvexGeometry(points);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    window.potreeViewer.scene.scene.add(mesh);

    const lineXMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });
    const pointsX = [];
    pointsX.push(new THREE.Vector3(...p0));
    pointsX.push(new THREE.Vector3(...p3));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(pointsX);
    const line = new THREE.Line(lineGeometry, lineXMaterial);
    window.potreeViewer.scene.scene.add(line);

    // depth = abs(p4[2] - p0[2])
    const depth = Math.abs(p4[2] - p0[2]); // z

    const numVertices = vertices.length;

    if (numVertices === 0) return [0, 0, 0]; // return [0,0,0] if no vertices

    const center = vertices
      .reduce(
        (acc, vertex) => {
          acc[0] += vertex[0];
          acc[1] += vertex[1];
          acc[2] += vertex[2];
          return acc;
        },
        [0, 0, 0],
      )
      .map((coord) => coord / numVertices);

    return { width, depth, height, center };
  };

  const drawLine = (p0, p1) => {
    const lineXMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 5 });
    const pointsX = [];
    pointsX.push(new THREE.Vector3(...p0));
    pointsX.push(new THREE.Vector3(...p1));
    const lineXGeometry = new THREE.BufferGeometry().setFromPoints(pointsX);
    const xx = new THREE.Line(lineXGeometry, lineXMaterial);
    window.potreeViewer.scene.scene.add(xx);
  };
  const drawBox = (vertices: number[][]) => {
    const numVertices = vertices.length;
    if (numVertices === 0) return [0, 0, 0]; // return [0,0,0] if no vertices
    const center = vertices
      .reduce(
        (acc, vertex) => {
          acc[0] += vertex[0];
          acc[1] += vertex[1];
          acc[2] += vertex[2];
          return acc;
        },
        [0, 0, 0],
      )
      .map((coord) => coord / numVertices);

    //draw 8 point
    const materials = [
      new THREE.PointsMaterial({
        color: 0xff0000, // đỏ
        size: 0.05, // Kích thước điểm
      }),
      new THREE.PointsMaterial({
        color: 0xffff00, // vàng
        size: 0.05, // Kích thước điểm
      }),
      new THREE.PointsMaterial({
        color: 0x0000ff, // xanh dương
        size: 0.05, // Kích thước điểm
      }),
      new THREE.PointsMaterial({
        color: 0xffffff, // trắng
        size: 0.05, // Kích thước điểm
      }),
      new THREE.PointsMaterial({
        color: 0xff00ff, // tím
        size: 0.05, // Kích thước điểm
      }),

      new THREE.PointsMaterial({
        color: 0x00ff00, // xanh
        size: 0.05, // Kích thước điểm
      }),

      new THREE.PointsMaterial({
        color: 0x00ffff, // xanh nước biển
        size: 0.05, // Kích thước điểm
      }),
      new THREE.PointsMaterial({
        color: 0x000000, // đen
        size: 0.05, // Kích thước điểm
      }),
    ];
    vertices.forEach((vertex, index) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertex), 3));

      const points = new THREE.Points(geometry, materials[index]);
      window.potreeViewer.scene.scene.add(points);
    });

    // draw ox - màu xanh
    const lineOXMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });
    const pointsOX = [];
    pointsOX.push(new THREE.Vector3(center[0], center[1], center[2]));
    pointsOX.push(new THREE.Vector3(center[0] + 1, center[1], center[2]));
    const lineOXGeometry = new THREE.BufferGeometry().setFromPoints(pointsOX);
    const Ox = new THREE.Line(lineOXGeometry, lineOXMaterial);
    window.potreeViewer.scene.scene.add(Ox);

    // draw oy - màu đỏ
    const pointsOY = [];
    const lineOYMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 });
    pointsOY.push(new THREE.Vector3(center[0], center[1], center[2]));
    pointsOY.push(new THREE.Vector3(center[0], center[1] + 1, center[2]));
    const lineOYGeometry = new THREE.BufferGeometry().setFromPoints(pointsOY);
    const Oy = new THREE.Line(lineOYGeometry, lineOYMaterial);
    window.potreeViewer.scene.scene.add(Oy);

    // draw oz - màu xanh la cay
    const pointsOZ = [];
    const lineOZMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10 });
    pointsOZ.push(new THREE.Vector3(center[0], center[1], center[2]));
    pointsOZ.push(new THREE.Vector3(center[0], center[1], center[2] + 1));
    const lineOZGeometry = new THREE.BufferGeometry().setFromPoints(pointsOZ);
    const Oz = new THREE.Line(lineOZGeometry, lineOZMaterial);
    window.potreeViewer.scene.scene.add(Oz);

    const p0 = vertices[0];
    const p1 = vertices[1];
    const p2 = vertices[2];
    const p3 = vertices[3];
    const p4 = vertices[4];
    const p5 = vertices[5];
    const p6 = vertices[6];
    const p7 = vertices[7];

    // Calculate rotation of z
    const angle_xO3 = Math.atan2(p3[1] - p0[1], p3[0] - p0[0]) * (180 / Math.PI);
    const angle_xO1 = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI);

    console.log('angle_xO3', angle_xO3);
    console.log('angle_xO1', angle_xO1);

    // width  = distance between p0 and p3
    // height = distance between p0 and p1
    let width = Math.sqrt((p3[0] - p0[0]) ** 2 + (p3[1] - p0[1]) ** 2 + (p3[2] - p0[2]) ** 2); // x
    let height = Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2 + (p1[2] - p0[2]) ** 2); // y
    const depth = Math.sqrt((p4[0] - p0[0]) ** 2 + (p4[1] - p0[1]) ** 2 + (p4[2] - p0[2]) ** 2); // z
    let rotation_x = angle_xO3;
    if (Math.abs(angle_xO3) > Math.abs(angle_xO1)) {
      width = Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2); // x
      height = Math.sqrt((p3[0] - p0[0]) ** 2 + (p3[1] - p0[1]) ** 2); // y
      rotation_x = angle_xO1;
    }

    const center_top = [
      (p4[0] + p5[0] + p6[0] + p7[0]) / 4,
      (p4[1] + p5[1] + p6[1] + p7[1]) / 4,
      (p4[2] + p5[2] + p6[2] + p7[2]) / 4,
    ];
    drawLine(center, center_top);

    // const volume = new Potree.BoxVolume();
    // volume.position.set(center[0], center[1], center[2]);
    // volume.scale.set(1, 1, 1);
    // volume.visible = false;
    // volume.clip = true;
    // window.potreeViewer.scene.addVolume(volume);

    const p00 = [center[0], center[1], center[2]];
    const p01 = [center[0], center[1], center[2] + 1];
    const p02 = [center[0], center_top[1], center_top[2]];
    const angle_rotate_x = Math.atan2(p01[1] - p02[1], p01[2] - p02[2]) * (180 / Math.PI);
    console.log('angle_rotate_x', angle_rotate_x);

    // cachs 2
    const vb = [center_top[0] - center[0], center_top[1] - center[1], center_top[2] - center[2]];
    const va = [0, 0, 1];
    const angle_rotate_x_2 =
      Math.acos(
        (vb[0] * va[0] + vb[1] * va[1] + vb[2] * va[2]) /
          (Math.sqrt(vb[0] ** 2 + vb[1] ** 2 + vb[2] ** 2) *
            Math.sqrt(va[0] ** 2 + va[1] ** 2 + va[2] ** 2)),
      ) *
      (180 / Math.PI);

    console.log('angle_rotate_x_2', angle_rotate_x_2);

    const p01y = [center[0], center[1], center[2] + 1];
    const p02y = [center_top[0], center[1], center_top[2]];
    const angle_rotate_y = /* Math.atan2(p01y[0] - p02y[0], p01y[2] - p02y[2]) * (180 / Math.PI);*/ 0;
    console.log('angle_rotate_y', angle_rotate_y);
    // Cach 2
    const vay = [0, 0, 1];
    // Calculate rotation of x

    console.log('width', width);
    console.log('height', height);
    console.log('depth', depth);

    // calculate angle between 2 vector Ox and

    const boxGeometry = new THREE.BoxGeometry(width, height, depth, 2);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(center[0], center[1], center[2]);
    const rotation = new THREE.Euler(
      angle_rotate_x_2 * THREE.MathUtils.DEG2RAD,
      angle_rotate_y * THREE.MathUtils.DEG2RAD,
      rotation_x * THREE.MathUtils.DEG2RAD,
    );
    boxMesh.rotation.copy(rotation);
    //window.potreeViewer.scene.scene.add(boxMesh);

    const points: Vector3[] = [];
    vertices.forEach((vertex) => {
      points.push(new THREE.Vector3(...vertex));
    });
    // using webgl_geometry_convex to draw box
    const geometry = new ConvexGeometry(points);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    window.potreeViewer.scene.scene.add(mesh);
  };
  const loadInventory = () => {
    const poles = dataScan.value?.poles || [];
    console.log('poles', poles);
    let allDevices: PoleDevice[] = [];
    if (poles[0]?.gps_ratio) {
      const gpsRatio = Number(poles[0].gps_ratio) / 1000 / modelStore.gpsRatio;
      modelStore.gpsRatio = gpsRatio;
      window.potreeViewer.setGPSRatio(gpsRatio);
    }
    poles.forEach((pole) => {
      allDevices = allDevices.concat(pole?.pole_devices || []);
    });
    //allDevices = [allDevices[2]];
    const boxMeshArray = allDevices.map((device) => {
      console.log('device', device);
      const vertices = JSON.parse(device.vertices);
      console.log('vertices', vertices);
      drawBox(vertices);
      // const boxVertices = vertices.map(
      //   (item: number[]) => new THREE.Vector3(item[0], item[1], item[2]),
      // );
      //
      //
      // const boxGeometry = new THREE.BoxGeometry(width, height, depth, 2);
      // const boxMaterial = new THREE.MeshBasicMaterial({
      //   color: 0xff0000,
      //   wireframe: true,
      // });
      // const boxXMaterial = new THREE.MeshBasicMaterial({
      //   color: 0xffff00,
      //   wireframe: true,
      // });
      //
      // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      // const boxXMesh = new THREE.Mesh(boxGeometry, boxXMaterial);
      //
      // boxMesh.position.set(center[0], center[1], center[2]);
      // boxXMesh.position.set(center[0], center[1], center[2]);
      // const rotation = new THREE.Euler(0, 0, 0);
      // const rotationX = new THREE.Euler(0, 0, rotationData[2] * THREE.MathUtils.DEG2RAD);
      // boxMesh.rotation.copy(rotation);
      // boxXMesh.rotation.copy(rotationX);
      //window.potreeViewer.scene.scene.add(boxMesh);
      //window.potreeViewer.scene.scene.add(boxXMesh);

      /* // draw oz
      const pointsZ = [];
      const lineZMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10 });
      pointsZ.push(new THREE.Vector3(center[0], center[1], center[2]));
      pointsZ.push(new THREE.Vector3(center[0], center[1], center[2] + 1));
      const lineGeometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
      const lineZ = new THREE.Line(lineGeometryZ, lineZMaterial);
      window.potreeViewer.scene.scene.add(lineZ);*/
    });
    /*





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
    });*/
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
    const url = scanModels.value.find((item) => item.type === 'potree')?.url;
    const name = dataScan.value?.name;
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
    scanImages?.value.forEach((item: Image) => {
      addCameraToScene(item);
    });
    modelStore.images = scanImages.value;
  };

  watch([dataScanResponse], () => {
    if (dataScanResponse.value && !loaded) {
      loaded = true;
      loadInventory();

      loadPointCloud();
      //loadBasePlate();
    }
  });

  watch([fetchImagesResponse], () => {
    if (fetchImagesResponse.value) {
      //loadImages();
    }
  });
};
