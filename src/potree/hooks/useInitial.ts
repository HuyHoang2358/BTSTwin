import { onMounted } from 'vue';
import objectsData from '@/views/tower_metadata.json';
import * as THREE from 'three';
import cameraData from '@/views/camera_pose.json';
import { useModelStore } from '@/stores/model';

export const useInitial = () => {
  const modelStore = useModelStore();

  const onMeasurementAdded = (e: any) => {
    modelStore.currentMeasurement = e.measurement;
    e.measurement.icon = Potree.Utils.getMeasurementIcon(e.measurement);
    modelStore.measurements.push(e.measurement);
  };

  const addCameraToScene = (potreeViewer: any, cameraData: any, key: any) => {
    const data = cameraData[key];
    const position = new THREE.Vector3(...data.cam_cent);
    const rotation = new THREE.Euler(
      THREE.MathUtils.degToRad(data.euler_angle[0]),
      THREE.MathUtils.degToRad(data.euler_angle[1]),
      THREE.MathUtils.degToRad(data.euler_angle[2]),
      'XYZ',
    );

    // Create a cone geometry
    const geometry = new THREE.ConeGeometry(0.1, 0.15, 8); // radius, height, radialSegments
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const cone = new THREE.Mesh(geometry, material);

    cone.position.copy(position);
    cone.rotation.copy(rotation);

    const additionalRotation = new THREE.Euler(THREE.MathUtils.degToRad(-90), 0, 0, 'XYZ');
    cone.rotation.x += additionalRotation.x;

    // Add the cone to the scene
    cone.userData = {
      key,
      data,
      type: 'camera_pose',
    };
    potreeViewer.scene.scene.add(cone);
  };

  const loadInventory = (potreeViewer: any) => {
    const boxMeshs =
      objectsData?.objects?.map((object) => {
        // Define vertices of the Antenna
        const antennaVertices = object.vertices.map(
          (item) => new THREE.Vector3(item[0], item[1], item[2]),
        );

        // Compute bounding box
        const box = new THREE.Box3().setFromPoints(antennaVertices);

        // Create geometry for the bounding box
        const boxSize = box.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);

        // Create a material with transparency
        const boxMaterial = new THREE.MeshBasicMaterial({
          color: 0x83bb95,
          opacity: 0.5, // Độ trong suốt
          transparent: true, // Bật chế độ trong suốt
          depthWrite: false, // Ngăn chặn việc ghi vào buffer độ sâu
          side: THREE.DoubleSide, // Hiển thị cả hai mặt
        });

        // Create the bounding box mesh
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

        // Set the position of the bounding box
        const boxCenter = box.getCenter(new THREE.Vector3());
        boxMesh.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

        let normal;
        if (boxSize.x >= boxSize.y && boxSize.x >= boxSize.z) {
          normal = new THREE.Vector3(1, 0, 0); // Mặt lớn song song với trục X
        } else if (boxSize.y >= boxSize.x && boxSize.y >= boxSize.z) {
          normal = new THREE.Vector3(0, 1, 0); // Mặt lớn song song với trục Y
        } else {
          normal = new THREE.Vector3(0, 0, 1); // Mặt lớn song song với trục Z
        }

        boxMesh.userData = {
          type: 'inventory',
          boxCenter,
          normal,
          object,
        };

        potreeViewer.scene.scene.add(boxMesh);

        // Create and configure Potree.BoxVolume
        const volume = new Potree.BoxVolume();

        // Set the position to the center of the bounding box
        volume.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

        // Set the scale to the size of the bounding box
        volume.scale.set(boxSize.x, boxSize.y, boxSize.z); // Convert vertices to THREE.Vector3
        // Thêm volume vào cảnh
        volume.visible = false;
        potreeViewer.scene.addVolume(volume);

        return {
          id: object.id,
          boxMesh,
          volume,
        };
      }) || [];

    modelStore.objectGroup = objectsData.objects.reduce((acc: any, object: any) => {
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
    const viewerElement = document.getElementById('potree_render_area');
    window.potreeViewer = new Potree.Viewer(viewerElement);

    potreeViewer.setEDLEnabled(true);
    potreeViewer.setFOV(60);
    potreeViewer.loadSettingsFromURL();
    potreeViewer.setBackground('black');
    potreeViewer.setPointBudget(1_000_000);
    potreeViewer.useHQ = true;
    potreeViewer.compass.setVisible(true);

    loadInventory(potreeViewer);

    Potree.loadPointCloud(
      'http://192.168.101.90:9000/public/BTS/HNI4067/potree/metadata.json',
      'Lion',
      (e: any) => {
        const scene = potreeViewer.scene;
        const pointCloud = e.pointcloud;

        // Thêm pointCloud vào cảnh
        scene.addPointCloud(pointCloud);

        // Cài đặt camera
        scene.view.yaw = 0;
        scene.view.pitch = 0;
        potreeViewer.fitToScreen(0.6);

        // Set clip task
        potreeViewer.setClipTask(Potree.ClipTask.SHOW_OUTSIDE);
      },
    );

    Object.keys(cameraData).forEach((key) => {
      addCameraToScene(potreeViewer, cameraData, key);
    });

    potreeViewer.scene.addEventListener('measurement_added', onMeasurementAdded);
  });
};
