import stringWidth from "string-width";
import { wrapAnsi } from "../ansi-util.js";
import type { Segment } from "./inspect.js";
import { styleText } from "./styleText.js";

type ErrorRange = {
  start: number;
  end: number;
  errors?: string[] | undefined;
};

type ErrorBox = {
  range: ErrorRange;
  lines: string[];
  width: number;
  height: number;
};

type PlacedErrorBox = ErrorBox & {
  x: number;
  y: number;
};

const BOX_PADDING = 3;
const MESSAGE_TAIL = "╰─ ";
const BOX_CHAR_topLeft = "╭──┄┄";
const BOX_CHAR_bottomLeft = "╰──┄┄";
const BOX_CHAR_vertical = "│";
const BOX_CHAR_connector = "┊";
const BOX_CHAR_tee = "┬";
const BOX_CHAR_horizontal = "─";
const BOX_CHAR_leftCap = "╶";
const BOX_CHAR_rightCap = "╴";

// Check if position is in any error range
function isInErrorRange(position: number, ranges: ErrorRange[]): boolean {
  return ranges.some((r) => position >= r.start && position < r.end);
}

function findBoxesBelow(errorBox: PlacedErrorBox, allBoxes: PlacedErrorBox[]) {
  const overlappingBoxes = new Set(
    allBoxes.filter((other) => {
      if (other === errorBox) {
        return false;
      }

      const xOverlap =
        errorBox.x < other.x + other.width &&
        errorBox.x + errorBox.width > other.x;
      return xOverlap && other.y > errorBox.y;
    }),
  );
  for (const other of overlappingBoxes) {
    for (const box of findBoxesBelow(other, allBoxes)) {
      overlappingBoxes.add(box);
    }
  }
  overlappingBoxes.add(errorBox);
  return overlappingBoxes;
}

function alternateFromCenter(low: number, high: number) {
  const center = Math.floor((low + high) / 2);
  let left = center - 1;
  let right = center + 1;
  const result = [center];

  while (left >= low || right <= high) {
    if (left >= low) {
      result.push(left);
      left--;
    }
    if (right <= high) {
      result.push(right);
      right++;
    }
  }

  return result;
}

