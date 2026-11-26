// Helper functions for validating input and parsing IDs
export function isValidTitle(title) {
  return typeof title === "string" && title.trim() !== "";
}

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}