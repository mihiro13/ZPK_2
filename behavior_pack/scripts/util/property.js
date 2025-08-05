import { Player } from '@minecraft/server';

const currentProps = new Map();
const tbfProps = new Map();
const ttbfProps = new Map();
const lbProps = new Map();
const labelProps = new Map();

const defaultProps = {
    'loc': { x: 0, y: 0, z: 0 },
    'yaw': 0,
    'pitch': 0,
    'vel': { x: 0, y: 0, z: 0 },
    'isSprinting': false,
    'isJumping': false,
    'isOnGround': false,
    'isSneaking': false,
    'isGrinding': false,
    'isJumpTick': false,
    'input': '',
    'walktime': 0,
    'jumpTickInput': ''
};

/**
 * get player properties
 * @param {Player} player 
 * @param {'current' | 'tbf' | 'ttbf' | 'lb' | 'label'} gen 
 * @returns properties
 */
export function getProperties(player, gen) {
    const propMap = {
        'current': currentProps,
        'tbf': tbfProps,
        'ttbf': ttbfProps,
        'lb': lbProps,
        'label': labelProps
    };

    const props = propMap[gen]?.get(player);
    return props ?? defaultProps;
};

/**
 * set player properties with prefix
 * @param {Player} player 
 * @param {'current' | 'tbf' | 'ttbf' | 'lb' | 'label'} gen 
 * @param {Object.<String, any>} props 
 * @returns 
 */
export function setProperties(player, gen, props) {
    const propMap = {
        'current': currentProps,
        'tbf': tbfProps,
        'ttbf': ttbfProps,
        'lb': lbProps,
        'label': labelProps
    };
    const map = propMap[gen];
    const currentMap = map.get(player) ?? undefined;

    if (map !== undefined) map.set(player, { ...currentMap, ...props });
    return;
};