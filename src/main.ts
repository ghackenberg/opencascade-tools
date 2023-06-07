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

async function run({format, linDeflection, isRelative, angDeflection, isInParallel, input, output}: Options) {
    // Load WebAssembly

    const oc = await init()

    // Process input files

    for (const inputPath of input) {
        // Determine read function

        const inputExt = extname(inputPath)
    
        let readInputFile: (oc: OpenCascadeInstance, sourcePath: string) => Handle_TDocStd_Document
    
        if (inputExt == ".iges") {
            readInputFile = readIgesFile
        } else if (inputExt == ".stp" || inputExt == ".step") {
            readInputFile = readStepFile
        } else {
            throw "Input file format is not supported!"
        }
        
        // Determine output path

        let outputPath = output
    
        if (!outputPath) {
            if (format == "obj") {
                outputPath = `${dirname(inputPath)}/${basename(inputPath, inputExt)}.obj`
            } else if (format == "gltf") {
                outputPath = `${dirname(inputPath)}/${basename(inputPath, inputExt)}.gltf`
            } else if (format == "glb") {
                outputPath = `${dirname(inputPath)}/${basename(inputPath, inputExt)}.glb`
            } else {
                throw "Output file format is not supported!"
            }       
        }

        // Determine write function

        const outputExt = extname(outputPath)
    
        let writeOutputFile: (oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, targetPath: string) => void

        if (outputExt == ".obj") {
            writeOutputFile = writeObjFile
        } else if (outputExt == ".gltf") {
            writeOutputFile = writeGltfFile
        } else if (outputExt == ".glb") {
            writeOutputFile = writeGlbFile
        } else {
            throw "Output file format is not supported!"
        }

        // Perform read, triangulate, write
    
        console.info(`Reading input file`, inputPath)
        
        const stepDocHandle = readInputFile(oc, inputPath)
    
        print(oc, stepDocHandle.get())
    
        triangulate(oc, stepDocHandle.get(), parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel)
    
        writeOutputFile(oc, stepDocHandle, outputPath)
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