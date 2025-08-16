import path from 'path';
import fs from 'fs';
import buildQuery from './query';
import buildMutation from './mutation';
import buildType from './type';

export type AutoloadOutput = {
  queries: Record<string, unknown>;
  mutations: Record<string, unknown>;
};

const autoload = (): AutoloadOutput => {
  const queryBag: Array<Record<string, unknown>> = [];
  const mutationBag: Array<Record<string, unknown>> = [];
  const output: AutoloadOutput = { queries: {}, mutations: {} };

  const normalizedPath = path.resolve('src/entities/');
  fs.readdirSync(normalizedPath).forEach((file) => {
    const modulePath = normalizedPath + '/' + file;
    if (fs.lstatSync(modulePath).isDirectory()) {
      const modelPath = modulePath + '/model.js';
      const inputPath = modulePath + '/input.js';
      const typePath = modulePath + '/type.js';
      if (fs.existsSync(modelPath)) {
        // require is intentional here to support legacy JS modules
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const model = (require(modelPath).default) as any;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const type = fs.existsSync(typePath) ? (require(typePath).default as any) : buildType(model);
        queryBag.push(buildQuery(file, type, model));

        if (fs.existsSync(inputPath)) {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const input = (require(inputPath).default) as any;
          mutationBag.push(buildMutation(model.name, type, input, model));
        }
      }
    }
  });

  queryBag.map((obj) => {
    Object.assign(output.queries, obj);
  });

  mutationBag.map((obj) => {
    Object.assign(output.mutations, obj);
  });

  return output;
};

export { autoload };
