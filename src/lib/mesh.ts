import { OpenCascadeInstance, TDocStd_Document, TopoDS_Shape } from "opencascade.js/dist/opencascade.full.js"

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

export function triangulateDocument(oc: OpenCascadeInstance, doc: TDocStd_Document, linDeflection = 0.1, isRelative = false, angDeflection = 0.1, isInParallel = false) {
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

    console.log("lower", sequence.Lower())
    console.log("upper", sequence.Upper())
    console.log("length", sequence.Length())
    console.log("size", sequence.Size())

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
    const algo = new oc.BRepMesh_IncrementalMesh_2(compound, linDeflection, isRelative, angDeflection, isInParallel)

    console.log("> Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.log("> Performing algorithm")
    algo.Perform_1(progress)

    return doc
}