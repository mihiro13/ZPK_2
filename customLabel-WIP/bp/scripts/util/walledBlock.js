import { Block } from '@minecraft/server';
import { getBoxfromCollision, isCollidableBlock } from './blockCollision';

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
 * @param {Block} block 
 * @param {Box} box 
 * @returns {Box} newBox
 */
export function getBoxWithWallCheck(block, box) {
    const newBox = JSON.parse(JSON.stringify(box));
    const faces = ['north', 'south', 'east', 'west'];
    for (const face of faces) {
        /** @type {Box} */
        const sideBlock = block.above(1)[face](1);
        const sideUpBlock = block.above(1)[face](1);
        const sideBlockBox = getBoxfromCollision(isCollidableBlock(sideBlock), sideBlock);
        const sideUpBlockBox = getBoxfromCollision(isCollidableBlock(sideUpBlock), sideUpBlock);
        if ((sideBlockBox === false && sideUpBlockBox === false) || newBox === false) continue;
        const isLargerX = sideBlockBox.start.x >= sideUpBlockBox.start.x && sideBlockBox.end.x <= sideUpBlockBox.end.x;
        const isLargerZ = sideBlockBox.start.z >= sideUpBlockBox.start.z && sideBlockBox.end.z <= sideUpBlockBox.end.z;

        if (isLargerX) {
            if (face === 'south') newBox.end.z -= box.start.x >= sideBlockBox.start.x && box.end.x <= sideBlockBox.end.x ? box.end.z - (1 + sideBlockBox.start.z) : 0;
            if (face === 'north') newBox.start.z += box.start.x >= sideBlockBox.start.x && box.end.x <= sideBlockBox.end.x ? -box.start.z + (sideBlockBox.end.z - 1) : 0;
        }

        if (isLargerZ) {
            if (face === 'east') newBox.end.x -= box.start.z >= sideBlockBox.start.z && box.end.z <= sideBlockBox.end.z ? box.end.x - (1 + sideBlockBox.start.x) : 0;
            if (face === 'west') newBox.start.x += box.start.z >= sideBlockBox.start.z && box.end.z <= sideBlockBox.end.z ? -box.start.x + (sideBlockBox.end.x - 1) : 0;
        }
    }
    return newBox;
}