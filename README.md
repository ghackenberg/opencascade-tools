# OpenCascade Tools

This project provides an **easy-to-use wrapper** around [Open CASCADE Technology](https://www.opencascade.com/open-cascade-technology/), a powerful free and open source computer-aided design (CAD) kernel. The project is based on [OpenCascade.js](https://github.com/donalffons/opencascade.js/), a WebAssembly port of the original native C++ library.

For now, you can use `opencascade-tools` to convert [STEP files](https://en.wikipedia.org/wiki/ISO_10303-21) into [OBJ files](https://en.wikipedia.org/wiki/Wavefront_.obj_file) (Wavefront Technologies) as well as [GLTF/GLB files](https://en.wikipedia.org/wiki/GlTF) (Khronos Group). In the future, we plan to add more functionality depending on community requests.

Below you find a short *user guide* and an even shorter *developer guide* 😉.

## User guide

Install `opencascade-tools` on your machine (requires [Node.js](https://nodejs.org/) and the [Node Package Manager (NPM)](https://www.npmjs.com/package/npm)):

```
npm install -g opencascade-tools
```

Afterwards you can use our *command line interface (CLI)* and/or our *application programming interface (API)*.

### Command line interface (CLI)

Our CLI provides a few *general functions* (as the CLI of most CLI-based programs) and some (domain-) *specific functions*:

#### General functions

Get help on how to use the command line interface of `opencascade-tools`:

```
opencascade-tools --help
```

Get the version number of `opencascade-tools` as installed on your machine:

```
opencascade-tools --version
```

#### Specific functions

Convert STEP file to OBJ file, GLTF file, or GLB file with standard values for the parameters of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> <path/to/stepFile>
```

Convert STEP file to OBJ file, GLTF file, or GLB file with custom value for the linear deflection parameter of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> --linDeflection 1 <path/to/stepFile>
```

Convert STEP file to OBJ file, GLTF file, or GLB file with custom value for the angular deflection parameter of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> --angDeflection 1 <path/to/stepFile>
```

### Application programming interface (API)

Convert STEP file to OBJ file, GLTF file, and GLB file with standard values for the parameters of the triangulation algorithm:

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

Convert STEP file to OBJ file, GLTF file, and GLB file with custom values for the parameters of the triangulation algorithm:

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

Run test cases defined in `package.json`:

```
cd opencascade-tools && npm run test
```

Compile TypeScript sources to JavaScript "binaries":

```
cd opencascade-tools && npm run build
```