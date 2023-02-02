import { OpenCascadeInstance, TopoDS_Shape } from "opencascade.js/dist/opencascade.full.js"

export function triangulateShape(oc: OpenCascadeInstance, shape: TopoDS_Shape, linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {
    return triangulateShapes(oc, [shape], linDeflection, isRelative, angDeflection, isInParallel)
}

export function triangulateShapes(oc: OpenCascadeInstance, shapes: TopoDS_Shape[], linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {
    console.log("Triangulating shapes")

    console.log("> Creating string")
    const format = new oc.TCollection_ExtendedString_1()

    console.log("> Creating document")
    const doc = new oc.TDocStd_Document(format)

    console.log("> Creating tool")
    const tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()

    console.log("> Processing shapes")
    for (const shape of shapes) {
        console.log("   > Processing shape")

        console.log ("    > Setting shape")
        tool.SetShape(tool.NewShape(), shape)

        console.log ("    > Triangulating shape")
        new oc.BRepMesh_IncrementalMesh_2(shape, linDeflection, isRelative, angDeflection, isInParallel)
    }

    return doc
}