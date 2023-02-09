import { OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full.js' 

export declare function init(): Promise<OpenCascadeInstance>

export * from '../lib/read/iges.js'
export * from '../lib/read/step.js'
export * from '../lib/write/obj.js'
export * from '../lib/write/glb.js'
export * from '../lib/write/gltf.js'
export * from '../lib/mesh.js'