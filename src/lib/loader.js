import path from "path";
import fs from "fs";
import buildQuery from './query';
import buildMutation from './mutation';
import buildType from './type';

const autoload = () => {
  let queryBag = [];
  let mutationBag = [];
  let output = {};
  output.queries = {};
  output.mutations = {};

  let normalizedPath = path.resolve('src/api/');
  fs.readdirSync(normalizedPath).forEach((file) => {
    let modulePath = normalizedPath + '/' + file;
    if (fs.lstatSync(modulePath).isDirectory()) {
      let modelPath = modulePath + '/model.js';
      let inputPath = modulePath + '/input.js';
      let typePath = modulePath + '/type.js';
      if (fs.existsSync(modelPath)) {
        let model = require(modelPath).default;
        let type = fs.existsSync(typePath) ? require(typePath).default : buildType(model);
        queryBag.push(buildQuery(file, type, model));

        if (fs.existsSync(inputPath)) {
          let input = require(inputPath).default;
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
