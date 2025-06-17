import { Player } from '@minecraft/server';

/**
 * send a decorated message to player
 * @param {Player} player 
 * @param {String} message 
 * @returns 
 */
export function sendMessage(player, message) {
    const color1 = player.getDynamicProperty('color1') ?? '6';
    const color2 = player.getDynamicProperty('color2') ?? 'f';
    const prefix = player.getDynamicProperty('prefix') ?? '<MPK>';
    player.sendMessage(`§r§${color1}${prefix}§r §${color2}${message}`);
    return;
};