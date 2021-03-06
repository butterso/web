import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

import { Box } from '../../../../components'
import { get } from '../../../../lib/get'
import { Transaction } from '../../../../types/transaction'
import TablePagination from '../TablePagination'
import TableRow from '../TableRow'

interface Props {
    transactions: Transaction[]
    page: number
    pagesCount: number
    selectedTransactionIds: string[]
    selectTransaction: (id: string) => void
}

export default class Table extends React.Component<Props> {
    public render() {
        const {
            transactions,
            page,
            pagesCount,
            selectedTransactionIds,
            selectTransaction,
        } = this.props

        return (
            <Box
                backgroundColor={Box.BackgroundColor.White}
                css={`
                    overflow-x: scroll;
                `}
            >
                <StyledTable>
                    <tbody>
                        {transactions.map(transaction => (
                            <TableRow
                                amountCents={transaction.amountCents}
                                accountMask={get(
                                    () => transaction.account.mask,
                                )}
                                accountName={get(
                                    () => transaction.account.name,
                                )}
                                budgetName={get(() => transaction.budget.name)}
                                checked={selectedTransactionIds.includes(
                                    transaction.id,
                                )}
                                date={this.formatDate(transaction.date)}
                                key={transaction.id}
                                id={transaction.id}
                                name={transaction.name}
                                transaction={transaction}
                                handleChange={selectTransaction}
                            />
                        ))}
                    </tbody>
                </StyledTable>
                {pagesCount > 1 && (
                    <Box mb={4} mt={3}>
                        <TablePagination page={page} pagesCount={pagesCount} />
                    </Box>
                )}
            </Box>
        )
    }
    private formatDate = (date: string): string => {
        const dateMoment = moment(date)
        const todayMoment = moment()
        const showYear =
            dateMoment.year() !== todayMoment.year() ? ', YYYY' : ''
        return dateMoment.format(`MMM D${showYear}`)
    }
}

const StyledTable = styled.table`
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
`
