# opencascade-tools

This project provides an **easy-to-use wrapper** around [Open CASCADE Technology](https://www.opencascade.com/open-cascade-technology/), a powerful free and open source computer-aided design (CAD) kernel. The project is based on [OpenCascade.js](https://github.com/donalffons/opencascade.js/), a WebAssembly port of the original native C++ library.

For now, you can use `opencascade-tools` to convert [IGES files](https://en.wikipedia.org/wiki/IGES) and [STEP files](https://en.wikipedia.org/wiki/ISO_10303-21) into [OBJ files](https://en.wikipedia.org/wiki/Wavefront_.obj_file) (Wavefront Technologies) and [GLTF/GLB files](https://en.wikipedia.org/wiki/GlTF) (Khronos Group). In the future, we plan to add more functionality depending on community requests.

Below you find a short *user guide* and an even shorter *developer guide* 😉.

## 📙 User guide

Install `opencascade-tools` on your machine (requires [Node.js](https://nodejs.org/) and the [Node Package Manager (NPM)](https://www.npmjs.com/package/npm)):

```
npm install -g opencascade-tools
```

Afterwards you can use our *command line interface (CLI)* and/or our *application programming interface (API)*.

### 🖥️ Command line interface (CLI)

Our CLI provides a few *general functions* (as the CLI of most CLI-based programs) and some (domain-) *specific functions*:

#### ⚙️ General functions

Get help on how to use the command line interface of `opencascade-tools`:

```
opencascade-tools --help
```

Get the version number of `opencascade-tools` as installed on your machine:

```
opencascade-tools --version
```

#### ⚙️ Specific functions

Convert IGES file or STEP file to OBJ file, GLTF file, or GLB file with standard values for the parameters of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> <path/to/igesOrStepFile>
```

Convert IGES file or STEP file to OBJ file, GLTF file, or GLB file with custom value for the linear deflection parameter of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> --linDeflection 1 <path/to/igesOrStepFile>
```

Convert IGES file or STEP file to OBJ file, GLTF file, or GLB file with custom value for the angular deflection parameter of the triangulation algorithm:

```
opencascade-tools --format <obj|gltf|glb> --angDeflection 1 <path/to/igesOrStepFile>
```

### 🖥️ Application programming interface (API)

Convert STEP file to OBJ file, GLTF file, and GLB file with standard values for the parameters of the triangulation algorithm:

```ts
import { init, readIgesFile, readStepFile, triangulate, writeObjFile, writeGltfFile, writeGlbFile } from 'opencascade-tools'

async function run() {
    const oc = await init()

    const docHandle = readIgesFile(oc, '<path/to/igesFile>')
    // or
    const docHandle = readStepFile(oc, '<path/to/stepFile>')

    triangulate(oc, docHandle.get())

    writeObjFile(oc, docHandle, '<path/to/objFile>')
    writeGltfFile(oc, docHandle, '<path/to/gltfFile>')
    writeGlbFile(oc, docHandle, '<path/to/glbFile>')
}

run()
```

Convert STEP file to OBJ file, GLTF file, and GLB file with custom values for the parameters of the triangulation algorithm:

```ts
import { init, readIgesFile, readStepFile, triangulate, writeObjFile, writeGltfFile, writeGlbFile } from 'opencascade-tools'

async function run() {
    const oc = await init()

    const docHandle = readIgesFile(oc, '<path/to/igesFile>')
    // or
    const docHandle = readStepFile(oc, '<path/to/stepFile>')

    const linDeflection = 0.1
    const isRelative = false
    const angDeflection = 0.1
    const isInParallel = false

    triangulate(oc, docHandle.get(), linDeflection, isRelative, angDeflection, isInParallel)

    writeObjFile(oc, docHandle, '<path/to/objFile>')
    writeGltfFile(oc, docHandle, '<path/to/gltfFile>')
    writeGlbFile(oc, docHandle, '<path/to/glbFile>')
}

run()
```

## 📙 Developer guide

Clone the Git repository:

```
git clone https://github.com/ghackenberg/opencascade-tools.git
```

Install development and production dependencies:

```
cd opencascade-tools && npm install
```

Afterwards you can use the following *scripts*:

### 🖥️ Scripts

Remove JavaScript binaries and TypeScript type definitions from previous builds:

```
cd opencascade-tools && npm run clean
```

Compile TypeScript sources to JavaScript binaries and TypeScript type definitions:

```
cd opencascade-tools && npm run build
```

Install your version of `opencascade-tools` into local NPM registry:

```
cd opencascade-tools && npm run deploy-local
```

Run all test cases with local installation of `opencascade-tools`:

```
cd opencascade-tools && npm run test-all
```

Run IGES test cases with local installation of `opencascade-tools`:

```
cd opencascade-tools && npm run test-iges
```

Run STEP test cases with local installation of `opencascade-tools`:

```
cd opencascade-tools && npm run test-step
```

Shorthand for clean, build, deploy local and run all test cases (see above scripts):

```
cd opencascade-tools && npm run test
```

Shorthand for clean, build, and publish to global NPM registry (see above scripts):

```
cd opencascade-tools && npm run deploy-global
```