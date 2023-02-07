# OpenCascade Tools

This project provides an easy-to-use wrapper around [Open CASCADE Technology](https://www.opencascade.com/open-cascade-technology/), a powerful free and open source computer-aided design (CAD) kernel.

For now, you can use `opencascade-tools` to convert [STEP files](https://en.wikipedia.org/wiki/ISO_10303-21) into [OBJ files](https://en.wikipedia.org/wiki/Wavefront_.obj_file) as well as [GLTF/GLB files](https://en.wikipedia.org/wiki/GlTF). In the future, we plan to add more functionality depending on community requests.

## User guide

Install `opencascade-tools` using `npm` **(coming soon)**:

```
npm install -g opencascade-tools
```

### Command line interface (CLI)

Convert STEP file with standard values for the parameters of the triangulation progress:

```
opencascade-tools <path/to/stepFile>
```

Convert STEP file with custom value for the linear deflection parameter of the triangulation process:

```
opencascade-tools --linDeflection 1 <path/to/stepFile>
```

Convert STEP file with custom value for the angular deflection parameter of the triangulation process:

```
opencascade-tools --angDeflection 1 <path/to/stepFile>
```

### Application programming interface (API)

*Coming soon!*

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