import * as React from "react";
import styled from "styled-components";

import { AnyColor } from "../../../types/color";
import { AlignSelf, Display, SimpleDisplay } from "../../../types/css";
import { reduce } from "../../../utils/object";
import { convertLazy, Breakpoint, Responsive } from "../../../utils/responsive";
import { styledFactory } from "../../../utils/styled-components";

import { paddingAtBreakpoint } from "./paddingAtBreakpoint";
import { InnerProps, MaxWidth, Props, ValidMaxWidths } from "./types";

/**
 * Use `<Grid>` to lay out content in sophisticated, responsive ways.
 */
export class Grid extends React.Component<Props> {
    public static AlignSelf = AlignSelf;
    public static BackgroundColor = AnyColor;
    public static SimpleDisplay = SimpleDisplay;
    public static Display = Display;

    public static defaultProps = {
        ph: {
            xs: 2
        }
    };

    public render() {
        const {
            backgroundColor,
            children,
            maxWidth,
            noOverflow,
            p,
            ph,
            pv
        } = this.props;
        const responsiveMaxWidth = convertLazy<MaxWidth>(maxWidth);
        const formattedPadding = convertLazy(p);
        const formattedPaddingHorizontal = convertLazy(ph);
        const formattedPaddingVertical = convertLazy(pv);
        return (
            <Outer backgroundColor={backgroundColor} noOverflow={noOverflow}>
                <Inner
                    maxWidth={responsiveMaxWidth}
                    p={formattedPadding}
                    ph={formattedPaddingHorizontal}
                    pv={formattedPaddingVertical}
                >
                    {children}
                </Inner>
            </Outer>
        );
    }
}

const Outer = styledFactory<Pick<Props, "backgroundColor" | "noOverflow">>(
    styled.div
)`
    ${props =>
        props.backgroundColor
            ? `background-color: ${props.theme.colors[props.backgroundColor]};`
            : ""} ${props =>
    props.noOverflow ? "overflow: hidden;" : ""} width: 100%;
`;

export const Inner = styledFactory<InnerProps>(styled.div)`
    box-sizing: border-box;
    margin: 0 auto;
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            reduce(
                props.maxWidth,
                (memo: any, key) => {
                    const value = props.maxWidth![key];
                    memo[key] = props.theme.units.getValue(
                        (ValidMaxWidths as any)[value!]
                    );
                    return memo;
                },
                // tslint:disable-next-line
                {} as Responsive<string>
            ),
            "max-width"
        )};
    width: 100%;
    ${({ theme, p, ph, pv }) =>
        theme.responsive.BREAKPOINT_NAMES.map((breakpoint: Breakpoint) => {
            const horizontalPadding =
                (p && p[breakpoint] ? p[breakpoint] : ph[breakpoint]) || 0;

            const verticalPadding =
                (p ? p[breakpoint] : pv && pv[breakpoint]) || 0;

            return paddingAtBreakpoint(
                breakpoint,
                horizontalPadding,
                verticalPadding
            );
        })};
`;
