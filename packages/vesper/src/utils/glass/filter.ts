import {
  type GlassMap,
  type GlassSurface,
  renderGlassMap,
} from "@/utils/glass/shader";

export const GLASS_DEPTHS = ["shallow", "regular", "deep"] as const;

export type GlassDepth = (typeof GLASS_DEPTHS)[number];

interface GlassPreset {
  /** bezel width as a fraction of the element's shortest half-side */
  bezelRatio: number;
  /** upper bound for the bezel width in css pixels */
  maxBezel: number;
  /** virtual glass thickness in css pixels */
  thickness: number;
  /** frost (gaussian blur standard deviation) in css pixels */
  blur: number;
  /** backdrop saturation multiplier */
  saturation: number;
  /** strength of the specular rim light from `0` to `1` */
  specular: number;
  /** chromatic dispersion, as a fraction of the displacement */
  dispersion: number;
}

const PRESETS: { [D in GlassDepth]: GlassPreset } = {
  // small controls (checkboxes, badges, tags)
  shallow: {
    bezelRatio: 0.7,
    maxBezel: 10,
    thickness: 14,
    blur: 0.5,
    saturation: 1.5,
    specular: 0.7,
    dispersion: 0,
  },
  // standard controls (buttons, inputs, chips)
  regular: {
    bezelRatio: 0.8,
    maxBezel: 20,
    thickness: 36,
    blur: 0.75,
    saturation: 1.6,
    specular: 0.85,
    dispersion: 0.06,
  },
  // floating surfaces (menus, modals, sheets, toasts)
  deep: {
    bezelRatio: 0.8,
    maxBezel: 36,
    thickness: 72,
    blur: 3,
    saturation: 1.8,
    specular: 0.95,
    dispersion: 0.1,
  },
};

// light comes from the top left, like the rest of the system's shadows
const LIGHT_ANGLE = (-125 * Math.PI) / 180;

// glass index of refraction
const IOR = 1.5;

// cap the size of each map; refraction maps are smooth so large surfaces
// can be rendered at a lower resolution and upscaled by the filter
const MAX_MAP_PIXELS = 640_000;

export interface GlassFilterParams {
  surface: GlassSurface;
  blur: number;
  saturation: number;
  specular: number;
  dispersion: number;
}

const round = (n: number, precision = 100) =>
  Math.round(n * precision) / precision;

/**
 * Resolves the refraction filter parameters for an element of a given size
 */
export function getGlassFilterParams(options: {
  width: number;
  height: number;
  radius: number;
  depth: GlassDepth;
  devicePixelRatio?: number;
}): GlassFilterParams {
  const { width, height, depth, devicePixelRatio = 1 } = options;
  const preset = PRESETS[depth];

  const shortestHalfSide = Math.min(width, height) / 2;
  const radius = Math.min(Math.max(options.radius, 0), shortestHalfSide);
  const bezel = Math.max(
    1,
    Math.min(shortestHalfSide * preset.bezelRatio, preset.maxBezel),
  );

  // smaller controls get proportionally thinner glass
  const thickness = Math.min(preset.thickness, bezel * 2);

  const idealResolution = Math.min(Math.max(devicePixelRatio, 1), 2);
  const maxResolution = Math.sqrt(MAX_MAP_PIXELS / (width * height));
  const resolution = round(Math.min(idealResolution, maxResolution), 1000);

  return {
    surface: {
      width,
      height,
      radius: round(radius),
      bezel: round(bezel),
      thickness: round(thickness),
      ior: IOR,
      lightAngle: LIGHT_ANGLE,
      resolution,
    },
    blur: preset.blur,
    saturation: preset.saturation,
    specular: preset.specular,
    dispersion: preset.dispersion,
  };
}

/**
 * A stable cache key for a set of filter parameters
 */
export const getGlassFilterKey = ({ surface, ...rest }: GlassFilterParams) =>
  [
    surface.width,
    surface.height,
    surface.radius,
    surface.bezel,
    surface.thickness,
    surface.ior,
    round(surface.lightAngle),
    surface.resolution,
    rest.blur,
    rest.saturation,
    rest.specular,
    rest.dispersion,
  ].join(":");

// least recently used cache of rendered maps, shared by every registry
const MAX_CACHED_MAPS = 96;
const mapCache = new Map<string, GlassMap>();

const getGlassMap = (surface: GlassSurface): GlassMap | null => {
  const key = [
    surface.width,
    surface.height,
    surface.radius,
    surface.bezel,
    surface.thickness,
    surface.ior,
    round(surface.lightAngle),
    surface.resolution,
  ].join(":");

  const cached = mapCache.get(key);
  if (cached) {
    // move to the end so it is evicted last
    mapCache.delete(key);
    mapCache.set(key, cached);
    return cached;
  }

  const map = renderGlassMap(surface);
  if (!map) return null;

  mapCache.set(key, map);
  if (mapCache.size > MAX_CACHED_MAPS) {
    const oldest = mapCache.keys().next().value;
    if (oldest !== undefined) mapCache.delete(oldest);
  }

  return map;
};

const SVG_NS = "http://www.w3.org/2000/svg";

const createSvgElement = (
  doc: Document,
  tag: string,
  attributes: Record<string, string | number>,
) => {
  const element = doc.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
};

// keeps one color channel (and alpha) from an image
const CHANNEL_MATRICES = {
  red: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  green: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  blue: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
};

/**
 * Builds the svg filter graph that refracts an element's backdrop:
 *
 * 1. frost the backdrop with a light gaussian blur
 * 2. bend it through the refraction map (once per color channel when dispersion is enabled)
 * 3. saturate it
 * 4. add the specular rim light encoded in the map's blue channel
 */
