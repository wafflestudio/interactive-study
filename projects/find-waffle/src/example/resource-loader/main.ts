import { ResourceLoader } from '../../libs/resource-loader/ResourceLoader';

const progressElement = document.querySelector('#progress') as HTMLElement;
const progressBarFillElement = document.querySelector(
  '#progress-bar-fill',
) as HTMLElement;
const onProgressUpdate = (progress: number) => {
  progressElement.textContent = `${Math.floor(progress * 100)}%`;
  progressBarFillElement.style.width = `${progress * 100}%`;
};

const resourceLoader = new ResourceLoader();
resourceLoader.onProgressUpdate = onProgressUpdate;

resourceLoader.registerModel('model1', '/models/Duck/glTF-Binary/Duck.glb');
resourceLoader.registerModel('model2', '/models/Duck/glTF-Binary/Duck.glb', {
  onLoad: (gltf) => {
    console.log('Loaded model2', gltf);
  },
});
resourceLoader.registerModel('model3', '/models/Duck/glTF-Binary/Duck.glb', {
  onLoad: (gltf) => {
    console.log('Loaded model3', gltf);
  },
});
resourceLoader.registerModel('model4', '/models/Duck/glTF-Binary/Duck.glb');

resourceLoader.registerTexture(
  'texture1',
  '/models/Duck/screenshot/screenshot.png',
);
resourceLoader.registerTexture(
  'texture2',
  '/models/Duck/screenshot/screenshot.png',
  {
    onLoad: (texture) => {
      console.log('Loaded texture2', texture);
    },
  },
);
resourceLoader.registerTexture(
  'texture3',
  '/models/Duck/screenshot/screenshot.png',
);

document.querySelector('#load')?.addEventListener('click', () => {
  resourceLoader.loadAll();
});

document.querySelector('#print')?.addEventListener('click', () => {
  console.log('model1', resourceLoader.getModel('model1'));
  console.log('model2', resourceLoader.getModel('model2'));
  console.log('model3', resourceLoader.getModel('model3'));
  console.log('model4', resourceLoader.getModel('model4'));

  console.log('texture1', resourceLoader.getTexture('texture1'));
  console.log('texture2', resourceLoader.getTexture('texture2'));
  console.log('texture3', resourceLoader.getTexture('texture3'));
});
