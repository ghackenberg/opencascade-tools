import { readFileSync, writeFileSync } from "fs"
import { OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"
import { convertDocument } from "./gltf.js"
import { triangulateShape } from "./mesh.js"
import { parseAsShape } from "./step.js"

export function convertStepToGltfData(oc: OpenCascadeInstance, stepData: string) {
    // Parse STEP data
    const stepShape = parseAsShape(oc, stepData)
    // Triangulate shape
    const brepDoc = triangulateShape(oc, stepShape)
    // Convert to GLTF data
    const gltfData = convertDocument(oc, brepDoc)
    // Return GLTF data
    return gltfData
}

export function convertStepToGltfFile(oc: OpenCascadeInstance, stepPath: string, gltfPath: string = undefined) {
    // Prepare GLTF path
    gltfPath = gltfPath || `${stepPath.substring(0, stepPath.lastIndexOf("."))}.glb`
    // Read STEP data
    const stepData = readFileSync(stepPath, 'ascii')
    // Convert STEP to GLTF data
    const gltfData = convertStepToGltfData(oc, stepData)
    // Write GLTF data
    writeFileSync(gltfPath, gltfData)
}