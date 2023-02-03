import initOpenCascade from 'opencascade.js/dist/node.js'
import { OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full.js'
import { basename, dirname } from "path"
import { triangulate } from "./lib/mesh.js"
import { readStepFile } from './lib/read/step.js'
import { writeGlbFile } from './lib/write/glb.js'
import { writeGltfFile } from './lib/write/gltf.js'
import { writeObjMtlFile } from './lib/write/obj_mtl.js'


async function processStep(oc: OpenCascadeInstance, stepPath: string) {

    console.info(`Processing STEP file`, stepPath)
    
    const stepDocHandle = readStepFile(oc, stepPath)

    triangulate(oc, stepDocHandle.get(), 1, false, 5, false)

    const objPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.obj`
    const glbPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.glb`
    const gltfPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.gltf`

    writeObjMtlFile(oc, stepDocHandle, objPath)
    writeGlbFile(oc, stepDocHandle, glbPath)
    writeGltfFile(oc, stepDocHandle, gltfPath)

}

async function run() {
    try {

        console.log("Initializing WebAssembly version of OpenCascade")
    
        const oc = await initOpenCascade()
    
        console.log("WebAssembly version of OpenCascade initialized successfully")

        processStep(oc, "./test/example.stp")
        processStep(oc, "./test/hauser.stp")

    } catch (error) {

        console.error(error)

    }
}

console.debug = () => {}

run()