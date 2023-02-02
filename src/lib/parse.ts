import { OpenCascadeInstance } from "opencascade.js/dist/opencascade.full"

export function parse(occ: OpenCascadeInstance, data: string) {
    console.log("Parsing data")

    console.log("> Creating file")

    occ.FS.createDataFile(".", "file.step", data, true, true, true)

    const reader = new occ.STEPControl_Reader_1()

    console.log("> Reading file")
    
    const result = reader.ReadFile("./file.step")
    
    if (result == occ.IFSelect_ReturnStatus.IFSelect_RetDone) {
        console.log("> Transferring roots")

        const progress = new occ.Message_ProgressRange_1()

        reader.TransferRoots(progress)

        console.log("> Getting shape")

        const shape = reader.OneShape()

        console.log("> Unlinking file")

        occ.FS.unlink("./file.step")

        return shape
    } else {
        console.log("> Unlinking file")

        occ.FS.unlink("./file.step")

        throw 'Could not read step file'
    }
}