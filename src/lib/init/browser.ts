import initOpenCascade from 'opencascade.js/dist/index.js'

export async function init() {
    console.log("Initializing WebAssembly version of OpenCascade")

    const start = Date.now()

    const oc = await initOpenCascade()

    const end = Date.now()

    console.log(`WebAssembly version of OpenCascade initialized successfully in ${end - start} ms`)

    return oc
}