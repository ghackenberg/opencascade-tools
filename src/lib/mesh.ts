import { OpenCascadeInstance, TDocStd_Document } from "opencascade.js/dist/opencascade.full.js"

export function triangulate(oc: OpenCascadeInstance, doc: TDocStd_Document, linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {
    console.log("> Triangulating shapes")

    console.debug("  > Creating tool")
    const tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()

    console.debug("  > Creating builder")
    const builder = new oc.BRep_Builder()

    console.debug("  > Creating compound")
    const compound = new oc.TopoDS_Compound()

    console.debug("  > Making compound")
    builder.MakeCompound(compound)

    console.debug("  > Creating sequence")
    const sequence = new oc.TDF_LabelSequence_1()

    console.debug("  > Getting shapes")
    tool.GetFreeShapes(sequence)

    console.debug("  > Getting labels")
    for (var index = sequence.Lower(); index <= sequence.Upper(); index++) {
        console.debug("    > Getting label")
        const label = sequence.Value(index)

        console.debug("    > Getting shape")
        const shape = oc.XCAFDoc_ShapeTool.GetShape_2(label)

        if (shape) {
            console.debug("    > Adding shape")
            builder.Add(compound, shape)
        }
    }

    console.debug("  > Creating algorithm")
    new oc.BRepMesh_IncrementalMesh_2(compound, linDeflection, isRelative, angDeflection, isInParallel)

    return doc
}