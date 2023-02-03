import { writeFileSync } from "fs"
import { basename, dirname } from "path"
import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

export function writeObjMtlFile(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string) {
    const objPathInternal = `./${basename(objPath)}`

    const { objData, mtlData, mtlPath } = writeObjMtlData(oc, docHandle, objPathInternal)

    objData && writeFileSync(objPath, objData)

    const mtlPathExternal = `${dirname(objPath)}/${basename(mtlPath)}`
    
    mtlData && writeFileSync(mtlPathExternal, mtlData)
}

export function writeObjMtlData(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string = "./output.obj") {
    return writeObjMtlInternal(oc, docHandle, objPath)
}

function writeObjMtlInternal(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string) {
    console.log("Writing OBJ/MTL")
    const mtlPath = `${objPath.substring(0, objPath.lastIndexOf("."))}.mtl`

    console.log("> Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.log("> Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.log("> Creating file")
    const file = new oc.TCollection_AsciiString_2(objPath)

    console.log("> Creating writer")
    const writer = new oc.RWObj_CafWriter(file)

    console.log("> Writing OBJ/MTL files")
    writer.Perform_2(docHandle, map, progress)

    console.log("> Reading OBJ file")
    const objData = oc.FS.analyzePath(objPath).exists && oc.FS.readFile(objPath)

    console.log("> Reading MTL file")
    const mtlData = oc.FS.analyzePath(mtlPath).exists && oc.FS.readFile(mtlPath)

    console.log("> Deleting OBJ file")
    objData && oc.FS.unlink(objPath)

    console.log("> Deleting MTL file")
    mtlData && oc.FS.unlink(mtlPath)

    return { objData, mtlData, mtlPath }
}