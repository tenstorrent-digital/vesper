/**
 * GPU renderer for glass refraction maps
 *
 * A fragment shader models each glass surface as a slab with a convex
 * squircle bezel around its edge (steep at the rim, flattening smoothly into
 * the face). For every pixel it traces a ray through the curved surface
 * (Snell's law), and writes the resulting lateral offset into an image:
 *
 * - red: horizontal displacement (`0.5` is neutral)
 * - green: vertical displacement (`0.5` is neutral)
 * - blue: specular rim light intensity
 *
 * The image is consumed by an SVG `<feDisplacementMap>` (see `./filter.ts`),
 * which bends whatever is rendered behind the element. Like Apple's glass
 * material, the rim acts as a prism that bends light from just beyond the
 * edge into view, so content around the glass appears to wrap into its bezel
 *
 * @see https://kube.io/blog/liquid-glass-css-svg
 */

export interface GlassSurface {
  /** element width in css pixels */
  width: number;
  /** element height in css pixels */
  height: number;
  /** corner radius in css pixels */
  radius: number;
  /** width of the curved bezel (measured inwards from the edge) in css pixels */
  bezel: number;
  /** thickness of the virtual glass slab in css pixels */
  thickness: number;
  /** index of refraction of the glass (air is `1`) */
  ior: number;
  /** direction the light comes from, in radians (`0` points right, positive is clockwise) */
  lightAngle: number;
  /** map pixels rendered per css pixel */
  resolution: number;
}

export interface GlassMap {
  /** `data:` url of the rendered refraction map */
  url: string;
  /** largest displacement (in css pixels) encoded in the map */
  maxDisplacement: number;
}

