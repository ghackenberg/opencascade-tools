import { readFileSync } from "fs"
import { OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

const NAME = "file.stp"
const BASE = "."
const PATH = `${BASE}/${NAME}`

export function readStepFile(oc: OpenCascadeInstance, path: string) {
    const data = readFileSync(path, "ascii")
    return readStepData(oc, data)   
}

export function readStepData(oc: OpenCascadeInstance, data: string) {
    console.log("Reading STEP")

    console.log("> Creating reader")
    const reader = new oc.STEPCAFControl_Reader_1()

    console.log("> Creating file")
    oc.FS.createDataFile(BASE, NAME, data, true, true, true)
    
    console.log("> Reading file")
    const result = reader.ReadFile(PATH)

    console.log("> Deleting file")
    oc.FS.unlink(PATH)

    if (result != oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
        throw 'Could not read STEP file'
    }

    console.log("> Creating format")
    const format = new oc.TCollection_ExtendedString_1()

    console.log("> Creating document")
    const doc = new oc.TDocStd_Document(format)

    console.log("> Creating handle")
    const docHandle = new oc.Handle_TDocStd_Document_2(doc)

    console.log("> Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.log("> Transferring data")
    reader.Transfer_1(docHandle, progress)

    return docHandle
}