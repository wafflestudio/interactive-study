import { z } from 'zod';

const vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

const singlePositionSchema = vector3Schema;
const rangePositionSchema = z.object({
  start: singlePositionSchema,
  end: singlePositionSchema,
  step: z.number().int().gte(1).default(1),
});
const positionsSchema = z.array(
  z.union([singlePositionSchema, rangePositionSchema]),
);

const cubeObjectSchema = z.object({
  type: z.literal('cube'),
  texture: z.string().optional(),
  size: vector3Schema.default([1, 1, 1]),
  background: z.string().optional(),
  transparent: z.boolean().default(false),
  border: z
    .object({
      color: z.string(),
      width: z.number(),
    })
    .optional(),
  positions: positionsSchema,
});
export type CubeObject = z.infer<typeof cubeObjectSchema>;

const textureArgSchema = z.object({
  type: z.literal('texture'),
  name: z.string(),
});

const stringArgSchema = z.object({
  type: z.literal('string'),
  value: z.string(),
});

const numberArgSchema = z.object({
  type: z.literal('number'),
  value: z.number(),
});

const booleanArgSchema = z.object({
  type: z.literal('boolean'),
  value: z.boolean(),
});

const materialArgSchema = z.discriminatedUnion('type', [
  textureArgSchema,
  stringArgSchema,
  numberArgSchema,
  booleanArgSchema,
]);

const modelOverrideSchema = z.object({
  name: z.string(),
  material: z
    .object({
      type: z.string(),
      args: z.record(materialArgSchema),
    })
    .optional(),
});
export type ModelOverride = z.infer<typeof modelOverrideSchema>;

const ModelShapeSchema = z.object({
  position: singlePositionSchema,
  size: vector3Schema,
});

const modelObjectSchema = z.object({
  type: z.literal('model'),
  name: z.string(),
  rotation: vector3Schema.default([0, 0, 0]),
  position: singlePositionSchema,
  overrides: z.array(modelOverrideSchema).optional(),
  shapes: z.array(ModelShapeSchema).optional(),
});
export type ModelObject = z.infer<typeof modelObjectSchema>;

const mapObjectSchema = z.union([cubeObjectSchema, modelObjectSchema]);

const textureResourceSchema = z.object({
  type: z.literal('texture'),
  name: z.string(),
  path: z.string(),
  colorSpace: z
    .enum(['srgb', 'srgb-linear', 'display-p3', 'display-p3-linear'])
    .optional(),
});

const gltfResourceSchema = z.object({
  type: z.literal('gltf'),
  name: z.string(),
  path: z.string(),
});

const resourceSchema = z.union([textureResourceSchema, gltfResourceSchema]);
export type Resource = z.infer<typeof resourceSchema>;

export const mapDataSchema = z.object({
  objects: z.array(mapObjectSchema),
  resources: z.array(resourceSchema),
});
export type MapData = z.infer<typeof mapDataSchema>;
