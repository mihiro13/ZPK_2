import { Block } from '@minecraft/server';
import { checkBlockConnection } from './blockConnection';

/**
 * @typedef collidableBlockResult
 * @property {boolean} result
 * @property {string} type
 */

/**
 * @typedef Box
 * @property {import '@minecraft/server'.Vector3} start
 * @property {import '@minecraft/server'.Vector3} end
 */

/**
 * 
 * @param {Block} block 
 * @returns {collidableBlockResult}
 */
export function isCollidableBlock(block) {
    if (!(block instanceof Block)) return { result: false, type: 'none' };

    if (block.isAir || block.isLiquid) return { result: false, type: 'none' };

    const id = block.typeId.replace('minecraft:', '');

    if (id === 'bamboo' || id === 'pointed_dripstone') return { result: false, type: 'fuck' };

    if (id.endsWith('fence')) return { result: true, type: 'fence' };
    if (id.endsWith('gate')) return { result: true, type: 'fencegate' };
    if (id.endsWith('_wall')) return { result: true, type: 'wall' };
    if (id.endsWith('pane') || id === 'iron_bars') return { result: true, type: 'pane' };
    if (id.endsWith('trapdoor')) return { result: true, type: 'trapdoor' };
    if (id === 'ladder') return { result: true, type: 'ladder' };
    if (id.endsWith('chest')) return { result: true, type: 'chest' };
    if (id === 'decorated_pot' || id === 'cactus' || id === 'honey_block') return { result: true, type: 'cactus' };
    if (id.endsWith('cake')) return { result: true, type: 'cake' };
    if (id.endsWith('anvil')) return { result: true, type: 'anvil' };
    if (id === 'end_rod' || id === 'lightning_rod') return { result: true, type: 'endrod' };
    if (id.endsWith('stairs')) return { result: true, type: 'stair' };
    if (id.endsWith('head') || id.endsWith('skull')) return { result: true, type: 'head' };
    if (id === 'flower_pot') return { result: true, type: 'flowerpot' };
    if ((id.endsWith('lantern'))) return { result: true, type: 'lantern' };
    if (id === 'heavy_core' || id === 'conduit') return { result: true, type: 'conduit' };
    if (id === 'brewing_stand') return { result: true, type: 'brewing_stand' };
    if (id.endsWith('hanging_sign')) return { result: true, type: 'hanging_sign' };
    if (id === 'grindstone') return { result: true, type: 'grindstone' };
    if (id === 'chain') return { result: true, type: 'chain' };
    if (id.endsWith('candle')) return { result: true, type: 'candle' };
    if (id === 'bell') return { result: true, type: 'bell' };
    if (id.endsWith('amethyst_bud') || id === 'amethyst_cluster') return { result: true, type: 'amethyst' };
    if (id === 'cocoa') return { result: true, type: 'cocoa' };
    if (id.endsWith('slab') && !id.endsWith('double_slab')) return { result: true, type: 'slab' };
    if (id === 'sculk_sensor' || id === 'sculk_shrieker' || id === 'calibrated_sculk_sensor') return { result: true, type: 'sculk' };
    if (id.endsWith('carpet')) return { result: true, type: 'carpet' };
    if (id === 'waterlily') return { result: true, type: 'waterlily' };
    if (id === 'bed' || id === 'stonecutter_block') return { result: true, type: 'bed' };
    if (id.endsWith('campfire')) return { result: true, type: 'campfire' };
    if (id.startsWith('daylight')) return { result: true, type: 'daylight_detector' };
    if (id.endsWith('repeater') || id.endsWith('comparator')) return { result: true, type: 'repeater' };
    if (id === 'snow_layer') return { result: true, type: 'snow' };
    if (id === 'enchanting_table') return { result: true, type: 'enchanting_table' };
    if (id === 'end_portal_frame') return { result: true, type: 'portal_frame' };
    if (id === 'lectern') return { result: true, type: 'lectern' };
    if (id === 'farmland' || id === 'grass_path') return { result: true, type: 'grass_path' };
    if (id === 'mud' || id === 'soul_sand') return { result: true, type: 'soul_sand' };
    if (id === 'sniffer_egg') return { result: true, type: 'sniffer_egg' };
    if (id === 'dried_ghast') return { result: true, type: 'dried_ghast' };
    if (id === 'chorus_plant') return { result: true, type: 'chorus_plant' };
    if (id.endsWith('glass') || id.endsWith('shulker_box') || id === 'ice' || id === 'mangrove_roots' || id === 'composter' || id.includes('leaves')) return { result: true, type: 'block' };

    if (block.isSolid) return { result: true, type: 'block' };

    return { result: false, type: 'none' };
}

