import React, { Fragment } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../components/Bookings/BookingsControls/BookingsControls';

class BookingPage extends React.Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list',
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `query {
                bookings{
                    _id
                    createdAt
                    updatedAt
                    user{
                        _id
                        email
                    }
                    event{
                        _id
                        title
                        date
                        price
                    }
                }
            }`,
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bear ' + this.context.token,
            },
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }

                return res.json();
            })
            .then(async (resData) => {
                //console.log(resData);
                const bookings = resData.data.bookings;
                this.setState({ bookings, isLoading: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    };

    deleteBookingHandler = (bookingId) => {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `mutation CancelBooking($id: ID!) {
                cancelBooking(bookingId: $id){
                    _id
                    title
                }
            }`,
            variables: {
                id: bookingId,
            },
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bear ' + this.context.token,
            },
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }

                return res.json();
            })
            .then(async (resData) => {
                //console.log(resData);
                this.setState((prevState) => {
                    const updatedBookings = prevState.bookings.filter((booking) => {
                        return booking._id !== bookingId;
                    });
                    return { bookings: updatedBookings, isLoading: false };
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    };

    changeOutputTypeHandler = (outputType) => {
        // if(outputType === 'list'){
        //     this.setState({ outputType })
        // }
        this.setState({ outputType });
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingsControl activeOutputType={this.state.outputType} onChange={this.changeOutputTypeHandler} />
                    <div>
                        {this.state.outputType === 'list' ? (
                            <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
                        ) : (
                            <BookingsChart bookings={this.state.bookings} />
                        )}
                    </div>
                </React.Fragment>
            );
        }

        return <React.Fragment>{content}</React.Fragment>;
    }
}

export default BookingPage;
