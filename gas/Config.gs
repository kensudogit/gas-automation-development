/** Non-secret configuration via Script Properties (Project settings). */
function getConfig_(key, optionalDefault) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (value !== null && value !== '') return value;
  if (optionalDefault !== undefined) return optionalDefault;
  throw new Error('Missing Script Property: ' + key);
}

function setConfig_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, String(value));
}
