import { writeFileSync } from "fs"
import { basename, dirname } from "path"
import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"

export function writeObjFile(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string) {
    const objPathInternal = `./${basename(objPath)}`

    const { objData, mtlData, mtlPath } = writeObjData(oc, docHandle, objPathInternal)

    objData && writeFileSync(objPath, objData)

    const mtlPathExternal = `${dirname(objPath)}/${basename(mtlPath)}`
    
    mtlData && writeFileSync(mtlPathExternal, mtlData)
}

export function writeObjData(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string = "./output.obj") {
    return writeObjInternal(oc, docHandle, objPath)
}

function writeObjInternal(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, objPath: string) {
    console.log("> Writing OBJ/MTL")
    const mtlPath = `${objPath.substring(0, objPath.lastIndexOf("."))}.mtl`

    console.debug("  > Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.debug("  > Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.debug("  > Creating file")
    const file = new oc.TCollection_AsciiString_2(objPath)

    console.debug("  > Creating writer")
    const writer = new oc.RWObj_CafWriter(file)

    console.debug("  > Writing OBJ/MTL files")
    writer.Perform_2(docHandle, map, progress)

    console.debug("  > Reading OBJ file")
    const objData = oc.FS.analyzePath(objPath).exists && oc.FS.readFile(objPath)

    console.debug("  > Reading MTL file")
    const mtlData = oc.FS.analyzePath(mtlPath).exists && oc.FS.readFile(mtlPath)

    console.debug("  > Deleting OBJ file")
    objData && oc.FS.unlink(objPath)

    console.debug("  > Deleting MTL file")
    mtlData && oc.FS.unlink(mtlPath)

    return { objData, mtlData, mtlPath }
}