import React from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

import './Events.css';

class EventPage extends React.Component {
    state = {
        isCreating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({ isCreating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ isCreating: false });
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        //const event = { title, price, date, description };

        let requestBody = {
            query: `mutation {
                createEvent(eventInput: {title: "${title}", price: ${price}, description: "${description}", date: "${date}"}){
                    _id
                    title
                    description
                    price
                    date
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
            .then((resData) => {
                //this.fetchEvents();
                this.setState((prevState) => {
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        price: resData.data.createEvent.price,
                        creator: {
                            _id: this.context.userId,
                        },
                    });
                    return { events: updatedEvents };
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    modalCancelHandler = () => {
        this.setState({ isCreating: false, selectedEvent: null });
    };

    fetchEvents() {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `query {
                events{
                    _id
                    title
                    price
                    description
                    date
                    creator{
                        _id
                        email
                    }
                }
            }`,
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                //Authorization: 'Bear ' + this.context.token,
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
                const events = resData.data.events;
                this.setState({ events, isLoading: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    }

    showDetailHandler = (eventId) => {
        this.setState((prevState) => {
            const selectedEvent = prevState.events.find((e) => e._id === eventId);
            return { selectedEvent };
        });
    };

    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        let requestBody = {
            query: `mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}"){
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
            .then((resData) => {
                console.log(resData);
                this.setState({ selectedEvent: null });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <React.Fragment>
                {(this.state.isCreating || this.state.selectedEvent) && <Backdrop />}
                {this.state.isCreating && (
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input id="title" type="text" ref={this.titleEl} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input id="price" type="number" ref={this.priceEl} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input id="date" type="datetime-local" ref={this.dateEl} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" type="text" ref={this.descriptionEl}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.selectedEvent && (
                    <Modal
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        confirmText={this.context.token ? 'Book' : 'Confirm'}
                    >
                        <h2>{this.state.selectedEvent.title}</h2>
                        <h4>
                            {this.state.selectedEvent.price} -{' '}
                            {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                        </h4>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="events-control">
                        <p>Share your own Events!</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>
                            Create Event
                        </button>
                    </div>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                    <EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default EventPage;
