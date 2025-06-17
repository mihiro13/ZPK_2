import { world } from '@minecraft/server';
import { setlbForm } from '../form/setlb';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player, block, isFirstEvent } = ev;
    const sign = block.getComponent('minecraft:sign')?.getText();

    if (!sign) return;
    if (sign === true && isFirstEvent === false) return ev.cancel = true;
    if (sign.startsWith('/setlb') && player.isSneaking === false) {
        ev.cancel = true;
        const args = sign.split(' ');
        const type = args[4];
        const inverseLB = args[5];
        if (!['both', 'x', 'z', 'zneo'].includes(type)) return sendMessage(player, 'Invalid Landing Box Type.');
        const coord = {
            x: Number(args[1]),
            y: Number(args[2]),
            z: Number(args[3])
        };

        if (inverseLB !== undefined) {
            switch (inverseLB) {
                case 'both':
                    player.setDynamicProperties({
                        'inv_x': true,
                        'inv_z': true
                    });
                    break;
                case 'x':
                    player.setDynamicProperties({
                        'inv_x': true,
                        'inv_z': false
                    });
                    break;
                case 'z':
                    player.setDynamicProperties({
                        'inv_x': false,
                        'inv_z': true
                    });
                    break;
                default:
                    player.setDynamicProperties({
                        'inv_x': false,
                        'inv_z': false
                    });
                    break;
            }
        } else {
            player.setDynamicProperties({
                'inv_x': false,
                'inv_z': false
            });
        }

        player.setDynamicProperties({
            'lb': coord,
            'lb_type': type,
        });
        setProperties(player, 'lb', {
            'offset': -1,
            'offset_x': -1,
            'offset_z': -1,
            'pb': -1,
            'pb_x': -1,
            'pb_z': -1
        });

        sendMessage(player, 'Clear PB and Set landing block successfully!');
        return;
    }
});

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;
    if (player.typeId !== 'minecraft:player') return;

    const setlbItem = player.getDynamicProperty('setlbItem') ?? 'minecraft:cyan_dye';
    if (itemStack.typeId === setlbItem) {
        setlbForm(player, true);
        return;
    }
});