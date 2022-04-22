import React from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingPage extends React.Component {
    state = {
        isLoading: false,
        bookings: [],
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
            query: `mutation {
                cancelBooking(bookingId: "${bookingId}"){
                    _id
                    title
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

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading && <Spinner />}
                <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
            </React.Fragment>
        );
    }
}

export default BookingPage;
