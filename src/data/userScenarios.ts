import type { NewUser } from '@app/data/models';
import scenarios from '@app/data/userScenarios.json';

export type UserScenario = Pick<NewUser, 'role' | 'status'>;

export const userScenarios = scenarios as UserScenario[];
