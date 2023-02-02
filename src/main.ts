import initOpenCascade from 'opencascade.js/dist/node.js'
import { convertStepToGltfFile } from './lib/util.js'

console.log("Initializing")

initOpenCascade().then(oc => {
    console.log("Initialized")

    convertStepToGltfFile(oc, "./example.stp")
}).catch(error => {
    console.error(error)
})