import * as node_karin from 'node-karin';

declare const slice: node_karin.Command<keyof node_karin.MessageEventMap>;
declare const gearshift: node_karin.Command<keyof node_karin.MessageEventMap>;

export { gearshift, slice };
