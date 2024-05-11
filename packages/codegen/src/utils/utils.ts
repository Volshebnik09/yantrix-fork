import type { ITypedObject, ITypedObjectProps } from '../types/common.js';
import { join } from 'path';
import { cwd } from 'node:process';
import { readFile } from 'fs/promises';
import { format } from 'prettier';

export const toUpperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTypedObjectProps = <T>(object: T, objName: string) => {
  const typeGuardName = `isValid${toUpperFirst(objName)}`;
  const typeName = `T${toUpperFirst(objName)}`;
  const body = JSON.stringify(object, null, 2);
  const name = `${objName}Obj`;

  return {
    typeName,
    typeGuardName,
    name,
    body,
  } satisfies ITypedObjectProps;
};

export const toTypedObject = <T>(obj: T, name: string) => {
  const props = toTypedObjectProps(obj, name);

  const codeBlock = `const ${props.name} = ${props.body}

		type ${props.typeName} = keyof typeof ${props.name}

		const ${props.typeGuardName} = (obj: any): obj is ${props.typeName} => {
			return Object.keys(${props.name}).includes(obj);
		}`;

  return {
    ...props,
    codeBlock,
  } satisfies ITypedObject;
};

const prettierCfgPath = join(cwd(), '.prettierrc');
export const fmt = async (code: string) => {
  try {
    const prettierCfgRaw = await readFile(prettierCfgPath, 'utf-8');
    const prettierCfg = JSON.parse(prettierCfgRaw);
    return format(code, { ...prettierCfg, parser: 'babel-ts' });
  } catch {
    return code;
  }
};
