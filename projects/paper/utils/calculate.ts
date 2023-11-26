import React from 'react';
import {
  leftHolo,
  rightHolo,
  centerHolo,
  fakeLeftHolo,
} from '@/constants/imgUrls';
import { Fake } from '@/types/bill';

const width = 513;
const height = 243;

export const getOffset = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
};

export const getRotate = (offsetX: number, offsetY: number) => {
  const x = -(((offsetX - width / 2) / width) * 2) * 30;
  const y = -(((offsetY - height / 2) / height) * -2) * 30;
  return { x, y };
};

export const getOpacity = (offsetX: number, offsetY: number) => {
  const op = {
    backImg: '15%',
    hiddenImg: '0%',
    registerImg: '50%',
  };

  if (offsetX < width / 11) {
    op.registerImg = '100%';
  } else if (offsetX < (width / 11) * 2) {
    op.registerImg = '90%';
  } else if (offsetX < (width / 11) * 3) {
    op.registerImg = '80%';
  } else if (offsetX < (width / 11) * 4) {
    op.registerImg = '70%';
  } else if (offsetX < (width / 11) * 5) {
    op.registerImg = '60%';
  } else if (offsetX < (width / 11) * 6) {
    op.registerImg = '50%';
  } else if (offsetX < (width / 11) * 7) {
    op.registerImg = '40%';
  } else if (offsetX < (width / 11) * 8) {
    op.registerImg = '30%';
  } else if (offsetX < (width / 11) * 9) {
    op.registerImg = '20%';
  } else if (offsetX < (width / 11) * 10) {
    op.registerImg = '10%';
  } else {
    op.registerImg = '0%';
  }

  if (offsetY < height / 11) {
    op.backImg = '0%';
    op.hiddenImg = '15%';
  } else if (offsetY < (height / 11) * 2) {
    op.backImg = '3%';
    op.hiddenImg = '12%';
  } else if (offsetY < (height / 11) * 3) {
    op.backImg = '6%';
    op.hiddenImg = '9%';
  } else if (offsetY < (height / 11) * 4) {
    op.backImg = '9%';
    op.hiddenImg = '6%';
  } else if (offsetY < (height / 11) * 5) {
    op.backImg = '12%';
    op.hiddenImg = '3%';
  } else if (offsetY < (height / 11) * 6) {
    op.backImg = '15%';
    op.hiddenImg = '0%';
  } else if (offsetY < (height / 11) * 7) {
    op.backImg = '12%';
    op.hiddenImg = '3%';
  } else if (offsetY < (height / 11) * 8) {
    op.backImg = '9%';
    op.hiddenImg = '6%';
  } else if (offsetY < (height / 11) * 9) {
    op.backImg = '6%';
    op.hiddenImg = '9%';
  } else if (offsetY < (height / 11) * 10) {
    op.backImg = '3%';
    op.hiddenImg = '12%';
  } else {
    op.backImg = '0%';
    op.hiddenImg = '15%';
  }
  return op;
};

// TODO: bug
export const getHoloMask = (offsetX: number, fakeType: Fake) => {
  if (offsetX < width / 3 && fakeType === Fake.TYPE_3) {
    return `url(${fakeLeftHolo})`;
  } else if (offsetX < width / 3 && fakeType !== Fake.TYPE_3) {
    return `url(${leftHolo})`;
  } else if ((width / 3) * 2 < offsetX) {
    return `url(${rightHolo})`;
  }
  return `url(${centerHolo})`;
};
