/**
 * An element or document fragment that portalled content can be rendered into.
 *
 * `null` is accepted so that container state from a ref callback can be passed
 * through directly, and is treated the same as omitting the container.
 */
export type PortalContainer = HTMLElement | ShadowRoot | null;

/**
 * Resolves the container that portalled content should be rendered into.
 *
 * When a container is provided it always takes precedence. Otherwise the
 * trigger's nearest `dialog` ancestor is used, because dialogs render in their
 * own stacking context above the document body, so portalled content rendered
 * inside a dialog would otherwise appear behind it.
 *
 * Returns `undefined` when there is no container and the trigger has no
 * `dialog` ancestor, which lets the portal fall back to the document body.
 *
 * @param {PortalContainer} [container] - (optional) An explicit container to portal into
 * @param {Element | null} [trigger] - (optional) The trigger element used to look up the nearest `dialog` ancestor
 *
 * @example
 * const container = getPortalContainer(props.container, trigger);
 */
export function getPortalContainer(
  container: PortalContainer | undefined,
  trigger: Element | null | undefined,
): PortalContainer | undefined {
  return container ?? trigger?.closest("dialog") ?? undefined;
}
