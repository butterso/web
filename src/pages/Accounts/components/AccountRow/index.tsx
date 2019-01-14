import React from "react";
import OutsideClickHandler from "react-outside-click-handler";
import {
    Box,
    Text,
    Button,
    PlaidLink,
    DynamicIcon
} from "../../../../components";
import { cssFactory } from "../../../../components/core/utils/styled-components";
import { css } from "styled-components";

interface Props {
    color: string;
    expired: boolean;
    id: string;
    icon: string;
    institution: string;
    last: boolean;
    linkLoaded: boolean;
    mask: string;
    name: string;
    networkActive: boolean;
    publicToken: string;
    type: string;
    handleDelete: Function;
    handleRenewLink: Function;
}

export default class AccountRow extends React.Component<Props> {
    static defaultProps = { last: false };

    state = { startDelete: false };

    onOutsideClick = () => {
        this.setState({ startDelete: false });
    };

    onClickDelete = () => {
        if (this.state.startDelete) {
            const { id, handleDelete } = this.props;
            handleDelete(id);
        } else {
            this.setState({ startDelete: true });
        }
    };

    onSuccess = () => {
        const { id, handleRenewLink } = this.props;
        handleRenewLink(id);
    };

    render() {
        const {
            color,
            expired,
            icon,
            institution,
            last,
            linkLoaded,
            mask,
            name,
            networkActive,
            publicToken,
            type
        } = this.props;
        const { startDelete } = this.state;
        return (
            <Box
                alignItems={Box.AlignItems.Center}
                display={Box.Display.Flex}
                bb={!last}
                borderColor={Box.BorderColor.Gray9}
                justifyContent={Box.JustifyContent.SpaceBetween}
                p={3}
            >
                <Box
                    alignItems={Box.AlignItems.FlexStart}
                    display={Box.Display.Flex}
                >
                    <Box
                        alignItems={Box.AlignItems.Center}
                        backgroundColor={Box.BackgroundColor.Gold3}
                        cornerRadius={Box.CornerRadius.Circle}
                        css={`
                            background-color: #${color};
                            height: 2.5rem;
                            min-width: 2.5rem;
                        `}
                        display={Box.Display.Flex}
                        justifyContent={Box.JustifyContent.Center}
                        mr={2}
                    >
                        <DynamicIcon
                            path={`../../assets/icons/logos/${icon}.svg`}
                        />
                    </Box>
                    <Box>
                        <Box mb={0.15}>
                            <Text color={Text.Color.Gray4} size={Text.Size.Xs}>
                                {institution} -{" "}
                                <Text
                                    color={Text.Color.Gray4}
                                    el={Text.Element.Span}
                                    size={Text.Size.Xs}
                                    transform={Text.Transform.Capitalize}
                                >
                                    {type}
                                </Text>
                            </Text>
                        </Box>
                        <Text color={Text.Color.Gray1} size={Text.Size.Sm}>
                            {name} - {mask}
                        </Text>
                    </Box>
                </Box>
                <Box
                    alignItems={Box.AlignItems.Center}
                    display={Box.Display.Flex}
                >
                    {linkLoaded && expired && (
                        <Box css={genActionCSS()} mr={3}>
                            <PlaidLink
                                noBackground
                                noBorder
                                token={publicToken}
                                onSuccess={this.onSuccess}
                            >
                                <Text
                                    color={Text.Color.Blue2}
                                    size={Text.Size.Xs}
                                    weight={Text.Weight.Medium}
                                >
                                    Renew Link
                                </Text>
                            </PlaidLink>
                        </Box>
                    )}
                    <Box css={genActionCSS()}>
                        <OutsideClickHandler
                            disabled={!startDelete}
                            onOutsideClick={this.onOutsideClick}
                        >
                            <Button
                                color={Button.Color.Primary}
                                disabled={networkActive}
                                isLoading={startDelete && networkActive}
                                noBackground
                                noBorder
                                onClick={this.onClickDelete}
                            >
                                {startDelete ? "Really delete?" : "Delete"}
                            </Button>
                        </OutsideClickHandler>
                    </Box>
                </Box>
            </Box>
        );
    }
}

const genActionCSS = () =>
    cssFactory(css)`
        button {
            padding: 0;
        }
    `;
