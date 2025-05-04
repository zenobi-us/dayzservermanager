import {
  NoModeError,
  NotManagerModeError,
  NotServerModeError,
} from '../errors/server';

import { Config } from './config';

export function getMode() {
  return Config.get('MODE');
}

export function isServerMode() {
  return getMode() === 'server';
}

export function isManagerMode() {
  return getMode() === 'manager';
}

export function assertIsServerMode() {
  if (!isServerMode()) {
    throw new NotServerModeError();
  }
}

export function assertIsManagerMode() {
  if (!isManagerMode()) {
    throw new NotManagerModeError();
  }
}

export function assertHasMode() {
  if (!getMode()) {
    throw new NoModeError();
  }
}
