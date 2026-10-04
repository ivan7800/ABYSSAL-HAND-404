export function safeStorage(){try{return globalThis.localStorage;}catch{return null;}}
export function safeIndexedDB(){try{return globalThis.indexedDB;}catch{return null;}}
