#!/usr/bin/env node

import { program } from 'commander'
import figlet from 'figlet'
import { readFileSync } from 'fs'
import { Handle_TDocStd_Document, OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full'
import { basename, dirname, extname, resolve } from "path"
import { fileURLToPath } from 'url'
import { init, readIgesFile, readStepFile, triangulate, writeGlbFile, writeGltfFile, writeObjFile } from './api/node.js'

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

async function run({format, linDeflection, isRelative, angDeflection, isInParallel}: Options, sourcePath: string) {

    const ext = extname(sourcePath)

    let readSourceFile: (oc: OpenCascadeInstance, sourcePath: string) => Handle_TDocStd_Document

    if (ext == ".iges") {
        readSourceFile = readIgesFile
    } else if (ext == ".stp" || ext == ".step") {
        readSourceFile = readStepFile
    } else {
        throw "Source file format is not supported!"
    }

    let targetPath: string

    let writeTargetFile: (oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, targetPath: string) => void

    if (format == "obj") {
        targetPath = `${dirname(sourcePath)}/${basename(sourcePath, ext)}.obj`
        writeTargetFile = writeObjFile
    } else if (format == "gltf") {
        targetPath = `${dirname(sourcePath)}/${basename(sourcePath, ext)}.gltf`
        writeTargetFile = writeGltfFile
    } else if (format == "glb") {
        targetPath = `${dirname(sourcePath)}/${basename(sourcePath, ext)}.glb`
        writeTargetFile = writeGlbFile
    } else {
        throw "Target file format is not supported!"
    }

    const oc = await init()

    console.info(`Processing source file`, sourcePath)
    
    const stepDocHandle = readSourceFile(oc, sourcePath)

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
    
    program.argument("<sourcePath>", "path to IGES or STEP file")
    
    program.parse()
    
    const options = program.opts<Options>()
    
    const sourcePath = program.args[0]
    
    console.debug = options.debug ? console.debug : () => {}
    
    run(options, sourcePath)
})