import * as THREE from 'three';

export const findAncestor = (
  object: THREE.Object3D | null,
  predicate: (object: THREE.Object3D) => boolean,
): THREE.Object3D | null => {
  if (object === null) return null;
  if (predicate(object)) return object;
  return findAncestor(object.parent, predicate);
};

export const traverseAncestor = (
  object: THREE.Object3D | null,
  callback: (object: THREE.Object3D) => boolean,
) => {
  if (object === null) return;

  if (callback(object)) return;
  else traverseAncestor(object.parent, callback);
};
