import { program } from 'commander'
import initOpenCascade from 'opencascade.js/dist/node.js'
import { OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full.js'
import { basename, dirname } from "path"
import { triangulate } from "./lib/mesh.js"
import { readStepFile } from './lib/read/step.js'
import { writeGlbFile } from './lib/write/glb.js'
import { writeGltfFile } from './lib/write/gltf.js'
import { writeObjFile } from './lib/write/obj.js'

async function processStep(oc: OpenCascadeInstance, stepPath: string, linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {

    console.info(`Processing STEP file`, stepPath)
    
    const stepDocHandle = readStepFile(oc, stepPath)

    triangulate(oc, stepDocHandle.get(), linDeflection, isRelative, angDeflection, isInParallel)

    const objPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.obj`
    const gltfPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.gltf`
    const glbPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.glb`

    writeObjFile(oc, stepDocHandle, objPath)
    writeGltfFile(oc, stepDocHandle, gltfPath)
    writeGlbFile(oc, stepDocHandle, glbPath)

}

async function run() {
    try {

        console.log("Initializing WebAssembly version of OpenCascade")
    
        const oc = await initOpenCascade()
    
        console.log("WebAssembly version of OpenCascade initialized successfully")

        processStep(oc, stepFile, linDeflection, isRelative, angDeflection, isInParallel)

    } catch (error) {

        console.error(error)

    }
}

program.name("opencascade-typescript")

program.version("0.0.1")

program.description("OpenCascade tools written in TypeScript and WebAssembly")

program.option("--linDeflection <number>", "linear deflection", "0.1")
program.option("--isRelative", "is relative", false)
program.option("--angDeflection <number>", "angular deflection", "0.1")
program.option("--isInParallel", "is in parallel", false)
program.option("--debug", "debug", false)

program.argument("<stepPath>", "Path to STEP file")

program.parse()

const options = program.opts()

const linDeflection = parseFloat(options["linDeflection"])
const angDeflection = parseFloat(options["angDeflection"])

const isRelative = options["isRelative"]
const isInParallel = options["isInParallel"]

const stepFile = program.args[0]

console.debug = options["debug"] ? console.debug : () => {}

run()