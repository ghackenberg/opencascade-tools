import { writeFileSync } from "fs"
import { basename } from "path"
import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

export function writeGlbFile(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, path: string) {
    const pathInternal = `./${basename(path)}`
    
    const data = writeGlbInternal(oc, docHandle, pathInternal)

    data && writeFileSync(path, data)
}

export function writeGlbData(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, path: string = "./output.glb") {
    return writeGlbInternal(oc, docHandle, path)
}

function writeGlbInternal(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, path: string) {
    console.log("Writing GLB")

    console.log("> Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.log("> Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.log("> Creating file")
    const file = new oc.TCollection_AsciiString_2(path)

    console.log("> Creating writer")
    const writer = new oc.RWGltf_CafWriter(file, true)
    
    console.log("> Writing file")
    writer.Perform_2(docHandle, map, progress)

    console.log("> Reading file")
    const data = oc.FS.analyzePath(path).exists && oc.FS.readFile(path)

    console.log("> Deleting file")
    data && oc.FS.unlink(path)

    return data
}