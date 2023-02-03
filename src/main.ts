import { readFileSync, writeFileSync } from "fs"
import initOpenCascade from 'opencascade.js/dist/node.js'
import { triangulate } from "./lib/mesh.js"
import { readStep } from './lib/read.js'
import { writeGltf } from "./lib/write.js"

console.log("Initializing WebAssembly version of OpenCascade")

initOpenCascade().then(oc => {

    console.log("WebAssembly version of OpenCascade initialized successfully")

    const stepData = readFileSync("./hauser.stp", "ascii")

    const stepDocHandle = readStep(oc, stepData)

    triangulate(oc, stepDocHandle.get())

    const gltfData = writeGltf(oc, stepDocHandle)

    writeFileSync("./hauser.glb", gltfData)

}).catch(error => {

    console.log("WebAssembly version of OpenCascade could not be initialized")
    
    console.error(error)

})