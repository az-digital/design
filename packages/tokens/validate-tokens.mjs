import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const COLOR_HEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const DIMENSION_UNITS = new Set(['px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax', 'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc']);
const DIMENSION = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/i;
const STROKE_STYLES = new Set(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']);

function isAlias(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function isDimension(value) {
  if (isAlias(value)) return true;
  if (typeof value === 'string') return DIMENSION.test(value);
  return typeof value === 'object' && value !== null && typeof value.value === 'number' && Number.isFinite(value.value) && DIMENSION_UNITS.has(value.unit);
}

function isColor(value) {
  if (typeof value === 'string') return COLOR_HEX.test(value);
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.colorSpace === 'string' &&
    Array.isArray(value.components) &&
    value.components.length >= 3 &&
    value.components.every((component) => typeof component === 'number' && Number.isFinite(component)) &&
    (value.alpha === undefined || (typeof value.alpha === 'number' && value.alpha >= 0 && value.alpha <= 1))
  );
}

function isDuration(value) {
  return (
    (typeof value === 'string' && /^-?(?:\d+\.?\d*|\.\d+)(?:ms|s)$/i.test(value)) ||
    (typeof value === 'object' && value !== null && typeof value.value === 'number' && Number.isFinite(value.value) && ['ms', 's'].includes(value.unit)) ||
    isAlias(value)
  );
}

function isStrokeStyle(value) {
  return STROKE_STYLES.has(value) || isAlias(value) || (typeof value === 'object' && value !== null && Array.isArray(value.dashArray) && value.dashArray.every(isDimension));
}

function validComposite(type, value) {
  if (typeof value !== 'object' || value === null) return false;
  if (type === 'gradient') {
    return Array.isArray(value) && value.length > 0 && value.every((stop) => stop && typeof stop === 'object' && (isColor(stop.color) || isAlias(stop.color)) && (typeof stop.position === 'number' || isAlias(stop.position)));
  }
  if (Array.isArray(value)) return type === 'shadow' && value.length > 0 && value.every((shadow) => validComposite('shadow', shadow));
  switch (type) {
    case 'border':
      return (isColor(value.color) || isAlias(value.color)) && isDimension(value.width) && isStrokeStyle(value.style);
    case 'transition':
      return (
        isDuration(value.duration) &&
        isDuration(value.delay) &&
        (Array.isArray(value.timingFunction) || (typeof value.timingFunction === 'string' && value.timingFunction.length > 0) || isAlias(value.timingFunction))
      );
    case 'shadow':
      return (
        (isColor(value.color) || isAlias(value.color)) &&
        ['offsetX', 'offsetY', 'blur', 'spread'].every((key) => isDimension(value[key])) &&
        (value.inset === undefined || typeof value.inset === 'boolean')
      );
    case 'typography': {
      const checks = [
        ['fontFamily', (field) => (typeof field === 'string' && field.length > 0) || (Array.isArray(field) && field.length > 0) || isAlias(field)],
        ['fontSize', isDimension],
        ['fontWeight', (field) => (typeof field === 'number' && Number.isFinite(field)) || (typeof field === 'string' && field.length > 0) || isAlias(field)],
        ['lineHeight', (field) => (typeof field === 'number' && Number.isFinite(field)) || isDimension(field)],
        ['letterSpacing', isDimension],
      ];
      return checks.every(([key, check]) => value[key] === undefined || check(value[key])) && checks.some(([key]) => value[key] !== undefined);
    }
    default:
      return false;
  }
}

function isValid(type, value) {
  if (isAlias(value)) return true;
  switch (type) {
    case 'color':
      return isColor(value);
    case 'dimension':
      return isDimension(value);
    case 'duration':
      return isDuration(value);
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'fontFamily':
      return (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0 && value.every((family) => typeof family === 'string' && family.length > 0));
    case 'fontWeight':
      return (typeof value === 'number' && Number.isFinite(value)) || (typeof value === 'string' && ['normal', 'bold', 'lighter', 'bolder'].includes(value));
    case 'cubicBezier':
      return Array.isArray(value) && value.length === 4 && value.every((point) => typeof point === 'number' && Number.isFinite(point)) && value[0] >= 0 && value[0] <= 1 && value[2] >= 0 && value[2] <= 1;
    case 'link':
      if (typeof value !== 'string') return false;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case 'string':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'strokeStyle':
      return isStrokeStyle(value);
    case 'border':
    case 'transition':
    case 'typography':
    case 'gradient':
    case 'shadow':
      return validComposite(type, value);
    default:
      return false;
  }
}

export function validateTokens(document) {
  const errors = [];

  function visit(node, inheritedType, path) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const type = node.$type ?? inheritedType;
    if (Object.hasOwn(node, '$value')) {
      const tokenPath = path.join('.');
      if (!type) errors.push(`${tokenPath}: missing $type`);
      else if (!isValid(type, node.$value)) errors.push(`${tokenPath}: invalid $value for type "${type}"`);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) visit(child, type, [...path, key]);
    }
  }

  visit(document, undefined, []);
  if (errors.length > 0) throw new Error(`Token validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const document = JSON.parse(await readFile(new URL('./tokens.json', import.meta.url), 'utf8'));
  validateTokens(document);
}
