import { system, world } from '@minecraft/server';
import { getProperties } from '../util/property';
import { ActionFormData } from '@minecraft/server-ui';
import { guiForm } from './gui';
import { othersForm } from './others';

/**
 * @param {Player} player 
 */
export function settingForm(player) {
    new ActionFormData()
        .title('Setting')
        .button('GUI')
        .button('Others')
        .show(player).then((res) => {
            if (res.canceled) return;
            if (res.selection === 0) {
                return guiForm(player);
            } else if (res.selection === 1) {
                return othersForm(player);
            } else if (res.selection === 2) {
                return checkpointForm(player);
            }
        })
};

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const props = getProperties(player, 'current');
        if (props.isSneaking && props.pitch < -89) {
            player.teleport(props.loc, { rotation: { x: 0, y: props.yaw } });
            settingForm(player);
            continue;
        }
    }
});