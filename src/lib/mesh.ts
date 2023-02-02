import { OpenCascadeInstance, TopoDS_Shape } from "opencascade.js/dist/opencascade.full"

export function triangulate(occ: OpenCascadeInstance, shapes: TopoDS_Shape[]) {
    console.log("Triangulating shapes")

    console.log("> Creating document")

    const format = new occ.TCollection_ExtendedString_1()

    const doc = new occ.TDocStd_Document(format)

    console.log("> Creating tool")

    const label = doc.Main()

    const tool = occ.XCAFDoc_DocumentTool.ShapeTool(label).get()

    console.log("> Processing shapes")

    for (const shape of shapes) {
        console.log("   > Processing shape")

        console.log ("    > Setting shape")

        tool.SetShape(tool.NewShape(), shape)

        console.log ("    > Triangulating shape")

        new occ.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.1, false)
    }

    return doc
}