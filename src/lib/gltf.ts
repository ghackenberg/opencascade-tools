import { Handle_TDocStd_Document, OpenCascadeInstance, TDocStd_Document } from "opencascade.js/dist/opencascade.full.js"

const NAME = "file.glb"
const BASE = "."
const PATH = `${BASE}/${NAME}`

export function convertDocument(oc: OpenCascadeInstance, doc: TDocStd_Document) {
    console.log("Converting shapes")

    console.log("> Creating handle")
    const handle = new oc.Handle_TDocStd_Document_2(doc)

    return convertDocumentHandle(oc, handle)
}

export function convertDocumentHandle(oc: OpenCascadeInstance, handle: Handle_TDocStd_Document) {
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
    writer.Perform_2(handle, map, progress)

    console.log("> Reading file")
    const data = oc.FS.readFile(PATH, { encoding: "binary" })

    return data
}