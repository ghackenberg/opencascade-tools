import initOpenCascade from 'opencascade.js/dist/node.js'

export async function init() {
    console.log("Initializing WebAssembly version of OpenCascade")

    const oc = await initOpenCascade()

    console.log("WebAssembly version of OpenCascade initialized successfully")

    return oc
}