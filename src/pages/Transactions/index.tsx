import { inject, observer } from 'mobx-react'
import { parse, stringify } from 'query-string'
import React from 'react'
import Helmet from 'react-helmet'

import { Box, Button, Col, Grid, Loader, Row, Text } from '../../components'
import { get } from '../../lib/get'
import RootStore from '../../store'

import Table from './components/Table'
import TableHeader from './components/TableHeader'

interface Props {
    history: any
    rootStore: RootStore
}

class TransactionsPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        const {
            rootStore: {
                transactionsStore: {
                    transactions,
                    getBudgets,
                    getTransactions,
                },
            },
        } = props
        if (transactions.length) {
            return
        }
        getBudgets()
        getTransactions()
    }

    public componentDidUpdate() {
        const {
            rootStore: {
                transactionsStore: {
                    budgetFilter: currentBudget,
                    page: currentPage,
                    getTransactions,
                    isLoading,
                },
            },
        } = this.props
        const queryParams = parse(location.search)
        const page = parseInt(get(() => queryParams.page, '1'), 10)
        const pageChanged = page !== currentPage

        const budget = get(() => queryParams.budget, 'all')
        const budgetChanged = budget !== currentBudget

        if ((pageChanged || budgetChanged) && !isLoading) {
            getTransactions()
        }
    }

    public render() {
        const {
            rootStore: {
                transactionsStore: { isLoading },
            },
        } = this.props
        return (
            <React.Fragment>
                <Helmet>
                    <title>Transactions</title>
                </Helmet>{' '}
                <Grid maxWidth="md" ph={{ xs: 2, md: 6 }}>
                    <Row>
                        <Col xs={12}>
                            <Box
                                alignItems={Box.AlignItems.Center}
                                display={Box.Display.Flex}
                                justifyContent={Box.JustifyContent.SpaceBetween}
                                mb={4}
                                mt={12}
                            >
                                <Text
                                    el={Text.Element.H1}
                                    font={Text.Font.Title}
                                    noMargin
                                    size={Text.Size.Xxl}
                                >
                                    Transactions
                                </Text>
                                <Box>
                                    <Button
                                        color={Button.Color.Secondary}
                                        noWrap
                                        to="/transactions/new"
                                    >
                                        Create Transaction
                                    </Button>
                                </Box>
                            </Box>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                this.renderTransactionsTable()
                            )}
                        </Col>
                    </Row>
                </Grid>
            </React.Fragment>
        )
    }

    private setBudgetFilter = (budget: string) => {
        const queryParams = {
            budget: budget === 'all' ? undefined : budget,
            page: 1,
        }
        this.props.history.push({
            pathname: '/transactions',
            search: stringify(queryParams),
        })
    }

    private renderTransactionsTable = () => {
        const {
            rootStore: {
                transactionsStore: {
                    budgets,
                    budgetFilter,
                    allSelected,
                    anySelected,
                    selectedTransactionIds,
                    transactions,
                    page,
                    pagesCount,
                    startDelete,
                    deleteTransactions,
                    categorizeTransactions,
                    handleSelectAll,
                    selectTransaction,
                    handleOutsideClick,
                },
            },
        } = this.props
        return (
            <React.Fragment>
                <TableHeader
                    budgets={budgets}
                    budgetFilter={budgetFilter}
                    allSelected={allSelected}
                    anySelected={anySelected}
                    startDelete={startDelete}
                    handleOnChange={handleSelectAll}
                    handleCategorize={categorizeTransactions}
                    handleDelete={deleteTransactions}
                    handleFilter={this.setBudgetFilter}
                    handleOutsideClick={handleOutsideClick}
                />
                {!transactions.length ? (
                    <Box
                        b
                        borderColor={Box.BorderColor.Gray9}
                        cornerRadius={Box.CornerRadius.Small}
                        p={8}
                    >
                        <Text
                            align={Text.Align.Center}
                            weight={Text.Weight.Medium}
                        >
                            No transactions
                        </Text>
                    </Box>
                ) : (
                    <Table
                        transactions={transactions}
                        page={page}
                        pagesCount={pagesCount}
                        selectedTransactionIds={selectedTransactionIds}
                        selectTransaction={selectTransaction}
                    />
                )}
            </React.Fragment>
        )
    }
}

export const Transactions = inject('rootStore')(observer(TransactionsPage))
