"use strict";

function sortJson(json, order) {
  if (json === undefined) {
    return undefined;
  }
  if (Array.isArray(json)) {
    return sortJsonArray(json, order);
  }
  if (typeof json === "object") {
    return sortJsonObject(json, order);
  }
  throw new TypeError(`Not a sortable json`);
}

module.exports.sortJson = sortJson;

function sortJsonArray(json, order) {
  if (order === undefined) {
    return json;
  }
  if (order === "alpha") {
    return [...json].sort();
  }
  throw new TypeError(`Invalid array order [${order}]`);
}

function sortJsonObject(json, order) {
  if (order === undefined) {
    return json;
  }
  if (order === "alpha") {
    const result = {};
    for (const key of Object.keys(json).sort()) {
      result[key] = json[key];
    }
    return result;
  }
  if (Array.isArray(order)) {
    const result = {};
    for (const key of order) {
      if (typeof key === "string") {
        result[key] = json[key];
      } else if (Array.isArray(key)) {
        const [x, y] = key;
        result[x] = sortJson(json[x], y);
      }
    }
    for (const key of Object.keys(json)) {
      if (!(key in result)) {
        result[key] = json[key];
      }
    }
    return result;
  }
  throw new TypeError(`Invalid object order [${order}]`);
}
