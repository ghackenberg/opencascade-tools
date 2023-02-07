# OpenCascade Tools

This project provides an **easy-to-use wrapper** around [Open CASCADE Technology](https://www.opencascade.com/open-cascade-technology/), a powerful free and open source computer-aided design (CAD) kernel. The project is based on [OpenCascade.js](https://github.com/donalffons/opencascade.js/), a WebAssembly port of the original native C++ library.

For now, you can use `opencascade-tools` to convert [STEP files](https://en.wikipedia.org/wiki/ISO_10303-21) into [OBJ files](https://en.wikipedia.org/wiki/Wavefront_.obj_file) (Wavefront Technologies) as well as [GLTF/GLB files](https://en.wikipedia.org/wiki/GlTF) (Khronos Group). In the future, we plan to add more functionality depending on community requests.

## User guide

Install `opencascade-tools` using `npm` **(coming soon)**:

```
npm install -g opencascade-tools
```

### Command line interface (CLI)

Convert STEP file to OBJ file, GLTF file, and GLB file with standard values for the parameters of the triangulation progress:

```
opencascade-tools <path/to/stepFile>
```

Convert STEP file to OBJ file, GLTF file, and GLB file with custom value for the linear deflection parameter of the triangulation process:

```
opencascade-tools --linDeflection 1 <path/to/stepFile>
```

Convert STEP file to OBJ file, GLTF file, and GLB file with custom value for the angular deflection parameter of the triangulation process:

```
opencascade-tools --angDeflection 1 <path/to/stepFile>
```

### Application programming interface (API)

Convert STEP file to OBJ file, GLTF file, and GLB file with standard values for the parameters of the triangulation progress:

```ts
import { init, readStep, triangulate, writeObj, writeGltf, writeGlb } from 'opencascade-tools'

async function run() {
    const oc = await init()

    const docHandle = readStep(oc, '<path/to/stepFile>')

    triangulate(oc, docHandle.get())

    writeObjFile(oc, docHandle, '<path/to/objFile>')
    writeGltfFile(oc, docHandle, '<path/to/gltfFile>')
    writeGlbFile(oc, docHandle, '<path/to/glbFile>')
}

run()
```

Convert STEP file to OBJ file, GLTF file, and GLB file with custom values for the parameters of the triangulation progress:

```ts
import { init, readStep, triangulate, writeObj, writeGltf, writeGlb } from 'opencascade-tools'

async function run() {
    const oc = await init()

    const linDeflection = 0.1
    const isRelative = false
    const angDeflection = 0.1
    const isInParallel = false

    const docHandle = readStep(oc, '<path/to/stepFile>', linDeflection, isRelative, angDeflection, isInParallel)

    triangulate(oc, docHandle.get())

    writeObjFile(oc, docHandle, '<path/to/objFile>')
    writeGltfFile(oc, docHandle, '<path/to/gltfFile>')
    writeGlbFile(oc, docHandle, '<path/to/glbFile>')
}

run()
```

## Developer guide

Clone the Git repository:

```
git clone https://github.com/ghackenberg/opencascade-tools.git
```

Install development and production dependencies:

```
cd opencascade-tools && npm install
```

Run test case defined in `package.json`:

```
cd opencascade-tools && npm start
```

Compile TypeScript sources to JavaScript "binaries":

```
cd opencascade-tools && npm run build
```