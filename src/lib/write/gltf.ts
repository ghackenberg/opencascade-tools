import { writeFileSync } from "fs"
import { basename, dirname } from "path"
import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

export function writeGltfFile(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, gltfPath: string) {
    const pathInternal = `./${basename(gltfPath)}`
    
    const { gltfData, binData, binPath } = writeGltfInternal(oc, docHandle, pathInternal)

    gltfData && writeFileSync(gltfPath, gltfData)

    const binPathExternal = `${dirname(gltfPath)}/${basename(binPath)}`
    
    binData && writeFileSync(binPathExternal, binData)
}

export function writeGltfData(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, gltfPath = "./output.gltf") {
    return writeGltfInternal(oc, docHandle, gltfPath)
}

function writeGltfInternal(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, gltfPath: string) {
    console.log("> Writing GTLF/BIN")
    const binPath = `${gltfPath.substring(0, gltfPath.lastIndexOf("."))}.bin`

    console.debug("  > Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.debug("  > Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.debug("  > Creating file")
    const file = new oc.TCollection_AsciiString_2(gltfPath)

    console.debug("  > Creating writer")
    const writer = new oc.RWGltf_CafWriter(file, false)
    
    console.debug("  > Writing GLTF/BIN files")
    writer.Perform_2(docHandle, map, progress)

    console.debug("  > Reading GLTF file")
    const gltfData = oc.FS.analyzePath(gltfPath).exists && oc.FS.readFile(gltfPath)

    console.debug("  > Reading BIN file")
    const binData = oc.FS.analyzePath(binPath).exists && oc.FS.readFile(binPath)

    console.debug("  > Deleting GLTF file")
    gltfData && oc.FS.unlink(gltfPath)

    console.debug("  > Deleting BIN file")
    binData && oc.FS.unlink(binPath)

    return { gltfData, binData, binPath }
}