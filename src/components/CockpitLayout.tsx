import type { ReactNode } from "react";

/**
 * Reference dashboard — frame 1565×1080
 * Sidebar 139, content cols ratio left:center:right = 464 : 464 : 428
 * Right column rows: gear 724 / battery+weather 189
 * Left column rows: traffic 523 / music 178 / aircond 189
 * Center column rows: map 584 / brightness 189
 *
 * In our 960×690 frame (sidebar 60, topbar 68, padding 12 around main):
 * content area ≈ 888 × 610
 */
interface CockpitLayoutProps {
  leftTop?: ReactNode;
  leftMiddle?: ReactNode;
  leftBottom?: ReactNode;
  leftTopLarge?: boolean;
  centerTop?: ReactNode;
  centerBottom?: ReactNode;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
}

// Computed sizes (px) — preserve ratios
const W_LEFT = 290;
const W_CENTER = 290;
const W_RIGHT = 268;
const GAP_X = 10;

const GAP_Y = 8;
const H_TOP_ROW = 460;
const H_BOTTOM_ROW = 120;
const H_CENTER_TOP = H_TOP_ROW; // map height (shared with right top)
const H_RIGHT_TOP = H_TOP_ROW; // gear height (must equal map)
const H_CENTER_BOT = H_BOTTOM_ROW;
const H_RIGHT_BOT = H_BOTTOM_ROW; // must match center bottom
const H_LEFT_TOTAL_TOP = 460; // leftTop + gap + leftMiddle
const H_LEFT_TOP = 332; // camera/traffic style top card
const H_LEFT_MID = H_LEFT_TOTAL_TOP - H_LEFT_TOP - GAP_Y;
const H_LEFT_BOT = 120;

export function CockpitLayout({
  leftTop,
  leftMiddle,
  leftBottom,
  leftTopLarge = false,
  centerTop,
  centerBottom,
  rightTop,
  rightBottom,
}: CockpitLayoutProps) {
  const totalW = W_LEFT + W_CENTER + W_RIGHT + GAP_X * 2;
  const showLeftMiddle = !leftTopLarge && leftMiddle !== undefined;
  const showLeftBottom = leftBottom !== undefined;
  const leftTopHeight = leftTopLarge
    ? showLeftBottom
      ? H_LEFT_TOTAL_TOP
      : H_TOP_ROW + GAP_Y + H_BOTTOM_ROW
    : H_LEFT_TOP;
  const leftBottomHeight = showLeftMiddle ? H_LEFT_BOT : H_LEFT_MID + H_LEFT_BOT + GAP_Y;

  return (
    <div className="flex h-full w-full items-stretch justify-center pt-[2px]">
      <div className="flex items-stretch" style={{ width: totalW, gap: GAP_X }}>
        {/* LEFT column */}
        <div className="flex flex-col" style={{ width: W_LEFT, gap: GAP_Y }}>
          <div style={{ height: leftTopHeight }}>{leftTop}</div>
          {showLeftMiddle && <div style={{ height: H_LEFT_MID }}>{leftMiddle}</div>}
          {showLeftBottom && (
            <div style={{ height: leftBottomHeight }}>
              {leftBottom}
            </div>
          )}
        </div>
        {/* CENTER column */}
        <div className="flex flex-col" style={{ width: W_CENTER, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>{centerTop}</div>
          <div style={{ height: H_CENTER_BOT }}>{centerBottom}</div>
        </div>
        {/* RIGHT column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_RIGHT_TOP }}>{rightTop}</div>
          <div style={{ height: H_RIGHT_BOT }}>{rightBottom}</div>
        </div>
      </div>
    </div>
  );
}