/*  start <-> endのyの変換式
    y * -1 - 0.8
    side <-> yの回転変換

    const newStartY = box.start[axis] - 1.5;
    const newEndY = box.end[axis] - 0.3;
    const newStartSide = direction % 2 === 1 ? box.start.y + 1.5 : 1 - box.end.y - 0.3;
    const newEndSide = direction % 2 === 1 ? box.end.y + 0.3 : - box.start.y - 1.5 + 1;

    side <-> sideの回転変換

    const newStartAxis = 1 - box.end.axis;
    const newEndAxis = 1 - box.start.axis;

    side <-> sideの反転変換

    const newStartSide = - box.end[axis] + 1;
    const newEndSide = 1 - box.start[axis];
*/

/** 
 * @param {collidableBlockResult} result
 * @param {Block} block
 * @returns {Box | false}
*/
export function getBoxfromCollision(result, block) {
    if (!result.result) return false;

    const permutation = block.permutation;
    const { north, south, east, west } = checkBlockConnection(block, result);

    const collisionHandlers = {
        'block': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 1, z: 1.3 } };
            return box;
        },
        'carpet': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.0625, z: 1.3 } };
            return box;
        },
        'waterlily': () => {
            const box = { start: { x: -0.2375, y: -1.8, z: -0.2375 }, end: { x: 1.2375, y: 0.09375, z: 1.2375 } };
            return box;
        },
        'cactus': () => {
            const box = { start: { x: -0.2375, y: -1.8, z: -0.2375 }, end: { x: 1.2375, y: 1, z: 1.2375 } };
            return box;
        },
        'bed': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.5625, z: 1.3 } };
            return box;
        },
        'campfire': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.4375, z: 1.3 } };
            return box;
        },
        'daylight_detector': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.375, z: 1.3 } };
            return box;
        },
        'repeater': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.125, z: 1.3 } };
            return box;
        },
        'enchanting_table': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.75, z: 1.3 } };
            return box;
        },
        'portal_frame': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.8125, z: 1.3 } };
            return box;
        },
        'lectern': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.9, z: 1.3 } };
            return box;
        },
        'grass_path': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.9375, z: 1.3 } };
            return box;
        },
        'soul_sand': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.875, z: 1.3 } };
            return box;
        },
        'fencegate': () => {
            const box = { start: { x: -0.3, y: -1.8, z: 0.075 }, end: { x: 1.3, y: 1.5, z: 0.925 } };
            const direction = permutation.getState('minecraft:cardinal_direction');
            if (direction === 'east' || direction === 'west') {
                [box.start.x, box.start.z] = [box.start.z, box.start.x];
                [box.end.x, box.end.z] = [box.end.z, box.end.x];
            }
            return box;
        },
        'hanging_sign': () => {
            if (permutation.getState('hanging')) return false;
            const box = { start: { x: -0.3, y: -1.8, z: 0.075 }, end: { x: 1.3, y: 1, z: 0.925 } };
            const direction = Math.floor(permutation.getState('facing_direction') / 2);
            if (direction === 2) {
                [box.start.x, box.start.z] = [box.start.z, box.start.x];
                [box.end.x, box.end.z] = [box.end.z, box.end.x];
            } else if (direction !== 1) return false;
            return box;
        },
        'grindstone': () => {
            const box = { start: { x: -0.175, y: -1.8, z: -0.175 }, end: { x: 1.175, y: 1, z: 1.175 } };
            const attachment = permutation.getState('attachment');
            const direction = permutation.getState('direction') % 2;
            if (attachment === 'side') {
                const axis = ['z', 'x'][direction];
                box.start[axis] = -0.3;
                box.start.y = -1.675;
                box.end[axis] = 1.3;
                box.end.y = 0.875;
            }
            return box;
        },
        'amethyst': () => {
            const amethystTable = {
                'small_amethyst_bud': { start: { x: -0.05, y: -1.8, z: -0.05 }, end: { x: 1.05, y: 0.1875, z: 1.05 } },
                'medium_amethyst_bud': { start: { x: -0.1125, y: -1.8, z: -0.1125 }, end: { x: 1.1125, y: 0.25, z: 1.1125 } },
                'large_amethyst_bud': { start: { x: -0.1125, y: -1.8, z: -0.1125 }, end: { x: 1.1125, y: 0.3125, z: 1.1125 } },
                'amethyst_cluster': { start: { x: -0.1125, y: -1.8, z: -0.1125 }, end: { x: 1.1125, y: 0.4375, z: 1.1125 } }
            };
            const box = amethystTable[block.typeId.replace('minecraft:', '')];
            const direction = permutation.getState('facing_direction');
            if (direction === 0) {
                [box.start.y, box.end.y] = [-box.end.y - 0.8, -box.start.y - 0.8];
            } else if (direction >= 2) {
                const axis = ['z', 'x'][Math.floor(direction / 2 - 1)];

                const newStartY = box.start[axis] - 1.5;
                const newEndY = box.end[axis] - 0.3;
                const newStartSide = direction % 2 === 1 ? box.start.y + 1.5 : 1 - box.end.y - 0.3;
                const newEndSide = direction % 2 === 1 ? box.end.y + 0.3 : - box.start.y - 1.5 + 1;

                [box.start.y, box.end.y, box.start[axis], box.end[axis]] = [newStartY, newEndY, newStartSide, newEndSide];
            }
            return box;
        },
        'cocoa': () => {
            const cocoaTable = {
                0: { start: { x: 0.075, y: -1.3625, z: 0.3875 }, end: { x: 0.925, y: 0.75, z: 1.2375 } },
                1: { start: { x: 0.0125, y: -1.4875, z: 0.2625 }, end: { x: 0.9875, y: 0.75, z: 1.2375 } },
                2: { start: { x: -0.05, y: -1.6125, z: 0.1375 }, end: { x: 1.05, y: 0.75, z: 1.2375 } }
            };
            const box = cocoaTable[permutation.getState('age')];
            const direction = permutation.getState('direction');
            if (direction !== 0) {
                const axis = ['z', 'x'][direction % 2];

                if (axis === 'x') {
                    const newStartX = 1 - box.end.z;
                    const newStartZ = box.start.x;
                    const newEndX = 1 - box.start.z;
                    const newEndZ = box.end.x;
                    [box.start.x, box.start.z, box.end.x, box.end.z] = [newStartX, newStartZ, newEndX, newEndZ];
                }
                if (direction >= 2) {
                    const newStartSide = - box.end[axis] + 1;
                    const newEndSide = 1 - box.start[axis];

                    [box.start[axis], box.end[axis]] = [newStartSide, newEndSide];
                }
            }
            return box;
        },
        'ladder': () => {
            const box = { start: { x: -0.3, y: -1.8, z: 0.5125 }, end: { x: 1.3, y: 1, z: 1.3 } };
            const direction = permutation.getState('facing_direction');
            if (direction > 2) {
                const axis = ['z', 'x'][Math.floor(direction / 2) - 1];

                if (axis === 'x') {
                    const newStartX = 1 - box.end.z;
                    const newStartZ = box.start.x;
                    const newEndX = 1 - box.start.z;
                    const newEndZ = box.end.x;
                    [box.start.x, box.start.z, box.end.x, box.end.z] = [newStartX, newStartZ, newEndX, newEndZ];
                }
                if (direction > 2 && direction !== 5) {
                    const newStartSide = - box.end[axis] + 1;
                    const newEndSide = 1 - box.start[axis];

                    [box.start[axis], box.end[axis]] = [newStartSide, newEndSide];
                }
            }
            return box;
        },
        'trapdoor': () => {
            const trapdoorTable = {
                'side': { start: { x: -0.3, y: -1.8, z: 0.5175 }, end: { x: 1.3, y: 1, z: 1.3 } },
                'stand': { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.1825, z: 1.3 } },
            };
            const attachment = permutation.getState('open_bit') ? 'side' : 'stand';
            const box = trapdoorTable[attachment];
            const direction = permutation.getState('direction');
            if (attachment === 'stand') {
                const upside_down = permutation.getState('upside_down_bit');
                if (upside_down) [box.start.y, box.end.y] = [-0.9825, 1];
            } else if (direction !== 3) {
                const axis = ['x', 'z'][Math.floor(direction / 2)];

                if (axis === 'x') {
                    const newStartX = 1 - box.end.z;
                    const newStartZ = box.start.x;
                    const newEndX = 1 - box.start.z;
                    const newEndZ = box.end.x;
                    [box.start.x, box.start.z, box.end.x, box.end.z] = [newStartX, newStartZ, newEndX, newEndZ];
                }
                if (direction > 0) {
                    const newStartSide = - box.end[axis] + 1;
                    const newEndSide = 1 - box.start[axis];

                    [box.start[axis], box.end[axis]] = [newStartSide, newEndSide];
                }
            }
            return box;
        },
        'head': () => {
            const trapdoorTable = {
                'side': { start: { x: -0.05, y: -1.55, z: 0.2 }, end: { x: 1.05, y: 0.75, z: 1.3 } },
                'stand': { start: { x: -0.05, y: -1.8, z: -0.05 }, end: { x: 1.05, y: 0.5, z: 1.05 } },
            };
            const attachment = permutation.getState('facing_direction') === 1 ? 'stand' : 'side';
            const box = trapdoorTable[attachment];
            const direction = permutation.getState('facing_direction');
            if (attachment === 'side' && direction !== 2) {
                const axis = ['z', 'x'][Math.floor(direction / 2) - 1];

                if (axis === 'x') {
                    const newStartX = 1 - box.end.z;
                    const newStartZ = box.start.x;
                    const newEndX = 1 - box.start.z;
                    const newEndZ = box.end.x;
                    [box.start.x, box.start.z, box.end.x, box.end.z] = [newStartX, newStartZ, newEndX, newEndZ];
                }
                if (direction > 2 && direction !== 5) {
                    const newStartSide = - box.end[axis] + 1;
                    const newEndSide = 1 - box.start[axis];

                    [box.start[axis], box.end[axis]] = [newStartSide, newEndSide];
                }
            }
            return box;
        },
        'bell': () => {
            const box = { start: { x: -0.05, y: -1.55, z: -0.05 }, end: { x: 1.05, y: 1, z: 1.05 } };
            const attachment = permutation.getState('attachment');
            const direction = permutation.getState('direction') % 2;
            if (attachment === 'standing') {
                const axis = ['x', 'z'][direction];
                box.start[axis] = -0.3;
                box.start.y = -1.8;
                box.end[axis] = 1.3;
                box.end.y = 0.8125;
            } else if (attachment === 'side') {
                const axis = ['z', 'x'][direction];
                const dir = permutation.getState('direction');
                const posTable = {
                    x: dir < 2 ? [-0.1125, 1.3] : [-0.3, 1.1125],
                    z: dir < 2 ? [-0.3, 1.1125] : [-0.1125, 1.3]
                };

                [box.start[axis], box.end[axis]] = posTable[axis];
                box.end.y = 0.9375;
            }
            return box;
        },
        'chain': () => {
            const box = { start: { x: 0.10625, y: -1.8, z: 0.10625 }, end: { x: 0.89375, y: 1, z: 0.89375 } };
            const axis = permutation.getState('pillar_axis');
            if (axis === 'y') return box;
            box.start[axis] = -0.3;
            box.start.y = -1.40625;
            box.end[axis] = 1.3;
            box.end.y = 0.59375;
            return box;
        },
        'slab': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.5, z: 1.3 } };
            if (permutation.getState('minecraft:vertical_half') === 'top') {
                [box.start.y, box.end.y] = [-1.3, 1];
            }
            return box;
        },
        'snow': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.0, z: 1.3 } };
            const height = permutation.getState('height');
            if (height === 0) return false;
            box.end.y = height * 0.125;
            return box;
        },
        'sculk': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.5, z: 1.3 } };
            return box;
        },
        'chest': () => {
            const box = { start: { x: -0.275, y: -1.8, z: -0.275 }, end: { x: 1.275, y: 0.95, z: 1.275 } };
            return box;
        },
        'cake': () => {
            const box = { start: { x: -0.2375, y: -1.8, z: -0.2375 }, end: { x: 1.2375, y: 0.5, z: 1.2375 } };
            box.start.x += permutation.getState('bite_counter') * 0.125;
            return box;
        },
        'anvil': () => {
            const box = { start: { x: -0.3, y: -1.8, z: -0.175 }, end: { x: 1.3, y: 1, z: 1.175 } };
            const direction = permutation.getState('minecraft:cardinal_direction');
            if (direction === 'north' || direction === 'south') {
                [box.start.x, box.start.z] = [box.start.z, box.start.x];
                [box.end.x, box.end.z] = [box.end.z, box.end.x];
            }
            return box;
        },
        'sniffer_egg': () => {
            const box = { start: { x: -0.2375, y: -1.8, z: -0.175 }, end: { x: 1.2375, y: 1, z: 1.175 } };
            return box;
        },
        'dried_ghast': () => {
            const box = { start: { x: -0.1125, y: -1.8, z: -0.1125 }, end: { x: 1.1125, y: 0.625, z: 1.1125 } };
            return box;
        },
        'chorus_plant': () => {
            const box = { start: { x: -0.175, y: -1.8, z: -0.175 }, end: { x: 1.175, y: 0.875, z: 1.175 } };
            return box;
        },
        'endrod': () => {
            const box = { start: { x: 0.075, y: -1.8, z: 0.075 }, end: { x: 0.925, y: 1, z: 0.925 } };
            const direction = Math.floor(permutation.getState('facing_direction') / 2);
            if (direction !== 0) {
                const axis = [null, 'z', 'x'][direction];
                box.start.y = -1.425;
                box.start[axis] = -0.3;
                box.end.y = 0.625;
                box.end[axis] = 1.3;
            }
            return box;
        },
        'candle': () => {
            const box = { start: { x: 0.1375, y: -1.8, z: 0.1375 }, end: { x: 0.8625, y: 0.375, z: 0.8625 } };
            const candles = permutation.getState('candles');
            const x_size = Math.floor((candles + 3) / 4) * 0.125;
            const z_size = Math.floor((candles + 2) / 4) * 0.0625;
            box.start.x -= x_size;
            box.end.x += x_size;
            box.start.z -= z_size;
            box.end.z += z_size;
            if (candles > 0) box.end.z += 0.0625;
            if (candles === 2) box.end.x -= 0.0625;
            if (candles === 3) {
                box.start.z -= 0.0625;
                box.end.z -= 0.0625;
            }
            return box;
        },
        'stair': () => { // boxを複数セットできるようにするときにつくります。。。
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 1, z: 1.3 } };
            return box;
        },
        'brewing_stand': () => { // さめ
            const box = { start: { x: -0.3, y: -1.8, z: -0.3 }, end: { x: 1.3, y: 0.125, z: 1.3 } };
            return box;
        },
        'flowerpot': () => {
            const box = { start: { x: 0.0125, y: -1.8, z: 0.0125 }, end: { x: 0.9875, y: 0.375, z: 0.9875 } };
            return box;
        },
        'lantern': () => {
            const box = { start: { x: 0.0125, y: -1.8, z: 0.0125 }, end: { x: 0.9875, y: 0.5, z: 0.9875 } };
            return box;
        },
        'conduit': () => {
            const box = { start: { x: -0.05, y: -1.8, z: -0.05 }, end: { x: 1.05, y: 0.5, z: 1.05 } };
            return box;
        },
        'fence': () => {
            const box = { start: { x: 0.075, y: -1.8, z: 0.075 }, end: { x: 0.925, y: 1.5, z: 0.925 } };
            if (north) box.start.z = -0.3;
            if (south) box.end.z = 1.3;
            if (east) box.end.x = 1.3;
            if (west) box.start.x = -0.3;
            return box;
        },
        'wall': () => {
            const box = { start: { x: -0.05, y: -1.8, z: -0.05 }, end: { x: 1.05, y: 1.5, z: 1.05 } };
            if (north) box.start.z = -0.3;
            if (south) box.end.z = 1.3;
            if (east) box.end.x = 1.3;
            if (west) box.start.x = -0.3;
            if (!permutation.getState('wall_post_bit')) {
                if (north && south) {
                    box.start.x += 0.0625;
                    box.end.x -= 0.0625;
                } else if (east && west) {
                    box.start.z += 0.0625;
                    box.end.z -= 0.0625;
                }
            }
            return box;
        },
        'pane': () => {
            const box = { start: { x: 0.1375, y: -1.8, z: 0.1375 }, end: { x: 0.8625, y: 1, z: 0.8625 } };
            if (north) {
                box.start.z = -0.3;
                if (!south && !west && !east) box.end.z = 0.8;
            };
            if (south) {
                box.end.z = 1.3;
                if (!north && !west && !east) box.start.z = 0.2;
            };
            if (west) {
                box.start.x = -0.3;
                if (!south && !north && !east) box.end.x = 0.8;
            };
            if (east) {
                box.end.x = 1.3;
                if (!south && !west && !north) box.start.x = 0.2;
            };
            return box;
        }
    }

    return collisionHandlers[result.type]?.();
}