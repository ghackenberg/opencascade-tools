import initOpenCascade from 'opencascade.js/dist/node.js'

export async function init() {
    console.log("Initializing WebAssembly version of OpenCASCADE Technology")

    const start = Date.now()

    const oc = await initOpenCascade()

    const end = Date.now()

    console.log(`WebAssembly version of OpenCASCADE Technology initialized successfully in ${end - start} ms`)

    return oc
}