import * as React from "react";
import * as ReactDOM from "react-dom";

import Utils from "../utils";
const utils = new Utils();

import SkipNoticeComponent, { SkipNoticeAction } from "../components/SkipNoticeComponent";
import { SponsorTime, ContentContainer } from "../types";

class SkipNotice {
    segments: SponsorTime[];
    autoSkip: boolean;
    // Contains functions and variables from the content script needed by the skip notice
    contentContainer: ContentContainer;

    noticeElement: HTMLDivElement;

    skipNoticeRef: React.MutableRefObject<SkipNoticeComponent>;

    constructor(segments: SponsorTime[], autoSkip = false, contentContainer: ContentContainer) {
        this.skipNoticeRef = React.createRef();

        this.segments = segments;
        this.autoSkip = autoSkip;
        this.contentContainer = contentContainer;

        const referenceNode = utils.findReferenceNode();
    
        const amountOfPreviousNotices = document.getElementsByClassName("sponsorSkipNotice").length;
        //this is the suffix added at the end of every id
        let idSuffix = "";
        for (const segment of this.segments) {
            idSuffix += segment.UUID;
        }
        idSuffix += amountOfPreviousNotices;

        this.noticeElement = document.createElement("div");
        this.noticeElement.id = "sponsorSkipNoticeContainer" + idSuffix;

        referenceNode.prepend(this.noticeElement);

        ReactDOM.render(
            <SkipNoticeComponent segments={segments} 
                autoSkip={autoSkip} 
                contentContainer={contentContainer}
                ref={this.skipNoticeRef}
                closeListener={() => this.close()} />,
            this.noticeElement
        );
    }

    close(): void {
        ReactDOM.unmountComponentAtNode(this.noticeElement);

        this.noticeElement.remove();

        const skipNotices = this.contentContainer().skipNotices;
        skipNotices.splice(skipNotices.indexOf(this), 1);
    }

    toggleSkip(): void {
        this.skipNoticeRef.current.prepAction(SkipNoticeAction.Unskip);
    }
}

export default SkipNotice;