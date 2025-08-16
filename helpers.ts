import { NODE_ENVIRONMENTS } from './constants.ts';

export const getNodeEnv = () => process.env.NODE_ENV || NODE_ENVIRONMENTS.DEV;
export const isProd = () => process.env.NODE_ENV === NODE_ENVIRONMENTS.PROD;
export const isDev = () => process.env.NODE_ENV === NODE_ENVIRONMENTS.DEV;
export const isTest = () => process.env.NODE_ENV === NODE_ENVIRONMENTS.TEST;