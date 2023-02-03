import initOpenCascade from 'opencascade.js/dist/node.js'
import { triangulate } from "./lib/mesh.js"
import { readStepFile } from './lib/read/step.js'
import { writeGlbFile } from './lib/write/glb.js'
import { writeGltfFile } from './lib/write/gltf.js'
import { writeObjMtlFile } from './lib/write/obj_mtl.js'

async function run() {
    try {

        console.log("Initializing WebAssembly version of OpenCascade")
    
        const oc = await initOpenCascade()
    
        console.log("WebAssembly version of OpenCascade initialized successfully")
    
        const stepDocHandle = readStepFile(oc, "./example.stp")
    
        triangulate(oc, stepDocHandle.get())
    
        writeObjMtlFile(oc, stepDocHandle, "./example.obj")
        writeGlbFile(oc, stepDocHandle, "./example.glb")
        writeGltfFile(oc, stepDocHandle, "./example.gltf")

    } catch (error) {

        console.error(error)

    }
}

run()