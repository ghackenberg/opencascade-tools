import initOpenCascade from 'opencascade.js/dist/node.js'

export async function init() {
    console.log("Initializing WebAssembly version of OpenCASCADE Technology")

    const oc = await initOpenCascade()

    console.log("WebAssembly version of OpenCASCADE Technology initialized successfully")

    return oc
}