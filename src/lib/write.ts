import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

const NAME = "file.glb"
const BASE = "."
const PATH = `${BASE}/${NAME}`

export function writeGltf(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document) {
    console.log("Converting shapes")

    console.log("> Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.log("> Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.log("> Creating file")
    const file = new oc.TCollection_AsciiString_2(PATH)

    console.log("> Creating writer")
    const writer = new oc.RWGltf_CafWriter(file, true)
    
    console.log("> Writing file")
    writer.Perform_2(docHandle, map, progress)

    console.log("> Reading file")
    const data = oc.FS.readFile(PATH, { encoding: "binary" })

    return data
}