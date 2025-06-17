import { system, world } from '@minecraft/server';
import { getProperties } from '../util/property';
import { ActionFormData } from '@minecraft/server-ui';
import { guiForm } from './gui';
import { offsetForm } from './offset';
import { itemsForm } from './items';
import { setlbForm } from './setlb';

/**
 * @param {Player} player 
 */
export function settingForm(player) {
    new ActionFormData()
        .title('Setting')
        .button('GUI')
        .button('Items')
        .button('Offset')
        .button('Landing Block')
        .show(player).then((res) => {
            if (res.canceled) return;
            if (res.selection === 0) {
                return guiForm(player);
            } else if (res.selection === 1) {
                return itemsForm(player);
            } else if (res.selection === 2) {
                return offsetForm(player);
            } else if (res.selection === 3) {
                return setlbForm(player);
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