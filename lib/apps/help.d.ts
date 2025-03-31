import * as node_karin from 'node-karin';

declare const help: node_karin.Command<"message">;
declare const version: node_karin.Command<"message">;

export { help, version };
