import React from 'react';

type MotionProps = {
  children?: React.ReactNode;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileTap?: unknown;
  whileHover?: unknown;
  whileInView?: unknown;
  layout?: unknown;
  layoutId?: unknown;
  variants?: unknown;
  [key: string]: unknown;
};

function createMotionComponent(tag: string) {
  return React.forwardRef<HTMLElement, MotionProps>(
    (
      { initial, animate, exit, transition, whileTap, whileHover, whileInView, layout, layoutId, variants, children, ...rest },
      ref
    ) => React.createElement(tag, { ...rest, ref }, children as React.ReactNode)
  );
}

const motion = new Proxy({} as Record<string, ReturnType<typeof createMotionComponent>>, {
  get: (_, prop: string) => createMotionComponent(prop),
});

const AnimatePresence: React.FC<{ children?: React.ReactNode; mode?: string; initial?: boolean }> = ({
  children,
}) => <>{children}</>;

const useAnimation = () => ({ start: () => Promise.resolve(), stop: () => {}, set: () => {} });
const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {}, onChange: () => () => {} });
const useTransform = () => ({ get: () => 0 });
const useInView = () => false;

export { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useInView };