function segmentsToLines(segments: Segment[], width: number): Segment[][] {
  const lines = [];
  let currentLine = [];
  let currentX = 0;
  for (const segment of segments) {
    const parts = wrapAnsi(" ".repeat(currentX) + segment.value, width, {
      hard: true,
      trim: false,
    })
      .slice(currentX)
      .split("\n");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      const isLastPart = i === parts.length - 1;
      const newSegment: Segment = { value: part };
      if (
        segment.errors === true ||
        (Array.isArray(segment.errors) && segment.errors.length)
      ) {
        if (isLastPart) {
          newSegment.errors = segment.errors;
        } else {
          newSegment.errors = true;
        }
      }
      currentLine.push(newSegment);
      currentX += stringWidth(newSegment.value);
      if (!isLastPart) {
        lines.push(currentLine);
        currentLine = [];
        currentX = 0;
      }
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

function getSquiggleChar(
  position: number,
  errorRanges: ErrorRange[],
  hasBoxAtPos: boolean,
): string {
  if (hasBoxAtPos) return BOX_CHAR_tee;
  if (isInErrorRange(position, errorRanges)) return BOX_CHAR_horizontal;
  if (isInErrorRange(position + 1, errorRanges)) return BOX_CHAR_leftCap;
  if (isInErrorRange(position - 1, errorRanges)) return BOX_CHAR_rightCap;
  return " ";
}

export function formatSegments(segments: Segment[], width: number) {
  const layoutWidth = width - BOX_PADDING;
  const lines = segmentsToLines(segments, layoutWidth);

  let box = styleText("gray", BOX_CHAR_topLeft) + "\n";

  for (const line of lines) {
    let x = 0;
    let str = styleText("gray", BOX_CHAR_vertical) + " ";
    const errorRanges: ErrorRange[] = [];

    for (const segment of line) {
      str += segment.value;
      const newX = x + stringWidth(segment.value);

      if (segment.errors === true || segment.errors?.length) {
        errorRanges.push({
          start: x,
          end: newX,
          errors: segment.errors === true ? undefined : segment.errors,
        });
      }

      x = newX;
    }

    box += str + "\n";

    if (errorRanges.length > 0) {
      // Build error boxes
      const errorBoxes: ErrorBox[] = [];
      for (const range of errorRanges) {
        if (range.errors && range.errors.length > 0) {
          const errorText = wrapAnsi(
            range.errors.join("\n").trimEnd(),
            layoutWidth - (range.end + MESSAGE_TAIL.length),
            { hard: true, trim: false },
          );
          const errorLines = errorText.split("\n");
          const width =
            Math.max(...errorLines.map((l) => stringWidth(l))) +
            MESSAGE_TAIL.length;
          const height = errorLines.length;

          errorBoxes.push({
            range,
            lines: errorLines,
            width,
            height,
          });
        }
      }

      // Layout error boxes - create placed boxes
      const placedBoxes: PlacedErrorBox[] = [];

      for (const errorBox of errorBoxes) {
        let placed = false;
        // Try different x positions within the range at y=0
        for (const testX of alternateFromCenter(
          errorBox.range.start,
          errorBox.range.end,
        )) {
          if (placed) break;
          // Check if this position overlaps with any already-placed boxes at y=0
          const overlaps = placedBoxes.some((other) => {
            // Check for overlap at y=0
            const xOverlap =
              testX < other.x + other.width && testX + errorBox.width > other.x;
            const yOverlap =
              0 < other.y + other.height && errorBox.height > other.y;

            return xOverlap && yOverlap;
          });

          if (!overlaps) {
            placedBoxes.push({ ...errorBox, x: testX, y: 0 });
            placed = true;
          } else if (testX === errorBox.range.end - 1) {
            // Couldn't find a spot, so place it and push others down
            const newBox: PlacedErrorBox = {
              ...errorBox,
              x: errorBox.range.start,
              // Put it above y=0 for now
              y: -1 * errorBox.height,
            };
            placedBoxes.push(newBox);

            // Recursively push it and all boxes below it down so it's at y=0 again
            for (const box of findBoxesBelow(newBox, placedBoxes)) {
              box.y = box.y + errorBox.height;
            }

            placed = true;
          }
        }
      }

      // Create squiggle line with ┬ markers at box positions
      let squiggle = "";
      for (let i = -1; i < x + 1; i++) {
        const boxAtPos = placedBoxes.find((eb) => eb.x === i);
        squiggle += getSquiggleChar(i, errorRanges, !!boxAtPos);
      }
      box +=
        styleText("gray", BOX_CHAR_connector) +
        styleText("redBright", squiggle) +
        "\n";

      const maxY = Math.max(...placedBoxes.map((eb) => eb.y + eb.height));

      // Render the error message area
      for (let row = 0; row < maxY; row++) {
        const rowStr = styleText("gray", BOX_CHAR_connector) + " ";
        let line = "";
        let currentWidth = 0;

        for (const errorBox of placedBoxes) {
          // Add vertical line if box hasn't started yet
          if (row < errorBox.y) {
            while (currentWidth < errorBox.x) {
              line += " ";
              currentWidth++;
            }
            line += BOX_CHAR_vertical;
            currentWidth++;
          } else {
            // Add box content if we're in the box's rows
            const localRow = row - errorBox.y;
            if (localRow >= 0 && localRow < errorBox.height) {
              while (currentWidth < errorBox.x) {
                line += " ";
                currentWidth++;
              }
              const prefix =
                localRow === 0 ? MESSAGE_TAIL : " ".repeat(MESSAGE_TAIL.length);
              const text = prefix + errorBox.lines[localRow];
              line += text;
              currentWidth += stringWidth(text);
            }
          }
        }

        box += rowStr + styleText("redBright", line.trimEnd()) + "\n";
      }
    }
  }
  box += styleText("gray", BOX_CHAR_bottomLeft);
  return box;
}
