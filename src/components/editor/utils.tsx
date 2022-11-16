import {BoundingBlock} from "./EditorViewer.utils";

function sortedKeys(object: Record<number, any>) : number[] {
    const keys = Object.keys(object);
    return keys.sort().map((x) => parseInt(x));
}

export function boundingBoxesToText(boundingBlocks: BoundingBlock[]) : string {
    const perBlockPerLinePerX : Record<number, Record<number, Record<string, string>>> = {};
    boundingBlocks.forEach((bb) => {
        if (!perBlockPerLinePerX[bb.block_num]) {
            perBlockPerLinePerX[bb.block_num] = {};
        }
        if (!perBlockPerLinePerX[bb.block_num][bb.line_num]) {
            perBlockPerLinePerX[bb.block_num][bb.line_num] = {}
        }
        perBlockPerLinePerX[bb.block_num][bb.line_num][bb.x] = bb.text;
    });

    return sortedKeys(perBlockPerLinePerX).map((blockNum: number) =>
            sortedKeys(perBlockPerLinePerX[blockNum]).map((lineNum: number) =>
                sortedKeys(perBlockPerLinePerX[blockNum][lineNum]).map(
                    (x: number) => perBlockPerLinePerX[blockNum][lineNum][x]
                )
                .join(' ')
            ).join(' ')
        ).join(' ');
}
