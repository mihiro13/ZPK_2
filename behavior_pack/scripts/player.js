import { system, world } from '@minecraft/server';
import { setProperties, getProperties } from './util/property';
import { updateLables } from './labels/label';
import { checkMMoffset, checkOffset } from './landingBlock/offset';
import { displayLabels } from './labels/display';
import './server/practice';
import './server/checkpoint';
import './server/gamemodeChanger';
import './landingBlock/setlb';
import './landingBlock/offset';
import './labels/display';
import './form/settings';
import './labels/label';
import './util/blockCollision';
import './command/registryCommands';

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const loc = player.location;
            const rot = player.getRotation();
            const vel = player.getVelocity();
            const { isSprinting, isJumping, isOnGround, isSneaking } = player;
            const input = getPlayerControlMovement(player);
            const current = getProperties(player, 'current');
            const tbf = getProperties(player, 'tbf');
            let walktime;
            if (isOnGround === false || input === '') {
                walktime = -1;
            } else if (input !== '' && isOnGround === true) {
                walktime = current.walktime + 1;
            };
            let { isWalkJump, jumpTickInput } = current;
            if (current.isOnGround === true && isJumping === true && isOnGround === false) {
                jumpTickInput = input;
                isWalkJump = !isSprinting;
            };
            const props = {
                'loc': loc,
                'yaw': rot.y,
                'pitch': rot.x,
                'vel': vel,
                'isSprinting': isSprinting,
                'isJumping': isJumping,
                'isOnGround': isOnGround,
                'isWalkJump': isWalkJump,
                'isSneaking': isSneaking,
                'input': input,
                'walktime': walktime,
                'jumpTickInput': jumpTickInput
            };

            setProperties(player, 'current', props);
            setProperties(player, 'tbf', current);
            setProperties(player, 'ttbf', tbf);
            updateLables(player);
            checkOffset(player);
            checkMMoffset(player);
            displayLabels(player);
            continue;
        }
    })
});

function getPlayerControlMovement(player) {
    const movement = player.inputInfo.getMovementVector();
    const threshold = 0.5;
    const normalizedX = Math.abs(movement.x) >= threshold ? (movement.x > 0 ? 1 : -1) : 0;
    const normalizedY = Math.abs(movement.y) >= threshold ? (movement.y > 0 ? 1 : -1) : 0;

    if (normalizedX === 0 && normalizedY === 1) return 'W';
    if (normalizedX === 0 && normalizedY === -1) return 'S';
    if (normalizedX === 1 && normalizedY === 0) return 'A';
    if (normalizedX === -1 && normalizedY === 0) return 'D';
    if (normalizedX === 1 && normalizedY === 1) return 'WA';
    if (normalizedX === -1 && normalizedY === 1) return 'WD';
    if (normalizedX === 1 && normalizedY === -1) return 'SA';
    if (normalizedX === -1 && normalizedY === -1) return 'SD';
    if (normalizedX === 0 && normalizedY === 0) return '';
    return 'Unknown';
};