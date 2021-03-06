import { toJS } from 'mobx'
import React from 'react'
import styled from 'styled-components'

import { BooleanField, Box, Link, Text } from '../../../../components'
import { prettyNumber } from '../../../../lib/currency'
import { Transaction } from '../../../../types/transaction'

interface Props {
    amountCents: number
    accountName?: number
    accountMask?: number
    budgetName?: string
    checked: boolean
    date: string
    id: string
    name: string
    transaction?: Transaction
    handleChange: (id: string) => void
}

export default class TableRow extends React.Component<Props> {
    public render() {
        const {
            accountMask,
            accountName,
            amountCents,
            budgetName,
            checked,
            date,
            id,
            name,
            transaction,
        } = this.props
        const accountInfo =
            accountMask && accountName
                ? `${accountName} - ${accountMask}`
                : 'Created on Butter'
        return (
            <StyledTableRow>
                <StyledTableData>
                    <Box display={Box.Display.Flex}>
                        <Box mr={2.5} mt={0.7}>
                            <BooleanField
                                id={`transactions-${id}`}
                                checked={checked}
                                onChange={this.onChange}
                            />
                        </Box>
                        <Box>
                            <Link
                                to={{
                                    pathname: `/transactions/${id}`,
                                    state: { transaction: toJS(transaction) },
                                }}
                            >
                                <Text
                                    color={Link.Color.Blue2}
                                    whiteSpace={Text.WhiteSpace.NoWrap}
                                    weight={Link.Weight.Medium}
                                >
                                    {name}
                                </Text>
                            </Link>
                            <Text
                                color={Text.Color.Gray3}
                                size={Text.Size.Sm}
                                whiteSpace={Text.WhiteSpace.NoWrap}
                            >
                                {date}
                                {` ∙ ${accountInfo}`}
                            </Text>
                        </Box>
                    </Box>
                </StyledTableData>
                <StyledTableData>
                    {budgetName && <Text>{budgetName}</Text>}
                </StyledTableData>
                <StyledTableData>
                    <Text align={Text.Align.Right} color={Text.Color.Gray2}>
                        {prettyNumber(amountCents)}
                    </Text>
                </StyledTableData>
            </StyledTableRow>
        )
    }

    private onChange = () => {
        const { id, handleChange } = this.props
        handleChange(id)
    }
}

const StyledTableRow = styled.tr`
    td {
        border-bottom: 1px solid ${props => props.theme.colors.gray9};
        padding-bottom: 1rem;
        padding-top: 1rem;
    }

    &:first-child {
        td {
            border-top: 1px solid ${props => props.theme.colors.gray9};
        }
    }

    &:last-child {
        td {
            border-bottom-color: ${props => props.theme.colors.gray9};
        }
    }
`

const StyledTableData = styled.td`
    padding-left: 1rem;
    padding-right: 1rem;
`
