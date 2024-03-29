import WreathSansController from '../domain/WreathSansController';
import { CanvasDataRefs } from './DataRefs';

type DataRefs = CanvasDataRefs | WreathSansController;

type Initiate<Refs extends DataRefs> = (refs: Refs) => void;

type Send<Params extends DataRefs> = (
  callback: (params: Params) => void,
) => void;

export type CanvasDispatcher = {
  initiate: Initiate<CanvasDataRefs>;
  send: Send<CanvasDataRefs>;
};

export type PixiDispatcher = {
  initiate: Initiate<WreathSansController>;
  send: Send<WreathSansController>;
};
