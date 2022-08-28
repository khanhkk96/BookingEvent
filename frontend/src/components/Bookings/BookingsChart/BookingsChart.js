import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100,
    },
    Normal: {
        min: 100,
        max: 200,
    },
    Expensive: {
        min: 200,
        max: 1000000,
    },
};

const bookingChart = (props) => {
    //const output = {};
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookings = props.bookings.reduce((prev, current) => {
            if (
                current.event.price >= BOOKINGS_BUCKETS[bucket].min &&
                current.event.price < BOOKINGS_BUCKETS[bucket].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        values.push(filteredBookings);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: 'rgba(255, 99, 132, 0.2)',
            strokeColor: 'rgba(54, 162, 235, 0.2)',
            highlightFill: 'rgba(255, 206, 86, 0.2)',
            highlightStroke: 'rgba(75, 192, 192, 0.2)',
            data: values,
        });
        console.log(values);
        //values = [...values];
        //values[values.length - 1] = 0;
        //output[bucket] = filteredBookings;
    }
    return (
        <div style={{ textAlign: 'center' }}>
            <BarChart data={chartData} />
        </div>
    );
};

export default bookingChart;
