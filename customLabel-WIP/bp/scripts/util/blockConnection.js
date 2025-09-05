// North => Negative Z
// South => Positive Z
// East => Positive X
// West => Negative X

/**
 * @typedef collidableBlockResult
 * @property {boolean} result
 * @property {string} type
 */

import { Block } from '@minecraft/server';

/**
 * @param {collidableBlockResult} result 
 * @param {Block} block 
 */
export function checkBlockConnection(block, result) {
    if (result.type !== 'fence' && result.type !== 'pane' && result.type !== 'wall') return { north: false, south: false, east: false, west: false };

    const permutation = block.permutation;

    const connection = {
        north: false,
        south: false,
        east: false,
        west: false
    };

    if (result.type === 'wall') {
        if (permutation.getState('wall_connection_type_north') !== 'none') connection.north = true;
        if (permutation.getState('wall_connection_type_south') !== 'none') connection.south = true;
        if (permutation.getState('wall_connection_type_east') !== 'none') connection.east = true;
        if (permutation.getState('wall_connection_type_west') !== 'none') connection.west = true;
    } else {
        const neighboringBlock = {
            north: block.north(1),
            south: block.south(1),
            east: block.east(1),
            west: block.west(1)
        };
        connection.north = isConnectableBlock(block, neighboringBlock.north, 'north');
        connection.south = isConnectableBlock(block, neighboringBlock.south, 'south');
        connection.east = isConnectableBlock(block, neighboringBlock.east, 'east');
        connection.west = isConnectableBlock(block, neighboringBlock.west, 'west');
    }
    return connection;
};

function isConnectableBlock(block, nextBlock, face) {
    if (!(nextBlock instanceof Block) || nextBlock.isAir || nextBlock.isLiquid) return false;

    const id = nextBlock.typeId.replace('minecraft:', '');
    const originalId = block.typeId.replace('minecraft:', '');

    if (id.endsWith('pumpkin') || id === 'melon' || id === 'jigsaw' || id === 'structure_block' || id === 'barrier') return false;
    if (nextBlock.isSolid) return true;
    if (id.endsWith('glass') || id === 'ice' || id === 'mangrove_roots' || id === 'composter' || id === 'structure_void') return true;
    if (id.endsWith('_wall') && (originalId.endsWith('pane') || originalId === 'iron_bars')) return true;
    if ((id.endsWith('pane') || id === 'iron_bars') && (originalId.endsWith('pane') || originalId === 'iron_bars')) return true;
    if ((id.endsWith('fence') && id !== 'nether_brick_fence') && (originalId.endsWith('fence') && originalId !== 'nether_brick_fence')) return true;
    if (id === 'nether_brick_fence' && originalId === 'nether_brick_fence') return true;
    if (id.endsWith('stairs')) {
        const stairFacing = ['west', 'east', 'north', 'south'];
        if (nextBlock.permutation.getState('weirdo_direction') === stairFacing.indexOf(face)) return true;
    };
    if (id.endsWith('trapdoor') && nextBlock.permutation.getState('open_bit')) {
        const tdFacing = ['east', 'west', 'south', 'north'];
        if (nextBlock.permutation.getState('direction') === tdFacing.indexOf(face)) return true;
    };
    if (originalId.endsWith('fence') && id.endsWith('gate') && !nextBlock.permutation.getState('open_bit')) {
        const gateFacing = ['east', 'north', 'south', 'west'].indexOf(nextBlock.permutation.getState('minecraft:cardinal_direction')) % 3 === 0;
        const originalFacing = ['north', 'east', 'west', 'south'].indexOf(face) % 3 === 0;
        if (gateFacing === originalFacing) return true;
    };
    return false;
};