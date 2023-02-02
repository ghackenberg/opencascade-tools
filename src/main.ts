import { readFileSync, writeFileSync } from "fs"
import initOpenCascade from 'opencascade.js/dist/node.js'
import { convertDocumentHandle } from "./lib/gltf.js"
import { triangulateDocument } from "./lib/mesh.js"
import { parseAsDocumentHandle } from './lib/step.js'
import { convertStepToGltfFile } from './lib/util.js'

console.log("Initializing")

initOpenCascade().then(oc => {
    console.log("Initialized")

    const stepHandle = parseAsDocumentHandle(oc, readFileSync("./hauser.stp", "ascii"))

    triangulateDocument(oc, stepHandle.get())

    const gltfData = convertDocumentHandle(oc, stepHandle)

    writeFileSync("./hauser.glb", gltfData)

    //convertStepToGltfFile(oc, "./example.stp")
}).catch(error => {
    console.error(error)
})