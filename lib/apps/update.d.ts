import * as node_karin from 'node-karin';

declare const autoUpdateRes: false | node_karin.Task;
declare const update: node_karin.Command<"message">;
declare const updateRes: node_karin.Command<"message">;

export { autoUpdateRes, update, updateRes };
