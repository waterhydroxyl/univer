/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { DocumentDataModel } from '@univerjs/core';
import { RxDisposable } from '@univerjs/core';
import { DocSkeletonManagerService, neoGetDocObject, TextSelectionManagerService, VIEWPORT_KEY } from '@univerjs/docs';
import type { IRenderContext, IRenderModule } from '@univerjs/engine-render';
import { getAnchorBounding, NodePositionConvertToCursor } from '@univerjs/engine-render';
import { IEditorService } from '@univerjs/ui';
import { Inject } from '@wendellhu/redi';
import { takeUntil } from 'rxjs';

const ANCHOR_WIDTH = 1.5;

export class DocBackScrollRenderController extends RxDisposable implements IRenderModule {
    constructor(
        private readonly _context: IRenderContext<DocumentDataModel>,
        @Inject(DocSkeletonManagerService) private readonly _docSkeletonManagerService: DocSkeletonManagerService,
        @Inject(TextSelectionManagerService) private readonly _textSelectionManagerService: TextSelectionManagerService,
        @IEditorService private readonly _editorService: IEditorService
    ) {
        super();

        this._init();
    }

    private _init() {
        this._textSelectionManagerService.textSelection$.pipe(takeUntil(this.dispose$)).subscribe((params) => {
            if (params == null) {
                return;
            }

            const { isEditing, unitId } = params;

            if (isEditing) {
                this._scrollToSelection(unitId);
            }
        });
    }

    // Let the selection show on the current screen.
    private _scrollToSelection(unitId: string) {
        const activeTextRange = this._textSelectionManagerService.getActiveRange();
        const docObject = neoGetDocObject(this._context);
        const skeleton = this._docSkeletonManagerService.getSkeleton();

        if (activeTextRange == null || docObject == null) {
            return;
        }

        const { collapsed, startNodePosition } = activeTextRange;

        if (!collapsed) {
            return;
        }

        const documentOffsetConfig = docObject.document.getOffsetConfig();
        const { docsLeft, docsTop } = documentOffsetConfig;

        const convertor = new NodePositionConvertToCursor(documentOffsetConfig, skeleton);

        const { contentBoxPointGroup } = convertor.getRangePointData(startNodePosition, startNodePosition);

        const { left: aLeft, top: aTop, height } = getAnchorBounding(contentBoxPointGroup);

        const left = aLeft + docsLeft;

        const top = aTop + docsTop;

        const viewportMain = docObject.scene.getViewport(VIEWPORT_KEY.VIEW_MAIN);

        const isEditor = !!this._editorService.getEditor(unitId);

        if (viewportMain == null) {
            return;
        }

        const {
            left: boundLeft,
            top: boundTop,
            right: boundRight,
            bottom: boundBottom,
        } = viewportMain.getBounding().viewBound;

        let offsetY = 0;
        let offsetX = 0;

        const delta = isEditor ? 0 : 100;

        if (top < boundTop) {
            offsetY = top - boundTop;
        } else if (top > boundBottom - height) {
            offsetY = top - boundBottom + height + delta;
        }

        if (left < boundLeft) {
            offsetX = left - boundLeft;
        } else if (left > boundRight - ANCHOR_WIDTH) {
            offsetX = left - boundRight + ANCHOR_WIDTH;
        }

        const config = viewportMain.transViewportScroll2ScrollValue(offsetX, offsetY);
        viewportMain.scrollBy(config);
    }
}