export function createGlassFilterElement(
  doc: Document,
  id: string,
  params: GlassFilterParams,
  map: GlassMap,
) {
  const { width, height } = params.surface;
  const scale = round(map.maxDisplacement * 2);

  // the rim samples the backdrop beyond the element's edge, so grow the filter
  // region to cover the farthest sample (otherwise it reads transparent pixels)
  const padding = Math.ceil(
    map.maxDisplacement * (1 + params.dispersion) + params.blur * 3,
  );

  const filter = createSvgElement(doc, "filter", {
    id,
    x: -padding,
    y: -padding,
    width: width + padding * 2,
    height: height + padding * 2,
    filterUnits: "userSpaceOnUse",
    primitiveUnits: "userSpaceOnUse",
    "color-interpolation-filters": "sRGB",
  });

  const primitives: Element[] = [
    createSvgElement(doc, "feGaussianBlur", {
      in: "SourceGraphic",
      stdDeviation: params.blur,
      edgeMode: "duplicate",
      result: "frost",
    }),
    createSvgElement(doc, "feImage", {
      href: map.url,
      x: 0,
      y: 0,
      width,
      height,
      preserveAspectRatio: "none",
      result: "map",
    }),
  ];

  const displace = (factor: number, result: string) =>
    createSvgElement(doc, "feDisplacementMap", {
      in: "frost",
      in2: "map",
      scale: round(scale * factor),
      xChannelSelector: "R",
      yChannelSelector: "G",
      result,
    });

  if (params.dispersion > 0) {
    // red bends least and blue bends most, like light through a prism
    const channels = [
      ["red", 1 - params.dispersion],
      ["green", 1],
      ["blue", 1 + params.dispersion],
    ] as const;

    for (const [channel, factor] of channels) {
      primitives.push(
        displace(factor, `${channel}-displaced`),
        createSvgElement(doc, "feColorMatrix", {
          in: `${channel}-displaced`,
          type: "matrix",
          values: CHANNEL_MATRICES[channel],
          result: channel,
        }),
      );
    }

    primitives.push(
      createSvgElement(doc, "feComposite", {
        in: "red",
        in2: "green",
        operator: "arithmetic",
        k2: 1,
        k3: 1,
        result: "red-green",
      }),
      createSvgElement(doc, "feComposite", {
        in: "red-green",
        in2: "blue",
        operator: "arithmetic",
        k2: 1,
        k3: 1,
        result: "refracted",
      }),
    );
  } else {
    primitives.push(displace(1, "refracted"));
  }

  primitives.push(
    createSvgElement(doc, "feColorMatrix", {
      in: "refracted",
      type: "saturate",
      values: params.saturation,
      result: "saturated",
    }),
    // turn the blue channel of the map into white light
    createSvgElement(doc, "feColorMatrix", {
      in: "map",
      type: "matrix",
      values: `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 ${params.specular} 0 0`,
      result: "specular",
    }),
    createSvgElement(doc, "feComposite", {
      in: "specular",
      in2: "saturated",
      operator: "over",
    }),
  );

  filter.append(...primitives);
  return filter;
}

interface FilterRecord {
  id: string;
  element: Element;
  refs: number;
}

interface Registry {
  svg: Element;
  filters: Map<string, FilterRecord>;
  sweep: ReturnType<typeof setTimeout> | undefined;
}

// filters are referenced with `url(#id)`, which only resolves within the same
// tree, so each document and shadow root gets its own set of filters
const registries = new WeakMap<Document | ShadowRoot, Registry>();

let filterCount = 0;

// keep unused filters around for a moment, in case an element resizes back
const SWEEP_DELAY = 2000;

const getRegistry = (host: Document | ShadowRoot): Registry => {
  const existing = registries.get(host);
  if (existing?.svg.isConnected) return existing;

  const doc = host instanceof Document ? host : host.ownerDocument;
  const svg = createSvgElement(doc, "svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: 0,
    height: 0,
    "data-vesper-glass-filters": "",
    style:
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none",
  });
  const registry: Registry = { svg, filters: new Map(), sweep: undefined };

  if (host instanceof Document) host.body.append(svg);
  else host.append(svg);

  registries.set(host, registry);
  return registry;
};

const scheduleSweep = (registry: Registry) => {
  if (registry.sweep !== undefined) return;

  registry.sweep = setTimeout(() => {
    registry.sweep = undefined;

    for (const [key, record] of registry.filters) {
      if (record.refs > 0) continue;
      record.element.remove();
      registry.filters.delete(key);
    }
  }, SWEEP_DELAY);
};

/**
 * Acquires a shared refraction filter for an element. Elements with the same
 * size, shape, and depth share one filter
 *
 * @returns the filter's `id` and a function to release it, or `null` if the
 * refraction map could not be rendered (eg. webgl is unavailable)
 */
export function acquireGlassFilter(
  element: Element,
  params: GlassFilterParams,
): { id: string; release: () => void } | null {
  const root = element.getRootNode();
  const host = root instanceof ShadowRoot ? root : element.ownerDocument;
  const registry = getRegistry(host);
  const key = getGlassFilterKey(params);

  let record = registry.filters.get(key);

  if (!record) {
    const map = getGlassMap(params.surface);
    if (!map) return null;

    const id = `vesper-glass-${++filterCount}`;
    const doc = host instanceof Document ? host : host.ownerDocument;
    const filterElement = createGlassFilterElement(doc, id, params, map);
    registry.svg.append(filterElement);

    record = { id, element: filterElement, refs: 0 };
    registry.filters.set(key, record);
  }

  record.refs += 1;
  const acquired = record;
  let released = false;

  return {
    id: acquired.id,
    release: () => {
      if (released) return;
      released = true;
      acquired.refs -= 1;
      if (acquired.refs <= 0) scheduleSweep(registry);
    },
  };
}
