#!/usr/bin/env node

import { program } from 'commander'
import figlet from 'figlet'
import { readFileSync } from 'fs'
import { Handle_TDocStd_Document, OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full'
import { basename, dirname, resolve } from "path"
import { fileURLToPath } from 'url'
import { init, readStepFile, triangulate, writeGlbFile, writeGltfFile, writeObjFile } from './api/node.js'

const packPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "package.json")
const packData = readFileSync(packPath, 'utf-8')

const { name, version, description } = JSON.parse(packData)
    
interface Options {
    debug: boolean
    format: string
    linDeflection: string
    isRelative: boolean
    angDeflection: string
    isInParallel: boolean
}

async function run({format, linDeflection, isRelative, angDeflection, isInParallel}: Options, stepPath: string) {

    let targetPath: string

    let writeTargetFile: (oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, targetPath: string) => void

    if (format == "obj") {
        targetPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.obj`
        writeTargetFile = writeObjFile
    } else if (format == "gltf") {
        targetPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.gltf`
        writeTargetFile = writeGltfFile
    } else if (format == "glb") {
        targetPath = `${dirname(stepPath)}/${basename(stepPath, ".stp")}.glb`
        writeTargetFile = writeGlbFile
    } else {
        throw "Format is not supported!"
    }

    const oc = await init()

    console.info(`Processing STEP file`, stepPath)
    
    const stepDocHandle = readStepFile(oc, stepPath)

    triangulate(oc, stepDocHandle.get(), parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel)

    writeTargetFile(oc, stepDocHandle, targetPath)

}

figlet(name, (error, result) => {
    if (error) {
        console.error(error)
    } else {
        console.log(result)
    }
    console.log()

    program.name(name)
    program.version(version)
    program.description(description)
    
    program.option("-d, --debug", "debug flag", false)
    program.option("-f, --format <obj|gltf|glb>", "target file format", "glb")
    program.option("-l, --linDeflection <number>", "linear deflection value for triangulation algorithm", "0.1")
    program.option("-r, --isRelative", "is relative flag for triangulation algorithm", false)
    program.option("-a, --angDeflection <number>", "angular deflection value for triangulation algorithm", "0.1")
    program.option("-p, --isInParallel", "is in parallel flag for triangulation algorithm", false)
    
    program.argument("<stepPath>", "path to STEP file")
    
    program.parse()
    
    const options = program.opts<Options>()
    
    const stepPath = program.args[0]
    
    console.debug = options.debug ? console.debug : () => {}
    
    run(options, stepPath)
})