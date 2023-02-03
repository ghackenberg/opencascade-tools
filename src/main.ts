import { readFileSync, writeFileSync } from "fs"
import initOpenCascade from 'opencascade.js/dist/node.js'
import { triangulate } from "./lib/mesh.js"
import { readStep } from './lib/read.js'
import { writeGltf } from "./lib/write.js"

console.log("Initializing")

initOpenCascade().then(oc => {
    console.log("Initialized")

    const stepData = readFileSync("./hauser.stp", "ascii")

    const stepHandle = readStep(oc, stepData)

    triangulate(oc, stepHandle.get())

    const gltfData = writeGltf(oc, stepHandle)

    writeFileSync("./hauser.glb", gltfData)

    //convertStepToGltfFile(oc, "./example.stp")
}).catch(error => {
    console.error(error)
})