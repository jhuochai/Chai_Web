import { describe, expect, it, vi } from 'vitest';
import { createCareerCameraController } from './careerCamera';

function makeStage() {
  const stage = document.createElement('div');
  stage.tabIndex = 0;
  document.body.append(stage);
  return stage;
}

function pointer(type, values) {
  return Object.assign(new Event(type, { cancelable: true, bubbles: true }), values);
}

describe('createCareerCameraController', () => {
  it('approaches on a negative wheel delta and retreats on a positive one', () => {
    const stage = makeStage();
    const onProgress = vi.fn();
    const controller = createCareerCameraController({ stage, onProgress });

    const forward = new WheelEvent('wheel', { deltaY: -180, cancelable: true });
    stage.dispatchEvent(forward);
    expect(controller.getProgress()).toBeGreaterThan(0);
    expect(forward.defaultPrevented).toBe(true);

    const approached = controller.getProgress();
    const retreat = new WheelEvent('wheel', { deltaY: 180, cancelable: true });
    stage.dispatchEvent(retreat);
    expect(controller.getProgress()).toBeLessThan(approached);
    expect(onProgress).toHaveBeenCalled();
    controller.destroy();
    stage.remove();
  });

  it('clamps progress and keeps the route stage in control at either boundary', () => {
    const stage = makeStage();
    const controller = createCareerCameraController({ stage, initialProgress: 1 });
    const forward = new WheelEvent('wheel', { deltaY: -80, cancelable: true });
    stage.dispatchEvent(forward);
    expect(controller.getProgress()).toBe(1);
    expect(forward.defaultPrevented).toBe(true);

    controller.setProgress(0);
    const retreat = new WheelEvent('wheel', { deltaY: 80, cancelable: true });
    stage.dispatchEvent(retreat);
    expect(controller.getProgress()).toBe(0);
    expect(retreat.defaultPrevented).toBe(true);
    controller.destroy();
    stage.remove();
  });

  it('supports upward touch and focused ArrowUp alternatives, then cleans listeners', () => {
    const stage = makeStage();
    const controller = createCareerCameraController({ stage });
    stage.dispatchEvent(pointer('pointerdown', { pointerId: 3, pointerType: 'touch', clientY: 220 }));
    const belowThreshold = pointer('pointermove', { pointerId: 3, pointerType: 'touch', clientY: 208 });
    stage.dispatchEvent(belowThreshold);
    expect(belowThreshold.defaultPrevented).toBe(false);
    const move = pointer('pointermove', { pointerId: 3, pointerType: 'touch', clientY: 100 });
    stage.dispatchEvent(move);
    stage.dispatchEvent(pointer('pointerup', { pointerId: 3, clientY: 100 }));
    expect(controller.getProgress()).toBeGreaterThan(0);
    expect(move.defaultPrevented).toBe(true);

    const beforeKey = controller.getProgress();
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
    expect(controller.getProgress()).toBeGreaterThan(beforeKey);
    controller.destroy();
    const afterDestroy = controller.getProgress();
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
    expect(controller.getProgress()).toBe(afterDestroy);
    stage.remove();
  });

  it('starts at a directly usable near state when reduced motion is requested', () => {
    const stage = makeStage();
    const controller = createCareerCameraController({ stage, reduceMotion: true });
    expect(controller.getProgress()).toBe(1);
    controller.destroy();
    stage.remove();
  });

  it('releases a captured pointer on pointerup, cancellation, blur, and destroy', () => {
    const stage = makeStage();
    stage.setPointerCapture = vi.fn();
    stage.hasPointerCapture = vi.fn(() => true);
    stage.releasePointerCapture = vi.fn();
    const controller = createCareerCameraController({ stage, initialProgress: 1 });
    stage.dispatchEvent(pointer('pointerdown', { pointerId: 9, clientY: 220 }));
    stage.dispatchEvent(pointer('pointermove', { pointerId: 9, clientY: 100 }));
    expect(stage.setPointerCapture).toHaveBeenCalledWith(9);
    expect(stage.releasePointerCapture).not.toHaveBeenCalled();
    stage.dispatchEvent(pointer('pointerup', { pointerId: 9, clientY: 100 }));
    expect(stage.releasePointerCapture).toHaveBeenCalledWith(9);

    stage.dispatchEvent(pointer('pointerdown', { pointerId: 10, clientY: 220 }));
    stage.dispatchEvent(pointer('pointercancel', { pointerId: 10, clientY: 180 }));
    window.dispatchEvent(new Event('blur'));
    controller.destroy();
    expect(stage.releasePointerCapture).toHaveBeenCalled();
    stage.remove();
  });

  it('keeps a touch capture at a boundary so the route stage remains reliable', () => {
    const stage = makeStage();
    stage.setPointerCapture = vi.fn();
    stage.hasPointerCapture = vi.fn(() => true);
    stage.releasePointerCapture = vi.fn();
    const controller = createCareerCameraController({ stage, initialProgress: 1 });
    stage.dispatchEvent(pointer('pointerdown', { pointerId: 18, pointerType: 'touch', clientY: 240 }));
    const atBoundary = pointer('pointermove', { pointerId: 18, pointerType: 'touch', clientY: 140 });
    stage.dispatchEvent(atBoundary);
    expect(atBoundary.defaultPrevented).toBe(true);
    expect(stage.releasePointerCapture).not.toHaveBeenCalled();
    controller.destroy();
    stage.remove();
  });

  it('does not capture pointer gestures that begin on an interactive control', () => {
    const stage = makeStage();
    const button = document.createElement('button');
    stage.append(button);
    stage.setPointerCapture = vi.fn();
    const controller = createCareerCameraController({ stage, initialProgress: 1 });

    button.dispatchEvent(pointer('pointerdown', { pointerId: 23, clientY: 180 }));

    expect(stage.setPointerCapture).not.toHaveBeenCalled();
    controller.destroy();
    stage.remove();
  });
});
