import * as THREE from 'three';
import { useModelStore } from '@/stores/model';
import type { Image } from '@/services/apis/station';

export const useChangeImage = () => {
  const modelStore = useModelStore();

  const onChangeImage = (data: Image) => {
    modelStore.selectedImage = data;
    if (!data) return;

    const viewer = window.potreeViewer;

    const length = 5; // Length of the line
    const moveForwardDistance = 0.1; // Distance to move the position forward

    const cameraPosition = new THREE.Vector3(
      data.camera_pose.geometry_cone.pos_x,
      data.camera_pose.geometry_cone.pos_y,
      data.camera_pose.geometry_cone.pos_z,
    );
    const rotation = new THREE.Euler(
      THREE.MathUtils.degToRad(data.camera_pose.geometry_cone.rotate_x),
      THREE.MathUtils.degToRad(data.camera_pose.geometry_cone.rotate_y),
      THREE.MathUtils.degToRad(data.camera_pose.geometry_cone.rotate_z),
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
