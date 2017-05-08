import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Box, Flex } from 'reflexbox';
import {
  PageHeader,
  Container,
  Message,
  Card,
  CardImage,
  Heading,
  Text,
} from 'rebass';

import FullscreenLoader from '../shared-components/FullscreenLoader';
import { getIdToken } from '../auth/selectors';
import { GlobalState } from '../rootReducer';
import { ResponseError } from '../apiService';

import { booksRequest, BooksRequest } from './reducer';
import { getSortedBooks, getError, getIsFetching } from './selectors';
import Book from './Book';

const styles = require('./BooksPage.css');

interface StateProps {
  idToken: string | null;
  books: { [id: string]: Book };
  isFetching: boolean;
  error: ResponseError | null;
}

interface DispatchProps {
  actions: {
    booksRequest: (idToken: string) => BooksRequest,
  };
}

class BooksPage extends React.PureComponent<StateProps & DispatchProps, {}> {
  componentDidMount() {
    const { idToken, actions } = this.props;

    if (idToken) {
      actions.booksRequest(idToken);
    }
  }

  render() {
    const { isFetching, books, error } = this.props;

    return isFetching ?
      <FullscreenLoader /> :
      <Box style={{ flex: '1 0 auto' }}>
        <Container pt={4} pb={3}>
          <PageHeader my={2} py={2} description="All the books" heading="Books" />
          {
            error &&
            <Message theme="error">
              { `Error: ${JSON.stringify(error)}` }
            </Message>
          }
          <Flex align="center" justify="center" wrap gutter={2}>
            {
              Object
                .keys(books)
                .map(id => (
                  <Card key={id} m={2} style={{ width: '309px', height: '610px' }} >
                    <a href={books[id].url} target="_blank" rel="noopener noreferrer">
                      <CardImage src={books[id].img} />
                    </a>
                    <Heading level={3}>
                      <a href={books[id].url} target="_blank" rel="noopener noreferrer">
                        { books[id].title }
                      </a>
                    </Heading>
                    <Text bold>{books[id].author}</Text>
                    <p className={styles.description}>
                      { books[id].description }
                    </p>
                  </Card>
              ))
            }
          </Flex>
        </Container>
      </Box>;
  }
}

const mapStateToProps = (state: GlobalState, ownProps: {}): StateProps => ({
  idToken: getIdToken(state),
  books: getSortedBooks(state),
  isFetching: getIsFetching(state),
  error: getError(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  actions: bindActionCreators({ booksRequest }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksPage);
