import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Font, FontLoader } from 'three/examples/jsm/Addons.js';

type ResourceType = 'model' | 'texture' | 'sound' | 'font';
type ResourceKey = string;

type Model = GLTF;
type Texture = THREE.Texture;
type Sound = THREE.Audio;

type ModelOptions = {
  onLoad?: (resource: Model) => void;
  onProgress?: (xhr: ProgressEvent<EventTarget>) => void;
  onError?: (error: unknown) => void;
};
type TextureOptions = {
  onLoad?: (resource: Texture) => void;
  onProgress?: (xhr: ProgressEvent<EventTarget>) => void;
  onError?: (error: unknown) => void;
};
type SoundOptions = {
  onLoad?: (resource: Sound) => void;
  onProgress?: (xhr: ProgressEvent<EventTarget>) => void;
  onError?: (error: unknown) => void;
};
type FontOptions = {
  onLoad?: (resource: Font) => void;
  onProgress?: (xhr: ProgressEvent<EventTarget>) => void;
  onError?: (error: unknown) => void;
};

/**
 * Loadable Resource
 */
type BaseLoadableResource<TType extends ResourceType, TOptions> = {
  type: TType;
  key: ResourceKey;
  url: string;
  options?: TOptions;
};
type ModelLoadableResource = BaseLoadableResource<'model', ModelOptions>; // { type: 'model'; options?: ModelOptions; ... }
type TextureLoadableResource = BaseLoadableResource<'texture', TextureOptions>; // { type: 'texture'; options?: TextureOptions; ... }
type SoundLoadableResource = BaseLoadableResource<'sound', SoundOptions>; // { type: 'sound'; options?: SoundOptions; ... }
type FontLodableResource = BaseLoadableResource<'font', FontOptions>; // { type: 'font'; options?: FontOptions; ... }
type LoadableResource =
  | ModelLoadableResource
  | TextureLoadableResource
  | SoundLoadableResource
  | FontLodableResource;

/**
 * Resource Loader
 *
 * @example
 * const resourceLoader = new ResourceLoader(onProgressUpdate);
 * resourceLoader.onProgressUpdate = (progress) => {
 *  console.log(progress);
 * };
 *
 * resourceLoader.registerModel('model1', 'model1.glb')
 * resourceLoader.registerTexture('texture1', 'texture1.png')
 * resourceLoader.registerSound('sound1', 'sound1.mp3')
 *
 * resourceLoader.loadAll();
 */
export class ResourceLoader {
  private resourcesToLoad: LoadableResource[] = [];
  private loadedResources = {
    models: new Map<ResourceKey, Model>(),
    textures: new Map<ResourceKey, Texture>(),
    sounds: new Map<ResourceKey, Sound>(),
    fonts: new Map<ResourceKey, Font>(),
  };
  public onProgressUpdate: (progress: number) => void = () => {}; // 0 ~ 1
  public onLoadComplete: () => void = () => {};

  constructor() {}

  private get totalResourcesCount() {
    return this.resourcesToLoad.length;
  }

  private get loadedResourcesCount() {
    return (
      this.loadedResources.models.size +
      this.loadedResources.textures.size +
      this.loadedResources.sounds.size +
      this.loadedResources.fonts.size
    );
  }

  private handleProgressUpdate() {
    const progress = this.loadedResourcesCount / this.totalResourcesCount;
    this.onProgressUpdate(progress);
    if (this.loadedResourcesCount === this.totalResourcesCount) {
      console.log('All resources loaded');
      console.log(this.getFont('helvetiker'));

      this.onLoadComplete();
    }
  }

  private loadModel(resource: ModelLoadableResource) {
    const loader = new GLTFLoader();
    loader.load(
      resource.url,
      (gltf) => {
        resource.options?.onLoad?.(gltf);
        this.loadedResources.models.set(resource.key, gltf);
        this.handleProgressUpdate();
      },
      (xhr) => {
        resource.options?.onProgress?.(xhr);
      },
      (error) => {
        resource.options?.onError?.(error);
      },
    );
  }

  private loadTexture(resource: TextureLoadableResource) {
    const loader = new THREE.TextureLoader();
    loader.load(
      resource.url,
      (texture) => {
        resource.options?.onLoad?.(texture);
        this.loadedResources.textures.set(resource.key, texture);
        this.handleProgressUpdate();
      },
      (xhr) => {
        resource.options?.onProgress?.(xhr);
      },
      (error) => {
        resource.options?.onError?.(error);
      },
    );
  }

  private loadSound(resource: SoundLoadableResource) {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      resource.url,
      (buffer) => {
        audio.setBuffer(buffer);

        resource.options?.onLoad?.(audio);
        this.loadedResources.sounds.set(resource.key, audio);
        this.handleProgressUpdate();
      },
      (xhr) => {
        resource.options?.onProgress?.(xhr);
      },
      (error) => {
        resource.options?.onError?.(error);
      },
    );
  }

  private loadFont(resource: FontLodableResource) {
    const loader = new FontLoader();
    loader.load(
      resource.url,
      (font) => {
        resource.options?.onLoad?.(font);
        this.loadedResources.fonts.set(resource.key, font);
        this.handleProgressUpdate();
      },
      (xhr) => {
        resource.options?.onProgress?.(xhr);
      },
      (error) => {
        resource.options?.onError?.(error);
      },
    );
  }

  private loadResource(resource: LoadableResource) {
    switch (resource.type) {
      case 'model':
        this.loadModel(resource);
        break;
      case 'texture':
        this.loadTexture(resource);
        break;
      case 'sound':
        this.loadSound(resource);
        break;
      case 'font':
        this.loadFont(resource);
        break;
    }
  }

  public registerModel(key: ResourceKey, url: string, options?: ModelOptions) {
    this.resourcesToLoad.push({ type: 'model', key, url, options });
  }

  public registerTexture(
    key: ResourceKey,
    url: string,
    options?: TextureOptions,
  ) {
    this.resourcesToLoad.push({ type: 'texture', key, url, options });
  }

  public registerSound(key: ResourceKey, url: string, options?: SoundOptions) {
    this.resourcesToLoad.push({ type: 'sound', key, url, options });
  }

  public registerFont(key: ResourceKey, url: string, options?: FontOptions) {
    this.resourcesToLoad.push({ type: 'font', key, url, options });
  }

  public loadAll() {
    this.resourcesToLoad.forEach((resource) => {
      this.loadResource(resource);
    });
  }

  public getModel(key: ResourceKey): Model | undefined {
    return this.loadedResources.models.get(key);
  }

  public getTexture(key: ResourceKey): Texture | undefined {
    return this.loadedResources.textures.get(key);
  }

  public getSound(key: ResourceKey): Sound | undefined {
    return this.loadedResources.sounds.get(key);
  }

  public getFont(key: ResourceKey): Font | undefined {
    return this.loadedResources.fonts.get(key);
  }
}
