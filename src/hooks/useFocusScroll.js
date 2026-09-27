import { useLayoutEffect } from 'react';

const scrollBehavior = () =>
  document.documentElement.classList.contains('reduce-motion') ? 'auto' : 'smooth';

const px = (value) => parseFloat(value) || 0;

/**
 * Keeps the item at `index` inside a horizontally scrolling track visible.
 * The track's CSS scroll-padding-left/right define the comfortable margins.
 */
export function useHorizontalFocusScroll(trackRef, index) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    const item = track?.children[index];
    if (!item) return;

    const style = getComputedStyle(track);
    const leftBound = track.scrollLeft + px(style.scrollPaddingLeft);
    const rightBound = track.scrollLeft + track.clientWidth - px(style.scrollPaddingRight);
    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;

    let target = null;
    if (itemLeft < leftBound) target = itemLeft - px(style.scrollPaddingLeft);
    else if (itemRight > rightBound) target = itemRight - track.clientWidth + px(style.scrollPaddingRight);

    if (target !== null) track.scrollTo({ left: Math.max(0, target), behavior: scrollBehavior() });
  }, [trackRef, index]);
}

/**
 * Scrolls a page only as far as needed to keep the focused row (marked with data-row)
 * fully visible; margins come from the scroller's scroll-padding. Row 0 shows the page top.
 */
export function useVerticalFocusScroll(scrollerRef, rowIndex) {
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const rowElement = scroller?.querySelector(`[data-row="${rowIndex}"]`);
    if (!rowElement) return;

    const style = getComputedStyle(scroller);
    const padTop = px(style.scrollPaddingTop);
    const padBottom = px(style.scrollPaddingBottom);
    const top = rowElement.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const bottom = top + rowElement.offsetHeight;

    let target = null;
    if (rowIndex === 0) target = 0;
    else if (top - padTop < scroller.scrollTop) target = top - padTop;
    else if (bottom + padBottom > scroller.scrollTop + scroller.clientHeight) {
      target = bottom + padBottom - scroller.clientHeight;
    }

    if (target !== null) scroller.scrollTo({ top: Math.max(0, target), behavior: scrollBehavior() });
  }, [scrollerRef, rowIndex]);
}
