#!/usr/bin/env node

import { program } from 'commander'
import figlet from 'figlet'
import { readFileSync } from 'fs'
import { Handle_TDocStd_Document, OpenCascadeInstance } from 'opencascade.js/dist/opencascade.full'
import { basename, dirname, extname, resolve } from "path"
import { fileURLToPath } from 'url'
import { init, readIgesFile, readStepFile, triangulate, writeGlbFile, writeGltfFile, writeObjFile } from './api/node.js'
import { print } from './lib/tree.js'

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
    input: string[]
    output: string
}

function selectReadFile(inputPath: string) {
    const inputExt = extname(inputPath)
    if (inputExt == ".iges") {
        return readIgesFile
    } else if (inputExt == ".stp" || inputExt == ".step") {
        return readStepFile
    } else {
        throw "Input file format is not supported!"
    }
}

function selectOutputPath(inputPath: string, format: string) {
    if (format == "obj") {
        return `${dirname(inputPath)}/${basename(inputPath, extname(inputPath))}.obj`
    } else if (format == "gltf") {
        return `${dirname(inputPath)}/${basename(inputPath, extname(inputPath))}.gltf`
    } else if (format == "glb") {
        return `${dirname(inputPath)}/${basename(inputPath, extname(inputPath))}.glb`
    } else {
        throw "Output file format is not supported!"
    }
}

function selectWriteFile(outputPath: string) {
    const outputExt = extname(outputPath)
    if (outputExt == ".obj") {
        return writeObjFile
    } else if (outputExt == ".gltf") {
        return writeGltfFile
    } else if (outputExt == ".glb") {
        return writeGlbFile
    } else {
        throw "Output file format is not supported!"
    }
}

function processDocument(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, linDeflection: number, isRelative: boolean, angDeflection: number, isInParallel: boolean, outputPath: string) {
    print(oc, docHandle.get())

    triangulate(oc, docHandle.get(), linDeflection, isRelative, angDeflection, isInParallel)

    const writeOutputFile = selectWriteFile(outputPath)

    writeOutputFile(oc, docHandle, outputPath)
}

async function run({format, linDeflection, isRelative, angDeflection, isInParallel, input, output}: Options) {
    // Load WebAssembly

    const oc = await init()

    // Process input files

    let docHandle: Handle_TDocStd_Document = null

    for (const inputPath of input) {
        // Read input file
    
        const readInputFile = selectReadFile(inputPath)
    
        console.info(`Processing input file`, inputPath)

        docHandle = readInputFile(oc, inputPath, docHandle)
        
        // Print, triangulate and write output files
        
        if (!output) {
            const outputPath = selectOutputPath(inputPath, format)

            processDocument(oc, docHandle, parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel, outputPath)

            docHandle = null
        }
    }
        
    // Print, triangulate and write output file

    if (output) {
        processDocument(oc, docHandle, parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel, output)
    }
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
    program.option("-l, --linDeflection <number>", "linear deflection value for triangulation algorithm", "0.1")
    program.option("-r, --isRelative", "is relative flag for triangulation algorithm", false)
    program.option("-a, --angDeflection <number>", "angular deflection value for triangulation algorithm", "0.1")
    program.option("-p, --isInParallel", "is in parallel flag for triangulation algorithm", false)
    program.option("-i, --input <path...>", "path to one or more IGES or STEP input files")
    program.option("-o, --output [path]", "path to single OBJ, GTLF, or GLB output file")
    program.option("-f, --format [obj|gltf|glb]", "output file format", "glb")
    
    program.parse()
    
    const options = program.opts<Options>()
    
    console.debug = options.debug ? console.debug : () => {}
    
    run(options)
})