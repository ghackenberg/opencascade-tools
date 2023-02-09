import { readFileSync } from "fs"
import { OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

const NAME = "file.iges"
const BASE = "."
const PATH = `${BASE}/${NAME}`

export function readIgesFile(oc: OpenCascadeInstance, path: string) {
    const data = readFileSync(path, "ascii")

    return readIgesData(oc, data)   
}

export function readIgesData(oc: OpenCascadeInstance, data: string) {
    console.log("> Reading IGES")

    console.debug("  > Creating reader")
    const reader = new oc.IGESCAFControl_Reader_1()

    console.debug("  > Creating file")
    oc.FS.createDataFile(BASE, NAME, data, true, true, true)
    
    console.debug("  > Reading file")
    const result = reader.ReadFile(PATH)

    console.debug("  > Deleting file")
    oc.FS.unlink(PATH)

    if (result != oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
        throw 'Could not read IGES file'
    }

    console.debug("  > Creating format")
    const format = new oc.TCollection_ExtendedString_1()

    console.debug("  > Creating document")
    const doc = new oc.TDocStd_Document(format)

    console.debug("  > Creating handle")
    const docHandle = new oc.Handle_TDocStd_Document_2(doc)

    console.debug("  > Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.debug("  > Transferring data")
    reader.Transfer(docHandle, progress)

    return docHandle
}