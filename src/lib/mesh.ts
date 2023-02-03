import { OpenCascadeInstance, TDocStd_Document, TopoDS_Shape } from "opencascade.js/dist/opencascade.full.js"

export function triangulate(oc: OpenCascadeInstance, doc: TDocStd_Document, linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {
    console.log("Triangulating shapes")

    console.log("> Creating tool")
    const tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()

    console.log("> Creating builder")
    const builder = new oc.BRep_Builder()

    console.log("> Creating compound")
    const compound = new oc.TopoDS_Compound()

    console.log("> Making compound")
    builder.MakeCompound(compound)

    console.log("> Creating sequence")
    const sequence = new oc.TDF_LabelSequence_1()

    console.log("> Getting shapes")
    tool.GetFreeShapes(sequence)

    console.log("> Getting labels")
    for (var index = sequence.Lower(); index <= sequence.Upper(); index++) {
        console.log("  > Getting label")
        const label = sequence.Value(index)

        console.log("  > Getting shape")
        const shape = oc.XCAFDoc_ShapeTool.GetShape_2(label)

        if (shape) {
            console.log("  > Adding shape")
            builder.Add(compound, shape)
        }
    }

    console.log("> Creating algorithm")
    new oc.BRepMesh_IncrementalMesh_2(compound, linDeflection, isRelative, angDeflection, isInParallel)

    return doc
}