const VERTEX_SHADER = /* glsl */ `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec2 u_size;
uniform float u_radius;
uniform float u_bezel;
uniform float u_thickness;
uniform float u_ior;
uniform float u_resolution;
uniform float u_maxDisplacement;
uniform vec2 u_light;

// signed distance to a rounded rectangle centered on the origin
float sdRoundRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// convex squircle profile: 0 at the outer edge, rising to 1 at the end of the bezel
float surface(float x) {
  return pow(1.0 - pow(1.0 - x, 3.0), 1.0 / 3.0);
}

void main() {
  vec2 halfSize = u_size * 0.5;

  // image space (y points down) in css pixels, relative to the center
  vec2 frag = vec2(gl_FragCoord.x, u_size.y * u_resolution - gl_FragCoord.y);
  vec2 p = frag / u_resolution - halfSize;

  float distance = sdRoundRect(p, halfSize, u_radius);
  float x = clamp(-distance / u_bezel, 0.0, 1.0);

  // outward facing direction of the bezel; measured against an inner core
  // inset by at least the bezel width so the field has no seams in corners
  float coreRadius = min(max(u_radius, u_bezel), min(halfSize.x, halfSize.y));
  vec2 core = max(halfSize - coreRadius, 0.0);
  vec2 outside = max(abs(p) - core, 0.0) * sign(p);
  float outsideLength = length(outside);

  vec3 color = vec3(0.5, 0.5, 0.0);

  if (outsideLength > 0.0001 && x < 1.0 && distance <= 0.0) {
    vec2 direction = outside / outsideLength;

    // slope of the surface (height per css pixel moving inwards)
    float delta = 0.001;
    float x0 = max(x, delta);
    float slope = (surface(min(x0 + delta, 1.0)) - surface(x0 - delta)) / (2.0 * delta);
    slope = slope * u_thickness / u_bezel;

    float height = surface(x) * u_thickness;

    // surface normal tilts outwards as the bezel curves down to the edge
    vec3 normal = normalize(vec3(direction * slope, 1.0));
    vec3 ray = refract(vec3(0.0, 0.0, -1.0), normal, 1.0 / u_ior);

    // travel through the glass down to the background plane, sampling
    // outwards so the rim gathers light from beyond the edge
    vec2 displacement = -ray.xy * (height / max(-ray.z, 0.0001));
    color.rg = clamp(0.5 + 0.5 * displacement / u_maxDisplacement, 0.0, 1.0);

    // how much this part of the rim faces the light (key) or faces away (fill)
    float facing = dot(direction, u_light);
    float key = pow(max(facing, 0.0), 3.0);
    float fill = pow(max(-facing, 0.0), 3.0) * 0.55;

    // a crisp glint hugging the outer edge, strongest on the light-facing corner
    float glint = 1.0 - smoothstep(0.75, 2.75, -distance);

    // a softer sheen where the bezel is steepest
    float rim = pow(1.0 - normal.z, 1.5);

    color.b = clamp(
      glint * (0.12 + 1.1 * key + fill) + rim * (0.1 + 0.45 * (key + fill)),
      0.0,
      1.0
    );
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

// convex squircle profile (mirrors `surface` in the fragment shader)
const surface = (x: number) => Math.pow(1 - Math.pow(1 - x, 3), 1 / 3);

/**
 * Computes the lateral displacement (in css pixels) of a ray that enters the
 * glass at `x` (normalized distance from the outer edge into the bezel)
 *
 * This mirrors the math in `FRAGMENT_SHADER` and is used to find the largest
 * displacement in a map, so it can be normalized into 8 bit color channels
 */
export function getProfileDisplacement(
  x: number,
  surfaceParams: Pick<GlassSurface, "bezel" | "thickness" | "ior">,
) {
  const { bezel, thickness, ior } = surfaceParams;
  if (x >= 1 || bezel <= 0 || thickness <= 0) return 0;

  const delta = 0.001;
  const x0 = Math.max(x, delta);
  const slope =
    ((surface(Math.min(x0 + delta, 1)) - surface(x0 - delta)) / (2 * delta)) *
    (thickness / bezel);
  const height = surface(Math.max(x, 0)) * thickness;

  // normal = normalize(slope, 1), incident ray = (0, -1)
  const length = Math.hypot(slope, 1);
  const nx = slope / length;
  const nz = 1 / length;

  // snell's law (vector form, same as glsl `refract`) for a ray entering glass from air
  const eta = 1 / ior;
  const dotNI = -nz;
  const k = 1 - eta * eta * (1 - dotNI * dotNI);
  if (k < 0) return 0;

  const factor = eta * dotNI + Math.sqrt(k);
  const rayX = -factor * nx;
  const rayZ = -eta - factor * nz;

  return Math.abs(rayX * (height / Math.max(-rayZ, 0.0001)));
}

/**
 * Returns the largest displacement (in css pixels) produced by a glass profile
 */
export function getMaxDisplacement(
  surfaceParams: Pick<GlassSurface, "bezel" | "thickness" | "ior">,
) {
  let max = 0;
  for (let i = 0; i <= 256; i++) {
    max = Math.max(max, getProfileDisplacement(i / 256, surfaceParams));
  }
  return max;
}

interface Renderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  uniforms: Record<
    | "size"
    | "radius"
    | "bezel"
    | "thickness"
    | "ior"
    | "resolution"
    | "maxDisplacement"
    | "light",
    WebGLUniformLocation | null
  >;
}

// `undefined` until first use, `null` when webgl is unavailable
let renderer: Renderer | null | undefined;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createRenderer = (): Renderer | null => {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    stencil: false,
  });
  if (!gl) return null;

  const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);

  // one triangle that covers the whole viewport
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  // start over with a fresh context if the gpu drops this one
  canvas.addEventListener("webglcontextlost", () => {
    renderer = undefined;
  });

  return {
    canvas,
    gl,
    uniforms: {
      size: gl.getUniformLocation(program, "u_size"),
      radius: gl.getUniformLocation(program, "u_radius"),
      bezel: gl.getUniformLocation(program, "u_bezel"),
      thickness: gl.getUniformLocation(program, "u_thickness"),
      ior: gl.getUniformLocation(program, "u_ior"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      maxDisplacement: gl.getUniformLocation(program, "u_maxDisplacement"),
      light: gl.getUniformLocation(program, "u_light"),
    },
  };
};

/**
 * Renders a refraction map for a glass surface on the gpu
 *
 * @returns the rendered map, or `null` when webgl is unavailable
 */
export function renderGlassMap(surfaceParams: GlassSurface): GlassMap | null {
  if (renderer === undefined) renderer = createRenderer();
  if (!renderer) return null;

  const { canvas, gl, uniforms } = renderer;
  const { width, height, radius, bezel, thickness, ior, resolution } =
    surfaceParams;

  const maxDisplacement = Math.max(getMaxDisplacement(surfaceParams), 0.0001);

  canvas.width = Math.max(1, Math.round(width * resolution));
  canvas.height = Math.max(1, Math.round(height * resolution));
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.uniform2f(uniforms.size, width, height);
  gl.uniform1f(uniforms.radius, Math.min(radius, width / 2, height / 2));
  gl.uniform1f(uniforms.bezel, Math.max(bezel, 0.0001));
  gl.uniform1f(uniforms.thickness, thickness);
  gl.uniform1f(uniforms.ior, ior);
  gl.uniform1f(uniforms.resolution, canvas.width / width);
  gl.uniform1f(uniforms.maxDisplacement, maxDisplacement);
  gl.uniform2f(
    uniforms.light,
    Math.cos(surfaceParams.lightAngle),
    Math.sin(surfaceParams.lightAngle),
  );

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if (gl.isContextLost()) return null;

  return { url: canvas.toDataURL("image/png"), maxDisplacement };
}
