# OpenCascade CLI

This project provides a **command line interface (CLI)** for [Open CASCADE Technology](https://www.opencascade.com/open-cascade-technology/), a powerful free and open source CAD kernel.

For now, you can use `opencascade-cli` to convert STEP files into OBJ/MTL files, GLB files, and GLTF files. For this conversion you need to triangulate the geometry data defined in STEP files. You can tune the triangulation quality using command line parameters.

## User guide

Install `opencascade-cli` using `npm` (coming soon):

```
npm install -g opencascade-cli
```

Convert STEP file with standard values for the parameters of the triangulation progress:

```
opencascade-cli <path/to/stepFile>
```

Convert STEP file with custom value for the linear deflection parameter of the triangulation process:

```
opencascade-cli --linDeflection 1 <path/to/stepFile>
```

Convert STEP file with custom value for the angular deflection parameter of the triangulation process:

```
opencascade-cli --angDeflection 1 <path/to/stepFile>
```

## Developer guide

Clone the Git repository:

```
git clone https://github.com/ghackenberg/opencascade-cli.git
```

Install development and production dependencies:

```
cd opencascade-cli && npm install
```

Run test case defined in `package.json`:

```
cd opencascade-cli && npm start
```

Compile TypeScript sources to JavaScript "binaries":

```
cd opencascade-cli && npm run build
```