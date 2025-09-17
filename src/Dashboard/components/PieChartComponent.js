import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spinner } from 'react-bootstrap';

// This is a custom tooltip component that displays the name and value of a pie slice
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-2 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid #ccc' }}>
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Main Pie Chart Component
const PieChartComponent = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="rounded-lg shadow-sm d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
        <Spinner animation="border" variant="secondary" />
      </Card>
    );
  }

  // Filter out any data with a value of 0 so they don't appear in the chart
  const filteredData = data.filter(item => item.value > 0);

  return (
    <Card className="p-4 rounded-lg shadow-sm h-100">
      <h3 className="h5 fw-semibold text-gray-800 mb-4">Community Distribution</h3>
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={100}
            >
              {/* Maps over the data to apply the correct color for each slice */}
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100">
          <p className="text-muted">No data available for the chart.</p>
        </div>
      )}
    </Card>
  );
};

export default PieChartComponent;
