import vocabData from './vocab.json';

export const MODULE_IDS = [1, 2, 3];

export const getModule = (moduleId) => vocabData[`module_${moduleId}`];

export const getModuleWords = (moduleId) => getModule(moduleId)?.words ?? [];

export const ALL_WORDS = MODULE_IDS.flatMap(getModuleWords);
