import cameraData from '@/views/camera_pose.json';
import * as THREE from 'three';
import { useModelStore } from '@/stores/model';

export const useChangeImage = () => {
  const modelStore = useModelStore();

  const onChangeImage = (image: any) => {
    modelStore.selectedImage = image;
    const data = cameraData[image];
    const viewer = window.potreeViewer;

    const length = 7; // Length of the line
    const moveForwardDistance = 0.1; // Distance to move the position forward

    const cameraPosition = new THREE.Vector3(...data.cam_cent);
    const rotation = new THREE.Euler(
      THREE.MathUtils.degToRad(data.euler_angle[0]),
      THREE.MathUtils.degToRad(data.euler_angle[1]),
      THREE.MathUtils.degToRad(data.euler_angle[2]),
      'XYZ',
    );
    const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation); // Original direction
    const endPoint = direction.multiplyScalar(-length); // Reversed direction

    // Calculate the new position by moving it forward
    const moveForward = direction.clone().multiplyScalar(moveForwardDistance);
    const newCameraPosition = cameraPosition.clone().add(moveForward);

    const cameraTarget = new THREE.Vector3(
      endPoint.x + cameraPosition.x,
      endPoint.y + cameraPosition.y,
      endPoint.z + cameraPosition.z,
    );

    // Move the camera to the new position and target
    Potree.Utils.moveTo(viewer.scene, newCameraPosition, cameraTarget);
  };

  return { onChangeImage };
};
