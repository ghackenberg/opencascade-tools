import { readFileSync, writeFileSync } from 'fs'
import initOpenCascade from 'opencascade.js/dist/node.js'
import { convert } from './lib/convert.js'
import { mesh } from './lib/mesh.js'
import { parse } from './lib/parse.js'

console.log("Initializing")

initOpenCascade().then(occ => {
    console.log("Initialized")

    const data = readFileSync('./example.stp', 'ascii')

    // Parse STEP data
    const shape = parse(occ, data)
    // Convert to mesh
    const doc = mesh(occ, [shape])
    // Convert to GLB
    const glb = convert(occ, doc)

    writeFileSync('./example.glb', glb)

}).catch(error => {
    console.error(error)
})