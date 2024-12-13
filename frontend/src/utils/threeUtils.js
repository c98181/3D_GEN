import * as THREE from 'three';
export const threeUtils = {
  calculateModelBoundingBox(model) {
    // 計算模型的邊界框，用於自動縮放和定位
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    return { box, size };
  },

  autoScaleModel(model, targetSize = 1) {
    // 自動調整模型大小以適應顯示區域
    const { size } = this.calculateModelBoundingBox(model);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetSize / maxDim;

    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    return scaleFactor;
  },

  centerModel(model) {
    // 將模型置於原點中心
    const { box } = this.calculateModelBoundingBox(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
  }
};