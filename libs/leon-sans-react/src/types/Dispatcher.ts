import { CanvasDataRefs, PixiDataRefs } from './DataRefs';

type DataRefs = CanvasDataRefs | PixiDataRefs;

type Initiate<Refs extends DataRefs> = (refs: Refs) => void;

type Send<Params extends DataRefs> = (
  callback: (params: Params) => void,
) => void;

export type CanvasDispatcher = {
  initiate: Initiate<CanvasDataRefs>;
  send: Send<CanvasDataRefs>;
};

export type PixiDispatcher = {
  initiate: Initiate<PixiDataRefs>;
  send: Send<PixiDataRefs>;
};
