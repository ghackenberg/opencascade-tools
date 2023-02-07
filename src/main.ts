#!/usr/bin/env node

import { program } from 'commander'
import { OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full.js'
import { basename, dirname } from "path"
import { init, readStepFile, triangulate, writeGlbFile, writeGltfFile, writeObjFile } from './api/node.js'

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
    const oc = await init()

    processStep(oc, stepPath, linDeflection, isRelative, angDeflection, isInParallel)
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

const stepPath = program.args[0]

console.debug = options["debug"] ? console.debug : () => {}

run()