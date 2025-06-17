import { Player, PlayerPermissionLevel } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { settingForm } from './settings';
import { sendMessage } from '../util/message';

/**
 * @param {Player} player 
 */
export function itemsForm(player) {
    if (player.playerPermissionLevel !== PlayerPermissionLevel.Operator) {
        sendMessage(player, 'you tarinai permission!');
        return;
    };
    const checkpointRetuner = player.getDynamicProperty('cpReturnItem') ?? 'minecraft:red_dye';
    const checkpointSet = player.getDynamicProperty('cpSetItem') ?? 'minecraft:emerald';
    const setlbItem = player.getDynamicProperty('setlbItem') ?? 'minecraft:cyan_dye';
    const gamemodeChanger = player.getDynamicProperty('gmChangerItem') ?? 'minecraft:iron_nugget';
    new ModalFormData()
        .title('Items')
        .textField('Checkpoint Returner', 'minecraft:red_dye', { defaultValue: checkpointRetuner })
        .textField('Checkpoint Set', 'minecraft:emerald', { defaultValue: checkpointSet })
        .textField('Setlb Item', 'minecraft:cyan_dye', { defaultValue: setlbItem })
        .textField('Gamemoed Changer', 'minecraft:iron_nugget', { defaultValue: gamemodeChanger })
        .show(player).then((res) => {
            if (res.canceled) return settingForm(player);
            player.setDynamicProperties({
                'cpReturnItem': res.formValues[0],
                'cpSetItem': res.formValues[1],
                'setlbItem': res.formValues[2],
                'gamemodeChanger': res.formValues[3],
            });
            return settingForm(player);
        })
};