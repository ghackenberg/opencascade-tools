import { OpenCascadeInstance, TDocStd_Document } from "opencascade.js/dist/opencascade.full"

export function convert(occ: OpenCascadeInstance, doc: TDocStd_Document) {
    console.log("Converting shapes")

    console.log("> Creating writer")

    const file = new occ.TCollection_AsciiString_2("./file.glb")

    const writer = new occ.RWGltf_CafWriter(file, true)

    console.log("> Writing file")

    const handle = new occ.Handle_TDocStd_Document_2(doc)

    const map = new occ.TColStd_IndexedDataMapOfStringString_1()

    const progress = new occ.Message_ProgressRange_1()
    
    writer.Perform_2(handle, map, progress)

    console.log("> Reading file")

    const data = occ.FS.readFile("./file.glb", { encoding: "binary" })

    return data
}