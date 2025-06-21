import { world } from '@minecraft/server';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';
import { getBoxfromCollision, isCollidableBlock } from '../util/blockCollision';

/**
 * Set MM box
 * @param {Player} player 
 * @param {Block} block 
 * @returns 
 */
export function setMMBox(player, block) {
    const lb = getBoxfromCollision(isCollidableBlock(block), block);
    if (lb === false) return sendMessage(player, 'Invalid Block!');

    const mmBox = {
        start: {
            x: block.location.x + lb.start.x,
            y: block.location.y + lb.start.y,
            z: block.location.z + lb.start.z,
        },
        end: {
            x: block.location.x + lb.end.x,
            y: block.location.y + lb.end.y,
            z: block.location.z + lb.end.z,
        }
    };
    if (!block || !isCollidableBlock(block).result) {
        sendMessage(player, 'Invalid Block!');
        return;
    } else {
        player.setDynamicProperties({
            'mmStart': mmBox.start,
            'mmEnd': mmBox.end
        });
        sendMessage(player, 'Successfully set MM Block §r§7(' + block.typeId + ')');
        return;
    }
};

/**
 * Set landing box
 * @param {Player} player 
 * @param {Block} block 
 * @returns 
 */
export function setLandingBox(player, block) {
    const lb = getBoxfromCollision(isCollidableBlock(block), block);
    if (lb === false) return sendMessage(player, 'Invalid Block!');

    /*
    const center = {
        x: block.location.x + ((lb.end.x - 0.3) + (lb.start.x + 0.3)) / 2,
        y: block.location.y + ((lb.end.y) + (lb.start.y + 1.8)) / 2,
        z: block.location.z + ((lb.end.z - 0.3) + (lb.start.z + 0.3)) / 2,
    };
    const start = {
        x: center.x - ((lb.end.x - 0.3) - (lb.start.x + 0.3)) / 2,
        y: center.y - ((lb.end.y) - (lb.start.y + 1.8)) / 2,
        z: center.z - ((lb.end.z - 0.3) - (lb.start.z + 0.3)) / 2
    };
    const bound = {
        x: (lb.end.x - lb.start.x - 0.6),
        y: (lb.end.y - lb.start.y - 1.8),
        z: (lb.end.z - lb.start.z - 0.6)
    };
    const lbBox = new DebugBox(start);
    lbBox.bound = bound;
    lbBox.color = { red: 0, green: 0, blue: 1 };
    lbBox.timeLeft = 99999999;
    debugDrawer.addShape(lbBox);
    */

    const landingBox = {
        start: {
            x: block.location.x + lb.start.x,
            y: block.location.y + lb.start.y,
            z: block.location.z + lb.start.z,
        },
        end: {
            x: block.location.x + lb.end.x,
            y: block.location.y + lb.end.y,
            z: block.location.z + lb.end.z,
        }
    };
    if (!block || !isCollidableBlock(block).result) {
        sendMessage(player, 'Invalid Block!');
        return;
    } else {
        player.setDynamicProperties({
            'boxStart': landingBox.start,
            'boxEnd': landingBox.end
        });
        sendMessage(player, 'Successfully set landing block! §r§7(' + block.typeId + ')');
        return;
    }
};

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player, block, isFirstEvent } = ev;
    const sign = block.getComponent('minecraft:sign')?.getText();

    if (!sign) return;
    if (isFirstEvent === false) return ev.cancel = true;
    if (sign.startsWith('/setlb') && player.isSneaking === false) {
        ev.cancel = true;
        const args = sign.split(' ');
        const type = args[4];
        const inverseLB = args[5];
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
            'lb_type': type ?? 'both',
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